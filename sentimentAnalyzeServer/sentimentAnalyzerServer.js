const express = require('express');
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let apikey = process.env.API_KEY;
    let apiUrl = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: apikey,
        }),
        serviceUrl: apiUrl,
    });

    return naturalLanguageUnderstanding;


}

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
            },
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });

    return res.send({ "happy": "90", "sad": "10" });
});

app.get("/url/sentiment", (req, res) => {
    return res.send("url sentiment for " + req.query.url);
});

app.get("/text/emotion", (req, res) => {
    const nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
            },
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            res.send(analysisResults);
        })
        .catch(err => {
            res.status(500).json(err);
        });

});

app.get("/text/sentiment", (req, res) => {
    return res.send("text sentiment for " + req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

