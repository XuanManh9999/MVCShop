const app = require(`${__dirname}/../apps/app`);
const config = require("config");
// Kết nối database khi khởi động server
require("../common/database")();

const server = app.listen(port=config.get("app.port"), (req, res)=>{

    console.log(`🚀 Server running on port ${port}`);
});
