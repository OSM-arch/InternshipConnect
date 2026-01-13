DROP TRIGGER IF EXISTS before_accept_application;
DELIMITER //

CREATE TRIGGER before_accept_application
BEFORE UPDATE ON applications
FOR EACH ROW
BEGIN
    DECLARE v_slots INT;
    DECLARE nbr_accepted_app INT;
    DECLARE active_internships INT;

    IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN

        -- Check if offer is full
        SELECT available_slots
        INTO v_slots
        FROM internship_offers
        WHERE offer_id = NEW.offer_id;

        SELECT COUNT(*)
        INTO nbr_accepted_app
        FROM applications
        WHERE offer_id = NEW.offer_id
          AND status = 'accepted';

        IF nbr_accepted_app >= v_slots THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'This offer is already full.';
        END IF;

        -- Check if student already has an active internship
        SELECT COUNT(*)
        INTO active_internships
        FROM internships i
        JOIN applications a ON a.application_id = i.application_id
        WHERE a.student_id = NEW.student_id
          AND i.internship_status = 'ongoing';

        IF active_internships > 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Student already has an active internship.';
        END IF;

    END IF;
END //
DELIMITER ;