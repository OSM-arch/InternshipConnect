DROP PROCEDURE IF EXISTS get_student_dashboard;
DELIMITER //

CREATE PROCEDURE get_student_dashboard(IN p_user_id CHAR(36))
BEGIN
	DECLARE p_student_id CHAR(36);
    START TRANSACTION;
    
    -- get student_id
    SELECT student_id INTO p_student_id FROM students WHERE user_id = p_user_id;
    
    SELECT first_name, second_name FROM users WHERE user_id = p_user_id;

    -- total completed internships
    SELECT COUNT(*) AS completed_internships
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    WHERE a.student_id = p_student_id
      AND i.internship_status = 'completed';

    -- total applications sent
    SELECT COUNT(*) AS total_applications
    FROM applications
    WHERE student_id = p_student_id;

    -- total pending applications
    SELECT COUNT(*) AS pending_applications
    FROM applications
    WHERE student_id = p_student_id
      AND status = 'pending';

    -- latest 5 applications sent
    SELECT a.application_id, i.title, i.salary, i.offer_id, c.company_name, c.logo_url, a.apply_date, a.status
	FROM applications a
	 JOIN internship_offers i ON i.offer_id = a.offer_id
	 JOIN companies c ON c.company_id = i.company_id
	WHERE a.student_id = p_student_id
    ORDER BY a.apply_date DESC
    LIMIT 5;

    -- current internship
    SELECT 
        i.start_date,
        i.end_date,
        i.internship_status,
        io.title,
        io.offer_id,
        c.company_name
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    JOIN internship_offers io ON io.offer_id = a.offer_id
    JOIN companies c ON c.company_id = io.company_id
    WHERE a.student_id = p_student_id;

    COMMIT;
END //

DELIMITER ;