import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import htmlToElement from './htmlToElement';
import {Linking, Platform, StyleSheet, View, ViewPropTypes} from 'react-native';

const boldStyle = {fontWeight: 'bold'};
const italicStyle = {fontStyle: 'italic'};
const underlineStyle = {textDecorationLine: 'underline'};
const strikethroughStyle = {textDecorationLine: 'line-through'};
const codeStyle = {fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'};

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  u: underlineStyle,
  s: strikethroughStyle,
  strike: strikethroughStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  h1: {fontWeight: 'bold', fontSize: 36},
  h2: {fontWeight: 'bold', fontSize: 30},
  h3: {fontWeight: 'bold', fontSize: 24},
  h4: {fontWeight: 'bold', fontSize: 18},
  h5: {fontWeight: 'bold', fontSize: 14},
  h6: {fontWeight: 'bold', fontSize: 12},
});

const htmlToElementOptKeys = [
  'lineBreak',
  'paragraphBreak',
  'bullet',
  'TextComponent',
  'textComponentProps',
  'NodeComponent',
  'nodeComponentProps',
];

class HtmlView extends PureComponent {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.startHtmlRender(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value || this.props.stylesheet !== prevProps.stylesheet || this.props.textComponentProps !== prevProps.textComponentProps || this.props.nodeComponentProps !== prevProps.nodeComponentProps) {
      this.startHtmlRender(this.props.value, this.props.stylesheet, this.props.textComponentProps, this.props.nodeComponentProps);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  startHtmlRender(value, style, textComponentProps, nodeComponentProps) {
    const {
      addLineBreaks,
      onLinkPress,
      onLinkLongPress,
      stylesheet,
      renderNode,
      onError,
    } = this.props;

    if (!value) {
      this.setState({element: null});
    }

    const opts = {
      addLineBreaks,
      linkHandler: onLinkPress,
      linkLongPressHandler: onLinkLongPress,
      styles: {...baseStyles, ...stylesheet, ...style},
      customRenderer: renderNode,
    };

    htmlToElementOptKeys.forEach(key => {
      if (typeof this.props[key] !== 'undefined') {
        opts[key] = this.props[key];
      }
    });

    if (textComponentProps) {
      opts.textComponentProps = textComponentProps;
    }

    if (nodeComponentProps) {
      opts.nodeComponentProps = nodeComponentProps;
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        onError(err);
      }

      if (this.mounted) {
        this.setState({element});
      }
    });
  }

  render() {
    const {RootComponent, style} = this.props;
    const {element} = this.state;
    if (element) {
      return (
        <RootComponent
          {...this.props.rootComponentProps}
          style={style}
        >
          {element}
        </RootComponent>
      );
    }
    return (
      <RootComponent
        {...this.props.rootComponentProps}
        style={style}
      />
    );
  }
}

HtmlView.propTypes = {
  addLineBreaks: PropTypes.bool,
  bullet: PropTypes.string,
  lineBreak: PropTypes.string,
  NodeComponent: PropTypes.func,
  nodeComponentProps: PropTypes.object,
  onError: PropTypes.func,
  onLinkPress: PropTypes.func,
  onLinkLongPress: PropTypes.func,
  paragraphBreak: PropTypes.string,
  renderNode: PropTypes.func,
  RootComponent: PropTypes.func,
  rootComponentProps: PropTypes.object,
  style: ViewPropTypes.style,
  stylesheet: PropTypes.object,
  TextComponent: PropTypes.func,
  textComponentProps: PropTypes.object,
  value: PropTypes.string,
};

HtmlView.defaultProps = {
  addLineBreaks: true,
  onLinkPress: url => Linking.openURL(url),
  onLinkLongPress: null,
  onError: console.error.bind(console),
  RootComponent: element => <View {...element} />, // eslint-disable-line react/display-name
};

export default HtmlView;
