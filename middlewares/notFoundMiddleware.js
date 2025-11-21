export function notFoundMiddleware(req, res) {
  res.status(404).render("404");
}
