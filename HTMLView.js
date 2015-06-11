var htmlparser = require('./vendor/htmlparser2')
var entities = require('./vendor/entities')
var React = require('react-native')
var {
  LinkingIOS,
  StyleSheet,
  Text,
} = React

var LINE_BREAK = '\n'
var PARAGRAPH_BREAK = '\n\n'
var BULLET = '  \u2022  '

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        var rendered = opts.customRenderer(node, index, list)
        if (rendered || rendered === null) return rendered
      }

      if (node.type == 'text') {
        return (
          <Text key={index} style={parent ? opts.styles[parent.name] : null}>
            {entities.decodeHTML(node.data)}
          </Text>
        )
      }

      if (node.type == 'tag') {
        var linkPressHandler = null
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href))
        }

        return (
          <Text key={index} onPress={linkPressHandler}>
            {node.name == 'pre' ? LINE_BREAK : null}
            {node.name == 'li' ? BULLET : null}
            {domToElement(node.children, node)}
            {node.name == 'br' ? LINE_BREAK : null}
            {node.name == 'li' ? LINE_BREAK : null}
            {node.name == 'p' && index < list.length-1 ? PARAGRAPH_BREAK : null}
          </Text>
        )
      }
    })
  }

  var handler = new htmlparser.DomHandler(function (err, dom) {
    if (err) done(err)
    done(null, domToElement(dom))
  })
  var parser = new htmlparser.Parser(handler)
  parser.write(rawHtml)
  parser.done()
}

var HTMLView = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
  ],
  getDefaultProps() {
    return {
      onLinkPress: LinkingIOS.openURL,
    }
  },
  getInitialState() {
    return {
      element: null,
    }
  },
  componentWillReceiveProps() {
    if (this.state.element) return
    this.startHtmlRender()
  },
  componentDidMount() {
    this.startHtmlRender()
  },
  startHtmlRender() {
    if (!this.props.value) return
    if (this.renderingHtml) return

    var opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    }

    this.renderingHtml = true
    htmlToElement(this.props.value, opts, (err, element) => {
      this.renderingHtml = false

      if (err) return (this.props.onError || console.error)(err)

      if (this.isMounted()) this.setState({element})
    })
  },
  render() {
    if (this.state.element) {
      return <Text children={this.state.element} />
    }
    return <Text />
  }
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
