DELIMITER //

DROP PROCEDURE IF EXISTS register_admin//

CREATE PROCEDURE register_admin (
    IN p_first_name VARCHAR(50),
    IN p_second_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
COMMENT 'Registers an admin account, and logs the registration.'
BEGIN
    DECLARE v_user_id CHAR(36);

    -- Handle duplicate email-verification
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email already registered';
    END;

    START TRANSACTION;
		-- Insert admin user
		INSERT INTO users (first_name, second_name, email, password, role)
		VALUES (p_first_name, p_second_name, p_email, p_password, 'admin');

		SELECT user_id INTO v_user_id
		FROM users
		WHERE email = p_email
		LIMIT 1;

		-- Log the registration
		INSERT INTO system_logs (action_type, performed_by, action_details)
		VALUES (
			'ADMIN_REGISTRATION',
			v_user_id,
			CONCAT('Admin registered: ', p_email)
		);
    COMMIT;
END//

DELIMITER ;