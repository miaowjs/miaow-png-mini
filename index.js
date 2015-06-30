// 参考 https://github.com/imagemin/imagemin-pngquant/blob/master/index.js
var isPng = require('is-png');
var pngquant = require('pngquant-bin');
var mutil = require('miaow-util');
var spawn = require('child_process').spawn;

var pkg = require('./package.json');

function minify(option, cb) {

  if (!isPng(this.contents)) {
    return cb();
  }

  var args = ['-'];
  var ret = [];
  var len = 0;
  var err = '';

  if (option.floyd) {
    args.push('--floyd', option.floyd);
  }

  if (option.nofs) {
    args.push('--nofs');
  }

  if (option.posterize) {
    args.push('--posterize', option.posterize);
  }

  if (option.quality) {
    args.push('--quality', option.quality);
  }

  if (option.speed) {
    args.push('--speed', option.speed);
  }

  if (option.verbose) {
    args.push('--verbose');
  }

  var cp = spawn(pngquant, args);

  cp.stderr.setEncoding('utf8');
  cp.stderr.on('data', function (data) {
    err += data;
  });

  cp.stdout.on('data', function (data) {
    ret.push(data);
    len += data.length;
  });

  cp.on('error', function (err) {
    return cb(new mutil.PluginError(pkg.name, err, {
      fileName: this.srcPath
    }));
  }.bind(this));

  cp.on('close', function () {
    if (err) {
      return cb(new mutil.PluginError(pkg.name, err, {
        fileName: this.srcPath
      }));
    }

    if (len < this.contents.length) {
      this.contents = Buffer.concat(ret, len);
    }

    cb();
  }.bind(this));

  cp.stdin.on('error', function (stdinErr) {
    if (!err) {
      err = stdinErr;
    }
  });

  cp.stdin.end(this.contents);
}

module.exports = minify;
