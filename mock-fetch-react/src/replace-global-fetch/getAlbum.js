const getAlbum = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`);
        const album = await response.json();
        return album;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = getAlbum;