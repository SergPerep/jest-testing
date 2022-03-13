const getTodo = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        const todo = await response.json();
        return todo;
    } catch (error) {
        console.error(error.message)
    }
}


module.exports = getTodo;