var React = require.requireActual('react')

var ReactNative = Object.assign({}, React, {
  ListView: jest.genMockFromModule('./View'),
  View: jest.genMockFromModule('./View'),
  Text: jest.genMockFromModule('./View'),
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
  Linking: {
    openURL: jest.fn(),
  },
  Dimensions: {
    get: function() {
      return {width: 414, height: 736}
    },
  },
})

module.exports = ReactNative
