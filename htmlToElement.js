var React = require('react');
var ReactNative = require('react-native');
var htmlparser = require('htmlparser2-without-node-native');
var entities = require('entities');

var {
  Text,
} = ReactNative;

var Img = require('./Img');

var LINE_BREAK = '\n';
var BULLET = '\u2022 ';

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null;

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        var rendered = opts.customRenderer(node, index, list);
        if (rendered || rendered === null) return rendered;
      }


      if (node.type == 'text') {
        return (
          <Text key={index} style={parent ? opts.styles[parent.name] : null}>
            {entities.decodeHTML(node.data)}
          </Text>
        );
      }

      if (node.type == 'tag') {
        if (node.name == 'img') {
          var imgWidth = Number(node.attribs['width']) || Number(node.attribs['data-width']) || 0;
          var imgHeight = Number(node.attribs['height']) || Number(node.attribs['data-height']) || 0;

          var imgStyle = {
            width: imgWidth,
            height: imgHeight,
          };
          var source = {
            uri: node.attribs.src,
            width: imgWidth,
            height: imgHeight,
          };
          return (
            <Img key={index} source={source} style={imgStyle} />
          );
        }

        var linkPressHandler = null;
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        return (
          <Text key={index} onPress={linkPressHandler}>
            {node.name == 'pre' ? LINE_BREAK : null}
            {node.name == 'li' ? BULLET : null}
            {domToElement(node.children, node)}
            {node.name == 'br' || node.name == 'li' ? LINE_BREAK : null}
            {node.name == 'p' && index < list.length - 1 ? LINE_BREAK + LINE_BREAK : null}
            {node.name == 'h1' || node.name == 'h2' || node.name == 'h3' || node.name == 'h4' || node.name == 'h5' ? LINE_BREAK : null}
          </Text>
        );
      }
    });
  }

  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  var parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}

module.exports = htmlToElement;
