const server = require("./src/app");
require("./src/controllers/MongoConnect");
const { PORT } = require("./src/config");

server.listen(PORT, () => console.log(`server in port ${PORT}`));
