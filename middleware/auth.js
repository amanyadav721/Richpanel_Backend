import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const isAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decode.id);
            if (!user) {
                return res.status(403).json({ msg: "Authorization denied." });
            }
            req.user = user;
            next();
        }
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
};