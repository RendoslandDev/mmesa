import React, { useState, useEffect } from 'react';
import { Download, LogOut, AlertCircle, Loader, BarChart2, Users, BookOpen, Cpu } from 'lucide-react';
import adminService from '../services/adminService';

export const AdminDashboard = ({ onLogout = () => { }, onNavigate }) => {
    const [statistics, setStatistics] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const surveyRes = await adminService.getStats(token);

                if (surveyRes.success && surveyRes.stats) {
                    setAdminStats({
                        totalStudents: surveyRes.stats.totalStudents,
                        totalResponses: surveyRes.stats.totalResponses,
                        totalModuleSelections: surveyRes.stats.totalModuleSelections,
                        totalSoftwareSelections: surveyRes.stats.totalSoftwareSelections
                    });

                    setStatistics({
                        modulePopularity: surveyRes.stats.modulePopularity,
                        softwarePopularity: surveyRes.stats.softwarePopularity,
                        optionBreakdown: surveyRes.stats.optionBreakdown
                    });
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchData(); // initial fetch
            const interval = setInterval(fetchData, 5000); // refresh every 5 seconds
            return () => clearInterval(interval);
        }
    }, [token]);


    const handleExport = async () => {
        try {
            setIsExporting(true);
            const blob = await adminService.exportToCSV(token);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mmesa_survey_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export failed: ' + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        onLogout();
        onNavigate('home');
    };

    if (isLoading) return (
        <div className="px-4 py-12 text-center">
            <Loader className="animate-spin mx-auto mb-4" size={40} />
            <p className="text-gray-600">Loading dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="px-4 py-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700">{error}</p>
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* KPI Cards */}
                {adminStats && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <Users size={32} />
                                <span className="text-sm font-medium opacity-90">Total Students</span>
                            </div>
                            <p className="text-4xl font-bold">{adminStats.totalStudents}</p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <BarChart2 size={32} />
                                <span className="text-sm font-medium opacity-90">Total Responses</span>
                            </div>
                            <p className="text-4xl font-bold">{adminStats.totalResponses}</p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <BookOpen size={32} />
                                <span className="text-sm font-medium opacity-90">Module Selections</span>
                            </div>
                            <p className="text-4xl font-bold">{adminStats.totalModuleSelections}</p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <Cpu size={32} />
                                <span className="text-sm font-medium opacity-90">Software Selections</span>
                            </div>
                            <p className="text-4xl font-bold">{adminStats.totalSoftwareSelections}</p>
                        </div>
                    </div>
                )}

                {/* Top Modules */}
                {statistics?.modulePopularity && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="text-blue-600" size={24} />
                            <h3 className="text-lg font-bold">Top Modules</h3>
                        </div>
                        <div className="space-y-3">
                            {statistics.modulePopularity.slice(0, 5).map((module, idx) => {
                                // percentage relative to total module selections
                                const modulePercent = adminStats?.totalModuleSelections
                                    ? Math.round((module.selection_count / adminStats.totalModuleSelections) * 100)
                                    : 0;

                                return (
                                    <div key={`module-${module.module_id}-${idx}`} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-900">
                                                    {idx + 1}. {module.module_name}
                                                </span>
                                                {module.is_major_module && (
                                                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                                                        MAJOR
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-blue-600">{module.selection_count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-500"
                                                style={{ width: `${modulePercent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Top Software */}
                {statistics?.softwarePopularity && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="text-purple-600" size={24} />
                            <h3 className="text-lg font-bold">Top Software</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {statistics.softwarePopularity.slice(0, 6).map((software, idx) => {
                                const softwarePercent = adminStats?.totalSoftwareSelections
                                    ? Math.round((software.selection_count / adminStats.totalSoftwareSelections) * 100)
                                    : 0;

                                return (
                                    <div key={`software-${software.software_id}-${idx}`} className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm font-medium text-gray-700 mb-2">{software.software_name}</p>
                                        <p className="text-2xl font-bold text-purple-600">{software.selection_count}</p>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-600 transition-all duration-500"
                                                style={{ width: `${softwarePercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{softwarePercent}% of total selections</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Export Button */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold mb-4">Export Data</h3>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <>
                                <Loader className="animate-spin" size={20} /> Exporting...
                            </>
                        ) : (
                            <>
                                <Download size={20} /> Export to CSV
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
