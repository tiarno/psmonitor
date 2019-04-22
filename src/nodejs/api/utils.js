const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://myserver00.example.com';

module.exports.find = function (collection_name, query, projection){
  return new Promise((resolve, reject) =>{
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
      const db = client.db('myserver');
      const collection = db.collection(collection_name);
      collection.find(query, projection).toArray(function (err, docs) {
        if (err) { console.log('error dammit'); reject(err);}
        resolve(docs);
      });
    });
  });
}
