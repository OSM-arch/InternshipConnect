DROP TRIGGER IF EXISTS before_save_offer;
DELIMITER //
CREATE TRIGGER before_save_offer BEFORE INSERT ON saved_offers FOR EACH ROW
BEGIN
	IF (SELECT count(*) FROM saved_offers WHERE user_id = NEW.user_id AND offer_id = NEW.offer_id > 0) THEN
		SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Already saved.";
	END IF;
END //
DELIMITER ;