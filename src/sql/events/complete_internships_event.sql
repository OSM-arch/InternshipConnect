SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS complete_internships_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
    UPDATE internships
    SET internship_status = 'completed'
    WHERE internship_status = 'ongoing'
      AND end_date <= CURDATE();