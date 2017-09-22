import React from 'react';
import {StyleSheet, Text, Dimensions, View} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

import AutoSizedImage from './AutoSizedImage';
import colors from '../../app/style/color.style';

const defaultOpts = {
  lineBreak: '\n',
  paragraphBreak: '\n',
  bullet: '\u2022 ',
  TextComponent: Text,
  textComponentProps: null,
  NodeComponent: Text,
  nodeComponentProps: null,
};

const Img = props => {
  let widthAtt =
    parseInt(props.attribs['width'], 10) || parseInt(props.attribs['data-width'], 10) || 0;
  const height =
    parseInt(props.attribs['height'], 10) ||
    parseInt(props.attribs['data-height'], 10) ||
    0;

  const { width } = Dimensions.get('window');
  const resizeMode = null;

  if (!widthAtt) {
    widthAtt = (width - 20);
    resizeMode: 'contain'
  }

  const imgStyle = {
    width: widthAtt,
    maxWidth: (width - 20),
    height: height || 200,
    resizeMode
  };

  const source = {
    uri: props.attribs.src,
    width: widthAtt,
    height,
  };

  if (props.attribs.src) {
    return <AutoSizedImage source={source} style={imgStyle} />;
  } else {
    return <Text>-</Text>
  }
};

export default function htmlToElement(rawHtml, customOpts = {}, done) {
  const opts = {
    ...defaultOpts,
    ...customOpts,
  };

  function cleanLink(link) {
    if (link) {
      if (link.startsWith("'") || link.startsWith('"') || link.startsWith('”')) {
        link = link.slice(1);
      }
      if (link.endsWith("'") || link.endsWith('"') || link.endsWith('”')) {
        link = link.slice(0, link.length - 1);
      }
    }
    return link;
  }

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
        const isParentCaption = parent && parent.name === 'figcaption';
        const isParentBlockquote = parent && parent.parent && parent.parent.name === 'blockquote';

        let specialStyle = null;
        if (isParentBlockquote) {
          specialStyle = inheritedStyle({name: 'bloquoteItem'});
        }

        return (
          <TextComponent
            {...opts.textComponentProps}
            key={index}
            style={[defaultStyle, customStyle, specialStyle]}
          >
            {entities.decodeHTML(isParentCaption ? (node.data && node.data.toUpperCase()) : node.data)}
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
          const link = cleanLink(entities.decodeHTML(node.attribs.href));
          linkPressHandler = () =>
            opts.linkHandler(link);
          if (opts.linkLongPressHandler) {
            linkLongPressHandler = () =>
              opts.linkLongPressHandler(link);
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
          case 'h6':
          case 'div':
          case 'figure':
            linebreakAfter = opts.lineBreak;
            break;
          }
        }

        let listItemPrefix = null;
        if (node.name === 'li') {
          const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
          const customStyle = inheritedStyle(parent);

          if (parent.name === 'ol') {
            listItemPrefix = (<TextComponent style={[defaultStyle, customStyle]}>
              {`${orderedListCounter++}. `}
            </TextComponent>);
          } else if (parent.name === 'ul') {
            listItemPrefix = (<TextComponent style={[defaultStyle, customStyle]}>
              {/* <View style={inheritedStyle({name: 'bullet'})} /> */}
              <TextComponent style={inheritedStyle({name: 'bullet'})}>{opts.bullet}</TextComponent>
            </TextComponent>);
          }
          linebreakAfter = opts.lineBreak;
        }

        let specialStyle = null;
        if (node.name === 'blockquote') {
          // listItemPrefix = <View style={inheritedStyle({name: 'bloquoteItem'})} />
          specialStyle = inheritedStyle({name: 'bloquoteItem'});
        }

        const {NodeComponent, styles} = opts;

        return (
          <NodeComponent
            {...opts.nodeComponentProps}
            key={index}
            onPress={linkPressHandler}
            style={[
              !node.parent ? styles[node.name] : null,
              specialStyle
            ]}
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
