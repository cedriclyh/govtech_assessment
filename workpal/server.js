const express = require('express');
const app = express();
const PORT = 8080;

// API routes
const registerStudentRoutes = require('./routes/registerStudentRoutes');
const getCommonRoutes = require('./routes/getCommonRoutes');
const suspendStudentRoutes = require('./routes/suspendStudentRoutes');

app.use(express.json());

// Register API routes
app.use('/api', registerStudentRoutes);
app.use('/api', getCommonRoutes);
app.use('/api', suspendStudentRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
