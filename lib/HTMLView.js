'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/HTMLView.js';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);
var _propTypes=require('prop-types');var _propTypes2=_interopRequireDefault(_propTypes);
var _htmlToElement=require('./htmlToElement');var _htmlToElement2=_interopRequireDefault(_htmlToElement);
var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var boldStyle={fontWeight:'500'};
var italicStyle={fontStyle:'italic'};
var underlineStyle={textDecorationLine:'underline'};
var strikethroughStyle={textDecorationLine:'line-through'};
var codeStyle={fontFamily:_reactNative.Platform.OS==='ios'?'Menlo':'monospace'};

var baseStyles=_reactNative.StyleSheet.create({
b:boldStyle,
strong:boldStyle,
i:italicStyle,
em:italicStyle,
u:underlineStyle,
s:strikethroughStyle,
strike:strikethroughStyle,
pre:codeStyle,
code:codeStyle,
a:{
fontWeight:'500',
color:'#007AFF'},

h1:{fontWeight:'500',fontSize:36},
h2:{fontWeight:'500',fontSize:30},
h3:{fontWeight:'500',fontSize:24},
h4:{fontWeight:'500',fontSize:18},
h5:{fontWeight:'500',fontSize:14},
h6:{fontWeight:'500',fontSize:12}});


var htmlToElementOptKeys=[
'lineBreak',
'paragraphBreak',
'bullet',
'TextComponent',
'textComponentProps',
'NodeComponent',
'nodeComponentProps'];var


HtmlView=function(_PureComponent){_inherits(HtmlView,_PureComponent);
function HtmlView(){_classCallCheck(this,HtmlView);var _this=_possibleConstructorReturn(this,(HtmlView.__proto__||Object.getPrototypeOf(HtmlView)).call(this));

_this.state={
element:null};return _this;

}_createClass(HtmlView,[{key:'componentDidMount',value:function componentDidMount()

{
this.mounted=true;
this.startHtmlRender(this.props.value);
}},{key:'componentWillReceiveProps',value:function componentWillReceiveProps(

nextProps){
if(
this.props.value!==nextProps.value||
this.props.stylesheet!==nextProps.stylesheet||
this.props.textComponentProps!==nextProps.textComponentProps)
{
this.startHtmlRender(
nextProps.value,
nextProps.stylesheet,
nextProps.textComponentProps);

}
}},{key:'componentWillUnmount',value:function componentWillUnmount()

{
this.mounted=false;
}},{key:'startHtmlRender',value:function startHtmlRender(

value,style,textComponentProps){var _this2=this;var _props=







this.props,addLineBreaks=_props.addLineBreaks,onLinkPress=_props.onLinkPress,onLinkLongPress=_props.onLinkLongPress,stylesheet=_props.stylesheet,renderNode=_props.renderNode,onError=_props.onError;

if(!value){
this.setState({element:null});
}

var opts={
addLineBreaks:addLineBreaks,
linkHandler:onLinkPress,
linkLongPressHandler:onLinkLongPress,
styles:_extends({},baseStyles,stylesheet,style),
customRenderer:renderNode};


htmlToElementOptKeys.forEach(function(key){
if(typeof _this2.props[key]!=='undefined'){
opts[key]=_this2.props[key];
}
});

if(textComponentProps){
opts.textComponentProps=textComponentProps;
}

(0,_htmlToElement2.default)(value,opts,function(err,element){
if(err){
onError(err);
}

if(_this2.mounted){
_this2.setState({element:element});
}
});
}},{key:'render',value:function render()

{var _props2=
this.props,RootComponent=_props2.RootComponent,style=_props2.style;var
element=this.state.element;
if(element){
return(
_react2.default.createElement(RootComponent,_extends({},this.props.rootComponentProps,{style:style,__source:{fileName:_jsxFileName,lineNumber:123}}),
element));


}
return _react2.default.createElement(RootComponent,_extends({},this.props.rootComponentProps,{style:style,__source:{fileName:_jsxFileName,lineNumber:128}}));
}}]);return HtmlView;}(_react.PureComponent);


HtmlView.propTypes={
addLineBreaks:_propTypes2.default.bool,
bullet:_propTypes2.default.string,
lineBreak:_propTypes2.default.string,
NodeComponent:_propTypes2.default.func,
nodeComponentProps:_propTypes2.default.object,
onError:_propTypes2.default.func,
onLinkPress:_propTypes2.default.func,
onLinkLongPress:_propTypes2.default.func,
paragraphBreak:_propTypes2.default.string,
renderNode:_propTypes2.default.func,
RootComponent:_propTypes2.default.func,
rootComponentProps:_propTypes2.default.object,
style:_reactNative.ViewPropTypes.style,
stylesheet:_propTypes2.default.object,
TextComponent:_propTypes2.default.func,
textComponentProps:_propTypes2.default.object,
value:_propTypes2.default.string};


HtmlView.defaultProps={
addLineBreaks:true,
onLinkPress:function onLinkPress(url){return _reactNative.Linking.openURL(url);},
onLinkLongPress:null,
onError:console.error.bind(console),
RootComponent:function RootComponent(element){return _react2.default.createElement(_reactNative.View,_extends({},element,{__source:{fileName:_jsxFileName,lineNumber:157}}));}};exports.default=


HtmlView;
//# sourceMappingURL=HTMLView.js.map