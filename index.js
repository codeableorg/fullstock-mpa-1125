import express from "express";

const app = express();

// Static file serving middleware
app.use(express.static("public"));

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs", {
    nombre: "Codeable",
    tecnologias: ["HTML", "CSS", "JS"],
  });
});

app.use((req, res, next) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
