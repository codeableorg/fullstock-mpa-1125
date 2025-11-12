import express from "express";

const app = express();

// Static file serving middleware
app.use(express.static("public"));

app.use((req, res, next) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
