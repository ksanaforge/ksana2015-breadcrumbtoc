var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;

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
	,onSelect:function(e) {
		domnode=e.target.parentElement;
		var idx=-1;
		while (domnode) {
			if (domnode.classList.contains("open")) domnode.classList.remove("open");
			if (domnode.dataset && domnode.dataset.idx) idx=parseInt(domnode.dataset.idx);
			domnode=domnode.parentElement;
		}
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
		var style={cursor:"pointer"};
		if (this.props.selected==idx) style.background="highlight"
		item.hit&&(hit=E("span",{style:{color:"red"},className:"pull-right"},item.hit));
		var t=this.renderKeyword(item.t);
		return E("li",{key:idx,"data-idx":idx},E("a",{style:style,onClick:this.onSelect},t,hit));
	}
	,blur:function(e){
		e.target.parentElement.classList.remove("open");
	}
	,open:function(e){
		e.target.parentElement.classList.add("open");
		e.target.nextSibling.focus();
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		var title=item.t;

		item.hit&&(title=[E("span",{key:1},item.t),E("span",{key:2,className:"hl0 pull-right"},item.hit||"")]);
		return E("span",{className:"dropdown"},
				E("button",{key:"drop","data-toggle":"dropdown",className:this.props.buttonClass||"btn btn-default",
					onClick:this.open}, this.props.items[this.props.selected].t ),
				this.props.separator,
				E("ul",{className:"dropdown-menu open",id:"for_shutting_warning_up"
					,onBlur:this.blur
					,noCaret:true,title:this.renderKeyword(title)},
			this.props.items.map(this.renderItem)));
	}
});
module.exports=BreadCrumbDropdown;