const express = require('express');
const app = express();
const PORT = 8080;

// api services
const registerStudentRoutes = require('./routes/registerStudentRoutes');

app.use(express.json());

// api routes
app.use('/api', registerStudentRoutes);

app.listen(
    PORT,
    () => console.log(`API running on http://localhost:${PORT}`)
)