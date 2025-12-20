DELIMITER //
DROP PROCEDURE IF EXISTS register_student//

CREATE PROCEDURE register_student (
    IN p_first_name VARCHAR(50),
    IN p_second_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
COMMENT 'Registers a student account, and logs the registration.'
BEGIN
    DECLARE v_user_id CHAR(36);

    -- Handle duplicate email error
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email already registered';
    END;

    START TRANSACTION;
		INSERT INTO users (first_name, second_name, email, password, role)
		VALUES (p_first_name, p_second_name, p_email, p_password, 'student');

		SELECT user_id INTO v_user_id
		FROM users
		WHERE email = p_email
		LIMIT 1;

		INSERT INTO system_logs (action_type, performed_by, action_details)
		VALUES (
			'STUDENT_REGISTRATION',
			v_user_id,
			CONCAT('Student registered: ', p_email)
		);
    COMMIT;
END//
DELIMITER ;