const sha1 = require('sha1');
const Wechat = require('./wechat');
const util = require('./util');
const getRawBody = require('raw-body')

// http://sunnyhuang.free.ngrok.cc/
module.exports = function (opt) {
  const wechat = new Wechat(opt);

  return function *(next) {
    // console.log(this.query)
    const token = opt.token;
    const signature = this.query.signature;
    const nonce = this.query.nonce;
    const timestamp = this.query.timestamp;
    const echostr = this.query.echostr;

    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);
    if (this.method === 'GET') {
      if (sha === signature) {
        //来源于微信
        this.body = echostr + ''
      } else {
        this.body = 'wrong'
      }
    } else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong';
        return false
      }
      //  获取微信服务器发送的数据
      const data = yield getRawBody(this.req, {
        length: this.req.headers['content-length'],
        limit: '1mb',
        encoding: this.charset
      })
      const content = yield util.parseXMLAsync(data)
      const message = util.formatMessage(content.xml)
      console.log(message)
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          const now = new Date().getTime();
          this.status = 200;
          this.type = 'application/xml';
          this.body =
            `<xml>
               <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
               <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
               <CreateTime>${now}</CreateTime>
               <MsgType><![CDATA[text]]></MsgType>
               <Content><![CDATA[Hi, This is huangchucai]]></Content>
            </xml>`
          return
        }
      }
    }
  }
}
