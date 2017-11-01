'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/htmlToElement.js';exports.default=







































htmlToElement;var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _htmlparser2WithoutNodeNative=require('htmlparser2-without-node-native');var _htmlparser2WithoutNodeNative2=_interopRequireDefault(_htmlparser2WithoutNodeNative);var _entities=require('entities');var _entities2=_interopRequireDefault(_entities);var _AutoSizedImage=require('./AutoSizedImage');var _AutoSizedImage2=_interopRequireDefault(_AutoSizedImage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var defaultOpts={lineBreak:'\n',paragraphBreak:'\n\n',bullet:'\u2022 ',TextComponent:_reactNative.Text,textComponentProps:null,NodeComponent:_reactNative.Text,nodeComponentProps:null};var Img=function Img(props){var width=parseInt(props.attribs['width'],10)||parseInt(props.attribs['data-width'],10)||0;var height=parseInt(props.attribs['height'],10)||parseInt(props.attribs['data-height'],10)||0;var imgStyle={width:width,height:height};var source={uri:props.attribs.src,width:width,height:height};return _react2.default.createElement(_AutoSizedImage2.default,{source:source,style:imgStyle,__source:{fileName:_jsxFileName,lineNumber:38}});};function htmlToElement(rawHtml){var customOpts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var done=arguments[2];
var opts=_extends({},
defaultOpts,
customOpts);


function inheritedStyle(parent){
if(!parent)return null;
var style=_reactNative.StyleSheet.flatten(opts.styles[parent.name])||{};
var parentStyle=inheritedStyle(parent.parent)||{};
return _extends({},parentStyle,style);
}

function domToElement(dom,parent){
if(!dom)return null;

var renderNode=opts.customRenderer;
var orderedListCounter=1;

return dom.map(function(node,index,list){
if(renderNode){
var rendered=renderNode(node,index,list,parent,domToElement);
if(rendered||rendered===null)return rendered;
}var

TextComponent=opts.TextComponent;

if(node.type==='text'){
var defaultStyle=opts.textComponentProps?
opts.textComponentProps.style:
null;
var customStyle=inheritedStyle(parent);

return(
_react2.default.createElement(TextComponent,_extends({},
opts.textComponentProps,{
key:index,
style:[defaultStyle,customStyle],__source:{fileName:_jsxFileName,lineNumber:75}}),

_entities2.default.decodeHTML(node.data)));


}

if(node.type==='tag'){
if(node.name==='img'){
return _react2.default.createElement(Img,{key:index,attribs:node.attribs,__source:{fileName:_jsxFileName,lineNumber:87}});
}

var linkPressHandler=null;
var linkLongPressHandler=null;
if(node.name==='a'&&node.attribs&&node.attribs.href){
linkPressHandler=function linkPressHandler(){return(
opts.linkHandler(_entities2.default.decodeHTML(node.attribs.href)));};
if(opts.linkLongPressHandler){
linkLongPressHandler=function linkLongPressHandler(){return(
opts.linkLongPressHandler(_entities2.default.decodeHTML(node.attribs.href)));};
}
}

var linebreakBefore=null;
var linebreakAfter=null;
if(opts.addLineBreaks){
switch(node.name){
case'pre':
linebreakBefore=opts.lineBreak;
break;
case'p':
if(index<list.length-1){
linebreakAfter=opts.paragraphBreak;
}
break;
case'br':
case'h1':
case'h2':
case'h3':
case'h4':
case'h5':
linebreakAfter=opts.lineBreak;
break;}

}

var listItemPrefix=null;
if(node.name==='li'){
var _defaultStyle=opts.textComponentProps?
opts.textComponentProps.style:
null;
var _customStyle=inheritedStyle(parent);

if(parent.name==='ol'){
listItemPrefix=
_react2.default.createElement(TextComponent,{style:[_defaultStyle,_customStyle],__source:{fileName:_jsxFileName,lineNumber:133}},
orderedListCounter++ +'. ');


}else if(parent.name==='ul'){
listItemPrefix=
_react2.default.createElement(TextComponent,{style:[_defaultStyle,_customStyle],__source:{fileName:_jsxFileName,lineNumber:139}},
opts.bullet);


}
if(opts.addLineBreaks&&index<list.length-1){
linebreakAfter=opts.lineBreak;
}
}var

NodeComponent=opts.NodeComponent,styles=opts.styles;

return(
_react2.default.createElement(NodeComponent,_extends({},
opts.nodeComponentProps,{
key:index,
onPress:linkPressHandler,
style:!node.parent?styles[node.name]:null,
onLongPress:linkLongPressHandler,__source:{fileName:_jsxFileName,lineNumber:152}}),

linebreakBefore,
listItemPrefix,
domToElement(node.children,node),
linebreakAfter));


}
});
}

var handler=new _htmlparser2WithoutNodeNative2.default.DomHandler(function(err,dom){
if(err)done(err);
done(null,domToElement(dom));
});
var parser=new _htmlparser2WithoutNodeNative2.default.Parser(handler);
parser.write(rawHtml);
parser.done();
}
//# sourceMappingURL=htmlToElement.js.map