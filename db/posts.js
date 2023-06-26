import { v4 as uuid } from "uuid";
import users from "./users.js";
import community from "./community.js";

export let posts = [
    {
        _id : uuid(),
        authorDetails : {
            id : users[0]._id,
            username : users[0].username,
            name : users[0].name
        },
        community : {},
        post : "this is the first dummy post and also the beginning to something amazing",
        likes : [{id : users[0]._id, username : users[0].username}],
        comments : [],
        time : new Date()
    },
];
