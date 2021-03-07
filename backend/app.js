const app = require("express")();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const API_KEY = "DrYeITtJemlW9Ch6kiRKd9_PwHx2O_Fns4GHBqwSNIQqTl7GEGPIGuoXBi52lxKu5QOBDA2OUxV6bMZJaOqOHQXffxI1u2v9SG5prwv8FxDS0acvnT_dUECEsGM7YHYx"

let rawData = fs.readFileSync(path.join(__dirname, "categories.json"))
const categories = JSON.parse(rawData);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
});

app.get("/activity/random", (req, res) => {
    const randomActivity = categories[Math.floor(Math.random() * categories.length)];

    res.status(200).send(JSON.stringify({
        parentTitle: randomActivity.parents,
        categoryTitle: randomActivity.title,
        categoryAlias: randomActivity.alias,
        type: randomActivity.type
    }))
})

app.get("/business/search", (req, res) => {
    /*
        query string: radius, latitude, longitude, categories
    */

    let url = "https://api.yelp.com/v3/businesses/search";
    var queryString = "radius=" + req.query.radius
                    + "&latitude=" + req.query.latitude
                    + "&longitude=" + req.query.longitude
                    + "&categories=" + req.query.categories;
    const config = {
        headers: { Authorization: `Bearer ${API_KEY}` }
    };

    axios.get(url + "?" + queryString, config)
        .then(response => {
            res.status(200).send(JSON.stringify(response.data));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        })

    
})

const port = process.env.PORT || "8000";
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});