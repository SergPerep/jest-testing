# Mock fetch with jest
This repo holds examples of jest implementations for fetch mocking. Feel free to use it however you want.

To install depenencies run this:
```bash
npm i --prefix mock-fetch-react && npm i --prefix mock-fetch-with-library
```

## Mock fetch in react-app
Fetch is a browser API, which means it works only in browsers. That's why if you will try to run fetch through terminal it will fail.

That being said, react-app by default use [whatwg-fetch module](https://github.com/github/fetch), which enables fetch-use within the react-app folder.

To summarize, you can't normally use and test fetch outside of browser, but in react-app folder you can (if you use react-app testing commands). So if you don't want to install addinitonal libraries apart of jest for fetch testing, you can do it for react-app.

I have found two ways to impement that:
- [Spy on fetch](#spy-on-fetch)
- [Replace global.fetch](#replace-globalfetch)

### Spy on fetch
[→ spy-on-fetch folder](./mock-fetch-react/src/spy-on-fetch/)

Jest library has `.onSpy` method that watches specified method and can change its output for mocking. 

```javascript
const spy = jest
    .spyOn(global, 'fetch') // Spy on fetch
    .mockReturnValue(Promise.resolve({ json: () => 
        Promise.resolve({id: 2}) 
    })) // Mock fetch-result: response with json
```
There's a lot of nested promises which can be hard to wrap your head around first time you look at them, but they are the way to simulate fetch response.

The complete code might look like this:

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

[→ replace-global-fetch folder](/mock-fetch-react/src/replace-global-fetch/)

You can fully replace fetch with a fake function. Fetch is stored in global variable, and normally it is not recommended to mess with it. But for testing purposes we are allowed to break some rules... as long as we promise to reset fetch after the tests.

``` javascript
const realFetch = global.fetch; // Save real fetch
global.fetch = () => {} // Replace with fake fetch
//... bunch of code
global.fetch = realFetch; // Reset fetch
``` 

Implement jest mocking functions, `beforeEach()` and `afterEach()` methods and you will get this:

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
The complete code might look like this:

```javascript
// getAlbum.test.js
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

[→ mock-fetch-with-library folder](/mock-fetch-with-library/utils/)

If tests are not in react-app-environment, then fetch will not going to work by default. To enable fetch and give us easy-to-configure mocking options we can use special libraries such as [jest-fetch-mock](https://github.com/jefflau/jest-fetch-mock).

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
Then in `.test.js` file you can access fetch and it's new methods for mocking.
```javascript
// getPost.test.js
const getPost = require("./getPost");

// Mocking fetch
fetch.mockResponseOnce(JSON.stringify({ id: 4 }))

test("Some test", async () => {
    const post = await getPost(4);
    expect(post.id).toBe(4)
})
```
Visit [documentation of jest-fetch-mock]() for more details and configuration options.

## Sources
- [Mocks and Spies with Jest | dev.to](https://dev.to/qmenoret/mocks-and-spies-with-jest-32gf) by Quentin Ménoret
- [Mocking Fetch Using jest-fetch-mock | youtube](https://youtu.be/yhUep7E9O20) by Leigh Halliday
- [How to Mock Fetch in Jest Manually | youtube](https://youtu.be/mHXhuPHiDj8) by Leigh Halliday