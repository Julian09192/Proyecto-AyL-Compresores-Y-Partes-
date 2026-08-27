USE `ayl_compresores_y_partes`;

-- Consultas Julian 
-- 1. Ver qué productos tiene cada bodega
-- Esta es la más básica para inventario. Une los nombres de los productos con los nombres de las bodegas donde están guardados.

SELECT 
    b.nombre AS nombre_bodega, 
    p.nombre AS nombre_producto, 
    i.cantidad AS stock
FROM bodega b
JOIN inventario i ON b.id_bodega = i.id_bodega
JOIN producto p ON i.id_producto = p.id_producto;

-- 2. Listado de compras hechas a cada proveedor
-- Para saber qué le hemos comprado a quién. Une la tabla de compras con la de proveedores y muestra quién atendió la compra (el usuario).

SELECT 
    c.id_compra, 
    pr.nombre AS proveedor, 
    c.valor_total, 
    u.nombre AS realizado_por
FROM compra c
JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor
JOIN usuario u ON c.id_usuario = u.id_usuario;

-- 3. Mostrar los artículos de un carrito de un cliente
-- Si quieres ver qué tiene guardado un cliente específicamente en su carrito actual.

SELECT 
    u.nombre AS cliente, 
    p.nombre AS producto, 
    ci.cantidad, 
    ci.precio_unitario
FROM usuario u
JOIN carrito c ON u.id_usuario = c.id_usuario
JOIN carrito_item ci ON c.id_carrito = ci.id_carrito
JOIN producto p ON ci.id_producto = p.id_producto
WHERE c.estado = 'activo';
-- 4. Detalle de ventas (Ordenes) por cliente
-- Esta consulta te muestra qué productos compró cada persona y cuánto pagó por cada uno en sus órdenes de pedido.

SELECT 
    o.id_orden, 
    u.nombre AS cliente, 
    p.nombre AS producto, 
    oi.cantidad, 
    oi.precio_unitario
FROM orden o
JOIN usuario u ON o.id_usuario = u.id_usuario
JOIN orden_item oi ON o.id_orden = oi.id_orden
JOIN producto p ON oi.id_producto = p.id_producto;

-- 5. Historial de movimientos de stock
-- Para saber quién movió mercancía, qué producto fue y qué tipo de movimiento hizo (entrada o salida).

SELECT 
    sm.creado_en AS fecha, 
    p.nombre AS producto, 
    sm.cantidad, 
    sm.tipo_movimiento, 
    u.nombre AS usuario_responsable
FROM stock_movimiento sm
JOIN producto p ON sm.id_producto = p.id_producto
JOIN usuario u ON sm.id_usuario = u.id_usuario;


-- Consultas Dilan
-- Grupo 1: Inventario y Productos
-- 1. Ver qué productos tiene cada bodega 

SELECT 
    b.nombre AS nombre_bodega, 
    p.nombre AS nombre_producto, 
    i.cantidad AS stock
FROM bodega b
JOIN inventario i ON b.id_bodega = i.id_bodega
JOIN producto p ON i.id_producto = p.id_producto;

-- 2. Consultar el stock total sumando todas las bodegas por producto *********

SELECT 
    p.id_producto,
    p.nombre AS producto, 
    p.tipo_producto,
    SUM(i.cantidad) AS stock_total
FROM producto p
JOIN inventario i ON p.id_producto = i.id_producto
GROUP BY p.id_producto, p.nombre, p.tipo_producto;

-- 3. Ver los artículos que están reservados actualmente

SELECT 
    p.nombre AS producto_apartado, 
    r.cantidad AS cantidad_reservada, 
    r.estado AS estado_reserva
FROM reserva r
JOIN producto p ON r.id_producto = p.id_producto
WHERE r.estado = 'activa';

-- Grupo 2: Ventas y Clientes
-- 4. Detalle de qué compró cada cliente en sus órdenes

SELECT 
    o.id_orden, 
    u.nombre AS cliente, 
    p.nombre AS producto, 
    oi.cantidad, 
    oi.precio_unitario
FROM orden o
JOIN usuario u ON o.id_usuario = u.id_usuario
JOIN orden_item oi ON o.id_orden = oi.id_orden
JOIN producto p ON oi.id_producto = p.id_producto;

-- 5. Saber qué empleado procesó cada orden de venta

SELECT 
    o.id_orden, 
    u_admin.nombre AS atendido_por, 
    u_cliente.nombre AS cliente, 
    o.total
FROM orden o
JOIN usuario u_admin ON o.id_usuario_creacion = u_admin.id_usuario
JOIN usuario u_cliente ON o.id_usuario = u_cliente.id_usuario;

-- Consultas Cristofer
-- 1. Ver el contenido del carrito de "Carlos Ruiz" (ID 3)

SELECT 
    u.nombre AS cliente, 
    p.nombre AS producto, 
    ci.cantidad, 
    ci.precio_unitario
FROM usuario u
JOIN carrito c ON u.id_usuario = c.id_usuario
JOIN carrito_item ci ON c.id_carrito = ci.id_carrito
JOIN producto p ON ci.id_producto = p.id_producto
WHERE u.id_usuario = 3 AND c.estado = 'activo';
-- 2.Listado de órdenes que están pagadas y listas para entregar

SELECT 
    o.id_orden, 
    u.nombre AS cliente, 
    u.num_celular, 
    o.total
FROM orden o
JOIN usuario u ON o.id_usuario = u.id_usuario
WHERE o.estado = 'pagado';


-- Grupo 3: Proveedores y Movimientos
-- 3. Ver qué productos se le compraron a "Distribuidora Ind. S.A.S"

SELECT 
    prov.nombre AS proveedor, 
    p.nombre AS producto_comprado, 
    ci.cantidad, 
    ci.precio_unitario
FROM proveedor prov
JOIN compra c ON prov.id_proveedor = c.id_proveedor
JOIN compra_item ci ON c.id_compra = ci.id_compra
JOIN producto p ON ci.id_producto = p.id_producto
WHERE prov.nombre = 'Distribuidora Ind. S.A.S';

-- 4. Listado de todas las compras realizadas a proveedores y quién las recibió

SELECT 
    c.id_compra, 
    pr.nombre AS proveedor, 
    c.valor_total, 
    u.nombre AS recibido_por
FROM compra c
JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor
JOIN usuario u ON c.id_usuario = u.id_usuario;

-- 5 Historial de movimientos: Quién movió mercancía y qué hizo

SELECT 
    sm.creado_en AS fecha, 
    p.nombre AS producto, 
    sm.cantidad, 
    sm.tipo_movimiento, 
    u.nombre AS responsable
FROM stock_movimiento sm
JOIN producto p ON sm.id_producto = p.id_producto
JOIN usuario u ON sm.id_usuario = u.id_usuario;
