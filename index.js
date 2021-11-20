const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');

//app initialization
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//working with database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3rb0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        //get data with get api
        app.get('/services', async (req, res) => {
            const ourServices = await serviceCollection.find({});
            const result = await ourServices.toArray();
            res.json(result);
        });

        //get signle data with get api
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectID(id)};
            const result = await serviceCollection.findOne(query);
            res.json(result);
        });

        //insert service with post api
        app.post('/insert/service', async (req, res) => {
            const serviceItem = req.body;
            const result = await serviceCollection.insertOne(serviceItem);
            res.send(result);
        });

        //delete data with delete api
        app.delete('/service/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectID(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

//application routes
app.get('/', (req, res) => {
    res.send('<h1>This Is The Home Page</h1>');
});

//our server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`our app is running on port 5000`);
});