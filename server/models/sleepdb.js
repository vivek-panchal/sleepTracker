const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    hours: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const Sleep = mongoose.model('Sleep', sleepSchema);

module.exports = Sleep;