const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const jwtSecret = '7fed6467c097faeee5915aa7b2b7fcecc397efedc6112fc1f311306608950481'; // Cambia esto a una cadena segura

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://carlosolivares:4Bhe4036WdU1sybT@cluster0.kkzbjrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware de autenticación
function authenticateToken(req, res, next) {
    // Omitir autenticación para la ruta /api/expenses
    if (req.path === '/api/expenses' && req.method === 'POST') {
        return next();
    }

    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}

// Routes
const expenseRoutes = require('./routes/expense');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
