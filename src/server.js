const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(bodyParser.json());

const withDB = async(operations, res) => {
    try {
        const client = await MongoClient.connect('mongodb://0.0.0.0:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db('myblog');
        await operations(db);
        client.close();
    } catch (error) {
        res.status(500).json({message: 'Error connecting to db', error});
    }
}

app.get('/api/articles/:name', async (req, res) => {
    withDB(async(db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection("articles").findOne({name: articleName});
        res.status(200).json(articleInfo);
    }, res)
});

app.post('/api/articles/:name/add-comments', (req, res) => {
    const {username, text} = req.body;
    const articleName = req.params.name;
    // articleInfo[articleName].comments.push({username, text});
    // res.status(200).send(articleInfo[articleName]);
    withDB(async(db) => {
        const articleInfo = await db
        .collection('articles')
        .findOne({name: articleName});
        await db.collection('articles').updateOne(
            {name: articleName}, 
            {
                $set: {
                    comments: articleInfo.comments.concat({username, text})
                }
            }
        );
        const updatedArticleInfo = await db
        .collection('articles')
        .findOne({name: articleName})   
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.listen(8000, () => console.log("Listening on Port 8000"))