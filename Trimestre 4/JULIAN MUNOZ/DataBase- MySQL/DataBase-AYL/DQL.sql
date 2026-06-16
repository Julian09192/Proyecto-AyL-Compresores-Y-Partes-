use AYL;

-- Consultas de Inventario y Bodegas

-- 1. Listado de productos con su bodega y stock actual 
-- Útil para la "Gestión de inventarios por bodega".

SELECT p.nombre, p.marca, p.stock, b.nombre AS bodega
FROM productos p
JOIN bodega b ON p.id_bodega = b.id_bodega;

-- 2. Alerta de bajo stock (Regla de negocio 1.9, punto 6) 
-- Busca productos con menos de 10 unidades para generar la notificación automática.

SELECT nombre, marca, stock, codigo_interno
FROM productos
WHERE stock < 10 AND suspendido = FALSE;

-- 3. Valor total del inventario por cada bodega
-- Suma el precio por stock para reportes administrativos.

SELECT b.nombre AS bodega, SUM(p.precio * p.stock) AS valor_total_inventario
FROM productos p
JOIN bodega b ON p.id_bodega = b.id_bodega
GROUP BY b.nombre;

-- Consultas de Ventas y Clientes

-- 4. Historial de pedidos por cliente con sus totales
-- Permite al cliente "Consultar pedidos" y ver su estado.

SELECT c.nombre_completo, o.numero_orden, o.fecha, o.total, o.estado
FROM orden o
JOIN cliente c ON o.id_cliente = c.id_cliente
ORDER BY o.fecha DESC;

-- 5. Productos más vendidos (Top 5)
-- Identifica la demanda para decisiones de reabastecimiento.

SELECT p.nombre, SUM(oi.cantidad) AS total_vendido
FROM orden_item oi
JOIN productos p ON oi.id_producto = p.id
GROUP BY p.nombre
ORDER BY total_vendido DESC
LIMIT 5;

-- 6. Detalle de una orden específica con sus productos
-- Muestra qué compró exactamente el cliente.

SELECT o.numero_orden, p.nombre, oi.cantidad, oi.precio_unitario, (oi.cantidad * oi.precio_unitario) AS subtotal
FROM orden_item oi
JOIN productos p ON oi.id_producto = p.id
JOIN orden o ON oi.id_orden = o.id_orden
WHERE o.numero_orden = 'ORD-XXXX'; -- Reemplazar con código real

-- Consultas con Subconsultas y Lógica de Negocio

-- 7. Clientes que han realizado compras por un valor superior al promedio
-- Útil para identificar "clientes VIP" o distribuidores.

SELECT nombre_completo, documento
FROM cliente
WHERE id_cliente IN (
    SELECT id_cliente 
    FROM orden 
    WHERE total > (SELECT AVG(total) FROM orden)
);

-- 8. Productos que nunca han tenido una venta
-- Ayuda a identificar mercancía estancada.

SELECT nombre, marca, codigo_interno
FROM productos
WHERE id NOT IN (SELECT DISTINCT id_producto FROM orden_item);

-- 9. Consultar el último movimiento de stock de cada producto
-- Para auditoría y trazabilidad.

SELECT p.nombre, sm.tipo_movimiento, sm.cantidad, sm.creado_en
FROM stock_movimiento sm
JOIN productos p ON sm.id_producto = p.id
WHERE sm.id_movimiento IN (
    SELECT MAX(id_movimiento) 
    FROM stock_movimiento 
    GROUP BY id_producto
);

-- 10. Listado de productos con reservas activas y su tiempo de expiración
-- Verifica la "reserva temporal" antes de que expire.

SELECT p.nombre, r.cantidad, r.expira_en
FROM reserva r
JOIN productos p ON r.id_producto = p.id
WHERE r.estado = 'activa' AND r.expira_en > CURRENT_TIMESTAMP;

-- Consultas Administrativas y de Auditoría

-- 11. Usuarios que no han realizado ninguna compra (Clientes potenciales)
-- Para estrategias de marketing.

SELECT u.usuario, u.correo
FROM usuario u
LEFT JOIN cliente c ON u.id_usuario = c.id_usuario
LEFT JOIN orden o ON c.id_cliente = o.id_cliente
WHERE u.rol = 'cliente' AND o.id_orden IS NULL;

-- 12. Auditoría: Cambios de precio realizados recientemente
-- Rastrea quién y cuándo cambió un precio.

SELECT a.id_registro AS id_producto, a.valor_anterior, a.valor_nuevo, a.fecha_cambio, u.usuario AS realizado_por
FROM auditoria_cambios a
JOIN usuario u ON a.id_usuario = u.id_usuario
WHERE a.tabla_afectada = 'productos' AND a.campo_cambiado = 'precio'
ORDER BY a.fecha_cambio DESC;

-- 13. Resumen de órdenes de compra a proveedores (Pendientes)
-- Control de abastecimiento según el procedimiento del distribuidor

SELECT oc.id_orden_compra, u.usuario AS comprador, oc.fecha, oc.valor_total
FROM orden_compra oc
JOIN usuario u ON oc.id_usuario = u.id_usuario
WHERE oc.estado = 'pendiente';

-- 14. Cantidad de productos por categoría de vehículo en cada bodega
-- Muestra la diversidad del inventario.

SELECT b.nombre AS bodega, p.categoria_vehiculo, COUNT(*) AS cantidad_referencias
FROM productos p
JOIN bodega b ON p.id_bodega = b.id_bodega
GROUP BY b.nombre, p.categoria_vehiculo;

-- 15. Total de ventas aprobadas por método de pago
-- Valida la efectividad de los métodos configurados.

SELECT metodo_pago, COUNT(*) AS total_transacciones, SUM(total) AS monto_total
FROM orden
WHERE estado = 'pagado' AND pago_confirmado = TRUE
GROUP BY metodo_pago;

