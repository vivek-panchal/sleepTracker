const express = require('express');

const Sleep = require('../models/sleepdb');
const { sleepSchema } = require('../types/sleepSchema');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const userId = req.userId.toString();
    const { hours, timestamp } = req.body;
    console.log(req.userId, hours, timestamp);
    if (!hours || !timestamp) {
        return res.status(400).json({message: 'Hours and timestamp are required.'});
    }

    const parsedTimestamp = new Date(timestamp);

    const validationResult = sleepSchema.safeParse({ userId, hours, timestamp: parsedTimestamp });

    if (!validationResult.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: validationResult.error.errors
        });
    }

    try {
        const sleep = new Sleep({ userId, hours, timestamp });
        await sleep.save();

        res.status(201).json(sleep);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const sleeps = await Sleep.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.status(200).send(sleeps);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/:recordId', authMiddleware, async (req, res) => {
    const { hours, timestamp } = req.body;
    if (!hours && !timestamp) {
        return res.status(400).json({message: 'Hours or timestamp must be provided.'});
    }

    try {
        const record = await Sleep.findById(req.params.recordId);
        if (!record) {
            return res.status(404).json({message: 'Record not found.'});
        }

        if (hours) record.hours = hours;
        if (timestamp) record.timestamp = timestamp;

        await record.save();
        res.status(200).json({ message: 'Record updated successfully.', record});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/:recordId', authMiddleware, async (req, res) => {
    try {
        const record = await Sleep.findById(req.params.recordId);
        if (!record) {
            return res.status(404).json({message: 'Record not found.'});
        }
        await Sleep.findByIdAndDelete(req.params.recordId);
        res.status(200).json({message: 'Record deleted successfully.'});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;