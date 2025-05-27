const express = require("express");
const path = require("path");

const app = express();

const distFolder = path.join(__dirname, "dist", "assignment-app", "browser");

// Serve static files
app.use(express.static(distFolder));

// Catch-all route: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
