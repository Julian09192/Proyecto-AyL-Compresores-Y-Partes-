import express from 'express';
import { reporteController } from '../controllers/reporteController.js';
import { verificarAdmin, verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas (solo admin o usuarios autenticados según el reporte)
router.get('/stock-bodegas', verificarToken, reporteController.stockPorBodega);
router.get('/movimientos/:id_producto', verificarToken, reporteController.movimientosPorProducto);
router.get('/stock-critico', verificarToken, reporteController.stockCritico);
router.get('/auditoria', verificarAdmin, reporteController.auditoria);
router.get('/pedidos-cliente/:id_usuario', verificarToken, reporteController.pedidosPorCliente);
router.get('/ventas-periodo', verificarAdmin, reporteController.ventasPorPeriodo);
router.get('/productos-mas-vendidos', verificarToken, reporteController.productosMasVendidos);
router.get('/resumen-general', verificarToken, reporteController.resumenGeneral);
router.get('/movimientos-mes', verificarAdmin, reporteController.movimientosPorMes);
router.get('/inventario', verificarToken, reporteController.inventario);

export default router;