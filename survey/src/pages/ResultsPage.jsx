// const ResultsPage = ({ allResponses }) => {
//     return (
//         <div className="px-4 py-6">
//             <h2 className="text-2xl font-bold mb-6">Survey Results</h2>
// 
//             {allResponses.length === 0 ? (
//                 <div className="text-center py-12">
//                     <p className="text-gray-500">No responses yet</p>
//                 </div>
//             ) : (
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-4 gap-3">
//                         {[
//                             { label: 'Total', value: allResponses.length },
//                             { label: 'Option 1', value: allResponses.filter(r => r.selectedOption === 'Option 1').length },
//                             { label: 'Option 2', value: allResponses.filter(r => r.selectedOption === 'Option 2').length },
//                             { label: 'Option 3', value: allResponses.filter(r => r.selectedOption === 'Option 3').length }
//                         ].map(stat => (
//                             <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-2xl">
//                                 <p className="text-3xl font-bold">{stat.value}</p>
//                                 <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
//                             </div>
//                         ))}
//                     </div>
// 
//                     <div className="space-y-3">
//                         {allResponses.map((response) => (
//                             <div key={response.id} className="p-5 border border-gray-200 rounded-2xl">
//                                 <div className="flex items-start justify-between mb-3">
//                                     <div>
//                                         <p className="font-bold">{response.studentInfo.indexNumber}</p>
//                                         <p className="text-sm text-gray-600">{response.studentInfo.year}</p>
//                                     </div>
//                                     <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
//                                         {response.selectedOption}
//                                     </span>
//                                 </div>
// 
//                                 {response.selectedModules.length > 0 && (
//                                     <div className="mb-3">
//                                         <p className="text-sm font-semibold mb-2">Modules</p>
//                                         <div className="flex flex-wrap gap-1">
//                                             {response.selectedModules.map(module => (
//                                                 <span key={module} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
//                                                     {module.length > 40 ? module.substring(0, 40) + '...' : module}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
// 
//                                 {response.selectedSoftware.length > 0 && (
//                                     <div>
//                                         <p className="text-sm font-semibold mb-2">Software</p>
//                                         <div className="flex flex-wrap gap-1">
//                                             {response.selectedSoftware.map(software => (
//                                                 <span key={software} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
//                                                     {software}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

const ResultsPage = ({ allResponses }) => {
    return (
        <div className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">Survey Results</h2>

            {allResponses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No responses yet</p>
                </div>
            ) : (
                <div className="space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Total', value: allResponses.length },
                            { label: 'Option 1', value: allResponses.filter(r => r.selected_option === 'Option 1').length },
                            { label: 'Option 2', value: allResponses.filter(r => r.selected_option === 'Option 2').length },
                            { label: 'Option 3', value: allResponses.filter(r => r.selected_option === 'Option 3').length }
                        ].map(stat => (
                            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-2xl">
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Response Cards */}
                    <div className="space-y-3">
                        {allResponses.map((response) => (
                            <div key={response.survey_id} className="p-5 border border-gray-200 rounded-2xl">

                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-bold">{response.index_number}</p>
                                        <p className="text-sm text-gray-600">Year {response.year_of_study}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
                                        {response.selected_option}
                                    </span>
                                </div>

                                {/* Modules */}
                                {response.selected_module_names?.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold mb-2">Modules</p>
                                        <div className="flex flex-wrap gap-1">
                                            {response.selected_module_names.map((module, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
                                                    {module.length > 40 ? module.substring(0, 40) + '...' : module}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Software */}
                                {response.selected_software_names?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Software</p>
                                        <div className="flex flex-wrap gap-1">
                                            {response.selected_software_names.map((software, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
                                                    {software}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};






export default ResultsPage;
