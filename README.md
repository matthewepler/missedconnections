# Missed Encounters Haikus
An application displaying recent Missed Encounters posts from [http://newyork.craigslist.org](http://newyork.craigslist.org)

## Technical Summary
This app is built with the following tools:  

* Express
* React
* Webpack 2
* Babel
* ESLint ([Standard](https://standardjs.com/))
* [Axios](https://github.com/mzabriskie/axios) - for XMLHttp requests
* [Cheerio](https://cheerio.js.org/) - for web scraping
* [Syllable](https://github.com/wooorm/syllable) - for counting syllables, naturally
* [Anime](http://animejs.com/) - for animation

And a bunch of other stuff to support the dev environment that isn't really that important. 

## Running the App Locally
Visit `URL` to see the app.

To run the app locally, `cd` to the root directory and open two Terminal windows.  

In one terminal, run the command `yarn start`  
In the other terminal, run the command `yarn dev:wds`  

**Database**
In a separate terminal, `cd` to the project root, and then to the `data` directory. Note this path and then run the command:   
`mongod --dbpath ~/Desktop/haiku/data` 

The argument passed to `--dbpath` is the path to your data folder inside your app.

## Design Choices
**Context**
I imagined this would live in a public setting on a large-ish display (despite the NSFW quality of the content). For that reason, I wanted a clean, clear, and bold aesthetic that made the text the center of the show. The screen should be readable from a distance and be compelling enough to encourage a user to stay for multiple poems. 

**Fate**
The top and bottom lines of the text animate to convey the movement of the two people involved in the "missed connection." The application chooses a random animation from four possible outcomes. Only one of these results in the lines coming together in the middle, collapsing the text into a space where love prevails despite the odds. Yay, love!

**Passing of Time**
The background gradient shifts slightly overtime to add a sensation of time passing, much as it does leading up to the moment we are caught off-guard by a stranger.

**Anticipation/Urgency**
Lastly, the timing of the text animation is frequent enough to create anticipation and brief so that the user is encouraged to makes sense of it as quickly as they can. These two effects are meant to approximate the anticipation of our next brush with fate while simultaneously evoking a sense of urgency when we know the moment will not last. 

## Technical Choices
**Why React?**
React is certainly overkill for this project. I don't need it. But it's what I'm comfortable with and it allowed me to get up and running and get a feel for what I needed. Now that I've finished, if I was concerned about size or feeling extra minimal, I might just do it with vanilla JS since that's all I'm really using. 

**Why create a DB with all that extra stuff in it?**
If the application is going to be parsing the data anyway, we might as well save it. As the application changes, we might want to add features that require some of the additional data available on the page. It will be less costly to setup the DB now and scrape as much as possible than doing it later. We can always decide to dump what we don't need later.

### Next Steps
If I were to keep working, these are the areas I would focus on, in order of priority:  

* write tests
* add better styling (SCSS, JSS, etc.) and autoprefixing (post-css, currently in there but not working)
* add more text cleaning (single parenthesis, dangling commas, etc.)
* when user hovers over a line, the animation is paused and the full original post is displayed in a tool-tip
* build out the API so that others can use it to access full posts or make bots
* make NSFW version ;)

### Dev Notes
To skip testing when making a push, use `git push --no-verify`  
If using the pm2 server, `ctrl-c` will not stop the server. It continues to run in the background. To stop pm2 server, run `yarn prod:stop`  

When running the dev server, you may get occaisonal errors regarding `XMLHttpRequests'. This is an issue with the Webpack Dev Server and goes away in production. 
