-- ==================== DATABASE SCHEMA ====================

-- Create Database
CREATE DATABASE IF NOT EXISTS mmesa_survey;
USE mmesa_survey;

-- ==================== 1. Module Categories Table ====================
CREATE TABLE IF NOT EXISTS module_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 2. Modules Table ====================
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  credits INT DEFAULT 3,
  is_major BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES module_categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_major (is_major)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 3. Software Table ====================
CREATE TABLE IF NOT EXISTS software (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 4. Students Table ====================
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  index_number VARCHAR(50) NOT NULL UNIQUE,
  year_of_study VARCHAR(50),
  whatsapp_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_index (index_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 5. Survey Responses Table ====================
CREATE TABLE IF NOT EXISTS survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  selected_option VARCHAR(50),
  additional_courses TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_option (selected_option),
  INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 6. Student Module Selections ====================
CREATE TABLE IF NOT EXISTS student_module_selections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  response_id INT NOT NULL,
  module_id INT NOT NULL,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 7. Student Software Selections ====================
CREATE TABLE IF NOT EXISTS student_software_selections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  response_id INT NOT NULL,
  software_id INT NOT NULL,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
  FOREIGN KEY (software_id) REFERENCES software(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_software (software_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 8. Admin Users Table ====================
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 9. Audit Log Table ====================
CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  action VARCHAR(255),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_admin (admin_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== INSERT MODULE CATEGORIES ====================
INSERT INTO module_categories (name, description) VALUES
('Drilling & Blasting Technology', 'Drilling and blasting techniques for mining operations'),
('Mine Excavation & Materials Transportation', 'Excavation methods and material handling systems'),
('Excel & Power BI', 'Data analysis and business intelligence tools'),
('Mine Planning & Design Technology', 'Mine planning, design, and optimization'),
('Occupational Health, Safety & Environment', 'Health, safety, and environmental management'),
('Data Science & Business Analytics', 'Data science, analytics, and business intelligence'),
('Creative Media and Digital Design', 'Digital design and multimedia content creation');

-- ==================== INSERT MODULES ====================
INSERT INTO modules (category_id, name, code, credits, is_major) VALUES
-- Category 1: Drilling & Blasting Technology
(1, 'Drilling Fundamentals', 'DBT-101', 3, TRUE),
(1, 'Blast Design and Analysis', 'DBT-102', 3, TRUE),
(1, 'Explosive Materials', 'DBT-201', 2, FALSE),
(1, 'Safety in Drilling Operations', 'DBT-202', 2, FALSE),

-- Category 2: Mine Excavation & Materials Transportation
(2, 'Excavation Methods', 'MEM-101', 3, TRUE),
(2, 'Material Handling Systems', 'MEM-102', 3, TRUE),
(2, 'Transportation Systems', 'MEM-201', 2, FALSE),
(2, 'Equipment Management', 'MEM-202', 2, FALSE),

-- Category 3: Excel & Power BI
(3, 'Advanced Excel for Mining', 'EXL-101', 3, TRUE),
(3, 'Power BI for Data Visualization', 'EXL-102', 3, TRUE),
(3, 'Data Dashboard Creation', 'EXL-201', 2, FALSE),
(3, 'Spreadsheet Automation', 'EXL-202', 2, FALSE),

-- Category 4: Mine Planning & Design Technology
(4, 'Mine Planning Principles', 'MPD-101', 3, TRUE),
(4, 'CAD for Mining Design', 'MPD-102', 3, TRUE),
(4, 'Pit Optimization', 'MPD-201', 2, FALSE),
(4, 'Resource Estimation', 'MPD-202', 2, FALSE),

-- Category 5: Occupational Health, Safety & Environment
(5, 'Mining Safety Standards', 'OHS-101', 3, TRUE),
(5, 'Environmental Management', 'OHS-102', 3, TRUE),
(5, 'Hazard Identification', 'OHS-201', 2, FALSE),
(5, 'Emergency Response Planning', 'OHS-202', 2, FALSE),

-- Category 6: Data Science & Business Analytics
(6, 'Data Science Foundations', 'DSA-101', 3, TRUE),
(6, 'Business Analytics', 'DSA-102', 3, TRUE),
(6, 'Machine Learning Basics', 'DSA-201', 2, FALSE),
(6, 'Statistical Analysis', 'DSA-202', 2, FALSE),

-- Category 7: Creative Media and Digital Design
(7, 'Digital Design Fundamentals', 'CMD-101', 3, TRUE),
(7, 'Multimedia Content Creation', 'CMD-102', 3, TRUE),
(7, 'Graphic Design', 'CMD-201', 2, FALSE),
(7, 'Video Production', 'CMD-202', 2, FALSE);

-- ==================== INSERT SOFTWARE OPTIONS ====================
INSERT INTO software (name, description) VALUES
('AutoCAD', 'Design and drafting software for engineering and mining planning'),
('Surpac', 'Mine planning and design software'),
('Datamine', 'Resource estimation and mine planning'),
('Vulcan', 'Integrated mining software suite'),
('Python', 'Programming language for data analysis'),
('SQL Server', 'Database management and data analysis'),
('Tableau', 'Data visualization and business intelligence'),
('ArcGIS', 'GIS software for spatial analysis'),
('SPSS', 'Statistical analysis software'),
('Adobe Creative Suite', 'Design and multimedia creation tools');

-- ==================== INSERT ADMIN USER ====================
INSERT INTO admin_users (username, password, role) VALUES
('admin', 'admin123', 'admin');

-- ==================== CREATE INDEXES FOR PERFORMANCE ====================
CREATE INDEX idx_response_date ON survey_responses(submitted_at);
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_module_selection ON student_module_selections(module_id);
CREATE INDEX idx_software_selection ON student_software_selections(software_id);

-- ==================== VERIFY INSTALLATION ====================
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as module_categories FROM module_categories;
SELECT COUNT(*) as modules FROM modules;
SELECT COUNT(*) as software_options FROM software;
SELECT COUNT(*) as admin_users FROM admin_users;