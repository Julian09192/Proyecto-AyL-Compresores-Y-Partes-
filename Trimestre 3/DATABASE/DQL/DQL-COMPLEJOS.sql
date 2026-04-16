-- ============================================================
-- QUERIES DE VALOR DE NEGOCIO - AYL Compresores y Partes
-- ============================================================

-- Q1. TOP 10 PRODUCTOS MÁS VENDIDOS
-- ¿Qué productos generan más volumen de ventas?
-- Útil para decisiones de reabastecimiento y vitrina.

SELECT 
    p.referencia,
    p.nombre AS producto,
    p.tipo_producto,
    SUM(oi.cantidad)                        AS unidades_vendidas,
    SUM(oi.cantidad * oi.precio_unitario)   AS ingresos_generados
FROM orden_item oi
JOIN producto p  ON oi.id_producto = p.id_producto
JOIN orden o     ON oi.id_orden    = o.id_orden
WHERE o.estado IN ('pagado', 'enviado', 'completado')
GROUP BY p.id_producto, p.referencia, p.nombre, p.tipo_producto
ORDER BY unidades_vendidas DESC
LIMIT 10;


-- Q2. CLIENTES CON MAYOR GASTO TOTAL (TOP 10)
-- ¿Quiénes son los clientes más valiosos?
-- Base para fidelización, descuentos o atención prioritaria.

SELECT 
    u.id_usuario,
    u.nombre          AS cliente,
    u.correo,
    u.num_celular,
    COUNT(o.id_orden) AS total_ordenes,
    SUM(o.total)      AS gasto_total
FROM usuario u
JOIN orden o ON u.id_usuario = o.id_usuario
WHERE o.estado IN ('pagado', 'enviado', 'completado')
GROUP BY u.id_usuario, u.nombre, u.correo, u.num_celular
ORDER BY gasto_total DESC
LIMIT 10;


-- Q3. PRODUCTOS SIN MOVIMIENTO EN LOS ÚLTIMOS 90 DÍAS
-- ¿Qué productos están parados en bodega?
-- Detecta inventario muerto que inmoviliza capital.

SELECT 
    p.id_producto,
    p.referencia,
    p.nombre          AS producto,
    p.tipo_producto,
    SUM(i.cantidad)   AS stock_actual
FROM producto p
JOIN inventario i ON p.id_producto = i.id_producto
WHERE p.id_producto NOT IN (
    SELECT DISTINCT sm.id_producto
    FROM stock_movimiento sm
    WHERE sm.creado_en >= NOW() - INTERVAL 90 DAY
      AND sm.tipo_movimiento IN ('salida', 'traslado')
)
GROUP BY p.id_producto, p.referencia, p.nombre, p.tipo_producto
HAVING stock_actual > 0
ORDER BY stock_actual DESC;


-- Q4. ALERTA DE STOCK BAJO POR BODEGA
-- ¿Qué productos están por agotarse en cada bodega?
-- Dispara órdenes de recompra a tiempo.

SELECT 
    b.nombre          AS bodega,
    p.referencia,
    p.nombre          AS producto,
    i.cantidad        AS stock_disponible,
    i.reservado       AS cantidad_reservada,
    (i.cantidad - i.reservado) AS stock_libre
FROM inventario i
JOIN producto p ON i.id_producto = p.id_producto
JOIN bodega b   ON i.id_bodega   = b.id_bodega
WHERE (i.cantidad - i.reservado) <= 5   -- umbral ajustable
ORDER BY stock_libre ASC;


-- Q5. RENTABILIDAD POR PRODUCTO (precio venta vs precio compra)
-- ¿Cuánto se gana por cada producto vendido?
-- Compara el último precio de compra contra el precio de venta real.

SELECT 
    p.referencia,
    p.nombre                                        AS producto,
    p.precio                                        AS precio_catalogo,
    AVG(ci.precio_unitario)                         AS costo_promedio_compra,
    AVG(oi.precio_unitario)                         AS precio_promedio_venta,
    AVG(oi.precio_unitario) - AVG(ci.precio_unitario) AS margen_promedio,
    ROUND(
        ((AVG(oi.precio_unitario) - AVG(ci.precio_unitario)) 
        / NULLIF(AVG(ci.precio_unitario), 0)) * 100, 2
    )                                               AS margen_porcentual
FROM producto p
JOIN compra_item ci  ON p.id_producto = ci.id_producto
JOIN orden_item oi   ON p.id_producto = oi.id_producto
JOIN orden o         ON oi.id_orden   = o.id_orden
WHERE o.estado IN ('pagado', 'enviado', 'completado')
GROUP BY p.id_producto, p.referencia, p.nombre, p.precio
ORDER BY margen_porcentual DESC;


