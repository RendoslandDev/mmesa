const InfoAlert = () => {
    return (
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
                <p className="text-gray-900 font-medium mb-1">Two sections in this survey</p>
                <p className="text-gray-600 mb-1">Section 1: Choose modules aligned with your interests</p>
                <p className="text-gray-600">Section 2: Select engineering software to learn</p>
                <p className="text-xs text-gray-500 mt-3">📞 Need help? 0257011510 / 0596125696</p>
            </div>
        </div>
    );
};

import { Info } from 'lucide-react'
export default InfoAlert;