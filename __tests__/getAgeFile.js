const fs = require("fs");
const path = require("path");
const moment = require("moment");

let fl = path.join(__dirname, "files", path.basename(__filename, ".js") + ".txt");
fs.writeFileSync(fl, moment(new Date()).toString());
/*
fs.stat(fl, (err, stats) => {
  if (err) {
    throw err;
  }

  //console.log(stats);
  console.log(`File Created: ${stats.birthtime}`);
  console.log(`File Last Modified: ${stats.atime}`);
  console.log(`File Last Modified: ${stats.mtime}`, "Data");
  console.log(`File Last Modified: ${stats.ctime}`, "Status");
});
*/
let stats = fs.statSync(fl);
console.log(stats);
