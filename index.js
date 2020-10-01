require("dotenv").config();
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 4020;
app.listen(PORT, () => {
  console.log("server working at http://localhost:4020");
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body);
      //   console.log(data.body.artists.items);
      //   console.log("index", data.body.artists.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {
        artistsList: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      //   console.log("tessssst", data.body.items);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", {
        artistsAlbum: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/titleListe/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getAlbumTracks(req.params.artistId)
    .then((data) => {
      console.log("track", data.body.items);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("titleListe", {
        artistsTrack: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
