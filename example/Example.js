import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import HTMLView from '../';

function renderNode(node, index) {
  if (node.name == 'iframe') {
    return (
      <View key={index} style={{width: 200, height: 200}}>
        <Text>{node.attribs.src}</Text>
      </View>
    );
  }
}

const htmlContent = `
  <div class="comment">
    <span class="c00">
      <b><i>&gt; Dwayne’s only companion at night was a Labrador retriever named Sparky.</i></b>
    <p>
    <i>Sparky could not wag his tail-because of an automobile accident many years ago, so he had no way of telling other dogs how friendly he was.
    He opened the door of the cage, something Bill couldn’t have done in a thousand years. Bill flew over to a windowsill.
    <b>The undippable flag was a beauty, and the anthem and the vacant motto might not have mattered much, if it weren’t for this: a lot of citizens were so ignored and cheated and insulted that they thought they might be in the wrong country, or even on the wrong planet, that some terrible mistake had been made.
    </p>
    <p>
      [1] <a href="https://code.facebook.com/posts/1505962329687926/flow-a-new-static-type-checker-for-javascript/" rel="nofollow">https://code.facebook.com/posts/1505962329687926/flow-a-new-...</a>
    </p>
    <img src="https://i.redd.it/1l01wjsv22my.jpg" width="400" height="400" />

    <h1>Dwayne’s only companion at night</h1>
    <h2>Dwayne’s only companion at night</h2>
    <h3>Dwayne’s only companion at night</h3>
    <h4>Dwayne’s only companion at night</h4>
    <h5>Dwayne’s only companion at night</h5>
    <h6>Dwayne’s only companion at night</h6>
    ayyy

    <iframe src="google.com" />
  </span>
</div>
`;

export default class App extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <HTMLView value={htmlContent} renderNode={renderNode} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
