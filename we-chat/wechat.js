
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const prefix = 'https://api.weixin.qq.com/cgi-bin/token'
const api = {
  accessToken : `${prefix}?grant_type=client_credential`
}

// 获取access_token
function Wechat(opt) {
  this.appID = opt.appID;
  this.appsecret = opt.appsecret;
  this.getAccessToken = opt.getAccessToken;
  this.saveAccessToken = opt.saveAccessToken;

  this.getAccessToken().then((data) => {
    try {
      data = JSON.parse(data);
    } catch(e) {
      return  this.updateAccessToken()
    }
    if(this.isValidAccessToken(data)) {
      return Promise.resolve(data)
    } else {
      return this.updateAccessToken()
    }
  }).then((data) => {
    this.access_token = data.access_token;
    this.expires_in = data.expires_in;

    this.saveAccessToken(data)
  })
}
// 检验是否过期
Wechat.prototype.isValidAccessToken = function(data) {
  if(!data || !data.expires_in || !data.access_token) {
    return false
  }
  const access_token = data.access_token;
  const expires_in = data.expires_in;
  const now = (new Date().getTime())
  if(now < expires_in) {
    return true
  }
  else {
    return false
  }
}

Wechat.prototype.updateAccessToken = function() {
  const appID = this.appID;
  const appsecret = this.appsecret;
  const url = `${api.accessToken}&appid=${appID}&secret=${appsecret}`;
  return new Promise((resolve, reject) => {
    request({url, json: true}).then((response) => {
      // console.log('---- response ----')
      // console.log(response.body)
      const data = response.body;
      const now = (new Date().getTime());
      const expires_in = now + (data.expires_in - 20) * 1000;
      data.expires_in = expires_in;
      resolve(data)
    })
  })
}

module.exports = Wechat