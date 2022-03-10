require("dotenv").config();

var path = require("path")
const morgan = require('morgan')  // dev to check request in temrinal
let nunjucks = require("nunjucks") // templating engine
const cors = require("cors") 
const express = require("express")
const cookieParser = require('cookie-parser') // read cookie in request
const app = express()

app.use(express.urlencoded({ extended: false })) // support for html forms
app.use(express.json()); // support JSON

const PORT = process.env.PORT;

const corsOptions = {
  origin: "http://localhost:" + PORT
};

app.use(cookieParser())

// Then pass them to cors:
app.use(cors(corsOptions))

app.use(morgan('tiny')) // console request
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
});
*/

app.set("view engine", "html")
nunjucks.configure('views', { // setting default views folder
  autoescape: true,
  express: app
})

app.use(express.static(path.join(__dirname, 'public'))) //serves all files contained in the public folder

require("./routes/front_routes")(app)

require("./routes/user_routes")(app)

require("./routes/article_routes")(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
