USE `ayl_compresores_y_partes`;

-- ============================================================
-- PRODUCTOS (sin cambios)
-- ============================================================
INSERT INTO `producto` (`referencia`, `nombre`, `tipo_producto`, `descripcion`, `precio`, `peso`) VALUES
('COMP-001', 'Compresor de Pistón 2HP 24L', 'Compresor', 'Compresor monofásico ideal para talleres pequeños y bricolaje.', 185.00, 22.500),
('COMP-002', 'Compresor de Pistón 3HP 50L', 'Compresor', 'Compresor de acople directo con tanque de 50 litros.', 250.00, 38.000),
('COMP-003', 'Compresor de Pistón 5.5HP 200L', 'Compresor', 'Unidad trifásica de alta eficiencia para uso industrial.', 890.00, 115.000),
('COMP-004', 'Compresor Silencioso 1HP 6L', 'Compresor', 'Libre de aceite, ultra silencioso para laboratorios médicos.', 210.00, 15.000),
('COMP-005', 'Compresor de Tornillo 10HP', 'Compresor', 'Transmisión por correas, panel digital de control.', 3200.00, 245.000),
('COMP-006', 'Compresor de Tornillo 20HP Inv', 'Compresor', 'Con variador de frecuencia para ahorro energético.', 5800.00, 310.000),
('COMP-007', 'Compresor Portátil 12V', 'Compresor', 'Mini compresor para inflado de neumáticos y emergencias.', 45.00, 1.200),
('COMP-008', 'Compresor Vertical 3HP 100L', 'Compresor', 'Diseño ahorrador de espacio para talleres mecánicos.', 420.00, 65.000),
('COMP-009', 'Compresor Odontológico 2HP', 'Compresor', 'Doble cabezote, libre de aceite con filtro bacteriológico.', 550.00, 42.000),
('COMP-010', 'Compresor Gasolina 6.5HP', 'Compresor', 'Autónomo, ideal para trabajos de construcción en campo.', 750.00, 85.000),
('REP-F001', 'Filtro de Aire 1/2 pulgada', 'Repuesto', 'Filtro metálico con esponja de alta densidad.', 12.50, 0.350),
('REP-F002', 'Filtro Separador Aire-Aceite', 'Repuesto', 'Para compresores de tornillo de 10 a 15 HP.', 85.00, 1.100),
('REP-F003', 'Filtro de Aceite Industrial', 'Repuesto', 'Elemento filtrante de alta presión.', 25.00, 0.450),
('REP-V001', 'Válvula de Retención 1/2', 'Repuesto', 'Válvula de seguridad en bronce para tanque.', 18.00, 0.200),
('REP-V002', 'Válvula de Seguridad 145 PSI', 'Repuesto', 'Válvula de alivio con anilla de descarga manual.', 15.00, 0.150),
('REP-V003', 'Válvula de Drenaje Manual', 'Repuesto', 'Para purga de condensados en la base del tanque.', 8.50, 0.100),
('REP-P001', 'Presostato Monofásico 4 Vías', 'Repuesto', 'Interruptor de presión ajustable para 110/220V.', 32.00, 0.500),
('REP-P002', 'Presostato Trifásico Heavy Duty', 'Repuesto', 'Control de presión para equipos industriales.', 55.00, 0.850),
('REP-M001', 'Manómetro 0-200 PSI 1/4', 'Repuesto', 'Dial de lectura clara con carcasa metálica.', 10.00, 0.120),
('REP-M002', 'Manómetro Glicerina Posterior', 'Repuesto', 'Resistente a vibraciones extremas.', 22.00, 0.180),
('REP-C001', 'Cigüeñal para Cabezote 3HP', 'Repuesto', 'Acero forjado de alta resistencia.', 95.00, 3.500),
('REP-C002', 'Biela de Aluminio Estándar', 'Repuesto', 'Compatible con compresores de acople directo.', 14.00, 0.250),
('REP-C003', 'Kit de Anillos 65mm', 'Repuesto', 'Juego completo para un pistón.', 18.00, 0.080),
('REP-C004', 'Pistón 47mm Aluminio', 'Repuesto', 'Incluye pasador y clips de seguridad.', 22.00, 0.300),
('REP-C005', 'Placa de Válvulas Completa', 'Repuesto', 'Incluye lengüetas de acero inoxidable.', 35.00, 0.600),
('REP-E001', 'Motor Eléctrico 2HP Monofásico', 'Repuesto', 'Arranque por capacitor, alta eficiencia.', 165.00, 18.000),
('REP-E002', 'Capacitor de Arranque 200uF', 'Repuesto', 'Para motores de compresor de 2HP.', 12.00, 0.150),
('REP-E003', 'Presostato Electrónico Digital', 'Repuesto', 'Programable con pantalla LCD.', 110.00, 0.400),
('ACE-001', 'Aceite Mineral ISO 100 1L', 'Insumo', 'Para lubricación de compresores de pistón.', 15.00, 0.920),
('ACE-002', 'Aceite Sintético Tornillo 5L', 'Insumo', 'Larga duración, hasta 4000 horas de uso.', 85.00, 4.600),
('ACE-003', 'Aceite Grado Alimenticio 1L', 'Insumo', 'Para compresores en industria farmacéutica.', 35.00, 0.950),
('ACC-001', 'Manguera Espiral 5 Metros', 'Accesorio', 'Poliuretano con acoples rápidos.', 18.00, 0.800),
('ACC-002', 'Pistola de Soplado Aire', 'Accesorio', 'Boquilla larga de aluminio.', 9.00, 0.200),
('ACC-003', 'Kit Pintura 5 Piezas', 'Accesorio', 'Incluye pistola, manguera e inflador.', 45.00, 2.500),
('ACC-004', 'Acople Rápido Hembra 1/4', 'Accesorio', 'Sistema universal NPT.', 5.50, 0.050),
('ACC-005', 'Filtro Regulador Lubricador', 'Accesorio', 'Unidad FRL para tratamiento de aire.', 65.00, 1.200),
('REP-J001', 'Kit Empacaduras Cabezote 3HP', 'Repuesto', 'Papel de asbesto y metalinas.', 15.00, 0.100),
('REP-T001', 'Tubo de Cobre Descarga', 'Repuesto', 'Con aletas de enfriamiento y tuercas.', 28.00, 0.700),
('REP-T002', 'Tanque 50L Certificado', 'Repuesto', 'Prueba hidrostática aprobada, color azul.', 130.00, 18.000),
('REP-V004', 'Visor de Aceite Roscado', 'Repuesto', 'Cuerpo de policarbonato transparente.', 7.00, 0.040),
('REP-O001', 'O-Ring Sello de Tapa', 'Repuesto', 'Caucho nitrilo resistente a temperatura.', 3.00, 0.010),
('REP-B001', 'Bobina para Electroválvula', 'Repuesto', 'Voltaje 220V AC.', 24.00, 0.250),
('REP-S001', 'Silenciador de Admisión 1 pulg', 'Repuesto', 'Reduce el ruido de succión significativamente.', 19.00, 0.400),
('COMP-011', 'Secador de Aire Refrigerativo', 'Equipo', 'Elimina humedad para procesos de pintura.', 950.00, 45.000),
('COMP-012', 'Tanque Pulmón 500L', 'Equipo', 'Tanque de almacenamiento vertical reforzado.', 1400.00, 185.000),
('REP-R001', 'Rodamiento 6205-ZZ', 'Repuesto', 'Para eje de motor eléctrico.', 8.00, 0.150),
('REP-R002', 'Rodamiento de Agujas Biela', 'Repuesto', 'Para cabezotes de alta gama.', 12.00, 0.080),
('REP-P003', 'Polea de Motor 4 Pulgadas', 'Repuesto', 'Aluminio, ranura tipo A.', 22.00, 0.900),
('REP-P004', 'Correa de Transmisión A-42', 'Repuesto', 'Caucho reforzado con fibra.', 10.00, 0.200),
('REP-V005', 'Ventilador de Motor 3HP', 'Repuesto', 'Plástico de alto impacto.', 14.00, 0.300);

