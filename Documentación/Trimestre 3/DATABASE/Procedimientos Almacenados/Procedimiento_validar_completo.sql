CREATE DEFINER=`root`@`localhost` PROCEDURE `p_validar_password_sha2`(
    IN p_password_intento VARCHAR(255),
    IN p_password_hash_almacenado VARCHAR(255),
    OUT p_es_valida BOOLEAN
)
BEGIN
    DECLARE v_salt_almacenado VARCHAR(64);
    DECLARE v_hash_almacenado VARCHAR(128);
    DECLARE v_hash_calculado VARCHAR(128);
    
    -- Extraer salt y hash del formato almacenado (salt:hash) de la columna password_hash de usuario
    SET v_salt_almacenado = SUBSTRING_INDEX(p_password_hash_almacenado, ':', 1);
    SET v_hash_almacenado = SUBSTRING_INDEX(p_password_hash_almacenado, ':', -1);
    
    -- Calcular hash con el password intentado y el mismo salt
    SET v_hash_calculado = SHA2(CONCAT(p_password_intento, v_salt_almacenado), 256);
    
    -- Comparar (usando comparación directa)
    IF v_hash_calculado = v_hash_almacenado THEN
        SET p_es_valida = TRUE;
    ELSE
        SET p_es_valida = FALSE;
    END IF;
END