DROP PROCEDURE IF EXISTS get_company_dashboard;
DELIMITER //
CREATE PROCEDURE get_company_dashboard(IN p_user_id CHAR(36))
BEGIN
	DECLARE v_company_id CHAR(36);

	-- Get company_id for the user
    SELECT company_id INTO v_company_id FROM companies WHERE user_id = p_user_id;
    
    SELECT first_name, second_name FROM users WHERE user_id = p_user_id;
    SELECT company_name FROM companies WHERE company_id = v_company_id;

    -- Total internships
    SELECT COUNT(*) AS total_internships
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    JOIN internship_offers io ON io.offer_id = a.offer_id
    WHERE io.company_id = v_company_id;

    -- Ongoing internships
    SELECT COUNT(*) AS ongoing_internships
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    JOIN internship_offers io ON io.offer_id = a.offer_id
    WHERE io.company_id = v_company_id AND i.internship_status = "ongoing";

    -- Completed internships
    SELECT COUNT(*) AS completed_internships
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    JOIN internship_offers io ON io.offer_id = a.offer_id
    WHERE io.company_id = v_company_id AND i.internship_status = "completed";

    -- Latest 5 internships
    SELECT i.internship_id, i.internship_status, i.start_date, i.end_date, u.first_name, u.second_name, u.profile_image_url, u.user_id, sh.school_name, a.offer_id
    FROM internships i
    JOIN applications a ON a.application_id = i.application_id
    JOIN students s ON s.student_id = a.student_id
    JOIN schools sh ON sh.school_id = s.school_id 
    JOIN users u ON u.user_id = s.user_id
    JOIN internship_offers io ON io.offer_id = a.offer_id
    WHERE io.company_id = v_company_id
    ORDER BY i.start_date DESC
    LIMIT 5;

END;
//
DELIMITER ;