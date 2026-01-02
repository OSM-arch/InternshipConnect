-- 1. Independent Tables (No Foreign Keys)
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'company', 'supervisor', 'school') NOT NULL,
    profile_image_url VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE industries (
    industry_id INT AUTO_INCREMENT PRIMARY KEY,
    industry_name VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Tables depending only on 'users'
CREATE TABLE schools (
    school_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    school_name VARCHAR(150) NOT NULL,
    registration_key VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE companies (
    company_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    industry_id INT NULL,
    company_name VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    size INT,
    description TEXT NULL,
    linkedin_url VARCHAR(255) NULL,
    logo_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE supervisors (
    supervisor_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    school_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

-- 3. Tables depending on 'schools' and 'supervisors'
CREATE TABLE student_groups (
    group_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    school_id CHAR(36),
    supervisor_id CHAR(36),
    group_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20),
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES supervisors(supervisor_id) ON DELETE SET NULL
);

-- 4. Tables depending on 'student_groups' and 'companies'
CREATE TABLE students (
    student_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    school_id CHAR(36),
    group_id CHAR(36),
    cv_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES student_groups(group_id) ON DELETE SET NULL
);

CREATE TABLE company_industries (
    company_id CHAR(36),
    industry_id INT,
    PRIMARY KEY (company_id, industry_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE internship_offers (
    offer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id CHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    required_skills JSON NOT NULL,
    salary DECIMAL(10,2) DEFAULT 0,
    languages JSON,
    location VARCHAR(50),
    expiration_date DATE,
    available_slots INT DEFAULT 1,
    status ENUM('open','closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Transactional Tables (Applications -> Internships)
CREATE TABLE applications (
    application_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    offer_id CHAR(36) NOT NULL,
    apply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES internship_offers(offer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE internships (
    internship_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    supervisor_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    internship_status ENUM('ongoing', 'completed', 'cancelled') DEFAULT 'ongoing',
    FOREIGN KEY (supervisor_id) REFERENCES supervisors(supervisor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE saved_offers (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36),
    offer_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES internship_offers(offer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Final Detail Tables
CREATE TABLE reports (
    report_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    internship_id CHAR(36) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_comments TEXT,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE evaluations (
    evaluation_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    internship_id CHAR(36) NOT NULL,
    report_grade FLOAT NOT NULL,
    supervisor_grade FLOAT NOT NULL,
    final_grade FLOAT NOT NULL,
    feedback TEXT,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    performed_by CHAR(36) NOT NULL,
    action_details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);