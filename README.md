# Missed Connections Haikus
An application displaying recent Missed Connections posts from [http://newyork.craigslist.org](http://newyork.craigslist.org)

See the application live here: [Missed Connections Haiku App](https://missedconnectionshaikus.herokuapp.com/)

To read the original assignment, see `notes.md`

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

## Design Choices
**Context**  
I imagined this would live in a public setting on a large-ish display (despite the NSFW quality of the content). For that reason, I wanted a clean, clear, and bold aesthetic that made the text the center of the show. The screen should be readable from a distance and be compelling enough to encourage a user to stay for multiple poems. 

**Fate**  
The top and bottom lines of the text animate to convey the movement of the two people involved in the "missed connection." The application chooses a random animation from four possible outcomes. Only one of these results in the lines coming together in the middle, collapsing the text into a space where love prevails despite the odds. Yay, love!

**Passing of Time**  
The background gradient shifts slightly overtime to add a sensation of time passing, much as it does leading up to the moment we are caught off-guard by a welcome stranger.

**Anticipation/Urgency**  
The timing of the text animation is frequent enough to create anticipation but brief enough so that the user is encouraged to make sense of it as quickly as he/she can. These two effects are meant to approximate the anticipation of our next brush with fate while simultaneously evoking a sense of urgency when we know the moment will not last. 

## Technical Choices
**Why React?**  
React is certainly overkill for this project. I don't need it. But it's what I'm comfortable with and it allowed me to get up and running and get a feel for what I needed. Now that I've finished, if I was concerned about size or feeling extra minimal, I might just do it with vanilla JS since that's all I'm really using. 

**Why create a DB with all that extra stuff in it?**  
If the application is going to be parsing the data anyway, we might as well save it. As the application changes, we might want to add features that require some of the additional data available on the page. It will be less costly to setup the DB now and scrape as much as possible than doing it later. We can always decide to dump what we don't need later.

As a cool bonus, the server is set to scrape new posts every night and the results are accessible through a public API.

## Next Steps
If I were to keep working, these are the areas I would focus on, in order of priority:  

* write tests
* add better styling approach (SCSS, JSS, etc.)
* add autoprefixing for cross-browser support
* add more text cleaning (single parenthesis, dangling commas, etc.)
* explore grammar libraries that could improve quality of results
* add ability to see original missed connection posts for each poem
* build out the API to accept queries

## Running the App Locally
You must have the MongoDB credentials in a `.env` file located at the project root. If you do not have this file, contact the author directly.

To run the app locally, `cd` to the root directory and open two Terminal windows.  

**Development Version**  
In one terminal, run the command `yarn start`  
In the other terminal, run the command `yarn dev:wds`  

**Production Version**  
Build the app with the command `yarn prod:build`  
This will compile the code with babel into the `/lib` folder.

The production server is heroku's, and it is controlled by a `Procfile` at the root of the directory. It will also automatically look for a `.env` file and load that too.  

Start the app by running `yarn prod:start`.   

NOTE: you do not needs the webpack dev server running. This is the only command you should need to get the app working. If you need the local database, see below.
 

**Database**  
You can either run MongoDB locally or use the URI to connect to [mLab](https://www.mlab.com). The easiest is to just use mLab and to do that you don't have to do anything. The app will communicate directly with the hosted database. If you prefer to run a local database, you will need to install mongo locally and then proceed with the instructions below:

*Running MongoDB Locally* 
 
In `src/server/index.js`, you will need to change the URL used to connect to the database to `MONGO_LOCAL_URL`, which is defined in `src/shared/config.js`

In a separate terminal, `cd` to the project root, and then to the `data` directory. Note this path and then run the command:   
`mongod --dbpath ~/Desktop/haiku/data` 

The argument passed to `--dbpath` is the path to your data folder inside your app.

To interact with the database, run `mongo` in a separate terminal window.

## Dev Notes
To skip testing when making a push or commit, use `git push --no-verify`   

When running the dev server, you may get occaisonal errors regarding `XMLHttpRequests'. This is an issue with the Webpack Dev Server and goes away in production. 
