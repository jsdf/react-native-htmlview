import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import htmlToElement from './htmlToElement';
import {Linking, Platform, StyleSheet, View, ViewPropTypes, InteractionManager} from 'react-native';

const boldStyle = {fontWeight: '500'};
const italicStyle = {fontStyle: 'italic'};
const underlineStyle = {textDecorationLine: 'underline'};
const codeStyle = {fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'};

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  u: underlineStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
  h1: {fontWeight: '500', fontSize: 36},
  h2: {fontWeight: '500', fontSize: 30},
  h3: {fontWeight: '500', fontSize: 24},
  h4: {fontWeight: '500', fontSize: 18},
  h5: {fontWeight: '500', fontSize: 14},
  h6: {fontWeight: '500', fontSize: 12},
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
    InteractionManager.runAfterInteractions(() => {
      this.startHtmlRender(this.props.value);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value || this.props.stylesheet !== nextProps.stylesheet) {
      InteractionManager.runAfterInteractions(() => {
        this.startHtmlRender(nextProps.value, nextProps.stylesheet);
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  startHtmlRender(value, style) {
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
  RootComponent: View,
};

export default HtmlView;
