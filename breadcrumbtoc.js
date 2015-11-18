var React=require("react");
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
		,theme:PT.object
		,onSelect:PT.func
		,vpos:PT.number  //jump with vpos
		,keyword:PT.string
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
	,getDefaultProps:function() {
		return {theme:{}};
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
		var dropdown=this.props.theme.dropdown;
		var cur=0,toc=this.props.toc,out=[],level=0;
		do {
			var children=getChildren(toc,cur);
			if (!children.length) break;

			var selected = this.closestItem(children,this.props.vpos) ;
			cur=children[selected];
			var items=children.map(function(child){
				return {t:toc[child].t,idx:child,hit:toc[child].hit,vpos:toc[child].vpos};
			});
			out.push(E(dropdown,{onSelect:this.onSelect,level:level,
				key:out.length,selected:selected,items:items,keyword:this.props.keyword}) );
			//if (out.length>5) break;
			level++;
		} while (true);
		return out;
	}
	,render:function(){
		var container=this.props.theme.container || "div";
		return E(container,null,this.renderCrumbs());
	}
})
module.exports=BreadcrumbTOC;