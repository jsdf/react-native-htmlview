import React, {Component, PropTypes} from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
} from 'react-native'

const boldStyle = {fontWeight: '500'}
const italicStyle = {fontStyle: 'italic'}
const codeStyle = {fontFamily: 'Menlo'}
const underlineStyle = {textDecorationLine: 'underline'}
const strikeStyle = {textDecorationLine: 'line-through'}

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  u: underlineStyle,
  strike: strikeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
})

class HtmlView extends Component {
  constructor() {
    super()
    this.state = {
      element: null,
    }
  }

  componentDidMount() {
    this.mounted = true
    this.startHtmlRender(this.props.value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  startHtmlRender(value) {
    if (!value) {
      this.setState({element: null})
    }

    const opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({element})
      }
    })
  }

  render() {
    if (this.state.element) {
      return <Text style={this.props.stylesheet} children={this.state.element} {...this.props} />
    }
    return <Text style={this.props.stylesheet} {...this.props}/>
  }
}

HtmlView.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  stylesheet: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onLinkPress: PropTypes.func,
  onError: PropTypes.func,
  renderNode: PropTypes.func,
}

HtmlView.defaultProps = {
  onLinkPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
}

export default HtmlView
