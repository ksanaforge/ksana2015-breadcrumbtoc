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
	,itemWidth:function(){
		var {width,height}=React.Dimensions.get('window');
		var ipr=this.props.itemPerRow;
		if (height<width) ipr=Math.floor(this.props.itemPerRow*(width/height));
		var w=Math.floor(width/ipr);

		if (this.props.total===this.props.n+1 && this.props.total % ipr) {
			var remain=ipr-this.props.total % ipr;
			if (remain) w+=remain*w; 
		}
		return w;
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		if (!item) return E(View);

		var values=this.props.items.map(function(item){return item.t});
		return E(Dropdown,{values:values, selected:this.props.selected,
			style:{height:20, width: this.itemWidth()},onChange:this.onSelect});
	}
});
module.exports=BreadCrumbDropdown;