import React from 'react';

import renderer from 'react-test-renderer';

import {StyleSheet, Text} from 'react-native';

import HTMLView from '../HTMLView';

describe('<HTMLView/>', () => {
  it('should render a <Text/> element', () => {
    const htmlContent = '<p><a href="http://jsdf.co">&hearts nice job!</a></p>';

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render text in a (nested) <Text/> element', () => {
    const htmlContent = 'This is some text';

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render ul bullets', () => {
    const htmlContent = '<ul><li> a </li><li> b </li></ul>';

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render ol numbers', () => {
    const htmlContent = '<ol><li> a </li><li> b </li></ol>';

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should handle additional text nodes between list items', () => {
    const htmlContent = `<ol>
      <li> a </li>
      <li> b </li>
    </ol>`;

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render an <Image />, with default width/height of 1', () => {
    const imgSrc =
      'https://facebook.github.io/react-native/img/header_logo.png';
    const htmlContent = `<img src="${imgSrc}"/>`;

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render an <Image /> with set width/height', () => {
    const imgSrc =
      'https://facebook.github.io/react-native/img/header_logo.png';
    const htmlContent = `<img src="${imgSrc}" width="66" height="58"/>`;

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should render inherited styles correctly', () => {
    const htmlContent = '<b>RED<u>BLUE<i>GREEN</i></u></b>';
    const stylesheet = StyleSheet.create({
      b: {color: 'red'},
      u: {color: 'blue'},
      i: {color: 'green'},
    });

    expect(
      renderer
        .create(<HTMLView value={htmlContent} stylesheet={stylesheet} />)
        .toJSON()
    ).toMatchSnapshot();
  });

  it('should render shoddy html including headings, links, bold, italic', () => {
    const htmlContent = `
      <div class="comment">
        <span class="c00">
          <h2>&gt; Dwayne’s only companion at night was a Labrador retriever named Sparky.</h2>
        <p>
        <i>Sparky could not wag his tail-because of an automobile accident many years ago, so he had no way of telling other dogs how friendly he was.
        He opened the door of the cage, something Bill couldn’t have done in a thousand years. Bill flew over to a windowsill.
        <b>The undippable flag was a beauty, and the anthem and the vacant motto might not have mattered much, if it weren’t for this: a lot of citizens were so ignored and cheated and insulted that they thought they might be in the wrong country, or even on the wrong planet, that some terrible mistake had been made.
        </p>
        <p>
          [1] <a href="https://code.facebook.com/posts/1505962329687926/flow-a-new-static-type-checker-for-javascript/" rel="nofollow">https://code.facebook.com/posts/1505962329687926/flow-a-new-...</a>
        </p>
      </span>
    </div>
    `;

    expect(
      renderer.create(<HTMLView value={htmlContent} />).toJSON()
    ).toMatchSnapshot();
  });

  it('should not render extra linebreaks if configured not to', () => {
    const htmlContent = `
      <div>
          <h2>Dwayne’s only companion at night was a Labrador retriever named Sparky.</h2>
        <p>
        Sparky could not wag his tail-because of an automobile accident many years ago, so he had no way of telling other dogs how friendly he was.<br>
        He opened the door of the cage, something Bill couldn’t have done in a thousand years. Bill flew over to a windowsill.
        </p>
      </div>
    `;

    expect(
      renderer
        .create(<HTMLView value={htmlContent} addLineBreaks={false} />)
        .toJSON()
    ).toMatchSnapshot();
  });

  it('should not render extra linebreaks in list items if configured not to', () => {
    const htmlContent = '<ul><li> a </li><li> b </li></ul>';

    expect(
      renderer
        .create(<HTMLView value={htmlContent} addLineBreaks={false} />)
        .toJSON()
    ).toMatchSnapshot();
  });

  it('can use a custom renderer', () => {
    const htmlContent = `
      <div>
        <thing a="b" />
    </div>
    `;

    function renderNode(node, index) {
      if (node.name == 'thing') {
        return <Text key={index}>{node.attribs.b}</Text>;
      }
    }

    expect(
      renderer
        .create(<HTMLView value={htmlContent} renderNode={renderNode} />)
        .toJSON()
    ).toMatchSnapshot();
  });

  it('can use a custom node class', () => {
    class Node extends React.Component {
      render() {
        return <Text {...this.props} selectable={false} />;
      }
    }

    const htmlContent = `
      <div>
        <div a="b" />
      </div>
    `;

    expect(
      renderer
        .create(<HTMLView value={htmlContent} NodeComponent={Node} />)
        .toJSON()
    ).toMatchSnapshot();
  });

  it('can use custom node props', () => {
    const htmlContent = `
      <div>
        <div a="b" />
      </div>
    `;

    expect(
      renderer
        .create(
          <HTMLView
            value={htmlContent}
            nodeComponentProps={{selectable: false}}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
