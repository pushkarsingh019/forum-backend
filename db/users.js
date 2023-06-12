import { v4 as uuid } from "uuid";


const users = [
    {
        _id : uuid(),
        email : "gavin@hooli.com",
        password : "killpiedpiper",
        username : "gavin",
        bio : "Hi, I am Gavin Belson. Founder and CEO of Hooli. I spend my time creating useless products and suuing piedpiper",
        posts : [],
        communities : [],
        bookmarks : [],
        follows : [],
        followers : [],
    }
];


export default users;