const getPost = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const post = await response.json();
        return post;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = getPost;