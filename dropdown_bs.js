var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

var Button=require("react-bootstrap").Button;
var DropdownButton=require("react-bootstrap").DropdownButton;
var MenuItem=require("react-bootstrap").MenuItem;

var BreadCrumbDropdown=React.createClass({
	propTypes:{
		items:PT.array.isRequired
		,selected:PT.number
		,onSelect:PT.func
		,level:PT.number.isRequired //which level
		,keyword:PT.string
	}
	,getDefaultProp:function(){
		return {items:[]}
	}
	,onSelect:function(e,idx) {
		this.props.onSelect&&this.props.onSelect(idx,this.props.items,this.props.level);
	}
	,renderKeyword:function(t) {
		if (this.props.keyword) {
			var o=[],lastidx=0;
			t.replace(new RegExp(this.props.keyword,"g"),function(m,idx){
				o.push(t.substr(lastidx,idx));
				o.push(E("span",{key:idx,style:{color:"red"}},m));
				lastidx=idx+m.length;
			});
			o.push(t.substr(lastidx));
			t=o;
		}
		return t;
	}
	,renderItem:function(item,idx) {
		var hit=null;
		item.hit&&(hit=E("span",{className:"hl0 pull-right"},item.hit));
		var t=this.renderKeyword(item.t);
		return E(MenuItem,{key:idx,active:this.props.selected==idx,eventKey:idx},t,hit);
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		var title=item.t;
		item.hit&&(title=[E("span",{key:1},item.t),E("span",{key:2,className:"hl0 pull-right"},item.hit||"")]);
		return E(DropdownButton,{onSelect:this.onSelect,noCaret:true,title:this.renderKeyword(title)},
			this.props.items.map(this.renderItem));
	}
});
module.exports=BreadCrumbDropdown;