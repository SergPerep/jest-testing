const getAlbum = require("./getAlbum");

const realFetch = global.fetch;

const buildFetchResult = (data) => Promise.resolve({ json: () => Promise.resolve(data) });

beforeAll(() => {
    global.fetch = jest.fn()
})

afterAll(() => {
    global.fetch = realFetch
})

test("Some test", async () => {
    global.fetch.mockReturnValueOnce(buildFetchResult({ id: 3 }));
    const album = await getAlbum(3);
    expect(fetch).toHaveBeenCalled();
    expect(album.id).toBe(3);
})