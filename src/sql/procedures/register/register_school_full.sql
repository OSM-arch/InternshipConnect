DELIMITER //
DROP PROCEDURE IF EXISTS register_school//
CREATE PROCEDURE register_school(
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_school_name VARCHAR(150),
    IN p_address TEXT
)
BEGIN
    DECLARE v_user_id CHAR(36) DEFAULT (UUID());
    DECLARE v_school_id CHAR(36) DEFAULT (UUID());
    DECLARE v_new_key VARCHAR(20) DEFAULT '';
	DECLARE characters CHAR(36) DEFAULT 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	DECLARE i INT DEFAULT 1;

    -- Handle duplicate email
    DECLARE EXIT HANDLER FOR 1062
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Email already registered';
    END;

    START TRANSACTION;

	SET v_new_key = 'SCH-';

	WHILE i <= 8 DO
		SET v_new_key = CONCAT(
			v_new_key,
			SUBSTRING(characters, FLOOR(1 + RAND() * 36), 1)
		);
		IF i = 4 THEN
			SET v_new_key = CONCAT(v_new_key, '-');
		END IF;
		SET i = i + 1;
	END WHILE;

    -- Create user
    INSERT INTO users (user_id, first_name, second_name, email, password, role)
    VALUES (v_user_id, p_first_name, p_last_name, p_email, p_password, 'school');

    -- Create school
    INSERT INTO schools (school_id, user_id, school_name, registration_key, address)
    VALUES (v_school_id, v_user_id, p_school_name, v_new_key, p_address);

    -- Log the registration
    INSERT INTO system_logs (action_type, performed_by, action_details)
    VALUES (
        'SCHOOL_REGISTRATION',
        v_user_id,
        CONCAT('School registered: ', p_school_name, ' | Registration Key: ', v_new_key)
    );

    COMMIT;
END //
DELIMITER ;