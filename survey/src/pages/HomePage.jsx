const HomePage = ({ onNavigate }) => {
    return (
        <>

            <div className="px-4 py-12">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto ">
                        <BookOpen className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">MMESA Survey</h1>
                    <p className="text-xl text-gray-600 mb-2">Short Course Interest Survey</p>
                    <p className="text-gray-500">Phase 2 • Module Selection</p>
                </div>
                <HeroSection />
                <div className="max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-xl border border-gray-200 mt-12">

                    <button
                        onClick={() => onNavigate('student-info')}
                        className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-4 sm:px-8 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-gray-800 transition"
                    >
                        Start Survey
                        <ArrowRight size={24} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-login')}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black px-6 py-4 sm:px-8 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-gray-50 transition"
                    >
                        <Lock size={20} />
                        Admin Portal
                    </button>

                    <div className="w-full sm:w-auto text-center self-center mt-2 sm:mt-0">
                        <p className="text-sm text-gray-500">Takes about 5 minutes</p>
                    </div>
                </div>

            </div>
        </>
    );
};


import { Check, ArrowRight, BookOpen, Lock } from 'lucide-react'
import HeroSection from '../componnents/HeroSection';

export default HomePage;