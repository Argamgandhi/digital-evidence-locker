const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoute = require("./routes/upload");
const verifyRoute = require("./routes/verify");
const authRoute = require("./routes/auth");
const { syncDB } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.json({ message: "🔐 Digital Evidence Locker API is running!" });
});

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});