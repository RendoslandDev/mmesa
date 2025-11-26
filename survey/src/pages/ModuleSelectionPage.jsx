import React, { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import ProgressBar from "../componnents/ProgressBar";
import { apiCall } from "../services/api";

const ModuleSelectionPage = ({
    selectedOption,
    selectedModules,
    setSelectedModules,
    onNavigate,
    getOptionRules,
    countSelections
}) => {
    const [moduleCategories, setModuleCategories] = useState({});
    const [loading, setLoading] = useState(true);

    // ----------------------------------------------
    // FIX 1: computeCounts moved BEFORE usage
    // ----------------------------------------------
    const computeCounts = () => {
        try {
            const c = countSelections();
            return (
                c || {
                    majorCount: 0,
                    subModuleCount: 0,
                    softwareCount: 0,
                    total: 0
                }
            );
        } catch {
            const majorCount = selectedModules.filter(
                (m) => m.is_major || m.isMajor
            ).length;
            const subModuleCount = selectedModules.length - majorCount;
            return {
                majorCount,
                subModuleCount,
                softwareCount: 0,
                total: majorCount + subModuleCount
            };
        }
    };

    const rules = getOptionRules();
    const counts = computeCounts(); // FIX 2: use counts, not currentCounts

    useEffect(() => {
        async function loadData() {
            try {
                const resModules = await apiCall("/surveys/modules");

                if (resModules.success) {
                    const categories = {};
                    resModules.data.forEach((mod) => {
                        mod.parentId = mod.parent_id;

                        if (!mod.parent_id) {
                            categories[mod.id] = { major: mod, subModules: [] };
                        } else {
                            const parent = Object.values(categories).find(
                                (c) => c.major.id === mod.parent_id
                            );
                            if (parent) parent.subModules.push(mod);
                        }
                    });

                    setModuleCategories(categories);
                } else {
                    console.error("Failed to load modules:", resModules.error);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // ----------------------------------------------
    // MODULE TOGGLE HANDLER
    // ----------------------------------------------
    const handleModuleToggle = (moduleObj, isMajor) => {
        const exists = selectedModules.find((m) => m.id === moduleObj.id);
        const rules = getOptionRules();
        const counts = computeCounts();

        if (exists) {
            setSelectedModules(selectedModules.filter((m) => m.id !== moduleObj.id));
            return;
        }

        // --- Option-specific logic ---
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
                const parentSelected = selectedModules.some(
                    (m) => m.id === moduleObj.parentId
                );
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
                alert("Option 3 allows only submodules");
                return;
            }
            if (counts.subModuleCount >= 4) {
                alert("Option 3 allows selecting up to 4 submodules only");
                return;
            }
        }

        // --- Parent-child blocking ---
        if (moduleObj.parentId) {
            if (selectedModules.some((m) => m.id === moduleObj.parentId)) {
                alert("Cannot select a submodule while its parent major is selected");
                return;
            }
        } else {
            const childrenSelected = selectedModules.some(
                (m) => m.parentId === moduleObj.id
            );
            if (childrenSelected) {
                alert("Cannot select a major while its submodule(s) are selected");
                return;
            }
        }

        setSelectedModules([...selectedModules, moduleObj]);
    };

    // Disable buttons
    const isMajorDisabled = (category) => {
        return selectedModules.some((m) => m.parentId === category.major.id);
    };

    const isSubDisabled = (category, sub) => {
        return selectedModules.some((m) => m.id === sub.parentId);
    };

    // ----------------------------------------------
    // UI
    // ----------------------------------------------
    return (
        <div>
            {/* TOP BAR */}
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

            {/* MODULE LIST */}
            <div className="px-4 py-4 space-y-4">
                {Object.entries(moduleCategories).map(([catName, category]) => {
                    const isMajorSelected = selectedModules.some(
                        (m) => m.id === category.major.id
                    );

                    return (
                        <div key={category.major.id}>
                            <h3 className="font-bold text-lg mb-3 px-2">{catName}</h3>

                            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">

                                {/* MAJOR BUTTON */}
                                <button
                                    key={category.major.id}
                                    disabled={isMajorDisabled(category)}
                                    onClick={() =>
                                        handleModuleToggle(category.major, true)
                                    }
                                    className={`w-full p-4 text-left border-2 rounded-2xl transition
                                        ${isMajorDisabled(category)
                                            ? "opacity-40 cursor-not-allowed"
                                            : ""}
                                        ${selectedModules.some(
                                                (m) => m.id === category.major.id
                                            )
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="font-semibold leading-snug">
                                                {category.major.name}
                                            </p>
                                            <span
                                                className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${selectedModules.some(
                                                    (m) => m.id === category.major.id
                                                )
                                                    ? "bg-white/20 text-white"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                MAJOR *
                                            </span>
                                        </div>
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedModules.some(
                                                (m) => m.id === category.major.id
                                            )
                                                ? "border-white bg-white"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {isMajorSelected && (
                                                <Check className="text-black" size={14} />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* SUBMODULES */}
                                {category.subModules.map((sub) => (
                                    <button
                                        key={sub.id}
                                        disabled={isSubDisabled(category, sub)}
                                        onClick={() =>
                                            handleModuleToggle(sub, false)
                                        }
                                        className={`w-full p-4 text-left border-2 rounded-2xl transition
                                            ${isSubDisabled(category, sub)
                                                ? "opacity-40 cursor-not-allowed"
                                                : ""}
                                            ${selectedModules.some(
                                                    (m) => m.id === sub.id
                                                )
                                                ? "border-black bg-gray-50"
                                                : "border-gray-200 hover:border-gray-400"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="flex-1 leading-snug">
                                                {sub.name}
                                            </p>
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedModules.some(
                                                    (m) => m.id === sub.id
                                                )
                                                    ? "border-black bg-black"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {selectedModules.some(
                                                    (m) => m.id === sub.id
                                                ) && (
                                                        <Check
                                                            className="text-white"
                                                            size={14}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* NAV BAR */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3">
                <button
                    onClick={() => onNavigate("option-selection")}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-50 transition"
                >
                    Back
                </button>

                <button
                    onClick={() => onNavigate("software-selection")}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition"
                >
                    Next <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ModuleSelectionPage;
