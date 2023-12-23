const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI="mongodb+srv://xxxxx:xxxxx@cluster0.oa6w0yn.mongodb.net/xxxxx?retryWrites=true&w=majority"

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    // Ensures that the client will close when you finish/error
    // await client.close()
    console.log(err.message);
  }
}
run().catch(console.dir);



module.exports = client
