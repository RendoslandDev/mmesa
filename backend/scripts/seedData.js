import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import pool from "../config/database.js";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // 1. Insert admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.execute(
      `INSERT IGNORE INTO admin_users (username, password_hash, role)
       VALUES (?, ?, ?)`,
      ["admin", hashedPassword, "admin"]
    );
    console.log("✅ Admin user created");

    // 2. Define categories with proper names (MUST MATCH moduleData keys)
    const categoryNames = [
      "Drilling & Blasting Technology",
      "Mine Excavation & Materials Transportation",
      "Excel & Power BI",
      "Mine Planning & Design Technology",
      "Occupational Health, Safety & Environment",
      "Data Science & Business Analytics",
      "Creative Media and Digital Design",
    ];

    // 3. Insert categories with CORRECT names
    console.log("📂 Creating categories...");
    for (const categoryName of categoryNames) {
      await pool.execute(
        "INSERT IGNORE INTO module_categories (name, description) VALUES (?, ?)",
        [categoryName, `${categoryName} courses and modules`]
      );
    }
    console.log(`✅ ${categoryNames.length} categories created`);

    // 4. Fetch category IDs
    console.log("📚 Fetching category IDs...");
    const [cats] = await pool.execute("SELECT id, name FROM module_categories");
    const categoryMap = {};
    cats.forEach((cat) => {
      categoryMap[cat.name] = cat.id;
    });
    console.log("✅ Category mapping created:", Object.keys(categoryMap).length, "categories");

    // 5. Define modules data - KEYS MUST MATCH CATEGORY NAMES
    const moduleData = {
      "Drilling & Blasting Technology": {
        major: "Drilling & Blasting Technology",
        sub: [
          "Rock Mechanics & Geology for Drilling & Blasting",
          "Drilling Technology & Equipment",
          "Explosives Science & Technology",
          "Blast Design & Engineering",
          "Blasting Operations & Safety Management",
          "Blast Monitoring, Analysis & Optimization",
          "Environmental Management & Specialized Applications",
        ],
      },
      "Mine Excavation & Materials Transportation": {
        major: "Mine Excavation & Materials Transportation",
        sub: [
          "Mine Production Systems & Planning",
          "Excavation Equipment & Operations",
          "Loading Systems & Material Handling",
          "Hauling & Transportation Systems",
          "Equipment Maintenance & Reliability",
          "Safety Management & Operational Controls",
          "Performance Monitoring & Continuous Improvement",
        ],
      },
      "Excel & Power BI": {
        major: "Excel & Power BI",
        sub: [
          "Excel Basics & Data Entry Mastery",
          "Data Organisation & Basic Analysis",
          "PivotTables & Advanced Reporting",
          "Advanced Functions & Data Manipulation",
          "Power BI Basics & Data Connection",
          "Visualization & Report Design",
          "Advanced Analytics & AI Integration",
          "Advanced DAX & Data Modelling",
        ],
      },
      "Mine Planning & Design Technology": {
        major: "Mine Planning & Design Technology",
        sub: [
          "Exploration Drillhole Data Interpretation & Block Modelling",
          "Strategic Mine Planning & Optimization",
          "Open Pit Mine & Waste Dump Design",
          "Surface Mine Production Scheduling",
          "Advanced Drill & Blast Design",
          "Underground Mine Design for Mine Planners",
          "Equipment Productivity & Haulage Modelling",
          "3D Discrete Event Simulation of Haulage Networks",
        ],
      },
      "Occupational Health, Safety & Environment": {
        major: "Occupational Health, Safety & Environment",
        sub: [
          "Principles of Occupational Health & Safety",
          "Hazard Identification, Risk Assessment & Control",
          "Legal & Regulatory Compliance in OHSE",
          "Accident Investigation & Root Cause Analysis",
          "Fatigue Risk Management & Human Factors in OHSE",
          "Mine Rescue Operations & Emergency Response",
          "Workplace Safety & Emergency Preparedness",
          "Environmental Management Systems & ISO 14001",
          "Industrial Hygiene & Toxicology",
          "Mine Environmental Protection & Sustainability",
          "Safety Audits & Inspections",
          "Construction Safety & Site Management",
        ],
      },
      "Data Science & Business Analytics": {
        major: "Data Science & Business Analytics",
        sub: [
          "Python Programming for Data Science",
          "Statistical Analysis & Hypothesis Testing",
          "Data Visualization & Business Intelligence",
          "Machine Learning & Predictive Analytics",
          "Big Data Analytics & AI Implementation",
          "Data Strategy & Organizational Transformation",
          "Capstone Project & Professional Portfolio",
        ],
      },
      "Creative Media and Digital Design": {
        major: "Creative Media and Digital Design",
        sub: [
          "Visual Design Foundations & Digital Image",
          "Vector Graphics & Brand Design Systems",
          "Professional Video Editing & Content Creation",
          "3D Modelling & Animation Fundamentals",
          "Advanced 3D & Cinema Production",
          "UI/UX & Interactive Media",
          "2D Animation & Motion Graphics",
          "Audio Production & Podcast Creation",
        ],
      },
    };

    // 6. Insert modules
    console.log("📖 Creating modules...");
    let moduleCount = 0;

    for (const [categoryName, modules] of Object.entries(moduleData)) {
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        console.warn(`⚠️  WARNING: Category not found in map: "${categoryName}"`);
        console.warn(`   Available categories: ${Object.keys(categoryMap).join(", ")}`);
        continue;
      }

      // Insert major module
      await pool.execute(
        "INSERT IGNORE INTO modules (category_id, name, is_major) VALUES (?, ?, ?)",
        [categoryId, modules.major, true]
      );
      moduleCount++;

      // Insert sub-modules
      for (const sub of modules.sub) {
        await pool.execute(
          "INSERT IGNORE INTO modules (category_id, name, is_major) VALUES (?, ?, ?)",
          [categoryId, sub, false]
        );
        moduleCount++;
      }
    }
    console.log(`✅ ${moduleCount} modules created`);

    // 7. Insert software
    console.log("💻 Creating software options...");
    const softwareList = [
      "Ball Mill Simulation Software",
      "Datamine",
      "Deswik",
      "Leapfrog",
      "Surpac",
      "ArcGIS",
      "Matlab",
      "Ansys",
      "Solidworks",
      "Autocad",
    ];

    for (const software of softwareList) {
      await pool.execute(
        "INSERT IGNORE INTO software (name) VALUES (?)",
        [software]
      );
    }
    console.log(`✅ ${softwareList.length} software options created`);

    // 8. Create sample student data
    console.log("🎓 Creating sample student data...");
    await pool.execute(
      `INSERT IGNORE INTO students (email, index_number, year_of_study, whatsapp_phone)
       VALUES (?, ?, ?, ?)`,
      ["student@example.com", "ST12345", "Year 2", "0244123456"]
    );

    const [studentResult] = await pool.execute(
      `SELECT id FROM students WHERE email = ?`,
      ["student@example.com"]
    );

    if (studentResult && studentResult.length > 0) {
      const studentId = studentResult[0].id;

      await pool.execute(
        `INSERT IGNORE INTO survey_responses (student_id, selected_option, additional_courses, submitted_at)
         VALUES (?, ?, ?, NOW())`,
        [studentId, "Option 1", "Extra course suggestion"]
      );
      console.log("✅ Sample student and survey response created");
    }

    console.log("\n========================================");
    console.log("✅ Database seed completed successfully!");
    console.log("========================================");
    console.log("\n📋 Default Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n🎓 Test Student:");
    console.log("   Email: student@example.com");
    console.log("   Index: ST12345");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();