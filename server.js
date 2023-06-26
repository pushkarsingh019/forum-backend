import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid";

import { initialiseSchema } from "./initial.js";
import users from "./db/users.js";
import {posts} from "./db/posts.js";
import communitySchema from "./db/community.js";
import { access_key } from "./utils/config.js";
import authenticateToken from "./utils/authenticateToken.js";
import {getUser, getUserByUsername} from "./utils/getUser.js";

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
            const userObject = getUser(user._id);
            res.status(200).json({user : userObject, accessToken : accessToken, message : "login sucessfull"});
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
    const {name, username, email, password} = req.body;
    const userExists = users.find(user => user.email === email);
    if(userExists){
        res.status(409).json({message : "user already exists, log in..."});
    }
    else {
        const newUser = {
            _id : uuid(),
            name,
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
        const userObject = getUser(newUser._id);
        const accessToken = jwt.sign(newUser, access_key);
        res.status(200).json({user : userObject, accessToken, message : "account created"})
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

app.route('/api/post/:id')
.get((req, res) => {
    const {id} = req.params;
    const postToSend = posts.find(post => post._id === id);
    if (postToSend !== undefined) {
        res.status(200).send(postToSend);
    }
    else{
        res.status(404).send('post not found');
    }
})
.delete(authenticateToken, (req, res) => {
    const {id} = req.params;
    const user = req.user;
    const postToDelete = posts.find(post => post._id === id);
    if(user._id === postToDelete.authorDetails.id){
        // delete the post
        const deleteIndex = posts.findIndex(post => post._id === id);
        posts.splice(deleteIndex, 1);
        res.status(200).send(posts);
    }
    else{
        res.status(401).send("you are not authorised to delete this post");
    }
})
.put(authenticateToken, (req, res) => {
    const {post} = req.body;
    const {id} = req.params;
    const user = req.user;
    const postToEditIndex = posts.findIndex(post => post._id === id);
    if(postToEditIndex !== -1){
        if(posts[postToEditIndex].authorDetails.id === user._id){
            posts[postToEditIndex].post = post;
            posts[postToEditIndex].time = new Date();
            res.status(200).send(posts[postToEditIndex]);
        }
        else{
            res.status(401).send("you are not authorised to edit this post");
        }
    }
    else{
        res.status(404).send("post not found");
    }
})

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
    const userObject = getUser(user._id);
    res.status(200).send(userObject);
});


app.delete(`/api/post/bookmark/:postId`, authenticateToken, (req, res) => {
    const {postId} = req.params;
    const requestedUser = req.user;
    const user = users.find(user => user._id === requestedUser._id);
    user.bookmarks = user.bookmarks.filter(post => post._id !== postId);
    res.status(200).send(user);
});

// user routes
app.route(`/api/user/:userId`)
.get((req, res) => {
    const {userId} = req.params;
    const userToSend = users.find(user => user._id === userId);
    if(userToSend !== undefined){
        const userObject = getUser(userToSend._id);
        res.status(200).send(userObject);
    }
    else{
        res.status(404).json({message : "incorrect user"})
    }
})
.put(authenticateToken, (req, res) => {
    const requestedUser = req.user;
    const {name, username, bio} = req.body;
    const userIndex = users.findIndex(user => user._id === requestedUser._id);
    if(userIndex !== -1){
        users[userIndex].name = name;
        users[userIndex].bio = bio;
        users[userIndex].username = username;
    }
    const userObject = getUser(requestedUser._id);
    res.status(200).send(userObject)
})

app.get(`/api/profile/:username`, (req, res) => {
    const {username} = req.params;
    const userToSend = users.find(user => user.username === username);
    if(userToSend !== undefined){
        const userObject = getUserByUsername(username);
        res.status(200).send(userObject);
    }
    else{
        res.status(404).send("user not found");
    }
});

// follow and unfollow user routes
app.get('/api/user/follow/:userId', authenticateToken, (req, res) => {
    //TODO : add a function if the user does not already follow the person.
    const requestedUser = req.user;
    const {userId} = req.params
    const userToFollow = users.findIndex(user => user._id === userId);
    const userWhoFollowed = users.findIndex(user => user._id === requestedUser._id);
    if(userToFollow !== -1){
        users[userToFollow].followers.push({
            _id : requestedUser._id,
            username : requestedUser.username
        });
    }
    if(userWhoFollowed !== -1){
        users[userWhoFollowed].follows.push({
            _id : users[userToFollow]._id,
            username : users[userToFollow].username
        })
    };
    const userObject = getUser(requestedUser._id);
    res.status(200).send(userObject);
});

app.delete('/api/user/follow/:userId', authenticateToken, (req, res) => {
    const requestedUser = req.user;
    const {userId} = req.params
    const userToUnfollow = users.findIndex(user => user._id === userId);
    const userWhoUnfollowed = users.findIndex(user => user._id === requestedUser._id);
    if(userToUnfollow !== -1){
       users[userToUnfollow].followers = users[userToUnfollow].followers.filter(follower => follower._id !== requestedUser._id);
    }
    if(userWhoUnfollowed !== -1){
        users[userWhoUnfollowed].follows = users[userWhoUnfollowed].follows.filter(follows => follows._id !== userId);
    };
    const userObject = getUser(requestedUser._id);
    res.status(200).send(userObject);
});


// comments crud routes
app.route('/api/post/comment')
.post(authenticateToken, (req, res) => {
    const {comment, postId} = req.body;
    const user = req.user;
    const postToComment = posts.find(post => post._id === postId);
    const newComment = {
        _id : uuid(),
        comment : comment,
        authorDetails : {
            id : user._id,
            username : user.username
        }
    };
    if(postToComment !== undefined){
        postToComment.comments.push(newComment);
        res.status(200).send(postToComment);
    }
    else{
        res.status(404).send("no such post found")
    }
})


app.listen(PORT, () => {
    initialiseSchema();
    console.log("server is up and listening")
});