-- Q6. CARRITOS ABANDONADOS (activos hace más de 24 horas)
-- ¿Cuántos clientes quedaron a mitad del proceso de compra?
-- Base para campañas de recuperación de ventas perdidas.

SELECT 
    u.nombre              AS cliente,
    u.correo,
    u.num_celular,
    c.id_carrito,
    c.actualizado_en      AS ultima_actividad,
    COUNT(ci.id_carrito_item)          AS items_en_carrito,
    SUM(ci.cantidad * ci.precio_unitario) AS valor_potencial
FROM carrito c
JOIN usuario u      ON c.id_usuario  = u.id_usuario
JOIN carrito_item ci ON c.id_carrito = ci.id_carrito
WHERE c.estado = 'activo'
  AND c.actualizado_en < NOW() - INTERVAL 24 HOUR
GROUP BY u.nombre, u.correo, u.num_celular, c.id_carrito, c.actualizado_en
ORDER BY valor_potencial DESC;


-- Q7. RENDIMIENTO DE EMPLEADOS POR VENTAS PROCESADAS
-- ¿Qué empleado genera más ventas?
-- Métricas de desempeño del equipo comercial.

SELECT 
    u.id_usuario,
    u.nombre                  AS empleado,
    COUNT(o.id_orden)         AS ordenes_procesadas,
    SUM(o.total)              AS valor_total_gestionado,
    AVG(o.total)              AS ticket_promedio,
    MIN(o.fecha)              AS primera_venta,
    MAX(o.fecha)              AS ultima_venta
FROM orden o
JOIN usuario u ON o.id_usuario_creacion = u.id_usuario
WHERE o.estado IN ('pagado', 'enviado', 'completado')
GROUP BY u.id_usuario, u.nombre
ORDER BY valor_total_gestionado DESC;


-- Q8. PROVEEDOR MÁS COSTOSO VS MÁS ECONÓMICO POR PRODUCTO
-- ¿Quién nos vende cada producto más barato?
-- Ayuda a negociar mejores precios o cambiar proveedor.

SELECT 
    p.nombre             AS producto,
    pr.nombre            AS proveedor,
    MIN(ci.precio_unitario) AS precio_minimo_comprado,
    MAX(ci.precio_unitario) AS precio_maximo_comprado,
    AVG(ci.precio_unitario) AS precio_promedio,
    COUNT(ci.id_compra_item) AS veces_comprado
FROM compra_item ci
JOIN producto  p  ON ci.id_producto  = p.id_producto
JOIN compra    c  ON ci.id_compra    = c.id_compra
JOIN proveedor pr ON c.id_proveedor  = pr.id_proveedor
WHERE c.estado = 'recepcionado'
GROUP BY p.id_producto, p.nombre, pr.id_proveedor, pr.nombre
ORDER BY p.nombre, precio_promedio ASC;


-- Q9. RESERVAS EXPIRADAS QUE AÚN NO SE HAN LIBERADO
-- ¿Hay stock "fantasma" bloqueado por reservas vencidas?
-- Liberar estas reservas recupera disponibilidad real de inventario.

SELECT 
    r.id_reserva,
    p.nombre          AS producto,
    b.nombre          AS bodega,
    r.cantidad,
    r.creado_en       AS fecha_reserva,
    r.expira_en       AS fecha_expiracion,
    TIMESTAMPDIFF(HOUR, r.expira_en, NOW()) AS horas_vencida,
    r.estado
FROM reserva r
JOIN producto   p ON r.id_producto   = p.id_producto
JOIN inventario i ON r.id_inventario = i.id_inventario
JOIN bodega     b ON i.id_bodega     = b.id_bodega
WHERE r.expira_en < NOW()
  AND r.estado = 'activa'
ORDER BY horas_vencida DESC;


-- Q10. RESUMEN FINANCIERO MENSUAL
-- ¿Cómo van las ventas y compras mes a mes?
-- Vista ejecutiva del flujo de dinero: ingresos vs egresos.

SELECT 
    DATE_FORMAT(periodo, '%Y-%m')   AS mes,
    tipo,
    COUNT(*)                        AS cantidad_transacciones,
    SUM(valor)                      AS valor_total
FROM (
    SELECT 
        DATE(o.fecha)   AS periodo,
        'VENTA'         AS tipo,
        o.total         AS valor
    FROM orden o
    WHERE o.estado IN ('pagado', 'enviado', 'completado')

    UNION ALL

    SELECT 
        DATE(c.fecha)   AS periodo,
        'COMPRA'        AS tipo,
        c.valor_total   AS valor
    FROM compra c
    WHERE c.estado = 'recepcionado'
) AS movimientos_financieros
GROUP BY mes, tipo
ORDER BY mes DESC, tipo;