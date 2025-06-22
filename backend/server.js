const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req,resp,next)=>{
    resp.header("Access-Control-Allow-Origin","*");
    resp.header(
        "Access-Control-Allow-Headers",
        "GET, POST,PUT, DELETE,OPTIONS,HEAD"
    );
    resp.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type, Accept, Authorization"
    );
    next(); 
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Upload folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Import error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});