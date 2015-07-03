var assert = require('assert');
var fs = require('fs-extra');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-png-mini', function () {
  this.timeout(10e3);

  var log;

  var cwd = path.resolve(__dirname, './fixtures');
  var output = path.resolve(__dirname, './output');

  function doCompile(cb) {
    miaow.compile({
      cwd: cwd,
      output: output,
      pack: false,
      module: {
        tasks: [
          {
            test: /\.png$/,
            plugins: [{
              plugin: parse,
              option: {
                plugin: parse,
                option: {quality: '65-80', speed: 4}
              }
            }]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        throw err;
      }

      log = JSON.parse(fs.readFileSync(path.join(output, 'miaow.log.json')));
      cb();
    });
  }

  before(function (done) {
    fs.emptyDirSync(output);
    doCompile(done);
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('压缩', function () {
    var stat = fs.statSync(path.join(output, 'bar.png'));
    assert.equal(stat.size, 1027);
  });

  it('缓存', function (done) {
    var filePath = path.join(output, 'bar.png');
    fs.writeFileSync(filePath, '/* load cache */');

    doCompile(function () {
      assert.equal(fs.readFileSync(filePath, {encoding: 'utf8'}), '/* load cache */');
      done();
    });
  });
});
