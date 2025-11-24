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
    countSelections
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const rules = getOptionRules();
    const counts = countSelections();

    const handleSoftwareToggle = (software) => {
        const exists = selectedSoftware.some(s => s.id === software.id);

        if (exists) {
            setSelectedSoftware(selectedSoftware.filter(s => s.id !== software.id));
        } else {
            if (counts.total >= rules.total) {
                alert(`Total selections cannot exceed ${rules.total}`);
                return;
            }
            setSelectedSoftware([...selectedSoftware, software]);
        }
    };

    const handleSubmit = async () => {
        // Validate major and sub-module/software selections
        if (counts.majorCount !== rules.majors) {
            alert(`You must select exactly ${rules.majors} major module(s)`);
            return;
        }
        if (counts.subModuleCount + counts.softwareCount !== rules.subModules) {
            alert(`You must select exactly ${rules.subModules} sub-module(s)/software (combined)`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare payload with correct backend field names
            const surveyData = {
                email: studentInfo.email?.trim(),
                indexNumber: studentInfo.indexNumber?.trim(),
                yearOfStudy: studentInfo.year,                      // renamed
                whatsappPhone: studentInfo.phoneNumber?.trim(),    // renamed
                selectedOption: selectedOption?.value ?? selectedOption,
                selectedModules: selectedModules.map(m => m.id ?? m),
                selectedSoftware: selectedSoftware.map(s => s.id ?? s),
                additionalCourses: additionalCourse                // renamed
            };

            console.log("FINAL SURVEY DATA", JSON.stringify(surveyData, null, 2));

            const response = await surveyService.submitSurvey(surveyData);

            if (response.success) {
                console.log('Survey submitted successfully');
                onNavigate('success');
            } else {
                setError(response.error || 'Failed to submit survey');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div>
            <div className="px-4 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2">Engineering Software</h2>
                <p className="text-gray-600">Software selections count toward your total</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm">
                        <span className="font-semibold">Current:</span> {counts.majorCount} major + {counts.subModuleCount} sub + {counts.softwareCount} software = <span className="font-bold">{counts.total}/{rules.total}</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <div className="px-4 py-4">
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {softwareOptions.map((software) => {
                        const isSelected = selectedSoftware.some(s => s.id === software.id);
                        return (
                            <button
                                key={software.id}
                                onClick={() => handleSoftwareToggle(software)}
                                disabled={isLoading}
                                className={`p-4 text-left border-2 rounded-2xl transition ${isSelected
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-400'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                        ? 'border-black bg-black'
                                        : 'border-gray-300'
                                        }`}>
                                        {isSelected && <Check className="text-white" size={14} />}
                                    </div>
                                    <span className="text-sm font-medium">{software.name}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                        Suggest another course <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={additionalCourse}
                        onChange={(e) => setAdditionalCourse(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition resize-none disabled:bg-gray-100"
                        rows="3"
                        placeholder="Any other course you'd like to see..."
                    />
                </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3">
                <button
                    onClick={() => onNavigate('module-selection')}
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader className="animate-spin" size={20} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SoftwareSelectionPage;
