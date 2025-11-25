const OptionSelectionPage = ({ selectedOption, setSelectedOption, onNavigate }) => {
    const options = [
        { value: 'Option 1', title: 'Option 1', desc: '2 Major Modules Only' },
        { value: 'Option 2', title: 'Option 2', desc: '1 Major + 2 Sub-Modules' },
        { value: 'Option 3', title: 'Option 3', desc: '4 Sub-Modules Only' }
    ];

    const handleContinue = () => {
        if (!selectedOption) {
            alert('Please select one option');
            return;
        }
        onNavigate('module-selection');
    };


    const wordspread = (
        <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white mb-6 rounded-xl ">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">Module Selection</h2>

            <p className="mb-3 text-gray-700 text-sm sm:text-base md:text-lg">
                👉 Please read the following options carefully. You must select only <strong>ONE</strong> of the three options below.
                Your chosen option will define the exact structure and number of modules you select in this section of the survey.
            </p>

            <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1 text-sm sm:text-base md:text-lg">
                <li><strong>Option 1:</strong> only 2 major modules</li>
                <li><strong>Option 2:</strong> only 3 modules (1 major module + 2 sub-modules)</li>
                <li><strong>Option 3:</strong> only 4 sub modules of your choice from any category</li>
            </ul>

            <p className="mb-2 text-yellow-700 font-semibold text-sm sm:text-base md:text-lg">⚠️ Important Note</p>
            <p className="mb-2 text-gray-700 text-sm sm:text-base md:text-lg">
                Once you select an option (e.g., Option 2), you are committed to the exact format and number of modules specified by that option.
            </p>
            <p className="mb-2 text-gray-700 text-sm sm:text-base md:text-lg">
                You cannot select Option 1 and then choose 4 sub-modules (the structure of Option 3).
            </p>
            <p className="mb-4 text-gray-700 text-sm sm:text-base md:text-lg">
                You cannot select Option 3 and then choose 1 major module (the structure of Option 2).
            </p>
            <p className="text-gray-800 font-medium text-sm sm:text-base md:text-lg">
                Choose the option that best reflects the modules you wish to cover and review your choices carefully.
            </p>
        </div>


    )

    return (
        <div className="px-4 py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Choose your path</h2>
                <p className="text-gray-600">Select one option to structure your course selection</p>
            </div>
            {wordspread}

            <div className="space-y-3 mb-10">
                {options.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedOption(option.value)}
                        className={`w-full p-5 text-left border-2 rounded-2xl transition ${selectedOption === option.value
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg mb-0.5">{option.title}</p>
                                <p className="text-gray-600 text-sm">{option.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === option.value
                                ? 'border-black bg-black'
                                : 'border-gray-300'
                                }`}>
                                {selectedOption === option.value && (
                                    <Check className="text-white" size={16} />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => onNavigate('student-info')}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-50 transition"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-800 transition"
                >
                    Next
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
import { ArrowRight, Check } from "lucide-react";

export default OptionSelectionPage;