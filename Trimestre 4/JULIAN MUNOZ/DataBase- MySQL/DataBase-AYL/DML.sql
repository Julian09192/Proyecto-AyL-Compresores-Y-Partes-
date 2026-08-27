use AYL;

-- Insertar una bodega inicial
INSERT INTO bodega (nombre, direccion, telefono) 
VALUES ('Bodega Principal Norte', 'Calle 123 #45-67', '601-555-0199');

-- Insertar un usuario administrador (para el campo ultimo_usuario_id)
INSERT INTO usuario (num_identificacion, correo, num_celular, usuario, rol, password_hash) 
VALUES ('10203040', 'admin@ayl.com', '3001234567', 'admin_ayl', 'admin', 'hash_seguro_123');

INSERT INTO productos 
(tipo, nombre, marca, caracteristicas, stock, precio, codigo_interno, categoria_vehiculo, id_bodega, ultimo_usuario_id)
VALUES
-- ACEITES DE MOTOR (20 registros)
('aceite_motor', 'Aceite 15W40 Mineral', 'Mobil', 'Protección premium para motores diesel', 50, 125000.00, 'OIL-15W40-M01', 'Pesado', 1, 1),
('aceite_motor', 'Aceite 15W40 Semi-Sintético', 'Castrol', 'Tecnología sintética avanzada', 30, 145000.00, 'OIL-15W40-C02', 'Carga', 1, 1),
('aceite_motor', 'Aceite 10W30 Sintético', 'Shell', 'Ahorro de combustible y limpieza', 45, 160000.00, 'OIL-10W30-S03', 'Liviano', 1, 1),
('aceite_motor', 'Aceite 20W50 Alto Kilometraje', 'Terpel', 'Especial para motores con desgaste', 100, 95000.00, 'OIL-20W50-T04', 'Particular', 1, 1),
('aceite_motor', 'Aceite 5W30 Full Sintético', 'Valvoline', 'Máxima protección en frío', 25, 185000.00, 'OIL-5W30-V05', 'Moderno', 1, 1),
('aceite_motor', 'Aceite 15W40 Rimula R4', 'Shell', 'Para trabajo pesado extremo', 60, 130000.00, 'OIL-15W40-S06', 'Tractocamión', 1, 1),
('aceite_motor', 'Aceite 10W40 Magnatec', 'Castrol', 'Moléculas inteligentes antidesgaste', 40, 155000.00, 'OIL-10W40-C07', 'SUV', 1, 1),
('aceite_motor', 'Aceite 25W60 Grueso', 'Chevron', 'Para motores con alto consumo de aceite', 35, 88000.00, 'OIL-25W60-CH08', 'Antiguo', 1, 1),
('aceite_motor', 'Aceite 5W40 Euro', 'Motul', 'Cumple normas europeas ACEA', 20, 210000.00, 'OIL-5W40-M09', 'Premium', 1, 1),
('aceite_motor', 'Aceite 15W40 Delvac', 'Mobil', 'Líder en flota de transporte', 80, 128000.00, 'OIL-15W40-M10', 'Camión', 1, 1),
('aceite_motor', 'Aceite 0W20 Híbrido', 'Toyota', 'Especial para motores híbridos', 15, 240000.00, 'OIL-0W20-T11', 'Híbrido', 1, 1),
('aceite_motor', 'Aceite 15W40 Ursa', 'Texaco', 'Protección contra depósitos', 55, 115000.00, 'OIL-15W40-TX12', 'Bus', 1, 1),
('aceite_motor', 'Aceite 10W30 Diesel', 'Cummins', 'Recomendado por fabricante', 30, 170000.00, 'OIL-10W30-CU13', 'Maquinaria', 1, 1),
('aceite_motor', 'Aceite 20W50 MaxLife', 'Valvoline', 'Sella fugas pequeñas', 50, 105000.00, 'OIL-20W50-V14', 'Pickup', 1, 1),
('aceite_motor', 'Aceite 15W40 Tection', 'Castrol', 'Intervalos de cambio extendidos', 40, 135000.00, 'OIL-15W40-C15', 'Pesado', 1, 1),
('aceite_motor', 'Aceite 5W20 Sintético', 'Ford Motorcraft', 'Original para motores Ford', 20, 195000.00, 'OIL-5W20-F16', 'Camioneta', 1, 1),
('aceite_motor', 'Aceite 15W40 Multigrado', 'Gulf', 'Resistencia a la oxidación', 45, 110000.00, 'OIL-15W40-G17', 'Comercial', 1, 1),
('aceite_motor', 'Aceite 10W40 Moto 4T', 'Yamalube', 'Para motocicletas de 4 tiempos', 60, 45000.00, 'OIL-10W40-Y18', 'Moto', 1, 1),
('aceite_motor', 'Aceite 15W40 Advance', 'Shell', 'Para flotas mixtas', 70, 122000.00, 'OIL-15W40-S19', 'Pesado', 1, 1),
('aceite_motor', 'Aceite 5W30 Dexos2', 'ACDelco', 'Certificado GM', 30, 175000.00, 'OIL-5W30-AC20', 'Liviano', 1, 1),

