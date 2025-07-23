console.log("Starting server...");

const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});