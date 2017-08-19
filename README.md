## Running the App
Visit `URL` to see the app.

To run the app locally, `cd` to the root directory and open two Terminal windows.  

In one terminal, run the command `yarn start`  

In the other terminal, run the command `yarn dev:wds`  

## Design Choices

## Technical Choices
**Why React?**
React is certainly overkill for this project. But I thought it would be a useful exercise to build a dev environment from scratch that could be scaled out incrementally.  

Also, using Express allows me to deply to services like Heroku so I don't have to deal with setting up a static site domain. Once you're dealing with Express and webpack, adding React doesn't seem like that much of a stretch and in return you get React's lifecycle events and easier Hot Module Integration, which makes the development experience more fluid.  

This could definitely be a simple static site with an `index.html` file and a `.js` file. In the context of a code test, any additional insight into my abilities is likely a plus. For that reason I brought a gun to a knife fight. 

### Dev Notes
To skip testing when making a push, use `git push --no-verify`  
If using the pm2 server, `ctrl-c` will not stop the server. It continues to run in the background. To stop pm2 server, run `yarn prod:stop`  

When running the dev server, you may get an error about `Access-Control-Allow-Origin` headers. To fix this, use Chrome and add the [CORS extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en). Turn on the extension and the problem should be resolved. 