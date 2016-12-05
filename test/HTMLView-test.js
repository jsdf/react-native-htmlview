import React from 'react'
import {shallow, mount, ReactWrapper} from 'enzyme'
import {Text, Image} from 'react-native'
import HtmlView from '../HTMLView'

describe('<HTMLView/>', () => {

  function getElementBeneathInitialTextNode(elem) {
    const topLevelText = elem.find(Text)
    return new ReactWrapper(topLevelText.prop('children')[0])
  }

  it('should render an empty <Text/> element, when rendered shallowly', () => {
    const htmlContent = '<p><a href="http://jsdf.co">&hearts nice job!</a></p>'
    const elem = shallow(<HtmlView value={htmlContent}/>)

    expect(elem.prop('children')).to.equal(undefined)
    expect(elem.matchesElement(<Text/>)).to.equal(true)
  })

  it('should render text in a (nested) <Text/> element', () => {
    const htmlContent = 'This is some text'
    const elem = mount(<HtmlView value={htmlContent}/>).update()

    const textNode = getElementBeneathInitialTextNode(elem)
    expect(textNode.prop('children')).to.equal('This is some text')
  })

  it('should render an <Image />, with default width/height of 1', () => {
    const imgSrc = 'https://facebook.github.io/react-native/img/header_logo.png'
    const htmlContent = `<img src="${imgSrc}"/>`

    const elem = mount(<HtmlView value={htmlContent}/>).update()

    const resizeableImage = getElementBeneathInitialTextNode(elem)
    const image = resizeableImage.find(Image)

    expect(image.matchesElement(
      <Image source={{uri: imgSrc, width: 1, height: 1}}/>
    )).to.equal(true)
  })

  it('should render an <Image /> with set width/height', () => {
    const imgSrc = 'https://facebook.github.io/react-native/img/header_logo.png'
    const htmlContent = `<img src="${imgSrc}" width="66" height="58"/>`

    const elem = mount(<HtmlView value={htmlContent}/>).update()

    const resizeableImage = getElementBeneathInitialTextNode(elem)
    const image = resizeableImage.find(Image)

    expect(image.matchesElement(
      <Image source={{uri: imgSrc, width: 66, height: 58}}/>
    )).to.equal(true)
  })
})
