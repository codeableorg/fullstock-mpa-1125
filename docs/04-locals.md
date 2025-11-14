# Pasando datos a una vista en Express

Cuando renderizas una vista con EJS en Express, puedes enviar datos dinámicos para que sean utilizados en la plantilla. Hay dos formas principales de hacerlo:

## 1. Usando `res.locals`

`res.locals` es un objeto especial en Express que permite definir variables disponibles en todas las vistas renderizadas durante el ciclo de vida de una petición. Es útil para datos globales o que deben estar presentes en varias vistas (por ejemplo, el nombre del sitio, el usuario autenticado, el año actual, etc.).

### Ejemplo

```js
// Middleware para variables globales
app.use((req, res, next) => {
  res.locals.siteName = 'Mi Tienda Online';
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// En cualquier vista EJS
// <%= siteName %> y <%= currentYear %> estarán disponibles
```

## 2. Pasando un objeto como segundo parámetro a `res.render`

Cuando llamas a `res.render`, puedes pasar un objeto con las variables que quieres usar en esa vista específica. Estas variables estarán disponibles solo en esa renderización.

### Ejemplo

```js
app.get('/products', (req, res) => {
  res.render('products', {
    title: 'Nuestros Productos',
    products: [/* ... */]
  });
});
```

En la vista `products.ejs` puedes usar `<%= title %>` y recorrer `products`.

## ¿Qué ocurre si defino la misma propiedad en ambos lugares?

Express hace un **merge** de ambos objetos. Si una propiedad existe en ambos, el valor del objeto pasado a `render` tiene prioridad sobre el de `res.locals`.

### Ejemplo de combinación

```js
app.use((req, res, next) => {
  res.locals.title = 'Título por defecto';
  next();
});

app.get('/custom', (req, res) => {
  res.render('custom', { title: 'Título personalizado' });
});
```

En la vista `custom.ejs`, el valor de `title` será `'Título personalizado'`.

## Resumen

- Usa `res.locals` para datos que deben estar disponibles en todas las vistas de una petición.
- Usa el objeto de `render` para datos específicos de una vista.
- Ambos se combinan, y el objeto de `render` tiene prioridad.
