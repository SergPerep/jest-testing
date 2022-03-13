const getTodo = require("./getTodo");

const buildFetchResult = (data) => Promise.resolve({ json: () => Promise.resolve(data) })

beforeEach(() => {
    jest.restoreAllMocks()
})

test("Basic test", async () => {
    const spy = jest.spyOn(global, 'fetch').mockReturnValue(buildFetchResult({id: 2}))
    const todo = await getTodo();

    expect(spy).toHaveBeenCalled();
    expect(todo).toEqual({ id: 2 });
})