import users from "../db/users.js"
import posts from "../db/posts.js";

const getUser = (userId) => {
    const userToSend = users.find(user => user._id === userId);
    if(userToSend !== undefined){
        const userObject = {
            _id : userToSend._id,
            email : userToSend.email,
            username : userToSend.username,
            name : userToSend.name,
            bio : userToSend.bio,
            posts : posts.filter(post => post.authorDetails.id === userToSend._id),
            communities : userToSend.communities,
            bookmarks : userToSend.bookmarks,
            follows : userToSend.follows,
            followers : userToSend.followers,
        };
        return userObject;
    }
    else {
        console.log('user does not exist')
    }
};

export default getUser;