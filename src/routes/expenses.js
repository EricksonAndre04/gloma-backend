// routes/expense.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Crear un nuevo gasto
router.post('/', async (req, res) => {
    const { name, amount, date, month } = req.body;
    try {
        const newExpense = new Expense({ name, amount, date, month });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Obtener gastos por mes
router.get('/', async (req, res) => {
    const { month } = req.query;
    try {
        const expenses = await Expense.find({ month });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

