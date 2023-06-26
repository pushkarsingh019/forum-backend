import { posts } from "../db/posts.js";
import users from "../db/users.js";

const createFeed = userId => {
    const user = users.find(user => user._id === userId);
    // see if the author of the post is someone the user follows or not.
    if(user !== undefined){
        let feed = [];
        posts.forEach(post => {
            const userFollows = user.follows.map(follow => follow._id);
            if (userFollows.includes(post.authorDetails.id) || post.authorDetails.id === user._id) {
                feed.push(post);
            }
        });
        return feed;
    }
    else{
        console.log("user does not exist")
    }
    
};

export default createFeed;