const getPost = require("./getPost");

fetch.mockResponseOnce(JSON.stringify({ id: 4, }))

test("Some test", async () => {
    const post = await getPost(4);
    expect(post.id).toBe(4)
})