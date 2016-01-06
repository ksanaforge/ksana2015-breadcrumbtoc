var React=require("react-native");
var E=React.createElement;
var PT=React.PropTypes;

var Dropdown = require('react-native-dropdown-android');
var View=React.View;

var BreadCrumbDropdown=React.createClass({
	propTypes:{
		items:PT.array.isRequired
		,selected:PT.number
		,onSelect:PT.func
		,level:PT.number.isRequired //which level
		,keyword:PT.string
	}
	,getDefaultProps:function(){
		return {items:[],selected:0,itemPerRow:3};
	}
	,onSelect:function(opt) {
		this.props.onSelect&&this.props.onSelect(opt.selected,this.props.items,this.props.level);
	}
	,itemHeight:function(){
		var {width,height}=React.Dimensions.get('window');
		if (height>width) {
			return Math.floor(width/this.props.itemPerRow)-5;
		} else {
			var ratio=width/height;
			return Math.floor(width/this.props.itemPerRow*ratio)-5;
		}
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		if (!item)return E(View);
		var title=item.t;

		var values=this.props.items.map(function(item){return item.t});

		return E(Dropdown,{values:values, selected:this.props.selected,style:{ height: 20, width: this.itemHeight()},onChange:this.onSelect});
	}
});
module.exports=BreadCrumbDropdown;