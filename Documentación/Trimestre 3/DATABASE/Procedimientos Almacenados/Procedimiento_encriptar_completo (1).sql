CREATE DEFINER=`root`@`localhost` PROCEDURE `p_encriptar_password_sha2`(
    IN p_password VARCHAR(255),
    OUT p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_salt VARCHAR(64);
    DECLARE v_hash_combinado VARCHAR(128);
    DECLARE v_uuid VARCHAR(36);
    
    -- Validar que la contraseña no esté vacía
    IF p_password IS NULL OR p_password = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La contraseña no puede estar vacía';
    END IF;
    
    -- Generar UUID para salt único
    SET v_uuid = UUID();
    
    -- Generar salt: combinación de UUID y timestamp
    SET v_salt = SHA2(CONCAT(v_uuid, NOW()), 256);
    
    -- Generar hash combinando password + salt (método consistente)
    SET v_hash_combinado = SHA2(CONCAT(p_password, v_salt), 256);
    
    -- Almacenar en formato salt:hash en la columna password_hash de usuario
    SET p_password_hash = CONCAT(v_salt, ':', v_hash_combinado);
    
END