"use strict";
exports.__esModule = true;
console.log("hello");
var restapi_1 = require("./restapi");
var PORT = 8814;
restapi_1.app.listen(PORT, function () {
    console.log("listening on " + PORT);
});
