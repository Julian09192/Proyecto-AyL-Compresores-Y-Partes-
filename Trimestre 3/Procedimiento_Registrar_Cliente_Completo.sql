-- ============================================================
-- PROCEDIMIENTO: sp_registrar_cliente
-- Registra un nuevo usuario con rol 'cliente' en la BD
-- ============================================================

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_cliente`(
    IN p_nombre          VARCHAR(100),
    IN p_identificacion  VARCHAR(30),
    IN p_correo          VARCHAR(150),
    IN p_num_celular     VARCHAR(20),
    IN p_password        VARCHAR(255)
)
BEGIN
    DECLARE v_id_usuario      INT;
    DECLARE v_password_hash   VARCHAR(255);

    -- Handler para errores SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT
            FALSE  AS success,
            'Error al registrar el cliente. Posible duplicado de correo o identificación.' AS mensaje;
    END;

    -- Iniciar transacción
    START TRANSACTION;

    main_block: BEGIN

        -- Verificar si el correo ya existe
        IF EXISTS (SELECT 1 FROM usuario WHERE correo = p_correo) THEN
            SELECT FALSE AS success, 'El correo ya está registrado' AS mensaje;
            ROLLBACK;
            LEAVE main_block;
        END IF;

        -- Verificar si el número de identificación ya existe
        IF EXISTS (SELECT 1 FROM usuario WHERE num_identificacion = p_identificacion) THEN
            SELECT FALSE AS success, 'El número de identificación ya está registrado' AS mensaje;
            ROLLBACK;
            LEAVE main_block;
        END IF;

        -- Encriptar contraseña
        CALL p_encriptar_password_sha2(p_password, v_password_hash);

        -- Insertar usuario con rol cliente
        INSERT INTO usuario (
            nombre,
            num_identificacion,
            correo,
            num_celular,
            rol,
            password_hash
        ) VALUES (
            p_nombre,
            p_identificacion,
            p_correo,
            p_num_celular,
            'cliente',
            v_password_hash
        );

        SET v_id_usuario = LAST_INSERT_ID();

        COMMIT;

        -- Resultado exitoso
        SELECT
            TRUE            AS success,
            'Cliente registrado exitosamente' AS mensaje,
            v_id_usuario    AS id_usuario,
            p_nombre        AS nombre,
            p_correo        AS correo;

    END main_block;

END;