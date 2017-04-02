# React Native HTMLView
A component which takes HTML content and renders it as native views, with
customisable style and handling of links, etc.

In action (from [ReactNativeHackerNews](https://github.com/jsdf/ReactNativeHackerNews)):

![React Native Hacker News Comments](http://i.imgur.com/FYOgBYc.png)

## Table of contents
- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Changelog](#changelog)

### Install
```
npm install react-native-htmlview --save
```

### Usage

props:

- `value`: a string of HTML content to render
- `onLinkPress`: a function which will be called with a url when a link is pressed.
  Passing this prop will override how links are handled (defaults to calling `Linking.openURL(url)`)
- `stylesheet`: a stylesheet object keyed by tag name, which will override the
  styles applied to those respective tags.
- `renderNode`: a custom function to render HTML nodes however you see fit. If
  the function returns `undefined` (not `null`), the default renderer will be
  used for that node. The function takes the following arguments:
  - `node` the html node as parsed by [htmlparser2](https://github.com/fb55/htmlparser2)
  - `index` position of the node in parent node's children
  - `siblings` parent node's children (including current node)
  - `parent` parent node
  - `defaultRenderer` the default rendering implementation, so you can use the normal rendering logic for some subtree. `defaultRenderer` takes the following arguments:
    - `node` the node to render with the default rendering logic
    - `parent` the parent of node of `node`

### Example

```js
import React from 'react';
import HTMLView from 'react-native-htmlview';

class App extends React.Component {
  render() {
    const htmlContent = `<p><a href="http://jsdf.co">&hearts; nice job!</a></p>`;

    return (
      <HTMLView
        value={htmlContent}
        stylesheet={styles}
      />
    );
  }
}

var styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
})
```

### Custom Link Handling

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


 If you're getting the error "undefined is not an object (evaluating 'RCTLinkingManager.openURL’)” from the LinkingIOS API, try adding ‘RCTLinking' to the project's 'Linked Frameworks and Libraries’. You might have to find RCTLinking.xcodeproj in the react-native package dir and drag that into your main Xcode project first.

### Custom Element Rendering

You can implement the `renderNode` prop to add support for unsupported element
types,  or override the rendering for supported types.

For example, here is how you might implement the `<iframe>` element:

```js
function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name == 'iframe') {
    const a = node.attribs;
    const iframeHtml = `<iframe src="${a.src}"></iframe>`;
    return (
      <View key={index} style={{width: Number(a.width), height: Number(a.height)}}>
        <WebView source={{html: iframeHtml}} />
      </View>
    );
  }
}

const htmlContent = `
  <div>
    <iframe src="http://info.cern.ch/" width="360" height="300" />
  </div>
`;

class App extends React.Component {
  render() {
    return (
      <HTMLView value={htmlContent} renderNode={renderNode} />
    );
  }
}
```

### Changelog

- 0.9.0
  - exposed `styles` prop
  - exposed `defaultRenderer` in `renderNode` (@brandonreavis, @koenpunt)
  - added `addLineBreaks` (@jmacedoit)
- 0.7.0 - fixed for recent versions of react-native
- 0.6.0 - onLinkPress fix (@damusnet), headers now only have one single line break (@crysfel)
- 0.5.0 - react-native 0.25 compat (@damusnet)
- 0.4.0 - re-renders properly when html content changes
