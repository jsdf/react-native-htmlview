import React from 'react';
import {StyleSheet, Text} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

import AutoSizedImage from './AutoSizedImage';

const defaultOpts = {
  lineBreak: '\n',
  paragraphBreak: '\n\n',
  bullet: '\u2022 ',
  TextComponent: Text,
  textComponentProps: null,
  NodeComponent: Text,
  nodeComponentProps: null,
};

const Img = props => {
  const width =
    parseInt(props.attribs['width'], 10) || parseInt(props.attribs['data-width'], 10) || 0;
  const height =
    parseInt(props.attribs['height'], 10) ||
    parseInt(props.attribs['data-height'], 10) ||
    0;

  const imgStyle = {
    width,
    height,
  };

  const source = {
    uri: props.attribs.src,
    width,
    height,
  };
  return <AutoSizedImage source={source} style={imgStyle} />;
};

export default function htmlToElement(rawHtml, customOpts = {}, done) {
  const opts = {
    ...defaultOpts,
    ...customOpts,
  };

  function inheritedStyle(parent) {
    if (!parent) return null;
    const style = StyleSheet.flatten(opts.styles[parent.name]) || {};
    const parentStyle = inheritedStyle(parent.parent) || {};
    return {...parentStyle, ...style};
  }

  function domToElement(dom, parent) {
    if (!dom) return null;

    const renderNode = opts.customRenderer;
    let orderedListCounter = 1;

    return dom.map((node, index, list) => {
      if (renderNode) {
        const rendered = renderNode(
          node,
          index,
          list,
          parent,
          domToElement
        );
        if (rendered || rendered === null) return rendered;
      }

      const {TextComponent} = opts;

      if (node.type === 'text') {
        const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
        const customStyle = inheritedStyle(parent);

        return (
          <TextComponent
            {...opts.textComponentProps}
            key={index}
            style={[defaultStyle, customStyle]}
          >
            {entities.decodeHTML(node.data)}
          </TextComponent>
        );
      }

      if (node.type === 'tag') {
        if (node.name === 'img') {
          return <Img key={index} attribs={node.attribs} />;
        }

        let linkPressHandler = null;
        let linkLongPressHandler = null;
        if (node.name === 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () =>
            opts.linkHandler(entities.decodeHTML(node.attribs.href));
          if (opts.linkLongPressHandler) {
            linkLongPressHandler = () =>
              opts.linkLongPressHandler(entities.decodeHTML(node.attribs.href));
          }
        }

        let linebreakBefore = null;
        let linebreakAfter = null;
        if (opts.addLineBreaks) {
          switch (node.name) {
          case 'pre':
            linebreakBefore = opts.lineBreak;
            break;
          case 'p':
            if (index < list.length - 1) {
              linebreakAfter = opts.paragraphBreak;
            }
            break;
          case 'br':
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
            linebreakAfter = opts.lineBreak;
            break;
          }
        }

        let listItemPrefix = null;
        if (node.name === 'li') {
          const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
          const customStyle = inheritedStyle(parent);

          if(!parent){
            listItemPrefix = null;
          } else if (parent.name === 'ol') {
            listItemPrefix = (<TextComponent style={[defaultStyle, customStyle]}>
              {`${orderedListCounter++}. `}
            </TextComponent>);
          } else if (parent.name === 'ul') {
            listItemPrefix = (<TextComponent style={[defaultStyle, customStyle]}>
              {opts.bullet}
            </TextComponent>);
          }
          if (opts.addLineBreaks && index < list.length - 1) {
            linebreakAfter = opts.lineBreak;
          }
        }

        const {NodeComponent, styles} = opts;

        return (
          <NodeComponent
            {...opts.nodeComponentProps}
            key={index}
            onPress={linkPressHandler}
            style={!node.parent ? styles[node.name] : null}
            onLongPress={linkLongPressHandler}
          >
            {linebreakBefore}
            {listItemPrefix}
            {domToElement(node.children, node)}
            {linebreakAfter}
          </NodeComponent>
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
