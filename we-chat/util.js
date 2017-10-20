/**
 * Created by Z7 on 2017/10/20.
 */
const xml2js = require('xml2js');
const Promise = require('bluebird');

// 测试
// var xml = "<root>Hello xml2js!</root>"
// xml2js.parseString(xml, function (err, result) {
//   console.dir(result);
// });

exports.parseXMLAsync = function(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, content) => {
      if(err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage(result) {
  const message = {};
  if(typeof result === 'object') {
    const keys = Object.keys(result);
    keys.forEach((key) => {
      const value = result[key]
      if(!Array.isArray( value ) || value.length === 0 )  {
        return message[key] = value;
      }
      else {
        if( value.length === 1) {
          if(typeof value[0] === 'object') {
            message[key] = formatMessage(value[0])
          } else {
            message[key] = value[0] || ''
          }
        } else {
          message[key] = [];
          value.forEach((item) => {
            message[key].push(formatMessage(item))
          })
        }
      }
    })
  }
  return message
}
exports.formatMessage = formatMessage