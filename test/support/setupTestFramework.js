require('babel-register')({
  presets: ['es2015', 'es2016', 'react-native'],
  ignore: /node_modules\/(?!react-native)/,
})
require('react-native-mock/mock')

const jsdom = require('jsdom')
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}

propagateToGlobal(global.window)

const chai = require('chai')

global.expect = chai.expect
