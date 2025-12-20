-- 1. Users Table
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'enterprise', 'supervisor', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies Table
CREATE TABLE companies (
    company_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    company_name VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Industries Table
CREATE TABLE industries (
    industry_id INT AUTO_INCREMENT PRIMARY KEY,
    industry_name VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Company-Industries
CREATE TABLE company_industries (
    company_id CHAR(36),
    industry_id INT,
    PRIMARY KEY (company_id, industry_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Internship Offers
CREATE TABLE internship_offers (
    offer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_id CHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    location VARCHAR(50),
    expiration_date DATE,
    available_slots INT DEFAULT 1,
    status ENUM('open','closed') DEFAULT 'open',
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Applications
CREATE TABLE applications (
    application_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    offer_id CHAR(36) NOT NULL,
    apply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    cv_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES internship_offers(offer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Internships
CREATE TABLE internships (
    internship_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    supervisor_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    internship_status ENUM('ongoing', 'completed', 'cancelled') DEFAULT 'ongoing',
    FOREIGN KEY (supervisor_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Reports
CREATE TABLE reports (
    report_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    internship_id CHAR(36) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_comments TEXT,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Evaluations
CREATE TABLE evaluations (
    evaluation_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    internship_id CHAR(36) NOT NULL,
    report_grade FLOAT NOT NULL,
    supervisor_grade FLOAT NOT NULL,
    final_grade FLOAT NOT NULL,
    feedback TEXT,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. System Logs
CREATE TABLE system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    performed_by CHAR(36) NOT NULL,
    action_details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);