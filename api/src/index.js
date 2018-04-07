let express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes.js');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    next();
});

routes(app);

app.listen(3000, () => console.log('Listening on port 3000!'));
