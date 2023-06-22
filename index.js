const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j4yufep.mongodb.net/?retryWrites=true&w=majority`;

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

    const carCollection = client.db("MadToy's").collection("category");

    app.get("/addToys", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myToysData/:email", async (req, res) => {
      const query = { sellerEmail: req.params.email };
      console.log(query);

      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addToys", async (req, res) => {
      const newToys = req.body;
      console.log(newToys);
      const result = await carCollection.insertOne(newToys);
      res.send(result);
    });

    app.get("/addToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await carCollection.findOne(query);
      res.send(result);
    });

    app.delete("/addToys/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/addToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToys = req.body;
      const specialToys = {
        $set: {
          // name: updatedToys.name,
          // sellerName: updatedToys.sellerName,
          // sellerEmail: updatedToys.sellerEmail,
          price: updatedToys.price,
          // rating: updatedToys.rating,
          quantity: updatedToys.quantity,
          details: updatedToys.details,
        },
      };
      const result = await carCollection.updateOne(
        filter,
        specialToys,
        options
      );
      res.send(result);
    });

    const sportsCollection = client.db("MadT").collection("sports");

    app.get("/singleRoute/:text", async (req, res) => {
      console.log(req.params.text);
      if (
        req.params.text == "first" ||
        req.params.text == "second" ||
        req.params.text == "third"
      ) {
        const result = await sportsCollection
          .find({
            status: req.params.text,
          })
          .toArray();
        console.log(result);
        return res.send(result);
      }

      const result = await sportsCollection.find({}).toArray();
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
  res.send("Mad Toy's Server Is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
