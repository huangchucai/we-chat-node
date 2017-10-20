/**
 * Created by Z7 on 2017/10/19.
 */
const Koa = require('koa');
const sha1 = require('sha1');
const path = require('path');
const util = require('./lib/util')
const wechat_file = path.join(__dirname, './config/wechat.txt');
const wechat = require('./we-chat/g')
const config = {
  wechat: {
    appID: 'wx4ca7b1cbfbf9c3c7',
    appsecret: 'c3bdea770631b1ddd83d1659f2c20939',
    token: 'huangchucaiyangxiaoxxxx',
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file,data)
    }
  }
}

const app = new Koa();
app.use(wechat(config.wechat))
app.listen(1234)
console.log('LISTENING:  1234')