require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("hoteltastic");
    const jobboxuserCollection = db.collection("jobBoxUsers");
    const jobCollection = db.collection("jobs");

    app.get("/jobboxusers", async (req, res) => {
      const cursor = jobboxuserCollection.find({});
      const jobboxuser = await cursor.toArray();
      res.send({ status: true, data: jobboxuser });
    });

    app.get("/jobboxuserbyemail/:email", async (req, res) => {
      const { email } = req.params
      const jobboxuser = await jobboxuserCollection.findOne({ email });
      if (jobboxuser) {
        return res.send({ status: true, data: jobboxuser });
      }

      res.send({ status: false })
    });

    app.post("/jobboxuser", async (req, res) => {
      const jobboxuser = req.body;
      const result = await jobboxuserCollection.insertOne(jobboxuser);
      res.send(result);
    });

    app.patch("/jobboxuser/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body
      const result = await jobboxuserCollection.updateOne({ _id: ObjectId(id) }, { $set: data });
      res.send(result);
    });

    app.delete("/jobboxuser/:id", async (req, res) => {
      const id = req.params.id;
      const result = await jobboxuserCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.get("/jobs", async (req, res) => {
      const cursor = jobCollection.find({});
      const jobs = await cursor.toArray();
      res.send({ status: true, data: jobs });
    });

    app.get("/job/:id", async (req, res) => {
      const { id } = req.params
      const cursor = jobCollection.findOne({ _id: id });
      const jobs = await cursor.toArray();
      res.send({ status: true, data: jobs });
    });

  } catch (err) {
    console.log(err)
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
