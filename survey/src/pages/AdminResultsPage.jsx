import React, { useState, useEffect } from 'react';
import { BarChart2, Loader, AlertCircle } from 'lucide-react';
import { surveyService } from '../services/surveyService';

export const AdminResultsPage = () => {
    const [results, setResults] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [resultsData, statsData] = await Promise.all([
                    surveyService.getAllResults(),
                    surveyService.getStatistics()
                ]);

                if (resultsData.success) {
                    setResults(resultsData.data);
                }
                if (statsData.success) {
                    setStatistics(statsData);
                }
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="px-4 py-12 text-center">
                <Loader className="animate-spin mx-auto mb-4" size={40} />
                <p className="text-gray-600">Loading results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-6">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">Survey Results</h2>

            {/* Statistics */}
            {statistics && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Statistics</h3>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {statistics.stats?.map((stat) => (
                            <div key={stat.selected_option} className="text-center p-4 bg-gray-50 rounded-2xl">
                                <p className="text-3xl font-bold">{stat.option_count}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.selected_option}</p>
                            </div>
                        ))}
                    </div>

                    {/* Module Popularity */}
                    {statistics.modulePopularity && (
                        <div className="mb-8">
                            <h4 className="text-lg font-bold mb-3">Top Modules</h4>
                            <div className="space-y-2">
                                {statistics.modulePopularity.slice(0, 5).map((module, idx) => (
                                    <div key={module.module_name} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{module.module_name}</span>
                                            <span className="font-bold">{module.selection_count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black"
                                                style={{ width: `${Math.min((module.selection_count / 10) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Software Popularity */}
                    {statistics.softwarePopularity && (
                        <div>
                            <h4 className="text-lg font-bold mb-3">Top Software</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {statistics.softwarePopularity.map((software) => (
                                    <div key={software.software_name} className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm font-medium mb-2">{software.software_name}</p>
                                        <p className="text-2xl font-bold">{software.selection_count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Detailed Results */}
            <h3 className="text-lg font-bold mb-4">All Responses</h3>
            <div className="space-y-3">
                {results.map((response) => (
                    <div key={response.response_id} className="p-5 border border-gray-200 rounded-2xl">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-bold">{response.index_number}</p>
                                <p className="text-sm text-gray-600">{response.year_of_study} • {response.email}</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
                                {response.selected_option}
                            </span>
                        </div>

                        {response.selected_modules && (
                            <div className="mb-3">
                                <p className="text-sm font-semibold mb-2">Modules</p>
                                <div className="flex flex-wrap gap-1">
                                    {response.selected_modules.split(', ').map(module => (
                                        <span key={module} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
                                            {module.length > 30 ? module.substring(0, 30) + '...' : module}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {response.selected_software && (
                            <div>
                                <p className="text-sm font-semibold mb-2">Software</p>
                                <div className="flex flex-wrap gap-1">
                                    {response.selected_software.split(', ').map(software => (
                                        <span key={software} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
                                            {software}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};