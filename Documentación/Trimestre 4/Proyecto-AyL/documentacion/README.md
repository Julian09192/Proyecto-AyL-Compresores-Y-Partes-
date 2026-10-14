# Documentación del proyecto A&L

## Visión general
Este proyecto es una tienda industrial y de repuestos desarrollada con React, Vite, Bootstrap y Supabase. El objetivo es ofrecer una experiencia rápida, clara y segura para explorar productos, consultar detalles y completar compras.

## Requisitos funcionales
- Catálogo público con productos y detalles.
- Navegación por Inicio, Nosotros, Productos, Contacto y Perfil.
- Carrito con visualización, edición de cantidades y checkout.
- Inicio de sesión y cierre de sesión para usuario registrados.
- SEO básico con títulos y metaetiquetas por vista.

## Estructura de vistas
- Inicio: hero, estadísticas, características, marcas y catálogo.
- Nosotros: información institucional y galería.
- Productos: filtro, búsqueda y detalle del catálogo.
- Checkout: resumen y confirmación del pedido.
- Perfil: datos del usuario y acceso a la cuenta.

## Flujo principal
1. El usuario entra a Inicio o Productos.
2. Puede abrir el carrito desde la navegación.
3. Si no está autenticado, se le solicita iniciar sesión antes de continuar al pago.
4. Después de confirmar el pedido, el carrito queda listo para nueva compra.

## Tecnologías principales
- React + Vite
- Bootstrap y estilos personalizados
- Supabase para almacenamiento y consultas
- Cloudinary para imágenes optimizadas

## Optimización y mantenimiento
- Se priorizan imágenes críticas con carga rápida.
- Se evita el uso de rutas rotas y se mantiene una estructura simple.
- Se mantiene documentación central para facilitar el mantenimiento del proyecto.

## Base de datos y migración
El proyecto usa Supabase como motor principal y se encuentra preparado para migrar o complementar con MySQL/Firebase si se requiere en el futuro.
