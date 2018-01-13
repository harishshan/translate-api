Translation API
===============

Receive a Get Request with Text, Source Language and Target Language. Then, make a FREE Translation request to google to translate text into target language. The translation text is then returned as a response.

## Installation
1. Clone the Repo
2. npm install
3. npm start: This start nodemon wich monitors any change to the file on localhost:4000

## Requesting on local:
`http://localhost:4000/?sourceLanguage=en&targetLanguage=ne&text=I%20Love%20You`

Response:
`{
  "translateText": "म तिमीलाई माया गर्छु"
}`

## Live request:
'http://translateapi.howtofixthis.com/?sourceLanguage=en&targetLanguage=ta&text=Tranlsation%20is%20the%20best'

Response:
`{
  "translateText": "म तिमीलाई माया गर्छु"
}`

## Consuming on Client end
`
let freeTranslateThirdParty = function(sourceText, sourceLanguage, targetLanguage) {
    return new Promise(function(resolve, reject) {
        let encodedUrl = encodeURI('http://translateapi.howtofixthis.com/?sourceLanguage=' + sourceLanguage + '&targetLanguage=' + targetLanguage + '&text=' + sourceText);

        // Do the usual XHR stuff
        let request = new XMLHttpRequest();
        request.open('GET', encodedUrl);

        request.onreadystatechange = function() {
            // This is called even on 404 etc
            // so check the status
            if (request.status == 200) {
                let json = JSON.parse(request.response);

                resolve(json.translateText);
            } else {
                reject('Rejected !' + request.status);
            }
        };

        // Handle network errors
        request.onerror = function() {
          reject(Error('Network Error'));
        };

        // Make the request
        request.send();
    });
}

freeTranslateThirdParty(sourceText, sourceLanguage, targetLanguage)
.then(function(response) { //For 200
    console.log('Translation ', response);        
})
.catch(function(error) { //For any other
    console.error('Failed -', error);     
});

`