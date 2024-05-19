const zod = require('zod');

const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
});

module.exports = { userSchema };