-- ============================================================
-- BODEGAS (sin cambios)
-- ============================================================
INSERT INTO `bodega` (`id_bodega`, `nombre`, `direccion`, `telefono`) VALUES
(1, 'Bodega Principal Norte', 'Calle 100 #15-30, Bogotá', '6015551234'),
(2, 'Bodega de Repuestos Sur', 'Carrera 45 #10-20, Medellín', '6042229876');

-- ============================================================
-- PROVEEDORES (sin cambios)
-- ============================================================
INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `contacto`, `telefono`, `email`, `direccion`) VALUES
(1, 'Distribuidora Ind. S.A.S', 'Marta Gómez', '6018887766', 'contacto@distri-ind.com', 'Zona Industrial, Cali'),
(2, 'Global Parts Inc.', 'John Smith', '+1 555 0199', 'sales@globalparts.com', 'Miami, Florida');

-- ============================================================
-- USUARIOS — contraseñas encriptadas con p_encriptar_password_sha2
-- ============================================================

-- Variables auxiliares para capturar el hash
SET @h = '';

-- ADMINS
CALL p_encriptar_password_sha2('1234', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Andrés López', '10102030', 'andres.lopez@ayl.com', '3001234567', 'admin', @h);

CALL p_encriptar_password_sha2('4561', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Beatriz Mendoza', '20203040', 'beatriz.m@ayl.com', '3109876543', 'admin', @h);

-- EMPLEADOS
CALL p_encriptar_password_sha2('ju486', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Carlos Ruiz', '11122233', 'carlos.vendedor@ayl.com', '3201112233', 'empleado', @h);

CALL p_encriptar_password_sha2('awd789', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Diana Castellanos', '44455566', 'diana.bodega@ayl.com', '3154445566', 'empleado', @h);

CALL p_encriptar_password_sha2('4568sdw', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Eduardo Gómez', '77788899', 'eduardo.tecnico@ayl.com', '3017778899', 'empleado', @h);

-- CLIENTES
CALL p_encriptar_password_sha2('fab123', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Fabian Suarez', '10111213', 'fsuarez_cliente@gmail.com', '3123334455', 'cliente', @h);

CALL p_encriptar_password_sha2('glo889', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Gloria Estefan', '14151617', 'gloria_paints@hotmail.com', '3055556677', 'cliente', @h);

CALL p_encriptar_password_sha2('hp2026', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Hernan Peláez', '18192021', 'hernan.mecanica@yahoo.com', '3189990011', 'cliente', @h);

CALL p_encriptar_password_sha2('isa741', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Isabel Carrascal', '22232425', 'isabel.c@construcciones.co', '3112223344', 'cliente', @h);

CALL p_encriptar_password_sha2('963852', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Jorge Eliécer', '26272829', 'jorge_talleres@outlook.com', '3218889900', 'cliente', @h);

CALL p_encriptar_password_sha2('kmtz12', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Karen Martínez', '30313233', 'karen.mtz@gmail.com', '3007771122', 'cliente', @h);

CALL p_encriptar_password_sha2('muebles01', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Leonardo Fabio', '34353637', 'leo.muebles@gmail.com', '3145558899', 'cliente', @h);

CALL p_encriptar_password_sha2('ms4041', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Martha Sánchez', '38394041', 'martha_servicios@live.com', '3174441122', 'cliente', @h);

CALL p_encriptar_password_sha2('nel77', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Nelson Ortiz', '42434445', 'nelson_compresores@gmail.com', '3102220099', 'cliente', @h);

CALL p_encriptar_password_sha2('dent4649', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Olga Lucía', '46474849', 'olga_dent@odontologia.com', '3023334455', 'cliente', @h);

CALL p_encriptar_password_sha2('pablo_99', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Pablo Escobar', '50515253', 'pablo_restaura@gmail.com', '3196667788', 'cliente', @h);

CALL p_encriptar_password_sha2('qg5457', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Quintino Gomez', '54555657', 'quintino@empresa.com', '3011110022', 'cliente', @h);

CALL p_encriptar_password_sha2('r8877', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Ricardo Arjona', '58596061', 'ricardo_taller@gmail.com', '3119998877', 'cliente', @h);

CALL p_encriptar_password_sha2('sandy44', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Sandra Bullock', '62636465', 'sandra_b@icloud.com', '3204445566', 'cliente', @h);

CALL p_encriptar_password_sha2('bulb99', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Tomás Alva', '66676869', 'tomas_inventor@gmail.com', '3152221100', 'cliente', @h);

CALL p_encriptar_password_sha2('macondo1', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Ursula Iguarán', '70717273', 'ursula_macondo@gmail.com', '3187776655', 'cliente', @h);

CALL p_encriptar_password_sha2('vh7477', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Víctor Hugo', '74757677', 'victor.literatura@gmail.com', '3105553322', 'cliente', @h);

CALL p_encriptar_password_sha2('blue99', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Walter White', '78798081', 'walter_quimica@gmail.com', '3049991122', 'cliente', @h);

CALL p_encriptar_password_sha2('xd8285', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Ximena Duque', '82838485', 'ximena_d@gmail.com', '3016664422', 'cliente', @h);

CALL p_encriptar_password_sha2('yina_01', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Yina Calderon', '86878889', 'yina.influencer@gmail.com', '3128885533', 'cliente', @h);

CALL p_encriptar_password_sha2('zm9093', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Zandra Moreno', '90919293', 'zandra.moreno@gmail.com', '3162224466', 'cliente', @h);

CALL p_encriptar_password_sha2('au1144', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Alvaro Uribe', '11223344', 'alvaro.u@politica.com', '3009990099', 'cliente', @h);

CALL p_encriptar_password_sha2('bb2255', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Belisario Betancur', '22334455', 'beli.b@gobierno.co', '3108881188', 'cliente', @h);

CALL p_encriptar_password_sha2('cg3366', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Cesar Gaviria', '33445566', 'cesar.g@liber.com', '3157772277', 'cliente', @h);

CALL p_encriptar_password_sha2('dq4477', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Daniel Quintero', '44556677', 'daniel.q@medellin.co', '3206663366', 'cliente', @h);

CALL p_encriptar_password_sha2('ep5588', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Enrique Peñalosa', '55667788', 'enrique.p@bogota.co', '3195554455', 'cliente', @h);

CALL p_encriptar_password_sha2('fs6699', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Francisco Santos', '66778899', 'pacho.s@periodismo.co', '3184445544', 'cliente', @h);

CALL p_encriptar_password_sha2('gp7700', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Gustavo Petro', '77889900', 'gustavo.p@presidencia.co', '3013336633', 'cliente', @h);

CALL p_encriptar_password_sha2('hc8811', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Humberto Calle', '88990011', 'humberto.c@paz.co', '3112227722', 'cliente', @h);

CALL p_encriptar_password_sha2('id9922', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Iván Duque', '99001122', 'ivan.d@economia.co', '3121118811', 'cliente', @h);

CALL p_encriptar_password_sha2('jm1033', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Juan Manuel', '10112233', 'juanma.s@nobel.co', '3140009900', 'cliente', @h);

CALL p_encriptar_password_sha2('ks2044', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Karol Sevilla', '20223344', 'karol.s@disney.com', '3005550055', 'cliente', @h);

CALL p_encriptar_password_sha2('lm3055', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Luis Miguel', '30334455', 'luismi.sol@mexico.com', '3104449944', 'cliente', @h);

CALL p_encriptar_password_sha2('mb4066', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Maluma Baby', '40445566', 'maluma@reggaeton.com', '3153338833', 'cliente', @h);

CALL p_encriptar_password_sha2('nq5077', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Nairo Quintana', '50556677', 'nairo.q@ciclismo.com', '3202227722', 'cliente', @h);

CALL p_encriptar_password_sha2('oc6088', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Oscar Córdoba', '60667788', 'oscar.c@futbol.com', '3191116611', 'cliente', @h);

CALL p_encriptar_password_sha2('pv7099', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Pibe Valderrama', '70778899', 'el.pibe@todo-bien.com', '3180005500', 'cliente', @h);

CALL p_encriptar_password_sha2('qs8000', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Quique Santander', '80889900', 'quique.s@musica.com', '3019994499', 'cliente', @h);

CALL p_encriptar_password_sha2('rf9011', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Radamel Falcao', '90990011', 'falcao.tigre@futbol.com', '3118883388', 'cliente', @h);

CALL p_encriptar_password_sha2('sm1022', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Shakira Mebarak', '10011122', 'shakira.m@barranquilla.co', '3127772277', 'cliente', @h);

CALL p_encriptar_password_sha2('tv2033', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Taliana Vargas', '20022233', 'taliana.v@miss.com', '3146661166', 'cliente', @h);

CALL p_encriptar_password_sha2('uv3044', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Ubaldina Valoyes', '30033344', 'ubaldina.v@pesas.co', '3005552255', 'cliente', @h);

CALL p_encriptar_password_sha2('va4055', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Valeria Abuchaibe', '40044455', 'valeria.a@carnaval.co', '3104443344', 'cliente', @h);

CALL p_encriptar_password_sha2('wm5066', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Wilson Manyoma', '50055566', 'wilson.m@salsa.com', '3153334433', 'cliente', @h);

CALL p_encriptar_password_sha2('yb6077', @h);
INSERT INTO `usuario` (`nombre`, `num_identificacion`, `correo`, `num_celular`, `rol`, `password_hash`)
VALUES ('Yuri Buenaventura', '60066677', 'yuri.b@salsa.com', '3202225522', 'cliente', @h);

-- ============================================================
-- INVENTARIO (sin cambios)
-- ============================================================
INSERT INTO `inventario` (`id_inventario`, `id_producto`, `id_bodega`, `cantidad`, `reservado`) VALUES
(1, 1, 1, 10, 2),
(2, 2, 1, 50, 0),
(3, 3, 2, 100, 0);

-- ============================================================
-- ORDENES (sin cambios)
-- ============================================================
INSERT INTO `orden` (`id_orden`, `id_usuario`, `total`, `estado`, `metodo_pago`, `pago_confirmado`, `id_usuario_creacion`) VALUES
(1, 3, 1335000.00, 'pagado', 'Transferencia Bancaria', 1, 1),
(2, 4, 2400000.00, 'pendiente', 'Efectivo', 1, 1);

-- ============================================================
-- CARRITO (sin cambios)
-- ============================================================
INSERT INTO `carrito` (`id_carrito`, `id_usuario`, `estado`) VALUES
(1, 3, 'activo');

-- ============================================================
-- COMPRA (sin cambios)
-- ============================================================
INSERT INTO `compra` (`id_compra`, `id_proveedor`, `valor_total`, `estado`, `id_usuario`) VALUES
(1, 1, 1335000.00, 'recepcionado', 1);

-- ============================================================
-- CARRITO ITEM (sin cambios)
-- ============================================================
INSERT INTO `carrito_item` (`id_carrito_item`, `id_carrito`, `id_producto`, `cantidad`, `precio_unitario`, `id_inventario`) VALUES
(1, 1, 1, 2, 1250000.00, 1);

-- ============================================================
-- COMPRA ITEM (sin cambios)
-- ============================================================
INSERT INTO `compra_item` (`id_compra_item`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 1250000.00),
(2, 1, 2, 1, 85000.00);

-- ============================================================
-- ORDEN ITEM (sin cambios)
-- ============================================================
INSERT INTO `orden_item` (`id_orden_item`, `id_orden`, `id_producto`, `cantidad`, `precio_unitario`, `id_bodega`, `id_inventario`) VALUES
(1, 1, 1, 1, 1250000.00, 1, 1),
(2, 1, 2, 1, 85000.00, 1, 2);

-- ============================================================
-- RESERVA (sin cambios)
-- ============================================================
INSERT INTO `reserva` (`id_reserva`, `id_carrito`, `id_inventario`, `id_producto`, `cantidad`, `estado`) VALUES
(1, 1, 1, 1, 2, 'activa');

-- ============================================================
-- STOCK MOVIMIENTO (sin cambios)
-- ============================================================
INSERT INTO `stock_movimiento` (`id_movimiento`, `id_producto`, `id_bodega_origen`, `id_bodega_destino`, `cantidad`, `tipo_movimiento`, `referencia`, `id_usuario`, `nota`) VALUES
(1, 1, NULL, 1, 10, 'entrada', 'COMPRA-01', 1, 'Entrada por compra inicial'),
(2, 2, NULL, 1, 50, 'entrada', 'COMPRA-01', 1, 'Entrada por compra inicial'),
(3, 1, 1, NULL, 1, 'salida', 'ORDEN-01', 2, 'Salida por venta al cliente Carlos');