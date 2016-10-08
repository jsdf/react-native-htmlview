require('babel-register')({
  presets: ['es2015', 'es2016', 'react-native'],
  ignore: /node_modules\/(?!react-native)/,
})
require('react-native-mock/mock')

const jsdom = require('jsdom')
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

const chai = require('chai')

global.expect = chai.expect
