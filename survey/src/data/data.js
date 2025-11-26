const moduleCategories = {
    'Category 1': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 1, name: 'Drilling & Blasting Technology' },
        subModules: [
            { id: 2, parentId: 1, name: 'Rock Mechanics & Geology for Drilling & Blasting' },
            { id: 3, parentId: 1, name: 'Drilling Technology & Equipment' },
            { id: 4, parentId: 1, name: 'Explosives Science & Technology' },
            { id: 5, parentId: 1, name: 'Blast Design & Engineering' },
            { id: 6, parentId: 1, name: 'Blasting Operations & Safety Management' },
            { id: 7, parentId: 1, name: 'Blast Monitoring, Analysis & Optimization' },
            { id: 8, parentId: 1, name: 'Environmental Management & Specialized Applications' }
        ]
    },

    'Category 2': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 9, name: 'Mine Excavation & Materials Transportation' },
        subModules: [
            { id: 10, parentId: 9, name: 'Mine Production Systems & Planning' },
            { id: 11, parentId: 9, name: 'Excavation Equipment & Operations' },
            { id: 12, parentId: 9, name: 'Loading Systems & Material Handling' },
            { id: 13, parentId: 9, name: 'Hauling & Transportation Systems' },
            { id: 14, parentId: 9, name: 'Equipment Maintenance & Reliability' },
            { id: 15, parentId: 9, name: 'Safety Management & Operational Controls' },
            { id: 16, parentId: 9, name: 'Performance Monitoring & Continuous Improvement' }
        ]
    },

    'Category 3': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 17, name: 'Excel & Power BI' },
        subModules: [
            { id: 18, parentId: 17, name: 'Excel Basics & Data Entry Mastery' },
            { id: 19, parentId: 17, name: 'Data Organisation & Basic Analysis' },
            { id: 20, parentId: 17, name: 'PivotTables & Advanced Reporting' },
            { id: 21, parentId: 17, name: 'Advanced Functions & Data Manipulation' },
            { id: 22, parentId: 17, name: 'Power BI Basics & Data Connection' },
            { id: 23, parentId: 17, name: 'Visualization & Report Design' },
            { id: 24, parentId: 17, name: 'Advanced Analytics & AI Integration' },
            { id: 25, parentId: 17, name: 'Advanced DAX & Data Modelling' }
        ]
    },

    'Category 4': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 26, name: 'Mine Planning & Design Technology' },
        subModules: [
            { id: 27, parentId: 26, name: 'Exploration Drillhole Data Interpretation & Block Modelling' },
            { id: 28, parentId: 26, name: 'Strategic Mine Planning & Optimization' },
            { id: 29, parentId: 26, name: 'Open Pit Mine & Waste Dump Design' },
            { id: 30, parentId: 26, name: 'Surface Mine Production Scheduling' },
            { id: 31, parentId: 26, name: 'Advanced Drill & Blast Design' },
            { id: 32, parentId: 26, name: 'Underground Mine Design for Mine Planners' },
            { id: 33, parentId: 26, name: 'Equipment Productivity & Haulage Modelling' },
            { id: 34, parentId: 26, name: '3D Discrete Event Simulation of Haulage Networks' }
        ]
    },

    'Category 5': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 35, name: 'Occupational Health, Safety & Environment' },
        subModules: [
            { id: 36, parentId: 35, name: 'Principles of Occupational Health & Safety' },
            { id: 37, parentId: 35, name: 'Hazard Identification, Risk Assessment & Control' },
            { id: 38, parentId: 35, name: 'Legal & Regulatory Compliance in OHSE' },
            { id: 39, parentId: 35, name: 'Accident Investigation & Root Cause Analysis' },
            { id: 40, parentId: 35, name: 'Fatigue Risk Management & Human Factors in OHSE' },
            { id: 41, parentId: 35, name: 'Mine Rescue Operations & Emergency Response' },
            { id: 42, parentId: 35, name: 'Workplace Safety & Emergency Preparedness' },
            { id: 43, parentId: 35, name: 'Environmental Management Systems & ISO 14001' },
            { id: 44, parentId: 35, name: 'Industrial Hygiene & Toxicology' },
            { id: 45, parentId: 35, name: 'Mine Environmental Protection & Sustainability' },
            { id: 46, parentId: 35, name: 'Safety Audits & Inspections' },
            { id: 47, parentId: 35, name: 'Construction Safety & Site Management' }
        ]
    },

    'Category 6': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 48, name: 'Data Science & Business Analytics' },
        subModules: [
            { id: 49, parentId: 48, name: 'Python Programming for Data Science' },
            { id: 50, parentId: 48, name: 'Statistical Analysis & Hypothesis Testing' },
            { id: 51, parentId: 48, name: 'Data Visualization & Business Intelligence' },
            { id: 52, parentId: 48, name: 'Machine Learning & Predictive Analytics' },
            { id: 53, parentId: 48, name: 'Big Data Analytics & AI Implementation' },
            { id: 54, parentId: 48, name: 'Data Strategy & Organizational Transformation' },
            { id: 55, parentId: 48, name: 'Capstone Project & Professional Portfolio' }
        ]
    },

    'Category 7': {
        text: '️Kindly note that the text in asterisk * is the major module and those without asterisks are sub- modules⚠️',
        major: { id: 56, name: 'Creative Media and Digital Design' },
        subModules: [
            { id: 57, parentId: 56, name: 'Visual Design Foundations & Digital Image' },
            { id: 58, parentId: 56, name: 'Vector Graphics & Brand Design Systems' },
            { id: 59, parentId: 56, name: 'Professional Video Editing & Content Creation' },
            { id: 60, parentId: 56, name: '3D Modelling & Animation Fundamentals' },
            { id: 61, parentId: 56, name: 'Advanced 3D & Cinema Production' },
            { id: 62, parentId: 56, name: 'UI/UX & Interactive Media' },
            { id: 63, parentId: 56, name: '2D Animation & Motion Graphics' },
            { id: 64, parentId: 56, name: 'Audio Production & Podcast Creation' }
        ]
    }
};

export default moduleCategories;
