const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/vendor', authRoutes);
app.use('/api/vendor/orders', orderRoutes);
app.use('/api/vendor', menuRoutes);
app.use('/api/vendor', profileRoutes); 
app.use('/api/vendor', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  