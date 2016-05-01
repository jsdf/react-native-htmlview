var React = require('react')
var ReactNative = require('react-native')
var htmlToElement = require('./htmlToElement')
var {
  Linking,
  StyleSheet,
  Text,
} = ReactNative


var HTMLView = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
    stylesheet: React.PropTypes.object,
    onLinkPress: React.PropTypes.func,
    onError: React.PropTypes.func,
    renderNode: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onLinkPress: Linking.openURL,
      onError: console.error.bind(console),
    }
  },

  getInitialState() {
    return {
      element: null,
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  },

  componentDidMount() {
    this.mounted = true
    this.startHtmlRender(this.props.value)
  },

  componentWillUnmount() {
    this.mounted = false
  },

  startHtmlRender(value) {
    if (!value) return this.setState({element: null})

    var opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) return this.props.onError(err)

      if (this.mounted) this.setState({element})
    })
  },

  render() {
    if (this.state.element) {
      return <Text children={this.state.element} />
    }
    return <Text />
  },
})

var boldStyle = {fontWeight: '500'}
var italicStyle = {fontStyle: 'italic'}
var codeStyle = {fontFamily: 'Menlo'}

var baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
})

module.exports = HTMLView
