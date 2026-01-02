DROP TRIGGER IF EXISTS before_insert_application;
DELIMITER //
CREATE TRIGGER before_insert_application BEFORE INSERT ON applications FOR EACH ROW
BEGIN
	IF (SELECT count(*) FROM applications WHERE student_id = NEW.student_id AND offer_id = NEW.offer_id > 0) THEN
		SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "you’ve already submitted an application for this offer.";
	END IF;
END //
DELIMITER ;