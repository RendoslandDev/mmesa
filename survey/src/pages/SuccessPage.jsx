import React, { useEffect } from 'react';


export const SuccessPage = ({ onNavigate }) => {
    useEffect(() => {
        // Auto redirect after 3 seconds
        const timer = setTimeout(() => {
            onNavigate('home');
        }, 3000);
        return () => clearTimeout(timer);
    }, [onNavigate]);

    return (
        <div className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">All set!</h2>
            <p className="text-gray-600 text-lg mb-8">
                Your survey has been submitted successfully to our database
            </p>
            <p className="text-sm text-gray-500">
                Redirecting to home in 3 seconds...
            </p>
        </div>
    );
};
import { Check } from 'lucide-react';

export default SuccessPage;