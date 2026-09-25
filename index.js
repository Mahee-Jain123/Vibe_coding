const path = require('path'); //install path module
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express'); //install express module and store it in the express variable
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');

// 1. Initialize Express application
const app = express();

// 2. Middleware to parse incoming JSON request bodies
app.use(express.json());

// 3. Define the port number from environment variables with fallback
const PORT = process.env.PORT || 5000;

// 4. Connect to MongoDB Atlas
connectDB();

// 5. Basic test route (GET /)
app.get('/', (req, res) => {
  res.json({
    message: 'Hackathon API is running successfully!',
    status: 'success'
  });
});

// 6. Mount authentication routes
app.use('/api/auth', authRoutes);

// 7. Mount admin routes
app.use('/api/admin', adminRoutes);

// 8. Mount team routes
app.use('/api/teams', teamRoutes);

// 9. Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});