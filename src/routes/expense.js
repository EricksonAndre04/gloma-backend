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

// Obtener totales de gastos por mes
router.get('/totals', async (req, res) => {
    try {
        const expenses = await Expense.aggregate([
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Obtener el balance de gasto total
router.get('/balance', async (req, res) => {
    try {
        const totalBalance = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        res.json(totalBalance[0]?.total || 0);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
