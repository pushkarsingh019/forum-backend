import { v4 as uuid } from "uuid";
import users from "./users.js";
import community from "./community.js";

const posts = [
    {
        _id : uuid(),
        authorDetails : {
            id : users[0]._id,
            username : users[0].username,
        },
        community : {},
        post : "this is the first dummy post and also the beginning to something amazing",
        upvotes : [{id : users[0]._id, username : users[0].username}],
        downvotes : [],
        likes : [{id : users[0]._id, username : users[0].username}],
        comments : [],
        time : new Date()
    },
];

export default posts;
