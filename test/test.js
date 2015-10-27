var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('miaow-png-mini', function () {
  this.timeout(10e3);

  function doCompile(done) {
    miaow({
      context: path.resolve(__dirname, './fixtures')
    }, function(err) {
      if (err) {
        console.error(err.toString(), err.stack);
        process.exit(1);
      }

      done();
    });
  }

  before(doCompile);

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('压缩', function () {
    var stat = fs.statSync(path.join(__dirname, './output', 'bar.png'));
    assert.equal(stat.size, 1027);
  });
});
