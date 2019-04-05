'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='src/AutoSizedImage.js';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var _Dimensions$get=

_reactNative.Dimensions.get('window'),width=_Dimensions$get.width;

var baseStyle={
backgroundColor:'transparent'};var


AutoSizedImage=function(_PureComponent){_inherits(AutoSizedImage,_PureComponent);
function AutoSizedImage(props){_classCallCheck(this,AutoSizedImage);var _this=_possibleConstructorReturn(this,(AutoSizedImage.__proto__||Object.getPrototypeOf(AutoSizedImage)).call(this,
props));
_this.state={


width:_this.props.style.width||1,
height:_this.props.style.height||1};return _this;

}_createClass(AutoSizedImage,[{key:'componentDidMount',value:function componentDidMount()

{var _this2=this;

if(this.props.style.width||this.props.style.height){
return;
}
_reactNative.Image.getSize(this.props.source.uri,function(w,h){
_this2.setState({width:w,height:h});
});
}},{key:'render',value:function render()

{
var finalSize={};
if(this.state.width>width){
finalSize.width=width;
var ratio=width/this.state.width;
finalSize.height=this.state.height*ratio;
}
var style=_extends(
baseStyle,
this.props.style,
this.state,
finalSize);

var source={};
if(!finalSize.width||!finalSize.height){
source=_extends(source,this.props.source,this.state);
}else{
source=_extends(source,this.props.source,finalSize);
}

return _react2.default.createElement(_reactNative.Image,{style:style,source:source,__source:{fileName:_jsxFileName,lineNumber:51}});
}}]);return AutoSizedImage;}(_react.PureComponent);exports.default=AutoSizedImage;
//# sourceMappingURL=AutoSizedImage.js.map