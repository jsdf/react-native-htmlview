var React = require('react')
var ReactNative = require('react-native')
var htmlparser = require('./vendor/htmlparser2')
var entities = require('./vendor/entities')

var {
  Text,
} = ReactNative


var LINE_BREAK = '\n'
var PARAGRAPH_BREAK = '\n\n'
var BULLET = '\u2022 '

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        var rendered = opts.customRenderer(node, index, list)
        if (rendered || rendered === null) return rendered
      }

      if (node.type === 'text') {
        var data = node.data;
        var textTransformation = opts.styles[parent.name] ? ReactNative.StyleSheet.flatten( opts.styles[parent.name] ).textTransformation : null;
        switch(textTransformation) {
          case 'uppercase':
            data = data.toUpperCase();
            break;
          case 'lowercase':
            data = data.toLowerCase();
            break;
        }
        return (
            <Text key={index} style={parent ? opts.styles[parent.name] : null}>
              {entities.decodeHTML(data)}
          </Text>
        )
      }

      if (node.type === 'tag') {
        var linkPressHandler = null
        if (node.name === 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href))
        }

        return (
          <Text key={index} onPress={linkPressHandler}>
            {node.name === 'pre' ? LINE_BREAK : null}
            {node.name === 'li' ? BULLET : null}
            {domToElement(node.children, node)}
            {node.name === 'br' || node.name === 'li' ? LINE_BREAK : null}
            {node.name === 'p' && index < list.length - 1 ? PARAGRAPH_BREAK : null}
            {node.name === 'h1' || node.name === 'h2' || node.name === 'h3' || node.name === 'h4' || node.name === 'h5' ? LINE_BREAK : null}
          </Text>
        )
      }
    })
  }

  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err)
    done(null, domToElement(dom))
  })
  var parser = new htmlparser.Parser(handler)
  parser.write(rawHtml)
  parser.done()
}

module.exports = htmlToElement
