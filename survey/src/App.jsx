import { useState } from 'react'

import './App.css'
import Header from './componnents/Header'
import HomePage from './pages/HomePage'
import SoftwareSelectionPage from './pages/SoftwareSelectionPage'
import StudentInfoPage from './pages/StudentInfoPage'
import ModuleSelectionPage from './pages/ModuleSelectionPage'
import SuccessPage from './pages/SuccessPage'
import ResultsPage from './pages/ResultsPage'
import OptionSelectionPage from './pages/OptionSelectionPage'
import moduleCategories from './data/data'
import Footer from './componnents/Footer'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboard } from "./pages/AdminDashboard";


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [studentInfo, setStudentInfo] = useState({
    email: '',
    indexNumber: '',
    year: '',
    phoneNumber: ''
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [additionalCourse, setAdditionalCourse] = useState('');
  const [allResponses, setAllResponses] = useState([]);
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const handleLoginSuccess = (token, admin) => {
    setAdminToken(token);
    setAdminUser(admin);
  };


  const getOptionRules = () => {
    switch (selectedOption) {
      case 'Option 1':
        return { majors: 2, subModules: 0, total: 2, description: '2 Major Modules' };
      case 'Option 2':
        return { majors: 1, subModules: 2, total: 3, description: '1 Major + 2 Sub-Modules' };
      case 'Option 3':
        return { majors: 0, subModules: 4, total: 4, description: '4 Sub-Modules' };
      default:
        return { majors: 0, subModules: 0, total: 0, description: '' };
    }
  };

  const countSelections = () => {
    const majorCount = selectedModules.filter(m =>
      Object.values(moduleCategories).some(cat => cat.major === m)
    ).length;
    const subModuleCount = selectedModules.filter(m =>
      Object.values(moduleCategories).some(cat => cat.subModules.includes(m))
    ).length;
    const softwareCount = selectedSoftware.length;

    return { majorCount, subModuleCount, softwareCount, total: majorCount + subModuleCount + softwareCount };
  };

  const handleSubmit = () => {
    const rules = getOptionRules();
    const counts = countSelections();

    if (counts.majorCount !== rules.majors) {
      alert(`You must select exactly ${rules.majors} major module(s)`);
      return;
    }
    if (counts.subModuleCount + counts.softwareCount !== rules.subModules) {
      alert(`You must select exactly ${rules.subModules} sub-module(s)/software (combined)`);
      return;
    }

    const response = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      studentInfo,
      selectedOption,
      selectedModules,
      selectedSoftware,
      additionalCourse
    };

    setAllResponses([...allResponses, response]);
    setCurrentPage('success');
  };

  const resetSurvey = () => {
    setStudentInfo({ email: '', indexNumber: '', year: '', phoneNumber: '' });
    setSelectedOption('');
    setSelectedModules([]);
    setSelectedSoftware([]);
    setAdditionalCourse('');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      resetSurvey();
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        responsesCount={allResponses.length}
      />

      <main className="max-w-2xl mx-auto">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}
        {
          currentPage === 'admin-login' && (
            <AdminLoginPage
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }


        {currentPage === 'student-info' && (
          <StudentInfoPage
            studentInfo={studentInfo}
            setStudentInfo={setStudentInfo}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'option-selection' && (
          <OptionSelectionPage
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'module-selection' && (
          <ModuleSelectionPage
            selectedOption={selectedOption}
            selectedModules={selectedModules}
            setSelectedModules={setSelectedModules}
            onNavigate={handleNavigate}
            getOptionRules={getOptionRules}
            countSelections={countSelections}
          />
        )}

        {currentPage === 'software-selection' && (
          <SoftwareSelectionPage
            studentInfo={studentInfo}
            selectedOption={selectedOption}
            selectedModules={selectedModules}
            selectedSoftware={selectedSoftware}
            setSelectedSoftware={setSelectedSoftware}
            additionalCourse={additionalCourse}
            setAdditionalCourse={setAdditionalCourse}
            onNavigate={handleNavigate}
            getOptionRules={getOptionRules}
            countSelections={countSelections}
            handleSubmit={handleSubmit}
          />
        )}

        {currentPage === 'success' && (
          <SuccessPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'results' && (
          <ResultsPage allResponses={allResponses} />
        )}

        {
          currentPage === "admin-dashboard" && (
            <AdminDashboard
              adminUser={adminUser}
              token={adminToken}
              onNavigate={handleNavigate}
            />
          )
        }


      </main>
      <Footer
        currentPage={currentPage}
        onNavigate={handleNavigate}
        responsesCount={allResponses.length}
      />
    </div>

  );
};



export default App;
