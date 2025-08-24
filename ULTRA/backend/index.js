const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" }); // files go into uploads/

app.use(cors()); // allow React frontend to talk to backend

let history = []; // store uploaded file info (temporary, in memory)

// Test route
app.get("/", (req, res) => {
  res.send("Server is ready!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

// Upload route, .single because single file upload
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file; //info about the uploaded file
  const record = {
    fileName: file.originalname,
    path: file.path,
    uploadDate: new Date().toISOString(),
  };
  history.push(record);
  res.json({ success: true, file: record });
});

// History route
app.get("/history", (req, res) => {
  res.json(history);
});

