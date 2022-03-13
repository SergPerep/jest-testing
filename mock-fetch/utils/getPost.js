const getPost = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const post = await response.json();
        console.log({ post });
        return post;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = getPost;