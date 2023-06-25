import users from "./db/users.js";
import {posts} from "./db/posts.js";
import community from "./db/community.js";

// to solve for circular dependency, I am adding dependency parts of schema here

export const initialiseSchema = () => {
    users[0] = {...users[0], posts : posts.filter(post => post.authorDetails.id === users[0]._id), communities : {id : community[0]._id, communityName : community[0].username}};

    posts[0] = {...posts[0], community : {id : community[0]._id, communityName : community[0].username}};

    community[0] = {...community[0], posts : posts.filter(post => post.community.id === community[0]._id)};
};


