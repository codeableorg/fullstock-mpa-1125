# ¿Qué son los Layouts en un Sistema de Plantillas?

Un **layout** (o plantilla base) es una estructura HTML común que se comparte entre múltiples páginas de una aplicación web. En lugar de repetir el mismo código de encabezado, pie de página y estructura general en cada vista, defines un layout una sola vez y las vistas individuales solo contienen su contenido específico.

## ¿Por qué usar layouts?
- **DRY (Don't Repeat Yourself):** Evitas duplicar código HTML común en todas tus vistas.
- **Mantenibilidad:** Los cambios en la estructura general (header, footer, meta tags) se hacen en un solo lugar.
- **Consistencia:** Todas las páginas mantienen la misma estructura y estilos base automáticamente.
- **Organización:** Separas el contenido específico de cada página de la estructura general de la aplicación.

## Express EJS Layouts

**express-ejs-layouts** es un middleware para Express que facilita el uso de layouts con EJS. Permite definir una plantilla base y especificar dónde se insertará el contenido de cada vista individual.

### Instalación

```bash
npm install express-ejs-layouts
```

### Configuración básica

En tu servidor Express (ESM):

```js
import express from 'express';
import expressLayouts from 'express-ejs-layouts';

const app = express();

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');

// Configurar el middleware de layouts
app.use(expressLayouts);

// El layout por defecto es 'layout.ejs' en la carpeta 'views'
// Si quieres usar un layout diferente o en otra ruta, puedes configurarlo así:
// app.set('layout', 'ruta/de/layout');
```

### Estructura de archivos recomendada

```
views/
  ├── layout.ejs         # Layout principal
  ├── home.ejs           # Vista de inicio
  ├── products.ejs       # Vista de productos
  └── about.ejs          # Vista de acerca de
```

### Ejemplo: Creando un Layout

```html
<!-- views/layout.ejs -->

<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Titulo de la página</title>
</head>
<body>
	<header>
		<nav>
			<a href="/">Inicio</a>
			<a href="/products">Productos</a>
			<a href="/about">Acerca de</a>
		</nav>
	</header>

	<main>
		<%- body %>  <!-- Aquí se inserta el contenido de cada vista -->
	</main>

	<footer>
		<p>&copy; 2025 Mi Tienda Online</p>
	</footer>
</body>
</html>
```

El contenido de cada vista se asigna a la variable `body`. Nota que usamos `<%- body %>` (con guion) en lugar de `<%= body %>` para que el HTML de las vistas no se escape.

### Ejemplo de una Vista

```html
<!-- views/home.ejs -->
<h1>Bienvenido a nuestra tienda</h1>
```

### Renderizando vistas con layouts

En tus rutas de Express:

```js
app.get('/', (req, res) => {
  res.render('home'); // Usa el layout por defecto (layout.ejs)
});
```

## Características avanzadas

### Usar un layout diferente para una vista específica

```js
app.get('/admin', (req, res) => {
  res.render('admin/dashboard', {
    layout: 'layouts/admin',  // Usa un layout diferente
  });
});
```

### Deshabilitar el layout para una vista

```js
app.get('/health', (req, res) => {
	res.render('health', {
		layout: false,  // No usar ningún layout
	});
});
```

### Pasar variables globales a todos los layouts

```js
// Middleware para variables globales
app.use((req, res, next) => {
  res.locals.siteName = 'Mi Tienda Online';
  res.locals.currentYear = new Date().getFullYear();
  next();
});
```

Ahora puedes usar `siteName` y `currentYear` en cualquier layout o vista:

```html
<footer>
	<p>&copy; <%= currentYear %> <%= siteName %></p>
</footer>
```

## Ventajas de express-ejs-layouts
- Simplifica la creación de estructuras HTML consistentes.
- Reduce significativamente la duplicación de código.
- Facilita el mantenimiento y actualización del diseño general.
- Permite layouts múltiples para diferentes secciones (admin, público, etc.).
- Se integra perfectamente con Express y EJS sin configuración compleja.
