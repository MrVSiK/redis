const express = require("express");
const app = express();
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();


app.use(express.static(__dirname + "/public"));

app.listen(3000, () => {
    console.log("Server is up on port 3000");
});


app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/result.html")
});

app.get("/:country", (req,res) => {
    const country = req.params.country;
    client.get(country, (err, reply) => {
        if(err) return err;
        if(reply){
            res.json({data: JSON.parse(reply)});
        } else {
            axios.get("https://restcountries.eu/rest/v2/name/" + country).then(data => {
                client.set(country, JSON.stringify(data.data));
                res.json({data: data.data});
            })
        }
    })
})