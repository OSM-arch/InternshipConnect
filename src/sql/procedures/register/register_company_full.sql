DELIMITER //
DROP PROCEDURE IF EXISTS register_company_full//
CREATE PROCEDURE register_company_full (
    IN p_first_name VARCHAR(50),
    IN p_second_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_industry_id INT,
    IN p_company_name VARCHAR(100),
    IN p_address TEXT
    
)
COMMENT 'registers a company account.'
BEGIN
    DECLARE v_user_id CHAR(36);

	-- Handle duplicate entries for email or company_name
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Email already registered';
        ELSEIF EXISTS (SELECT 1 FROM companies WHERE LOWER(company_name) = LOWER(p_company_name)) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Company name already exists';
        ELSE
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Duplicate entry error';
        END IF;
    END;
    
    START TRANSACTION;
		-- Create user
		INSERT INTO users (first_name, second_name, email, password, role)
		VALUES (p_first_name, p_second_name, p_email, p_password, 'company');

		SELECT user_id INTO v_user_id FROM users WHERE email = p_email LIMIT 1;

		-- Create company
		INSERT INTO companies (user_id, industry_id, company_name, address)
		VALUES (v_user_id, p_industry_id, p_company_name, p_address);
		
		-- Log the registration
		INSERT INTO system_logs (action_type, performed_by, action_details) 
		VALUES ('COMPANY_REGISTRATION', v_user_id, CONCAT('Company registered: ', p_company_name));
	COMMIT;
END//
DELIMITER ;