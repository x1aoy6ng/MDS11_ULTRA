const express = require("express");
const multer = require("multer");
const musicmd = require("music-metadata"); // to get audio metadata

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // files go into uploads/

let history = []; // store uploaded file info (temporary, in memory)

// Test route
router.get("/", (req, res) => {
  res.send("Server is ready!");
});

// Upload route, .single because single file upload
router.post("/upload", upload.single("file"), async(req, res) => {
  const file = req.file; //info about the uploaded file
  const metadata = await musicmd.parseFile(file.path);
  const duration = metadata.format.duration; // in seconds

  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const record = {
    fileName: file.originalname,
    path: file.path,
    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    status: "Processing",
    uploadDate: new Date().toISOString(),
    duration: formatDuration(duration),
  };
  history.push(record);
  res.json({ success: true, file: record });
});

// History route
router.get("/history", (req, res) => {
  res.json(history);
});

// Helper function to format duration in seconds to HH:MM:SS
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "--:--:--";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);


  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

module.exports = router;


