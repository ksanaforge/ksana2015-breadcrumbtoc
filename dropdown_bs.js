var React=require("react/addons");
var E=React.createElement;
var PT=React.PropTypes;

var Button=require("react-bootstrap").Button;
var DropdownButton=require("react-bootstrap").DropdownButton;
var MenuItem=require("react-bootstrap").MenuItem;

var BreadCrumbDropdown=React.createClass({
	mixins:[React.addons.pureRenderMixin]
	,propTypes:{
		items:PT.array.isRequired
		,selected:PT.number
		,onSelect:PT.func
		,level:PT.number.isRequired //which level
	}
	,getDefaultProp:function(){
		return {items:[]}
	}
	,onSelect:function(idx) {
		this.props.onSelect&&this.props.onSelect(idx,this.props.items,this.props.level);
	}
	,renderItem:function(item,idx) {
		var hit=null;
		item.hit&&(hit=E("span",{className:"hl0 pull-right"},item.hit));
		return E(MenuItem,{key:idx,active:this.props.selected==idx,eventKey:idx},item.t,hit);
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		var title=item.t;
		item.hit&&(title=[item.t,E("span",{className:"hl0 pull-right"},item.hit||"")]);
		return E(DropdownButton,{onSelect:this.onSelect,noCaret:true,title:title},
			this.props.items.map(this.renderItem));
	}
});
module.exports=BreadCrumbDropdown;