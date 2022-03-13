const getPost = require("./getPost");
fetch
    .mockResponseOnce(JSON.stringify({
        "userId": 1,
        "id": 4,
        "title": "eum et est occaecati",
        "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
    }))

test("Some test", async () => {
    const post = await getPost(4);
    expect(post.id).toBe(4)
})