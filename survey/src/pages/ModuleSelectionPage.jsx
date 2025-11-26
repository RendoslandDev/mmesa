import React, { useState, useEffect } from "react";
import { Check, ArrowRight } from 'lucide-react';
import ProgressBar from '../componnents/ProgressBar';
import moduleCategories from '../data/data.js';

import { apiCall } from '../services/api';

const ModuleSelectionPage = ({
    selectedOption,
    selectedModules,
    setSelectedModules,
    onNavigate,
    getOptionRules,
    countSelections
}) => {
    const [moduleCategories, setModuleCategories] = useState({});
    const [softwareList, setSoftwareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const rules = getOptionRules();
    const counts = countSelections();
    useEffect(() => {
        async function loadData() {
            try {
                // Fetch modules
                const resModules = await apiCall('/surveys/modules');
                if (resModules.success) {
                    const categories = {};
                    resModules.data.forEach(mod => {
                        if (!mod.parent_id) {
                            categories[mod.id] = { major: mod, subModules: [] };
                        } else {
                            const parent = Object.values(categories).find(c => c.major.id === mod.parent_id);
                            if (parent) parent.subModules.push(mod);
                        }
                    });
                    setModuleCategories(categories);
                } else {
                    console.error('Failed to load modules:', resModules.error);
                }

                // Fetch software
                const resSoftware = await fetchData('/surveys/software');
                if (resSoftware.success) {
                    setSoftwareList(resSoftware.data);
                } else {
                    console.error('Failed to load software:', resSoftware.error);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);


    const handleModuleToggle = (moduleObj, isMajor) => {
        const exists = selectedModules.find(m => m.id === moduleObj.id);

        if (exists) {
            setSelectedModules(selectedModules.filter(m => m.id !== moduleObj.id));
            return;
        }

        // Option-specific rules
        if (selectedOption === "Option 1") {
            if (!isMajor) {
                alert("Option 1 allows only major modules");
                return;
            }
            if (counts.majorCount >= rules.majors) {
                alert(`You can only select ${rules.majors} major module(s)`);
                return;
            }
        }

        if (selectedOption === "Option 2") {
            if (isMajor) {
                if (counts.majorCount >= rules.majors) {
                    alert(`You can only select ${rules.majors} major module(s)`);
                    return;
                }
            } else {
                // Only block submodule if **its parent major is selected**
                const parentSelected = selectedModules.some(m => m.id === moduleObj.parentId);
                if (parentSelected) {
                    alert("Cannot select submodules under a selected major");
                    return;
                }
                if (counts.subModuleCount >= rules.subModules) {
                    alert(`You can only select ${rules.subModules} sub-module(s)`);
                    return;
                }
            }
        }

        if (selectedOption === "Option 3") {
            if (isMajor) {
                alert('Option 3 allows only submodules');
                return;
            }
            if (counts.subModuleCount >= 4) {
                alert('Option 3 allows selecting up to 4 submodules only');
                return;
            }
        }

        setSelectedModules([...selectedModules, moduleObj]);
    };

    // Disable logic
    const isMajorDisabled = (category) => {
        // major is disabled if **any of its submodules is selected**
        return selectedModules.some(m => m.parentId === category.major.id);
    };

    const isSubDisabled = (category, sub) => {
        // submodule is disabled only if its **parent major is selected**
        return selectedModules.some(m => m.id === sub.parentId);
    };

    if (loading) return <p>Loading modules & software...</p>;

    return (
        <div>
            <div className="sticky top-14 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-4 z-40">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold">{rules.description}</p>
                        <p className="text-sm text-gray-600">
                            {counts.majorCount} major · {counts.subModuleCount} sub
                        </p>
                    </div>
                    <ProgressBar current={counts.total} total={rules.total} />
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {Object.entries(moduleCategories).map(([catName, category]) => {
                    // compute selection flags INSIDE the map where `category` is defined
                    const isMajorSelected = selectedModules.some(m => m.id === category.major.id);

                    return (
                        <div key={category.major.id}>
                            <h3 className="font-bold text-lg mb-3 px-2">{catName}</h3>

                            {category.text && (
                                <p className="text-sm text-yellow-800 bg-yellow-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <span role="img" aria-label="warning">⚠️</span> {category.text}
                                </p>
                            )}

                            <div className="space-y-2 grid grid-cols-1 grid-rows-auto md:grid-cols-2 gap-2">
                                {rules.majors > 0 && (
                                    // <button
                                    //     key={category.major.id}
                                    //     onClick={() => handleModuleToggle(category.major, true)}
                                    //     className={`w-full p-4 text-left border-2 rounded-2xl transition ${selectedModules.find(m => m.id === category.major.id)
                                    //         ? 'border-black bg-black text-white'
                                    //         : 'border-gray-200 hover:border-gray-400'
                                    //         }`}
                                    // >
                                    <button
                                        key={category.major.id}
                                        disabled={isMajorDisabled(category)}
                                        onClick={() => handleModuleToggle(category.major, true)}
                                        className={`w-full p-4 text-left border-2 rounded-2xl transition
        ${isMajorDisabled(category) ? 'opacity-40 cursor-not-allowed' : ''}
        ${selectedModules.some(m => m.id === category.major.id)
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >

                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="font-semibold leading-snug">{category.major.name}</p>
                                                <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${selectedModules.find(m => m.id === category.major.id)
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    MAJOR *
                                                </span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedModules.find(m => m.id === category.major.id)
                                                ? 'border-white bg-white'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedModules.find(m => m.id === category.major.id) && <Check className="text-black" size={14} />}
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {category.subModules.map(subModule => (
                                    // <button
                                    //     key={subModule.id}
                                    //     onClick={() => handleModuleToggle(subModule, false)}
                                    //     className={`w-full p-4 text-left border-2 rounded-2xl transition ${selectedModules.find(m => m.id === subModule.id)
                                    //         ? 'border-black bg-gray-50'
                                    //         : 'border-gray-200 hover:border-gray-400'
                                    //         }`}
                                    // >
                                    <button
                                        key={subModule.id}
                                        disabled={isSubDisabled(category, subModule)}
                                        onClick={() => handleModuleToggle(subModule, false)}
                                        className={`w-full p-4 text-left border-2 rounded-2xl transition
        ${isSubDisabled(category, subModule) ? 'opacity-40 cursor-not-allowed' : ''}
        ${selectedModules.some(m => m.id === subModule.id)
                                                ? 'border-black bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >

                                        <div className="flex items-start justify-between gap-3">
                                            <p className="flex-1 leading-snug">{subModule.name}</p>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedModules.find(m => m.id === subModule.id)
                                                ? 'border-black bg-black'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedModules.find(m => m.id === subModule.id) && <Check className="text-white" size={14} />}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3">
                <button
                    onClick={() => onNavigate('option-selection')}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-50 transition"
                >
                    Back
                </button>
                <button
                    onClick={() => onNavigate('software-selection')}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition"
                >
                    Next
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ModuleSelectionPage;