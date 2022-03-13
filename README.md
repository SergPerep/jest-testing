# Jest study cases
This repo holds examples of jest implementations. Feel free to do whatever you want with this.

## Mock fetch in react-app
Fetch is a browser API, which means it works only in browsers. That's why if you will try to run fetch with terminal it will fail.

That being said, react-app by default use [whatwg-fetch module](https://github.com/github/fetch), which enables fetch-use within the react-app folder.

To summarize, you can't normally use and test fetch outside browser, but in react-app folder you can. So if you don't want to install addinitonal libraries apart of jest for fetch testing, you can do it for react-app.

Quentin Ménoret describes good in [Mocks and Spies with Jest](https://dev.to/qmenoret/mocks-and-spies-with-jest-32gf) the

To ways to impement that:
- Spy on fetch
- Replace global.fetch

### Spy on fetch
Jest library has `.onSpy` method that watches specified method and can change it's output for mocking. 

```javascript
const spy = jest
    .spyOn(global, 'fetch') // Spy on fetch
    .mockReturnValue(Promise.resolve({ json: () => 
        Promise.resolve({id: 2}) 
    })) // Mock fetch-result: response with json
```
There's a lot of nested promises which can be hard to wrap your head around first time you look at them. Which may become a reason why you would consider to use special libraries.

The complete code might look like this

```javascript
// getTodo.test.js
const getTodo = require("./getTodo");
// We test getTodo that has fetch inside

// I use buildFetchResult to not write 
// nested Promises every time we spy
const buildFetchResult = (data) => Promise.resolve({ json: () => Promise.resolve(data) })

beforeEach(() => {
    jest.restoreAllMocks()
})

test("Basic test", async () => {
    const spy = jest
        .spyOn(global, 'fetch')
        .mockReturnValue(buildFetchResult({id: 2}))
    
    const todo = await getTodo();

    expect(spy).toHaveBeenCalled();
    expect(todo).toEqual({ id: 2 });
})
```
### Replace global.fetch

You can fully replace fetch-method. That is not recomended to do, but for testing purposes we can allow it. But we should not forget to reset fetch after the tests.
``` javascript
const realFetch = global.fetch; // Save real fetch
global.fetch = () => {} // Replace with fake fetch
//... bunch of code
global.fetch = realFetch;
``` 

Implement jest mocking fucntions, beforeEach() and afterEach() methods and you will get this:
```javascript
const realFetch = global.fetch; // Save real fetch

// Replace fetch with fake fetch before tests
beforeAll(() => {
    global.fetch = jest.fn() // Mocking function
})

 // Reset fetch after the test
afterAll(() => {
    global.fetch = realFetch;
})

```
Completed code is going to look like this:
```javascript
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
```

## Mock fetch with libraries
If tests are not in react-app-environment, then fetch will not going to work, since it's a browser API, thus works only in a browser.

To enable fetch and give us easy-to-configure mocking options we can use special libraries such as [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock).

After module has been installed, create and configure `setupJest.js`.

```javascript
//setupJest.js or similar file
require('jest-fetch-mock').enableMocks()
```

Add to `package.json`:
```JSON
"jest": {
  "automock": false,
  "resetMocks": false,
  "setupFiles": [
    "./setupJest.js"
  ]
}
```
Then in `...test.js` you can access fetch and it's new methods for mocking.
```javascript
// getPost.test.js
const getPost = require("./getPost");

// Mocking fetch
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
```
Visit [documentation of jest-fetch-mock]() for more details and configuration options.