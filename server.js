import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid";

import { initialiseSchema } from "./initial.js";
import users from "./db/users.js";
import posts from "./db/posts.js";
import communitySchema from "./db/community.js";
import { access_key } from "./utils/config.js";
import authenticateToken from "./utils/authenticateToken.js";
import e from "express";

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

});

// CRUD POST ROUTES
app.route('/api/post')
.get((req, res) => {
    res.status(200).send(posts);
})
.post(authenticateToken, (req, res) => {
    const {post, community} = req.body;
    const requestedUser = req.user;
    const user = users.find(user => user._id === requestedUser._id);
    if(user){
        const newPost = {
            _id : uuid(),
            authorDetails : {
                id : user._id,
                username : user.username 
            },
            community : {
                id : communitySchema[0]._id,
                communityName : communitySchema[0].username
            },
            post,
            upvotes : [{id : user._id, username : user.username}],
            downvotes : [],
            likes : [],
            comments : [],
            time : new Date(),
        };
        posts.push(newPost)
        res.status(200).send(posts);
    }
    else{
        res.status(401).send("user not part of the database.")
    }
});

// Post Interaction Routes
app.get(`/api/post/like/:postId`, authenticateToken, (req, res) => {
    const user = req.user;
    const {postId} = req.params;
    const postToLike = posts.find(post => post._id === postId);
    if(postToLike.likes.filter(like => like.id === user._id).length > 0){
        postToLike.likes = postToLike.likes.filter(like => like.id !== user._id);
        res.status(200).send(posts)
    }
    else{
        postToLike.likes.push({id : user._id, username : user.username});
        res.status(200).send(posts);
    }
});

app.get(`/api/post/bookmark/:postId`, authenticateToken, (req, res) => {
    const {postId} = req.params;
    const requestedUser = req.user;
    const postToBookmark = posts.find(post => post._id === postId);
    const user = users.find(user => user._id === requestedUser._id);
    user.bookmarks.push(postToBookmark);
    res.status(200).send(user);
});

app.delete(`/api/post/bookmark/:postId`, authenticateToken, (req, res) => {
    const {postId} = req.params;
    const requestedUser = req.user;
    const user = users.find(user => user._id === requestedUser._id);
    user.bookmarks = user.bookmarks.filter(post => post._id !== postId);
    res.status(200).send(user);
});

app.listen(PORT, () => {
    initialiseSchema();
    console.log("server is up and listening")
});