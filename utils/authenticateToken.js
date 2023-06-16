import jwt from "jsonwebtoken";
import { access_key } from "./config.js";

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    // token = tokenHeader && tokenHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, access_key, (err, user) => {
        if(err){return res.sendStatus(403)}
        req.user = user
        next()
    });
};

export default authenticateToken;