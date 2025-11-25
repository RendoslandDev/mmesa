const HomePage = ({ onNavigate }) => {
    return (
        <>

            <div className="px-4 py-12">
                <div className="text-center ">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">MMESA Survey</h1>
                    <p className="text-xl text-gray-600 mb-2">Short Course Interest Survey</p>
                    <p className="text-gray-500">Phase 2 • Module Selection</p>
                </div>
                <HeroSection />
                <div className="max-w-md mx-auto space-y-4 card flex flex-row gap-6 p-8">
                    <button
                        onClick={() => onNavigate('student-info')}
                        className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition"
                    >
                        Start Survey
                        <ArrowRight size={24} />
                    </button>

                    <button
                        onClick={() => onNavigate('admin-login')}
                        className="w-full flex items-center justify-center gap-2 border-2 border-black text-black px-8 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition"
                    >
                        <Lock size={20} />
                        Admin Portal
                    </button>

                    <div className="text-center">
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