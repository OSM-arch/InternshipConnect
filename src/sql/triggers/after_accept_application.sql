DROP TRIGGER IF EXISTS after_accept_application;
DELIMITER //

CREATE TRIGGER after_accept_application
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    DECLARE v_slots INT;
    DECLARE nbr_accepted_app INT;

    IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN

        -- Insert internship
        INSERT INTO internships (
            application_id,
            start_date,
            internship_status
        ) VALUES (
            NEW.application_id,
            CURDATE(),
            'ongoing'
        );

        -- Close offer if full
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
            UPDATE internship_offers
            SET status = 'closed'
            WHERE offer_id = NEW.offer_id;
        END IF;

    END IF;
END //
DELIMITER ;