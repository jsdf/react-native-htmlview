var React = require('react-native')
var TestUtils = require('react-addons-test-utils')
var HTMLView = require('../HTMLView')
jest.setMock('../htmlToElement', jest.fn())
var htmlToElement = require('../htmlToElement')

describe('HTMLView', () => {
  it('renders the html', () => {
    var htmlContent = '<p><a href="http://jsdf.co">&hearts; nice job!</a></p>'

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
    expect(second.props.children[0].type).toBe(React.Text)
  })
})
