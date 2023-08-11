import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const user = await (User.findOne({ email: email }))
        if (user) return res.status(400).json({ msg: "User already exist." });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newuser = new User({
            name,
            email,
            password: passwordHash,
        });
        const saveduser = await newuser.save();
        res.status(201).json(saveduser);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await (User.findOne({ email: email }))
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials !" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        let oldToken = user.tokens;

        if (oldToken.length > 0) {
            oldToken.filter((t) => {
                const timeDiff = (Date.now() - parseInt(t.createdAt)) / 1000;
                if (timeDiff > 86400) {
                    return t;
                }
            })
        }

        await User.findByIdAndUpdate(user._id, { tokens: [...oldToken, { token, signedInAt: Date.now().toString() }] });

        delete user.password;
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const signout = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            if (!token)
                return res.status(401).json({ msg: "Authorization denied." });

            const tokens = req.user.tokens;
            console.log(token);
            const newTokens = tokens.filter(t => t.token !== token);
            console.log(newTokens);
            await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
            res.status(200).json({ msg: "Signout successfully." });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}