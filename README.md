# Barbería Corextec — Demo de gestión

Demo web interactiva para peluquerías y barberías.

## Funciones incluidas

- Dashboard con ventas mensuales, servicios, citas, clientes y ticket promedio.
- Gráfico de facturación mensual y distribución de servicios.
- Agenda de horas con filtros por fecha y barbero.
- Gestión de barberos con producción, ventas y cálculo estimado de comisión.
- Gestión de clientes e historial calculado desde ventas.
- Registro de servicios/ventas y medios de pago.
- Recordatorios de citas próximas con simulación de envío por WhatsApp.
- Configuración del negocio y catálogo de servicios/precios.
- Persistencia con `localStorage`, ideal para una demo publicada en GitHub Pages.
- Diseño responsive para escritorio, tablet y móvil.

## Publicación en GitHub Pages

El proyecto es 100% estático. Publica la rama `main` desde la raíz del repositorio en **Settings → Pages**.

El archivo `CNAME` ya apunta a:

`barberia.corextec.cl`

Luego crea en tu proveedor DNS un registro **CNAME**:

- Host/Nombre: `barberia`
- Destino: `patricioghs.github.io`

Una vez que GitHub Pages reconozca el dominio, activa **Enforce HTTPS**.

## Importante para producción

Esta versión usa almacenamiento local del navegador y los recordatorios son simulados. Para convertirla en SaaS multiusuario se debe agregar:

- backend/API;
- autenticación y roles;
- PostgreSQL o MySQL;
- reservas públicas con disponibilidad real;
- integración WhatsApp Business / email;
- pagos y suscripciones si corresponde;
- aislamiento de datos por barbería.
