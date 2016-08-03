var React = require('react')
var ReactNative = require('react-native')
var TestUtils = require('react-addons-test-utils')
var HTMLView = require('../HTMLView')
jest.setMock('../htmlToElement', jest.fn())
var htmlToElement = require('../htmlToElement')

describe('HTMLView', () => {
  it('renders the html', () => {
    var htmlContent = '<p><a href="http://jsdf.co">&hearts nice job!</a></p>'

    htmlToElement.mockImplementation((value, opts, callback) => {
      callback(null, <Text />)
    })

    var shallowRenderer = TestUtils.createRenderer()

    shallowRenderer.render(
      <HTMLView
        value={htmlContent}
      />
    )

    var first = shallowRenderer.getRenderOutput()
    expect(first.props.children).toEqual(undefined)

    shallowRenderer._instance._instance.componentDidMount()

    var second = shallowRenderer.getRenderOutput()
    expect(second.props.children[0].type).toBe(ReactNative.Text)
  })
  it('renders the img', () => {
    var htmlContent = '<img src="https://facebook.github.io/react-native/img/header_logo.png"/>'

    var shallowRenderer = TestUtils.createRenderer()

    shallowRenderer.render(
      <HTMLView
        value={htmlContent}
      />
    )
    shallowRenderer._instance._instance.componentDidMount()

    var second = shallowRenderer.getRenderOutput()
    expect(second.props.children.length).toBe(1)
    expect(second.props.children[0].props.style.width).toBe(0)
    expect(second.props.children[0].props.style.height).toBe(0)
  })
  it('renders the img with width and height', () => {
    var htmlContent = '<img src="https://facebook.github.io/react-native/img/header_logo.png" width="66" height="58"/>'

    var shallowRenderer = TestUtils.createRenderer()

    shallowRenderer.render(
      <HTMLView
        value={htmlContent}
      />
    )
    shallowRenderer._instance._instance.componentDidMount()

    var second = shallowRenderer.getRenderOutput()
    expect(second.props.children[0].props.style.width).toBe(66)
    expect(second.props.children[0].props.style.height).toBe(58)
  })
})
