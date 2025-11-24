export const StudentInfoPage = ({ studentInfo, setStudentInfo, onNavigate }) => {
    const handleContinue = () => {
        if (!studentInfo.email || !studentInfo.indexNumber || !studentInfo.year || !studentInfo.phoneNumber) {
            alert('Please fill in all fields');
            return;
        }
        onNavigate('option-selection');
    };

    return (
        <div className="px-4 py-6 carding mt-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Student Information</h1>
                <p className="text-gray-600">Let's start with your details</p>
            </div>

            <InfoAlert />

            <div className="mt-8 space-y-5">
                <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        value={studentInfo.email}
                        onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-lg"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Index Number</label>
                    <input
                        type="text"
                        value={studentInfo.indexNumber}
                        onChange={(e) => setStudentInfo({ ...studentInfo, indexNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-lg"
                        placeholder="Your index number"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Year</label>
                        <select
                            value={studentInfo.year}
                            onChange={(e) => setStudentInfo({ ...studentInfo, year: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-lg"
                        >
                            <option value="">Select</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Year 4</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <input
                            type="tel"
                            value={studentInfo.phoneNumber}
                            onChange={(e) => setStudentInfo({ ...studentInfo, phoneNumber: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition text-lg"
                            placeholder="024XXXXXXX"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="w-full mt-18 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition"
            >
                Continue
                <ArrowRight size={20} />
            </button>
        </div>
    );
};
import InfoAlert from "../componnents/InfoAlert";
import { ArrowRight } from "lucide-react";

export default StudentInfoPage;