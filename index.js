const server = require("./src/app");
require("./src/controllers/MongoConnect");

server.listen(3001, () => console.log("server in port 3001"));
