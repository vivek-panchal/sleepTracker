const zod = require('zod');

const sleepSchema = zod.object({
    userId: zod.string().nonempty(),
    hours: zod.number().positive(),
    timestamp: zod.date()
});

module.exports = { sleepSchema };