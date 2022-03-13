# Jest study cases
This repo holds examples of jest implementations. Feel free to do whatever you want with this.

## Mock fetch in react-app
Fetch is a browser API, which means it works only in browsers. That's why if you will try to run fetch with terminal it will fail.

That being said, react-app by default use [whatwg-fetch module](https://github.com/github/fetch), that enables fetch-use within the react-app folder.

To summarize, you can't normally use and test fetch outside browser, but in react-app folder you can. So if you don't want to install addinitonal libraries apart of jest to test fetch, you can do it for react-app.

### Spy on fetch
Jest library has `.onSpy` method that watches specified method and can change it's output for mocking. 

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