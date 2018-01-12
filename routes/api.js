const express = require('express');
const translate = require('google-translate-api');
const googleTranslate = require('free-google-translation');

const router = express.Router();

//Return the translated text
//URL structure: http://localhost:4000?sourceLanguage=en&targetLanguage=ne&text=I Love You
router.get('/', function(request, response, next) {

    if (typeof request.query.sourceLanguage !== 'undefined' && request.query.sourceLanguage !== null &&
        typeof request.query.targetLanguage !== 'undefined' && request.query.targetLanguage !== null &&
        typeof request.query.text !== 'undefined' && request.query.text !== null
    ) {
        translate(request.query.text, {from: request.query.sourceLanguage, to: request.query.targetLanguage}).then(res => {
            console.log(res.text);
            //=> I love nepal
            console.log(res.from.language.iso);       
    
            response.status(200);
            response.send({
                translateText: res.text
            });
        }).catch(err => {
            console.error(err);
            response.status(404);
            response.send({
                translateText: 'The request couldn\'t be translated'
            });
        });
    } else {
        response.status(400);
        response.send({
            translateText: 'Invalid Request!'
        });
    }
});

module.exports = router;