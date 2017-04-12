import React from 'react';
import {
  Text,
} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';
import AutoSizedImage from './AutoSizedImage';
import _ from 'lodash/';
import transform from 'css-to-react-native';

const LINE_BREAK = '\n';
const PARAGRAPH_BREAK = '\n\n';
const BULLET = '\u2022 ';

const Img = props => {
  const width = Number(props.attribs['width']) || Number(props.attribs['data-width']) || 0;
  const height = Number(props.attribs['height']) || Number(props.attribs['data-height']) || 0;

  const imgStyle = {
    width,
    height,
  };
  const source = {
    uri: props.attribs.src,
    width,
    height,
  };
  return (
    <AutoSizedImage source={source} style={imgStyle} />
  );
};

export default function htmlToElement(rawHtml, opts, done) {
  function getInheritedStyles(parent) {
    let inlineStyle = {};
    try {
      if (parent.attribs && parent.attribs.hasOwnProperty('style')) {
        const styleString = parent.attribs.style.trim(),
          inlineStyleRules = _.unescape(styleString).split(';').filter(String),
          inlineStyles = inlineStyleRules.map(function(rule) {
            const ruleSet = rule.trim().split(':'),
              propertyName = ruleSet[0];
            if (opts.inlineStyleBlacklist.length > 0 && opts.inlineStyleBlacklist.includes(propertyName)) {
              return null;
            }

            if (opts.inlineStyleWhitelist.length <= 0 || opts.inlineStyleWhitelist.includes(propertyName)) {
              return ruleSet;
            } else {
              return null;
            }
          });

        inlineStyle = transform(inlineStyles, opts.inlineStyleBlacklist);
      }
    } catch (error) {
      //console.error(error)
    }

    const style = [inlineStyle, opts.styles[parent.name] || {}];
    return parent.parent ? _.concat(getInheritedStyles(parent.parent), style) : style;
  }

  function domToElement(dom, parent) {
    if (!dom) return null;

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        const rendered = opts.customRenderer(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      if (node.type == 'text') {
        const inlineStyle = parent ? getInheritedStyles(parent) : null;
        return (
          <Text key={index} style={parent ? getInheritedStyles(parent) : null}>
            {entities.decodeHTML(node.data)}
          </Text>
        );
      }

      if (node.type == 'tag') {
        if (node.name == 'img') {
          return (
            <Img key={index} attribs={node.attribs} />
          );
        }

        let linkPressHandler = null;
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        let linebreakBefore = null;
        let linebreakAfter = null;
        if (opts.addLineBreaks) {
          switch (node.name) {
          case 'pre':
            linebreakBefore = LINE_BREAK;
            break;
          case 'p':
            if (index < list.length - 1) {
              linebreakAfter = PARAGRAPH_BREAK;
            }
            break;
          case 'br':
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
            linebreakAfter = LINE_BREAK;
            break;
          }
        }

        let listItemPrefix = null;
        if (node.name == 'li') {
          if (parent.name == 'ol') {
            listItemPrefix = `${index + 1}. `;
          } else if (parent.name == 'ul') {
            listItemPrefix = BULLET;
          }
        }

        return (
          <Text key={index} onPress={linkPressHandler}>
            {linebreakBefore}
            {listItemPrefix}
            {domToElement(node.children, node)}
            {linebreakAfter}
          </Text>
        );
      }
    });
  }

  const handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}
