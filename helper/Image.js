var React = require('react-native')
var {
  Image,
  Dimensions,
} = React

var {width} = Dimensions.get('window')

var baseStyle = {
  backgroundColor: 'transparent',
}
var ResizableImage = React.createClass({
  getInitialState: function() {
    return {
      width: this.props.style.width || 0,
      height: this.props.style.height || 0,
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
      var ratio = this.state.height / this.state.width
      finalSize.height = this.state.height * ratio
    }
    var style = Object.assign(baseStyle, this.props.style, this.state, finalSize)
    var source = Object.assign({}, this.props.source, this.state)
    return (
      <Image
        style={style}
        source={source} />
    )
  },
})

module.exports = ResizableImage
