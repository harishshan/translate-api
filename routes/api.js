const express = require('express');
const translate = require('google-translate-api');
const googleTranslate = require('free-google-translation');

const router = express.Router();

//list the translated text
router.get('/', function(request, response, next) {

    translate(request.query.text, {from: request.query.sourceLanguage, to: request.query.targetLanguage}).then(res => {
        console.log(res.text);
        //=> I love nepal
        console.log(res.from.language.iso);       

        response.send({
            translateText: res.text
        });
    }).catch(err => {
        console.error(err);
    });

    // googleTranslate(request.query.text, request.query.sourceLanguage, request.query.targetLanguage)
    // .then(function(response) {
    //     console.log('Translation Text is : ', response);
    // })
    // .catch(function(error) {
    //     console.error("Failed!", error);
    //     activateSubmitToTranslateLabel();
    //     ajaxLogToFile(sourceText, sourceLanguage, targetLanguage, error);        
    // });
});

//post is for adding
router.post('/', function(request, response, next) {
    // console.log(request.body);
    response.send({
        type: 'POST'

        // sourceLanguage: request.body.sourceLanguage,
        // targetLanguage: request.body.targetLanguage,
        // text: text
    });
});

module.exports = router;