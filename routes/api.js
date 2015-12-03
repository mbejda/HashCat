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