const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      fs.createReadStream(filePath).pipe(res);
      // console.log('11', fs.createReadStream(filePath).pipe(res));
      // console.log('22', fs.createReadStream(filePath));
      // console.log(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      //  res.end(files.join(','));
      const dir = path.relative(config.root, filePath);//某个文件的相对路径
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',//从根目录开始
        files:files.map(file=>{
          return{
            file,
            icon:mime(file)
          }
        })
      };
      res.end(template(data));
    }
  } catch (error) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file!---error:${error}`);
  }
}