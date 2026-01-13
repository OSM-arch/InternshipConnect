CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'company', 'supervisor') NOT NULL,
    profile_image_url VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE industries (
    industry_id INT AUTO_INCREMENT PRIMARY KEY,
    industry_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE schools (
    school_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    school_name VARCHAR(150) NOT NULL,
    address TEXT
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
    company_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE students (
    student_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
	school_id CHAR(36) NULL,
    cv_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE SET NULL ON UPDATE CASCADE

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
    supervisor_id CHAR(36) DEFAULT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    report_url VARCHAR(255),
    internship_status ENUM('ongoing', 'completed', 'cancelled') DEFAULT 'ongoing',
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES supervisors(supervisor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE saved_offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36),
    offer_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES internship_offers(offer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

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
    technical_score FLOAT NOT NULL,
    soft_skills_score FLOAT NOT NULL,
    final_grade FLOAT NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
