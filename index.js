const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kihouyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("surya24Db").collection("user");
    const teamsCollection = client.db("surya24Db").collection("teams");
    const managerCollection = client.db("surya24Db").collection("managers");
    const coachCollection = client.db("surya24Db").collection("coaches");
    const mainPlayersCollection = client.db("surya24Db").collection("mainPlayers");
    const substitutePlayersCollection = client.db("surya24Db").collection("substitutePlayers");

    // user related apis
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/teams", async (req, res) => {
      const cursor = teamsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/team", async (req, res) => {
      const newTeam = req.body;
      console.log(newTeam);
      const result = await teamsCollection.insertOne(newTeam);
      res.send(result);
    });

    app.get("/team/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await teamsCollection.findOne(query);
      res.send(result);
    });

    app.post("/manager", async (req, res) => {
      const newManager = req.body;
      console.log(newManager);
      const result = await managerCollection.insertOne(newManager);
      res.send(result);
    });

    app.get("/manager/:id", async (req, res) => {
      const id = req.params.id;
      const query = { teamId: id };
      const result = await managerCollection.findOne(query);
      res.send(result);
    });

    app.post("/coach", async (req, res) => {
      const newCoach = req.body;
      console.log(newCoach);
      const result = await coachCollection.insertOne(newCoach);
      res.send(result);
    });

    app.get("/coach/:id", async (req, res) => {
      const id = req.params.id;
      const query = { teamId: id };
      const result = await coachCollection.findOne(query);
      res.send(result);
    });

    // this to get all the main players under the team 
    app.post("/mainPlayers", async (req, res) => {
      const id = req.body.id;
      const query = { teamId: id };
      const result = await mainPlayersCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

// to add new player 
    app.post("/addMainPlayer", async (req, res) => {
      const newMainPlayer = req.body;
      console.log(newMainPlayer);
      const result = await mainPlayersCollection.insertOne(newMainPlayer);
      res.send(result);
    });

     // this to get all the main sub players under the team 
     app.post("/substitutePlayers", async (req, res) => {
      const id = req.body.id;
      const query = { teamId: id };
      const result = await substitutePlayersCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    // to add new player 
    app.post("/addSubstitutePlayer", async (req, res) => {
      const newSubstitutePlayer = req.body;
      console.log(newSubstitutePlayer);
      const result = await substitutePlayersCollection.insertOne(newSubstitutePlayer);
      res.send(result);
    });

    app.post("/myList", async (req, res) => {
      const userEmail = req.body.email;
      const query = { userEmail: userEmail };
      const result = await touristsSpotCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.delete("/touristsSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/touristsSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          image_URL: updatedSpot.image_URL,
          tourists_spot_name: updatedSpot.tourists_spot_name,
          country_Name: updatedSpot.country_Name,
          location: updatedSpot.location,
          short_description: updatedSpot.short_description,
          seasonality: updatedSpot.seasonality,
          average_cost: updatedSpot.average_cost,
          totalVisitorsPerYear: updatedSpot.totalVisitorsPerYear,
          travel_time: updatedSpot.travel_time,
        },
      };
      const result = await touristsSpotCollection.updateOne(
        filter,
        spot,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Surya24 server is running !!");
});

app.listen(port, () => {
  console.log(" Surya24 Server is running on " + port);
});
