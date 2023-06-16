import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid";

import { initialiseSchema } from "./initial.js";
import users from "./db/users.js";
import { access_key } from "./utils/config.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// entry route

app.get('/', (req, res) => {
    res.send("Api's are up and running");
});


// authenentication routes
app.post(`/api/login`, (req, res) => {
    const {email, password} = req.body;
    const userExists = users.find(user => user.email === email) ? true : false;
    if(userExists){
        const user = users.find(user => user.email === email);
        if(user.password === password){
            const accessToken = jwt.sign(user, access_key);
            res.status(200).json({user : user, accessToken : accessToken, message : "login sucessfull"});
        }
        else {
            res.status(401).json({message : `wrong password for @${user.username}`});
        }
    }
    else{
        res.status(404).json({message : "user does not exist, sign up"})
    };
});

app.post(`/api/signup`, (req, res) => {
    const {username, email, password} = req.body;
    const userExists = users.find(user => user.email === email);
    if(userExists){
        res.status(409).json({message : "user already exists, log in..."});
    }
    else {
        const newUser = {
            _id : uuid(),
            email,
            password,
            username,
            bio : "",
            posts : [],
            communities : [],
            bookmarks : [],
            follows : [],
            followers : [],
        };
        users.push(newUser);
        const accessToken = jwt.sign(newUser, access_key);
        res.status(200).json({user : newUser, accessToken, message : "account created"})
    }

})

app.listen(PORT, () => {
    initialiseSchema();
    console.log("server is up and listening")
});