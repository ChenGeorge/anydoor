const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');

const server = http.createServer((req,res)=>{
   const filePath = path.join(conf.root,req.url);
   console.log('path:',`${chalk.blue(conf.root)}`);
   console.log('filePath:',`${chalk.blue(filePath)}`);
   route(req,res,filePath);
    
})

server.listen(conf.port,()=>{
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
    // console.info(`Server started at ${addr}`);
});
