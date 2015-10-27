// 参考 https://github.com/imagemin/imagemin-pngquant/blob/master/index.js
var isPng = require('is-png');
var spawn = require('child_process').spawn;

var pkg = require('./package.json');

module.exports = function(options, callback) {
  var context = this;
  var contents = context.contents;

  if (!isPng(contents)) {
    return callback();
  }

  var args = ['-'];
  var ret = [];
  var len = 0;
  var err = '';

  if (options.floyd) {
    args.push('--floyd', options.floyd);
  }

  if (options.nofs) {
    args.push('--nofs');
  }

  if (options.posterize) {
    args.push('--posterize', options.posterize);
  }

  if (options.quality) {
    args.push('--quality', options.quality);
  }

  if (options.speed) {
    args.push('--speed', options.speed);
  }

  if (options.verbose) {
    args.push('--verbose');
  }

  var cp = spawn('pngquant', args);

  cp.stderr.setEncoding('utf8');
  cp.stderr.on('data', function(data) {
    err += data;
  });

  cp.stdout.on('data', function(data) {
    ret.push(data);
    len += data.length;
  });

  cp.on('error', function(err) {
    return callback(err);
  }.bind(this));

  cp.on('close', function() {
    if (err) {
      return callback(err);
    }

    if (len < contents.length) {
      context.contents = Buffer.concat(ret, len);
    }

    callback();
  }.bind(this));

  cp.stdin.on('error', function(stdinErr) {
    if (!err) {
      err = stdinErr;
    }
  });

  cp.stdin.end(contents);
};

module.exports.toString = function() {
  return [pkg.name, pkg.version].join('@');
};
