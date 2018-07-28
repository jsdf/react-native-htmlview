# React Native HTMLView [![Build status](https://api.travis-ci.org/jsdf/react-native-htmlview.svg?branch=master)](https://travis-ci.org/jsdf/react-native-htmlview)
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
- `onLinkLongPress`: a function which will be called with a url when a link is long pressed.
  The default is `null`.
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
- `bullet`: text which is rendered before every `li` inside a `ul`
- `paragraphBreak`: text which appears after every `p` element
- `lineBreak`: text which appears after text elements which create a new line (`br`, headings)
- `addLineBreaks`: when explicitly `false`, effectively sets `paragraphBreak` and `lineBreak` to `null`
- `NodeComponent`, `nodeComponentProps`, `RootComponent`, `rootComponentProps`, `TextComponent`, `textComponentProps`: see [**Customizing things even further**](https://github.com/jsdf/react-native-htmlview#customizing-things-even-further) below.

### Example

```js
import React from 'react';
import {StyleSheet} from 'react-native';
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

const styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});
```

### Custom Link Handling

When a link is clicked, by default `ReactNative.Linking.openURL` is called with the
link url. You can customise what happens when a link is clicked with `onLinkPress`:

```js
class App extends React.Component {
  render() {
    return (
      <HTMLView
        value={this.props.html}
        onLinkPress={(url) => console.log('clicked link: ', url)}
      />
    );
  }
}
```


 If you're getting the error "undefined is not an object (evaluating 'RCTLinkingManager.openURL’)” from the LinkingIOS API, try adding ‘RCTLinking' to the project's 'Linked Frameworks and Libraries’. You might have to find RCTLinking.xcodeproj in the react-native package dir and drag that into your main Xcode project first.

### Custom Element Rendering

You can implement the `renderNode` prop to add support for unsupported element
types,  or override the rendering for supported types. `renderNode` is a function which is called with the type and attributes of each HTML element found in the input HTML, and from this function you can return a React element to be rendered in its place. If you return `null` nothing will be rendered in place of this element or its children. If you return `undefined` (or don't return anything) then HTMLView will drop back to its default rendering for that type of HTML element.

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

Alternatively, this example shows how you could disallow the `<iframe>` element:

```js
function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name == 'iframe') {
    return null;
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

If you want to reuse the default renderer, you need to call it passing an array of nodes. This example shows how to replace a specific HTML tag with something different, but still process the children.
```js
function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name == 'mytag') {
      const specialSyle = node.attribs.style
      return (
        <Text key={index} style={specialSyle}>
          {defaultRenderer(node.children, parent)}
        </Text>
      )
    }
}

const htmlContent = `
  <div>
    <mytag>
      <div>some content processed normally by the engine</div>
    </mytag>
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

For further understanding of the possiblities of the `renderNode` prop, read through [htmlToElement.js](https://github.com/jsdf/react-native-htmlview/blob/master/htmlToElement.js). Particularly look at where `renderNode` is called to see how it can override what sort of React element is created in place of an element in the input HTML.

### Customizing things even further

In addition to supplying a custom `renderNode` function, you can customize what is rendered by the built in `renderNode` function. Read through [htmlToElement.js](https://github.com/jsdf/react-native-htmlview/blob/master/htmlToElement.js) and note the usage of NodeComponent (for rendering HTML element nodes) and TextComponent (for rendering text strings in the HTML). Both of these components can be injected as the `NodeComponent` and `TextComponent` props to HTMLView, or alternatively they can be given extra props by passing an object as the `nodeComponentProps` and `textComponentProps` props. Finally you can also use the props `RootComponent` and `rootComponentProps` to customize the root wrapper `View` element that is rendered by the HTMLView in [HTMLView.js](https://github.com/jsdf/react-native-htmlview/blob/master/HTMLView.js).

### Changelog
- 0.13.0
  - fixed `Failed prop type` error on react-native@0.56 [#228](https://github.com/jsdf/react-native-htmlview/pull/228)
  - added support for `<s>` tag (strikethrough text) [#210](https://github.com/jsdf/react-native-htmlview/pull/210)
  - fix to re-render when `textComponentProps` changes [#188](https://github.com/jsdf/react-native-htmlview/pull/188)
  - fixed line breaks for `<li>` elements [#166](https://github.com/jsdf/react-native-htmlview/pull/166)
  - Thanks to @mdimovska, @alphasp, @waldyrious, @macgregorthomson
- 0.12.1
  - use ViewPropTypes
  - fix an issue with htmlparser2-without-node-native and inline-requires
  - Thanks to @nikolaik and @douglasjunior
- 0.12.0
  - inherited styles are now applied in the correct order
  - fixed an issue where the style array was unnecessarily complex and included multiple empty objects
  - changes to the stylesheet will now trigger a re-render
  - `textAlign` works correctly in most cases
  - fixed an ordered list numbering bug
  - added `onLinkLongPress` property
  - default and custom styles now apply correctly to `<li>` prefix
  - fixed `code` font for Android (monospace)
  - Thanks to @JoeyBetlej, @isilher, @bky, @RobPando
- 0.11.0
  - `style` prop passed via `textComponentProps` is now respected even if no wrapping element is present
  - underline style
  - line break after `li`
  - nested elements (`<b><i>...</i></b>`) work properly
  - use `PureComponent`
  - sundry refactoring
  - Thanks to @michalraska, @tywhang, @isilher, @douglasjunior, @shashkovdanil
- 0.10.0
  - added props: `bullet`, `paragraphBreak`, `lineBreak`, `NodeComponent`, `nodeComponentProps`, `RootComponent`, `rootComponentProps`, `TextComponent`, `textComponentProps`
- 0.9.0
  - exposed `styles` prop
  - exposed `defaultRenderer` in `renderNode` (@brandonreavis, @koenpunt)
  - added `addLineBreaks` (@jmacedoit)
- 0.7.0 - fixed for recent versions of react-native
- 0.6.0 - onLinkPress fix (@damusnet), headers now only have one single line break (@crysfel)
- 0.5.0 - react-native 0.25 compat (@damusnet)
- 0.4.0 - re-renders properly when html content changes
