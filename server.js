const express = require("express");
const connectDB = require("./config/db");

// Express init
const app = express();

// Connect with MangoDB
connectDB();

// Init Bodyparser
app.use(express.json({ extended: false }));

// Home route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Define Routes
app.use("/api/users", require("./routes/api/users"));

// Chose PORT   Production / Develope
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
