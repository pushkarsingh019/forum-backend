import { v4 as uuid } from "uuid";


let users = [
    {
        _id : uuid(),
        name : "Gavin Belson",
        avatar : "https://media.licdn.com/dms/image/C5603AQELJdeNIQtl3Q/profile-displayphoto-shrink_800_800/0/1542153743923?e=2147483647&v=beta&t=RVv95dfGogDEbH-6Qhfli5lxxzwPd99NW-blKPZipLU",
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