-- VALVULINAS Y TRANSMISIÓN (10 registros)
('valvulina', 'Valvulina 80W90', 'Mobil', 'Para diferenciales y cajas manuales', 40, 48000.00, 'VAL-80W90-M21', 'Universal', 1, 1),
('valvulina', 'Valvulina 85W140', 'Chevron', 'Extrema presión para equipo pesado', 30, 55000.00, 'VAL-85W140-CH22', 'Pesado', 1, 1),
('valvulina', 'Valvulina ATF Dexron III', 'Castrol', 'Fluido para transmisión automática', 50, 35000.00, 'VAL-ATF-C23', 'Automático', 1, 1),
('valvulina', 'Valvulina 75W90 Sintética', 'Motul', 'Alto rendimiento en cambios', 20, 95000.00, 'VAL-75W90-M24', 'Deportivo', 1, 1),
('valvulina', 'Valvulina ATF +4', 'Mopar', 'Original para Chrysler/Jeep', 15, 65000.00, 'VAL-ATF4-MP25', 'Camioneta', 1, 1),
('valvulina', 'Valvulina 90 EP', 'Terpel', 'Para transmisiones industriales', 60, 32000.00, 'VAL-90EP-T26', 'Industrial', 1, 1),
('valvulina', 'Valvulina 140 EP', 'Gulf', 'Viscosidad alta para climas cálidos', 45, 38000.00, 'VAL-140EP-G27', 'Pesado', 1, 1),
('valvulina', 'Valvulina ATF VI', 'ACDelco', 'Baja viscosidad para cajas modernas', 25, 78000.00, 'VAL-ATF6-AC28', 'Moderno', 1, 1),
('valvulina', 'Valvulina CVT Fluid', 'Shell', 'Para cajas automáticas tipo CVT', 12, 110.00, 'VAL-CVT-S29', 'Liviano', 1, 1),
('valvulina', 'Valvulina 80W90 Spirax', 'Shell', 'Protección contra herrumbre', 40, 52000.00, 'VAL-80W90-S30', 'Universal', 1, 1),

-- FILTROS DE AIRE Y SEPARADORES (15 registros)
('aire', 'Filtro de Aire Primario', 'Donaldson', 'Alta eficiencia para motores diesel', 100, 145000.00, 'AIR-DON-31', 'Tractocamión', 1, 1),
('aire', 'Filtro de Aire Secundario', 'Fleetguard', 'Protección secundaria de motor', 80, 85000.00, 'AIR-FLT-32', 'Tractocamión', 1, 1),
('aire', 'Filtro de Aire Panel', 'Mann Filter', 'Para vehículos livianos', 120, 45000.00, 'AIR-MAN-33', 'Particular', 1, 1),
('separador', 'Filtro Separador Agua/Combustible', 'Racor', 'Elemento filtrante 10 micras', 60, 98000.00, 'SEP-RAC-34', 'Diesel', 1, 1),
('separador', 'Separador de Aceite Aire', 'Baldwin', 'Para compresores industriales', 30, 210000.00, 'SEP-BAL-35', 'Industrial', 1, 1),
('aire', 'Filtro de Aire Circular', 'Wix', 'Carburación antigua', 50, 28000.00, 'AIR-WIX-36', 'Antiguo', 1, 1),
('aire', 'Filtro de Cabina Polen', 'Bosch', 'Carbon activado', 40, 65000.00, 'AIR-BSH-37', 'Particular', 1, 1),
('separador', 'Trampa de Agua Diesel', 'LuberFiner', 'Para camiones serie NQR/NPR', 55, 75000.00, 'SEP-LUB-38', 'Camión', 1, 1),
('aire', 'Filtro de Aire Heavy Duty', 'Donaldson', 'Para ambientes polvorientos', 25, 230000.00, 'AIR-HD-39', 'Maquinaria', 1, 1),
('aire', 'Filtro de Aire Cónico', 'K&N', 'Alto flujo lavable', 10, 350000.00, 'AIR-KN-40', 'Tuning', 1, 1),
('separador', 'Separador Centrífugo', 'Mann Filter', 'Elimina partículas metálicas', 15, 420000.00, 'SEP-MAN-41', 'Maquinaria', 1, 1),
('aire', 'Filtro de Aire Motor', 'Premium Guard', 'Económico y funcional', 150, 18000.00, 'AIR-PG-42', 'Particular', 1, 1),
('aire', 'Filtro de Aire Turbo', 'Fleetguard', 'Resistente a alta presión', 20, 160000.00, 'AIR-TUR-43', 'Turbo Diesel', 1, 1),
('separador', 'Filtro Trampa Parker', 'Parker', 'Alta capacidad de retención', 18, 115000.00, 'SEP-PAR-44', 'Pesado', 1, 1),
('aire', 'Filtro Habitáculo Bio', 'Mann Filter', 'Antibacterias y hongos', 35, 88000.00, 'AIR-BIO-45', 'Premium', 1, 1),

-- OTROS ACEITES Y COMPLEMENTOS (5 registros)
('aceite', 'Aceite Hidráulico ISO 68', 'Mobil', 'Para sistemas hidráulicos industriales', 200, 580000.00, 'OIL-H68-M46', 'Industrial', 1, 1),
('aceite', 'Aceite Hidráulico ISO 46', 'Shell', 'Para gatos y prensas', 150, 560000.00, 'OIL-H46-S47', 'Industrial', 1, 1),
('aceite', 'Aceite de Transmisión 10W', 'CAT', 'Especial para mandos finales', 40, 210000.00, 'OIL-CAT-48', 'Maquinaria', 1, 1),
('aceite', 'Aceite 2 Tiempos Moto', 'Motul', 'Mezcla para motores 2T', 100, 25000.00, 'OIL-2T-M49', 'Moto', 1, 1),
('aceite', 'Aceite para Compresor', 'Ingersoll Rand', 'Sintético para tornillo', 12, 450000.00, 'OIL-COM-50', 'Industrial', 1, 1);

ALTER USER 'root'@'localhost' IDENTIFIED BY 'hola123456';