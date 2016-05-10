# React Native HTMLView
A component which takes HTML content and renders it as native views, with 
customisable style and handling of links, etc.

### usage

props:

- `value`: a string of HTML content to render
- `onLinkPress`: a function which will be called with a url when a link is pressed.
  Passing this prop will override how links are handled (defaults to calling `Linking.openURL(url)`)
- `stylesheet`: a stylesheet object keyed by tag name, which will override the 
  styles applied to those respective tags.
- `renderNode`: a custom function to render HTML nodes however you see fit. If 
  the function returns `undefined` (not `null`), the default renderer will be 
  used for that node.

Note: see the [troubleshooting](#troubleshooting) section below if you're having problems with links not working.

### example

```js
var React = require('react')
var ReactNative = require('react-native')
var {Text, View, ListView} = ReactNative

var HTMLView = require('react-native-htmlview')

var App = React.createClass({
  render() {
    var htmlContent = '<p><a href="http://jsdf.co">&hearts; nice job!</a></p>'

    return (
      <HTMLView
        value={htmlContent}
        stylesheet={styles}
      />
    )
  }
})

var styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
})
```

When a link is clicked, by default `ReactNative.Linking.openURL` is called with the 
link url. You can customise what happens when a link is clicked with `onLinkPress`:

```js
var React = require('react')
var ReactNative = require('react-native')

var ContentView = React.createClass({
  render() {
    return (
      <HTMLView
        value={this.props.html}
        onLinkPress={(url) => console.log('clicked link: ', url)}
      />
    )
  }
})
```

### screenshot

In action (from [ReactNativeHackerNews](https://github.com/jsdf/ReactNativeHackerNews)):

![React Native Hacker News Comments](http://i.imgur.com/FYOgBYc.png)

### troubleshooting

 If you're getting the error "undefined is not an object (evaluating 'RCTLinkingManager.openURL’)” from the LinkingIOS API, try adding ‘RCTLinking' to the project's 'Linked Frameworks and Libraries’. You might have to find RCTLinking.xcodeproj in the react-native package dir and drag that into your main Xcode project first.


### changelog

- 0.4.0 - re-renders properly when html content changes
