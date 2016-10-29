var React=require("react");
var ReactDOM=require("react-dom");
var E=React.createElement;
var PT=React.PropTypes;

var BreadCrumbDropdownMUI=React.createClass({
	propTypes:{
		items:PT.array.isRequired
		,selected:PT.number
		,onSelect:PT.func
		,level:PT.number.isRequired //which level
		,keyword:PT.string
	}
	,getInitialState:function(){
		return {opened:false};
	}
	,componentWillReceiveProps:function(){
		this.setState({opened:false});
	}
	,getDefaultProp:function(){
		return {items:[]}
	}
	,close:function(){
		this.setState({opened:false});
	}
	,closeOther:function(cb){
		this.props.closeOther(cb);
	}
	,onSelect:function(e) {
		this.setState({opened:false});
		const domnode=e.target.parentElement;
		if (domnode.dataset && domnode.dataset.idx) idx=parseInt(domnode.dataset.idx);
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
		return E("li",{key:idx,"data-idx":idx},
			E("a",{style:style,onClick:this.onSelect},t,hit));
	}
	,open:function(e){
		this.closeOther(function(){
			this.setState({opened:true});	
		}.bind(this));
		
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		if (!item)return E("span");
		var title=this.renderKeyword(item.t);

//		item.hit&&(title=[E("span",{key:1},item.t),E("span",{key:2,className:"hl0 pull-right"},item.hit||"")]);
		var dropdownbuttonclass=this.props.buttonClass;

		this.props.buttonClass
		const menuEl=(this.state.opened)?
			E("ul",{className:"mui-dropdown__menu mui--is-open"
				,onMouseLeave:this.close
				,id:"for_shutting_warning_up",title:title},
			this.props.items.map(this.renderItem)):E("div");

		//trim 
		var label=this.props.items[this.props.selected].t;
		if (this.props.depth+(this.props.untrimDepth||1)
			<this.props.maxDepth && (label.length>5 ||label.match(/[ 　]/))) {
			const m=label.match(/(.*)[ 　]/);
			if (m) {
				label=m[1];	
			} else {
				label=label.substring(0,5);
			}
		}
		return E("span",{className:"mui-dropdown"},
				E("button",{key:"drop","data-toggle":"dropdown",
					className:dropdownbuttonclass,
					style:this.state.opened?this.props.activeButtonStyle:this.props.buttonStyle,
					onMouseEnter:this.open}, this.renderKeyword(label) ),
				this.props.separator,menuEl);
				
	}
});
module.exports=BreadCrumbDropdownMUI;