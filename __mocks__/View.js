var React = require.requireActual('react')

var View = React.createClass({
  render() {
    return this.props.children
  },
})

module.exports = View
