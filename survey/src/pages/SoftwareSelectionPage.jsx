import React, { useState } from "react";
import { Check, ArrowRight, AlertCircle, Loader } from "lucide-react";
import softwareOptions from "../data/ssoftwaredata";
import surveyService from "../services/surveyService";

const SoftwareSelectionPage = ({
    studentInfo,
    selectedOption,
    selectedModules,
    selectedSoftware,
    setSelectedSoftware,
    additionalCourse,
    setAdditionalCourse,
    onNavigate,
    getOptionRules,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // -------------------------------------------------------
    // FIXED COUNT FUNCTION — counts major, sub, software, total
    // -------------------------------------------------------
    const countSelections = () => {
        let majorCount = 0;
        let subModuleCount = 0;
        let softwareCount = selectedSoftware.length;

        selectedModules.forEach((m) => {
            if (m.isMajor) majorCount++;
            else subModuleCount++;
        });

        return {
            majorCount,
            subModuleCount,
            softwareCount,
            total: majorCount + subModuleCount + softwareCount,
        };
    };

    const rules = getOptionRules();
    const counts = countSelections();


    const handleSoftwareToggle = (software) => {
        const exists = selectedSoftware.some((s) => s.id === software.id);

        if (exists) {
            setSelectedSoftware(selectedSoftware.filter((s) => s.id !== software.id));
            return;
        }

        // Enforce total limit
        if (counts.total >= rules.total) {
            alert(`Your total selections cannot exceed ${rules.total}`);
            return;
        }

        setSelectedSoftware([...selectedSoftware, software]);
    };


    const handleSubmit = async () => {
        setError(null);

        const countsNow = countSelections();


        if (countsNow.majorCount !== rules.majors) {
            alert(`You must select exactly ${rules.majors} major module(s).`);
            return;
        }


        const combined = countsNow.subModuleCount + countsNow.softwareCount;

        if (combined !== rules.subModules) {
            alert(
                `You must select exactly ${rules.subModules} sub-module(s) + software (combined).`
            );
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                email: studentInfo.email?.trim(),
                indexNumber: studentInfo.indexNumber?.trim(),
                yearOfStudy: studentInfo.year,
                whatsappPhone: studentInfo.phoneNumber?.trim(),
                selectedOption: selectedOption?.value ?? selectedOption,
                selectedModules: selectedModules.map((m) => m.id),
                selectedSoftware: selectedSoftware.map((s) => s.id),
                additionalCourses: additionalCourse?.trim() ?? "",
            };

            console.log("FINAL PAYLOAD:", payload);

            const response = await surveyService.submitSurvey(payload);

            if (response.success) {
                onNavigate("success");
            } else {
                setError(response.error || "Submission failed.");
            }
        } catch (err) {
            setError(err.message || "Unexpected error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* HEADER */}
            <div className="px-4 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Engineering Software</h2>
                <p className="text-gray-600">Software counts toward your total.</p>

                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm">
                        <strong>Current:</strong>{" "}
                        {counts.majorCount} major + {counts.subModuleCount} sub +{" "}
                        {counts.softwareCount} software ={" "}
                        <strong>
                            {counts.total}/{rules.total}
                        </strong>
                    </p>
                </div>
            </div>

            {/* ERRORS */}
            {error && (
                <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* SOFTWARE LIST */}
            <div className="px-4 py-4">
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {softwareOptions.map((software) => {
                        const isSelected = selectedSoftware.some(
                            (s) => s.id === software.id
                        );

                        return (
                            <button
                                key={software.id}
                                onClick={() => handleSoftwareToggle(software)}
                                disabled={isLoading}
                                className={`p-4 text-left border-2 rounded-2xl transition ${isSelected
                                    ? "border-black bg-gray-50"
                                    : "border-gray-200 hover:border-gray-400"
                                    } ${isLoading ? "opacity-50" : ""}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                            ? "border-black bg-black"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        {isSelected && (
                                            <Check className="text-white" size={14} />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {software.name}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ADDITIONAL COURSE */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                        Suggest another course{" "}
                        <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={additionalCourse}
                        onChange={(e) => setAdditionalCourse(e.target.value)}
                        disabled={isLoading}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none resize-none disabled:bg-gray-100"
                        placeholder="Any course you'd like to see..."
                    />
                </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3">
                <button
                    onClick={() => onNavigate("module-selection")}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-50 disabled:opacity-50"
                >
                    Back
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader className="animate-spin" size={20} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SoftwareSelectionPage;
