const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes'); // Correct path
// const sequelize = require('./config/database');
// const authRoutes = require('./routes/authRoutes');
// const builderRoutes = require('./builderRoutes');

// dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Ensure JSON parsing middleware is in place

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// app.get('/api/users', (req, res) => {
//   res.status(200).json({ message: 'API is running' });
// });

// Routes
// app.use('/api/users', userRoutes); // Correct path for users
// app.use('/api/auth', authRoutes);
// app.use('/api/builders', builderRoutes);

// Error handling for invalid JSON payloads
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//     console.error('Invalid JSON payload:', err);
//     return res.status(400).json({ message: 'Invalid JSON payload' });
//   }
//   next(err);
// });

// Global error handler
// app.use((err, req, res, next) => {
//   console.error('Stack trace:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// Sync the models with the database
// sequelize.sync()
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((error) => {
//     console.error('Error creating database & tables:', error);
//   });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
