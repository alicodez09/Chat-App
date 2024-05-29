const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const cookiesParser = require("cookie-parser");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookiesParser());

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log("Server is listening on Port", PORT);
});
