-- ==================== DATABASE SCHEMA ====================

-- Create Database (PostgreSQL handles DB separately, don't use USE)
-- CREATE DATABASE mmesa_survey;

-- ==================== 1. Module Categories Table ====================
CREATE TABLE IF NOT EXISTS module_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 2. Modules Table ====================
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES module_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  credits INT DEFAULT 3,
  is_major BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON modules(category_id);
CREATE INDEX idx_major ON modules(is_major);

-- ==================== 3. Software Table ====================
CREATE TABLE IF NOT EXISTS software (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 4. Students Table ====================
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  index_number VARCHAR(50) NOT NULL UNIQUE,
  year_of_study VARCHAR(50),
  whatsapp_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON students(email);
CREATE INDEX idx_index ON students(index_number);

-- ==================== 5. Survey Responses Table ====================
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  selected_option VARCHAR(50),
  additional_courses TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student ON survey_responses(student_id);
CREATE INDEX idx_option ON survey_responses(selected_option);
CREATE INDEX idx_submitted ON survey_responses(submitted_at);

-- ==================== 6. Student Module Selections ====================
CREATE TABLE IF NOT EXISTS student_module_selections (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  response_id INT NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  module_id INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_module ON student_module_selections(student_id);
CREATE INDEX idx_module ON student_module_selections(module_id);

-- ==================== 7. Student Software Selections ====================
CREATE TABLE IF NOT EXISTS student_software_selections (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  response_id INT NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  software_id INT NOT NULL REFERENCES software(id) ON DELETE CASCADE,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_software ON student_software_selections(student_id);
CREATE INDEX idx_software ON student_software_selections(software_id);

-- ==================== 8. Admin Users Table ====================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON admin_users(username);

-- ==================== 9. Audit Log Table ====================
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(255),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin ON audit_log(admin_id);
CREATE INDEX idx_created ON audit_log(created_at);

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
(1, 'Drilling Fundamentals', 'DBT-101', 3, TRUE),
(1, 'Blast Design and Analysis', 'DBT-102', 3, TRUE),
(1, 'Explosive Materials', 'DBT-201', 2, FALSE),
(1, 'Safety in Drilling Operations', 'DBT-202', 2, FALSE),
(2, 'Excavation Methods', 'MEM-101', 3, TRUE),
(2, 'Material Handling Systems', 'MEM-102', 3, TRUE),
(2, 'Transportation Systems', 'MEM-201', 2, FALSE),
(2, 'Equipment Management', 'MEM-202', 2, FALSE),
(3, 'Advanced Excel for Mining', 'EXL-101', 3, TRUE),
(3, 'Power BI for Data Visualization', 'EXL-102', 3, TRUE),
(3, 'Data Dashboard Creation', 'EXL-201', 2, FALSE),
(3, 'Spreadsheet Automation', 'EXL-202', 2, FALSE),
(4, 'Mine Planning Principles', 'MPD-101', 3, TRUE),
(4, 'CAD for Mining Design', 'MPD-102', 3, TRUE),
(4, 'Pit Optimization', 'MPD-201', 2, FALSE),
(4, 'Resource Estimation', 'MPD-202', 2, FALSE),
(5, 'Mining Safety Standards', 'OHS-101', 3, TRUE),
(5, 'Environmental Management', 'OHS-102', 3, TRUE),
(5, 'Hazard Identification', 'OHS-201', 2, FALSE),
(5, 'Emergency Response Planning', 'OHS-202', 2, FALSE),
(6, 'Data Science Foundations', 'DSA-101', 3, TRUE),
(6, 'Business Analytics', 'DSA-102', 3, TRUE),
(6, 'Machine Learning Basics', 'DSA-201', 2, FALSE),
(6, 'Statistical Analysis', 'DSA-202', 2, FALSE),
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
INSERT INTO admin_users (username, password_hash, role) VALUES
('admin', 'admin123', 'admin');

-- ==================== CREATE INDEXES FOR PERFORMANCE ====================
CREATE INDEX idx_response_date ON survey_responses(submitted_at);
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_module_selection ON student_module_selections(module_id);
CREATE INDEX idx_software_selection ON student_software_selections(software_id);
