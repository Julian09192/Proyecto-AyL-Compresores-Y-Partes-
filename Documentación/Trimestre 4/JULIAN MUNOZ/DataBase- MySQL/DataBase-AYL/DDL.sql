create database AYL;
use AYL;

-- 1. TABLA BODEGA
CREATE TABLE bodega (
    id_bodega INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA USUARIO
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    num_identificacion VARCHAR(30) UNIQUE,
    correo VARCHAR(150) UNIQUE NOT NULL,
    num_celular VARCHAR(20),
    usuario VARCHAR(50) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente' 
        CHECK (rol IN ('admin', 'empleado', 'cliente')),
    password_hash VARCHAR(255) NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. TABLA PRODUCTOS
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL 
        CHECK (tipo IN ('separador', 'aceite', 'aire', 'aceite_motor', 'valvulina')),
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100),
    caracteristicas TEXT,
    stock INT NOT NULL DEFAULT 0,
    precio DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    codigo_interno VARCHAR(50),
    categoria_vehiculo VARCHAR(50),
    imagen_url VARCHAR(255),
    imagen_public_id VARCHAR(100),
    suspendido BOOLEAN NOT NULL DEFAULT FALSE,
    id_bodega INT NOT NULL,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultimo_usuario_id INT,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prod_bodega FOREIGN KEY (id_bodega) REFERENCES bodega(id_bodega) ON DELETE RESTRICT,
    CONSTRAINT fk_prod_usuario FOREIGN KEY (ultimo_usuario_id) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- 4. TABLA AUDITORIA_CAMBIOS
CREATE TABLE auditoria_cambios (
    id_auditoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro BIGINT NOT NULL,
    id_usuario INT,
    operacion VARCHAR(10) CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    campo_cambiado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- 5. TABLA STOCK_MOVIMIENTO
CREATE TABLE stock_movimiento (
    id_movimiento BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_usuario INT,
    id_bodega_salida INT,
    id_bodega_destino INT,
    cantidad INT NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL 
        CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'transferencia')),
    referencia VARCHAR(100),
    nota TEXT,
    stock_anterior INT,
    stock_nuevo INT,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_user FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_stock_bod_salida FOREIGN KEY (id_bodega_salida) REFERENCES bodega(id_bodega),
    CONSTRAINT fk_stock_bod_dest FOREIGN KEY (id_bodega_destino) REFERENCES bodega(id_bodega)
);

-- 6. TABLA CLIENTE
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    documento VARCHAR(20) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 7. TABLA CARRITO
CREATE TABLE carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo' 
        CHECK (estado IN ('activo', 'checkout', 'cancelado')),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 8. TABLA CARRITO_ITEM
CREATE TABLE carrito_item (
    id_carrito_item INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12, 2),
    agregado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_carrito, id_producto),
    CONSTRAINT fk_item_carrito FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    CONSTRAINT fk_item_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- 9. TABLA ORDEN
CREATE TABLE orden (
    id_orden BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_cliente INT NOT NULL,
    id_usuario_creacion INT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12, 2),
    estado VARCHAR(20) DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'completado', 'cancelado')),
    metodo_pago VARCHAR(80),
    pago_confirmado BOOLEAN DEFAULT FALSE,
    numero_orden VARCHAR(50) UNIQUE,
    CONSTRAINT fk_orden_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_orden_user_crea FOREIGN KEY (id_usuario_creacion) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- 10. TABLA ORDEN_ITEM
CREATE TABLE orden_item (
    id_orden_item BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_orden BIGINT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2),
    UNIQUE (id_orden, id_producto),
    CONSTRAINT fk_oi_orden FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE CASCADE,
    CONSTRAINT fk_oi_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- 11. TABLA RESERVA
CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT,
    id_orden BIGINT,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa' 
        CHECK (estado IN ('activa', 'consumida', 'liberada', 'expirada')),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expira_en DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 HOUR),
    CONSTRAINT fk_res_carrito FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito) ON DELETE CASCADE,
    CONSTRAINT fk_res_orden FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE SET NULL,
    CONSTRAINT fk_res_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- 12. TABLA ORDEN_COMPRA
CREATE TABLE orden_compra (
    id_orden_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(12, 2),
    estado VARCHAR(20) DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'recepcionado', 'cancelado')),
    CONSTRAINT fk_oc_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- 13. TABLA ORDEN_COMPRA_ITEM
CREATE TABLE orden_compra_item (
    id_orden_compra_item INT AUTO_INCREMENT PRIMARY KEY,
    id_orden_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2),
    UNIQUE (id_orden_compra, id_producto),
    CONSTRAINT fk_oci_orden FOREIGN KEY (id_orden_compra) REFERENCES orden_compra(id_orden_compra) ON DELETE CASCADE,
    CONSTRAINT fk_oci_prod FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_productos_tipo ON productos (tipo);
CREATE INDEX idx_productos_bodega ON productos(id_bodega);
CREATE INDEX idx_productos_activos ON productos (suspendido);
CREATE INDEX idx_productos_codigo ON productos(codigo_interno);
CREATE INDEX idx_stock_mov_producto ON stock_movimiento(id_producto);
CREATE INDEX idx_stock_mov_creado ON stock_movimiento (creado_en);
CREATE INDEX idx_orden_usuario ON orden(id_usuario);
CREATE INDEX idx_orden_cliente ON orden(id_cliente);
CREATE INDEX idx_orden_estado ON orden(estado);
CREATE INDEX idx_orden_fecha ON orden(fecha);
CREATE INDEX idx_carrito_usuario ON carrito(id_usuario);
CREATE INDEX idx_carrito_item_carrito ON carrito_item(id_carrito);
CREATE INDEX idx_reserva_producto_activa ON reserva(id_producto, estado);
CREATE INDEX idx_auditoria_tabla ON auditoria_cambios(tabla_afectada, id_registro);
CREATE INDEX idx_auditoria_fecha ON auditoria_cambios(fecha_cambio);

-- TRIGGER DE AUDITORÍA PARA PRODUCTOS (MySQL Syntax)
DELIMITER $$

CREATE TRIGGER tr_auditar_productos_update
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF (OLD.nombre <> NEW.nombre) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'nombre', OLD.nombre, NEW.nombre);
    END IF;

    IF (OLD.precio <> NEW.precio) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'precio', CAST(OLD.precio AS CHAR), CAST(NEW.precio AS CHAR));
    END IF;

    IF (OLD.stock <> NEW.stock) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'stock', CAST(OLD.stock AS CHAR), CAST(NEW.stock AS CHAR));
    END IF;

    IF (OLD.suspendido <> NEW.suspendido) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'suspendido', CAST(OLD.suspendido AS CHAR), CAST(NEW.suspendido AS CHAR));
    END IF;

    IF (OLD.tipo <> NEW.tipo) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'tipo', OLD.tipo, NEW.tipo);
    END IF;

    IF (OLD.id_bodega <> NEW.id_bodega) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'id_bodega', CAST(OLD.id_bodega AS CHAR), CAST(NEW.id_bodega AS CHAR));
    END IF;

    IF (OLD.marca <> NEW.marca) THEN
        INSERT INTO auditoria_cambios (tabla_afectada, id_registro, id_usuario, operacion, campo_cambiado, valor_anterior, valor_nuevo)
        VALUES ('productos', OLD.id, NEW.ultimo_usuario_id, 'UPDATE', 'marca', OLD.marca, NEW.marca);
    END IF;
END$$

DELIMITER ;

