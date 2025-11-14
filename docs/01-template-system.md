# ¿Qué es un Sistema de Plantillas en Server Side Rendering?

Un **sistema de plantillas** es una herramienta que permite generar páginas HTML dinámicas a partir de datos y estructuras predefinidas. En el contexto de **server side rendering (SSR)**, el servidor utiliza estas plantillas para crear el HTML final antes de enviarlo al navegador del usuario.

## ¿Por qué usar un sistema de plantillas?
- **Separación de lógica y presentación:** Permite mantener el código de la aplicación separado del diseño visual.
- **Reutilización:** Puedes definir fragmentos reutilizables (headers, footers, etc.) y usarlos en múltiples páginas.
- **Dinamicidad:** El contenido de la página se puede adaptar según los datos recibidos del servidor.

## Ejemplo: EJS (Embedded JavaScript Templates)

**EJS** es uno de los sistemas de plantillas más populares en el ecosistema de Node.js. Permite incrustar código JavaScript dentro de archivos HTML usando la sintaxis `<%= %>` para imprimir valores y `<% %>` para ejecutar lógica.

### Ejemplo básico de EJS
Supongamos que tienes una plantilla `index.ejs`:

```ejs
<!DOCTYPE html>
<html>
	<head>
		<title><%= title %></title>
	</head>
	<body>
		<h1>Bienvenido, <%= user.name %>!</h1>
		<ul>
			<% products.forEach(function(product) { %>
				<li><%= product.name %> - $<%= product.price %></li>
			<% }); %>
		</ul>
	</body>
</html>
```

Y en tu servidor Node.js:

```js
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Tienda Online',
		user: { name: 'Diego' },
		products: [
			{ name: 'Taza', price: 10 },
			{ name: 'Sticker', price: 5 }
		]
	});
});
```

El servidor procesa la plantilla, reemplaza las variables y genera el HTML final que se envía al cliente.

## Ventajas de EJS en SSR
- Fácil de aprender y usar.
- Permite lógica sencilla dentro de la plantilla.
- Integración directa con Express y otros frameworks de Node.js.
