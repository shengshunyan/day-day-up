const childProcess = require("child_process");
const execCmd = function (cmd, cb) {
  childProcess.exec(cmd, (error, stdout) => {
    if (!error) {
      cb(stdout);
    } else {
      console.log("err=", error);
    }
  });
};

// config
const originIp = "43.139.50.150"; // new
// const originIp = '129.204.110.90' // old
const publicPath = "/opt/application/blog";
const cmdArr = [
  `ssh root@${originIp} 'rm -rf ${publicPath}; mkdir ${publicPath}'`,
  `scp -r ./public/* root@${originIp}:${publicPath}`,
];
const cmd = cmdArr.join(";");

execCmd(cmd, (stdout) => {
  console.log("部署完成", stdout);
});
