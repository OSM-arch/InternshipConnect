DELIMITER //
DROP PROCEDURE IF EXISTS register_student//

CREATE PROCEDURE register_student (
    IN p_first_name VARCHAR(50),
    IN p_second_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_school_id CHAR(36)
)
COMMENT 'Registers a student account, and logs the registration.'
BEGIN
    DECLARE v_user_id CHAR(36);

    -- Handle duplicate email-verification error
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email already registered';
    END;
    
    -- Handle school not exists
    IF NOT EXISTS (
		SELECT 1 FROM schools WHERE school_id = p_school_id
	) THEN
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Invalid school ID';
	END IF;

    START TRANSACTION;
		-- insert user to users table 
		INSERT INTO users (first_name, second_name, email, password, role)
		VALUES (p_first_name, p_second_name, p_email, p_password, 'student');

		SELECT user_id INTO v_user_id
		FROM users
		WHERE email = p_email
		LIMIT 1;
        
        -- insert to students table
        INSERT INTO students (user_id, school_id) VALUES (v_user_id, p_school_id);

		-- insert log to system logs table 
		INSERT INTO system_logs (action_type, performed_by, action_details)
		VALUES (
			'STUDENT_REGISTRATION',
			v_user_id,
			CONCAT('Student registered: ', p_email)
		);
    COMMIT;
END//
DELIMITER ;