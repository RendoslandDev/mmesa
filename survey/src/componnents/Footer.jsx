const Footer = ({ currentPage, onNavigate, responsesCount }) => {
    return (
        <footer className="sticky top-0 mt-30 z-50 bg-white/80 backdrop-blur-md  border-gray-200">
            <div className="max-w-2xl mx-auto px-4">
                <img src="/pic1.jpeg" alt="" width={600} height={600} />
                {/* <div className="flex items-center justify-between h-14">

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
                </div> */}
            </div>
        </footer>
    );
};
// import { BookOpen, BarChart2, X } from 'lucide-react';

export default Footer;  