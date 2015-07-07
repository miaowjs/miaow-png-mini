# miaow-png-mini

> Miaow的PNG压缩工具,对[pngquant-bin](https://www.npmjs.com/package/pngquant-bin)进行了简单的封装

## 使用说明

### 安装

```
npm install miaow-png-mini --save-dev
```

### 在项目的 miaow.config.js 中添加模块的 tasks 设置

```javascript
//miaow.config.js
module: {
  tasks: [
    {
      test: /\.png$/,
      plugins: ['miaow-png-mini']
    }
  ]
}
```

### 参数说明

* 传递的所有参数都是压缩配置, 具体可以参考[pngquant-bin的说明](https://www.npmjs.com/package/pngquant-bin)
