const Header = ({ currentPage, onNavigate, responsesCount }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-2xl mx-auto px-4">
                <img src="/pic.jpeg" alt="" width={600} height={600} />
                <div className="flex items-center justify-between h-14">
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <BookOpen className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg">MMESA</span>

                    </button>
                    {responsesCount > 0 && currentPage !== 'results' && (
                        <button
                            onClick={() => onNavigate('results')}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm  font-medium hover:bg-gray-100 rounded-full transition"
                        >
                            <BarChart2 size={16} />
                            Results
                        </button>
                    )}
                    {currentPage === 'results' && (
                        <button
                            onClick={() => onNavigate('home')}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={16} />
                            Close
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
import { BookOpen, BarChart2, X } from 'lucide-react';

export default Header;  