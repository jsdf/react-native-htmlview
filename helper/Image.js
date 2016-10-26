var ReactNative = require('react-native')
var React = require('react')
var {
  Image,
  Dimensions,
} = ReactNative

var {width} = Dimensions.get('window')

var baseStyle = {
  backgroundColor: 'transparent',
}
var ResizableImage = React.createClass({
  getInitialState: function() {
    return {
      // set width 1 is for preventing the warning
      // You must specify a width and height for the image %s
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
    }
  },
  componentDidMount: function() {
    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      this.setState({width:w, height:h})
    })
  },
  render: function() {
    var finalSize = {}
    if (this.state.width > width) {
      finalSize.width = width
      var ratio = width / this.state.width
      finalSize.height = this.state.height * ratio
    }
    var style = Object.assign(baseStyle, this.props.style, this.state, finalSize)
    var source = {}
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }

    return (
      <Image
        style={style}
        source={source} />
    )
  },
})

module.exports = ResizableImage
