const express = require('express');
const translate = require('google-translate-api');
const googleTranslate = require('free-google-translation');
const fs = require('fs');
const path = require('path');

const router = express.Router();


/**
 *  https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
 *
 * // Default, make directories relative to current working directory.
 * mkDirByPathSync('path/to/dir');
 *
 * // Make directories relative to the current script.
 * mkDirByPathSync('path/to/dir', {isRelativeToScript: true});
 *
 * // Make directories with an absolute path.
 * mkDirByPathSync('/path/to/dir');
 */
function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
            console.log(`Directory ${curDir} created!`);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }

            console.log(`Directory ${curDir} already exists!`);
        }

        return curDir;
    }, initDir);
}

/**
 * TODO: move to seperte file or consider moment js
 */
function ddmmyyyy(dateIn) {
   var yyyy = dateIn.getFullYear();
   var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
   var dd  = dateIn.getDate();
   return String(dd + '-' + mm + '-' + yyyy);
}


//Return the translated text
//URL structure: http://localhost:4000?sourceLanguage=en&targetLanguage=ne&text=I Love You
router.get('/', function(request, response, next) {

    if (typeof request.query.sourceLanguage !== 'undefined' && request.query.sourceLanguage !== null &&
        typeof request.query.targetLanguage !== 'undefined' && request.query.targetLanguage !== null &&
        typeof request.query.text !== 'undefined' && request.query.text !== null
    ) {
        let logTranslation;

        translate(request.query.text, {from: request.query.sourceLanguage, to: request.query.targetLanguage}).then(res => {
            console.log(res.text);
            //=> I love nepal
            console.log(res.from.language.iso);       
    
            response.status(200);
            response.send({
                translateText: res.text
            });

            // Logging Process
                // TODO: 
                   // Move to separate file
                   // Add Remote Host IP

            logTranslation = 'Source Language: ' + request.query.sourceLanguage + '\n' +
                                 'Target Language:' + request.query.targetLanguage + '\n' +
                                 'Source Text: ' + request.query.text + '\n' +
                                 'Translated Text: ' + res.text + '\n\n\n';

            console.log('Host Name', request.headers.host);
            console.log(logTranslation);

            let translationDirectory = 'logs/googleTranslate/' + request.headers.host + '/';
            mkDirByPathSync(translationDirectory);
            
            let today = new Date();
            let formattedDate = ddmmyyyy(today);
            let translationFile = formattedDate + '.txt';

            // #writeFile #appendFile
            fs.appendFile(translationDirectory + translationFile, logTranslation, (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('Logged to a file!');
            });
        }).catch(err => {
            console.error(err);
            response.status(404);
            response.send({
                translateText: 'The request couldn\'t be translated'
            });

            //@TODO Log here
        });
    } else {
        response.status(400);
        response.send({
            translateText: 'Invalid Request!'
        });

        //@TODO Log here
    }
});

module.exports = router;