# React Native HTMLView
A component which takes HTML content and renders it as native views, with 
customisable style and handling of links, etc.

### usage

props:

- `value`: a string of HTML content to render
- `onLinkPress`: a function which will be called with a url when a link is pressed.
  Passing this prop will override how links are handled (defaults to calling LinkingIOS.openURL(url))
- `stylesheet`: a stylesheet object keyed by tag name, which will override the 
  styles applied to those respective tags.
- `renderNode`: a custom function to render HTML nodes however you see fit. If 
  the function returns `undefined` (not `null`), the default renderer will be 
  used for that node.

### example

```js
var React = require('react-native')
var {Text, View, ListView} = React

var HTMLView = require('react-native-htmlview')

var ContentView = React.createClass({
  render() {
    return (
      var htmlContent = '<p><a href="">&hearts; nice job!</a></p>'
      <HTMLView
        value={htmlContent}
        onLinkPress={(url) => console.log('navigating to: ', url)}
        stylesheet={styles}
      />
    )
  }
})
```

var styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
})

### screenshot

In action (from [ReactNativeHackerNews](https://github.com/jsdf/ReactNativeHackerNews)):

![React Native Hacker News Comments](http://i.imgur.com/FYOgBYc.png)


![Under Construction](https://jamesfriend.com.au/files/under-construction.gif)

I just wrote this... use at your own risk. Not API stable.
