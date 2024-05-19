const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userdb');
const { userSchema } = require('../types/userSchema');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { success } = userSchema.safeParse({ email, password });

        if(!success) {
            return res.status(400).json({ error: 'Invalid inputs!!' });
        }

        const userExists = await User.findOne({ email });

        if(!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                email: email,
                password: hashedPassword
            })
            const userId = user._id;
            const token = jwt.sign({ userId }, process.env.SECRET);
            return res.status(200).json({
                message: "User logged in successfully",
                token
            });
        }

        const userId = userExists._id;
        const token = jwt.sign({ userId }, process.env.SECRET);

        return res.status(200).json({
            message: "User logged in successfully",
            token
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;