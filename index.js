import express from "express";
import fs from "fs";

const app = express();

// Static file serving middleware
app.use(express.static("public"));

// Custom static file serving
// app.get("/{:file}", (req, res, next) => {
//   const fileName = req.params.file ?? "index.html";

//   // Verificar si archivo existe
//   if (!fs.existsSync(fileName)) {
//     next();
//     return;
//   }

//   const extension = fileName.split(".")[1];

//   if (extension === "html") {
//     res.setHeader("Content-Type", "text/html");
//   } else if (extension === "css") {
//     res.setHeader("Content-Type", "text/css");
//   } else if (extension === "json") {
//     res.setHeader("Content-Type", "application/json");
//   } else if (extension === "jpg") {
//     res.setHeader("Content-Type", "image/jpg");
//   } else if (extension === "png") {
//     res.setHeader("Content-Type", "image/png");
//   }

//   return res.sendFile(fileName, { root: "." });
// });

app.use((req, res, next) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
