const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // allow React frontend to talk to backend

//Import routes
const routes = require("./routes");
app.use("/", routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
