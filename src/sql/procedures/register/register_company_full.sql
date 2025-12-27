DELIMITER //
DROP PROCEDURE IF EXISTS register_company_full//
CREATE PROCEDURE register_company_full (
    IN p_first_name VARCHAR(50),
    IN p_second_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_company_name VARCHAR(100),
    IN p_address TEXT,
    IN p_contact_person VARCHAR(100),
    IN p_industry_id INT
)
COMMENT 'Atomically registers a company account. 
Creates an enterprise user, links it to a company profile, assigns an industry, 
and logs the registration. Ensures referential integrity by preventing companies 
from existing without a corresponding user account.'
BEGIN
    DECLARE v_user_id CHAR(36);
    DECLARE v_company_id CHAR(36);

	-- Handle duplicate email-verification error
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email already registered';
    END;
    
    START TRANSACTION;
		-- Create enterprise user
		INSERT INTO users (first_name, second_name, email, password, role)
		VALUES (p_first_name, p_second_name, p_email, p_password, 'enterprise');

		SELECT user_id INTO v_user_id FROM users WHERE email = p_email LIMIT 1;

		-- Create company linked to user
		INSERT INTO companies (user_id, company_name, address, contact_person)
		VALUES (v_user_id, p_company_name, p_address, p_contact_person);

		SELECT company_id INTO v_company_id FROM companies WHERE user_id = v_user_id LIMIT 1;

		-- Link company to industry
		INSERT INTO company_industries (company_id, industry_id)
		VALUES (v_company_id, p_industry_id);
		
		-- Log the registration
		INSERT INTO system_logs (action_type, performed_by, action_details) 
		VALUES ('COMPANY_REGISTRATION', v_user_id, CONCAT('Company registered: ', p_company_name));
	COMMIT;
END//
DELIMITER ;