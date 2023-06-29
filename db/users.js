import { v4 as uuid } from "uuid";


let users = [
    {
        _id : uuid(),
        name : "Gavin Belson",
        avatar : "",
        email : "gavin@hooli.com",
        password : "killpiedpiper",
        username : "gavin",
        bio : "Hi, I am Gavin Belson. Founder and CEO of Hooli. I spend my time creating useless products and suuing piedpiper",
        portfolioLink : "www.gavinbelson.com",
        posts : [],
        communities : [],
        bookmarks : [],
        follows : [],
        followers : [],
    }
];


export default users;