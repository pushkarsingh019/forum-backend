import { v4 as uuid } from "uuid";
import users from "./users.js";

const community = [
    {
        _id : uuid(),
        username : "general",
        title : "General Pod",
        description : "All things ! no boundaries here, post what you want to post",
        founder : {id : users[0]._id, username : users[0].username},
        posts : [],
        members : [],
    }
];

export default community;