var React,Dropdown,View;
var pc=function(){
	React=require("react");	
	Dropdown=require("./dropdown_bs");
	View="span"; 
}

try {
	React=require("react-native");
	Dropdown=require("./dropdown");//dropdown.android.js or dropdown.ios.js
	View=React.View;
	if (!View) pc();
} catch(e) {
	pc();
}


var E=React.createElement;
var PT=React.PropTypes;
var buildToc = function(toc) {
	if (!toc || !toc.length || toc.built) return;
	var depths=[];
 	var prev=0;
 	for (var i=0;i<toc.length;i++) delete toc[i].n;
	for (var i=0;i<toc.length;i++) {
	    var depth=toc[i].d||toc[i].depth;
	    if (prev>depth) { //link to prev sibling
	      if (depths[depth]) toc[depths[depth]].n = i;
	      for (var j=depth;j<prev;j++) depths[j]=0;
	    }
    	depths[depth]=i;
    	prev=depth;
	}
	toc.built=true;
	return toc;
}
var getChildren = function(toc,n) {
	if (!toc[n]||!toc[n+1] ||toc[n+1].d!==toc[n].d+1) return [];
	var out=[],next=n+1;
	while (next) {
		out.push(next);
		if (!toc[next+1])break;
		if (toc[next].d==toc[next+1].d) {
			next++;
		} else if (toc[next].n){
			next=toc[next].n;			
		} else {
			next=0;
		}
	}
	return out;
}
var BreadcrumbTOC=React.createClass({
	propTypes:{
		toc:PT.array.isRequired
		,hits:PT.array
		,onSelect:PT.func
		,vpos:PT.number  //jump with vpos
		,keyword:PT.string
		,treenodeHits:PT.func
		,buttonClass:PT.string
		,separator:PT.node
	}
	,componentWillReceiveProps:function(nextProps,nextState) {
		if (nextProps.toc && !nextProps.toc.built) {
			buildToc(nextProps.toc);
		}
		if (nextProps.hits!==this.props.hits) {
			this.clearHits();
		}
	}
	,componentWillMount:function(){
		buildToc(this.props.toc);
	}
	,getInitialState:function(){
		return {};
	}
	,clearHits:function() {
		for (var i=0;i<this.props.toc;i++) {
			if (this.props.toc[i].hit) delete this.props.toc[i].hit;
		}
	}
	,onSelect:function(idx,children,level) {
		this.props.onSelect && this.props.onSelect(idx, children[idx].vpos+1);//don't know why???
	}
	,closestItem:function(tocitems,vpos) {
		for (i=1;i<tocitems.length;i++) {
			if (this.props.toc[tocitems[i]].vpos>=vpos) return i-1;
		}
		return tocitems.length-1;
	}
	,renderCrumbs:function() {
		
		var cur=0,toc=this.props.toc,out=[],level=0;
		var children=getChildren(toc,cur),nextchildren;
		do {
			var selected = this.closestItem(children,this.props.vpos) ;
			cur=children[selected];

			var items=children.map(function(child){
				var hit=toc[child].hit;
				if (this.props.hits && isNaN(hit) && this.props.treenodeHits) {
					hit=this.props.treenodeHits( toc,this.props.hits,child);
				}
				return {t:toc[child].t,idx:child,hit:hit,vpos:toc[child].vpos};

			}.bind(this));

			nextchildren=getChildren(toc,cur);

			out.push(
				E(View,{key:out.length},
					E(Dropdown,{onSelect:this.onSelect,level:level,
					separator:nextchildren.length?this.props.separator:null,//last separator is not shown
					buttonClass:this.props.buttonClass,
					selected:selected,items:items,keyword:this.props.keyword})
				)
			); 
			//if (out.length>5) break;
			level++;
			if (!nextchildren.length) break;
			children=nextchildren;
		} while (true);
		return out;
	}
	,render:function(){
		if (View==="span") {
			return E(View,null,this.renderCrumbs());
		} else {

			return E(View,{flex:1,flexDirection:'row',flexWrap:'wrap'},this.renderCrumbs());
		}
	}
})
module.exports=BreadcrumbTOC;