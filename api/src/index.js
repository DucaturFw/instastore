let express = require('express');
var bodyParser = require("body-parser");

var routes = require("./routes.js");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(3000, () => console.log('Listening on port 3000!'));
