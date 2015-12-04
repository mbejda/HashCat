## Building an OpenNLP application with Node Express ##
The objective of this post is to demonstrate how to integrate OpenNLP with Node Express. Were going to be making an `Express` application called HashCat. I put the source code for HashCat on Github.

## Getting Started

Generate a simple Express application. I used Yeomen express-generator to generate my Express application.  
```javascript
express hashcat --ejs
```

The next step is to install the npm modules that are going to be used. 

```javascript
npm install java --save
npm install opennlp --save
```
If everything was done correctly, navigate to your localhost:port (Im using port 3000) and you should see the following in your browser :

![](https://www.mbejda.com/content/images/2015/12/Screen-Shot-2015-12-03-at-8-03-50-AM.png)


## Training 

Were going to need a trained dataset that will categorize our hashtags. 

Obtain and download the categorized hashtag dataset from [my publicly shared datasets on Github](http://mbejda.github.io) and rename it as hashcat.tsv. Execute the following OpenNLP CLI command to create a trained model.
```javascript
opennlp DoccatTrainer -model hashcat.bin -lang en -data hashcat.tsv -encoding UTF-8
```
![](https://www.mbejda.com/content/images/2015/12/Screen-Shot-2015-12-03-at-8-34-10-AM.png#400)

After 1-2 minutes the training should be complete and a `hashcat.bin` file should appear in the directory.

## API
Add one api route to the Express `app.js`. This API route is going to handle the requests. For simplicity sake I have named my API route `api`.

```javascript
/*
app.js
*/
var api = require('./routes/api');
app.use('/api', api);
```
In the routes folder create the api file and insert the following code : 
```javascript
/*
routes/api.js
 */
var express = require('express');
var router = express.Router();
var OpenNLP = require('opennlp');

/*
Point the doccat model to our trained NLP model.
 */
var doccat = new OpenNLP({
    models: {
        doccat: 'hashcat.bin'
    }
}).doccat


/*
Hashtag will be our api parameter
 */

router.get('/:hashtag', function(req, res, next) {
    var hashtag = req.param('hashtag')
    if (!hashtag) return res.json(500).json({
        error: "missing hashtag parameter"
    });


/*
Run categorization
 */

    doccat.categorize(hashtag, function(err, list) {
        if (err) return res.status(500).json({
            error: JSON.stringify(err)
        });


/*
Choose best category
 */

        doccat.getBestCategory(list, function(err, category) {
            if (err) return res.status(500).json({
                error: JSON.stringify(err)
            });
            return res.status(200).json({
                category: category
            });
        });
    });
});

module.exports = router;
```
 
Now you have an awesome API that can categorize hashtags. Try it out with the following calls. `http://localhost:3000/api/samsung` should be categorized as technology and 
`http://localhost:3000/api/bacon` should be categorized as food. 

<br>

You can view a live hashcat demo on Heroku.<br>
[https://hashcatdemo.herokuapp.com](https://hashcatdemo.herokuapp.com)
<hr>
HashCat on Github : [https://github.com/mbejda/HashCat](https://github.com/mbejda/HashCat)<br>
Blog: [www.mbejda.com](https://www.mbejda.com)<br>
Twitter: [@notmilobejda](https://twitter.com/notmilobejda)
