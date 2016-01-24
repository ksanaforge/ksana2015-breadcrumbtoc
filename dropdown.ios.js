var React=require("react-native");
var E=React.createElement;
var PT=React.PropTypes;


var {
	Modal,
	Text,
	TouchableHighlight ,
	View,
	ListView,
	Dimensions
}=React;
var win=Dimensions.get('window');
var Popup=React.createClass({
	dismiss:function(){
		this.props.onClose();
	}
	,getDefaultProps:function() {
		return {items:[]};
	}
	,getInitialState: function() {
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  return {
	    dataSource: ds.cloneWithRows( this.props.items),
	  };
	}
	,press:function(selected){
		this.props.onClose();
		this.props.onSelect(selected,this.props.items,this.props.level);
	}
	,renderRow:function(item,unknown,idx){
		idx=parseInt(idx);
		var style={padding:3,fontSize:20};
		if (idx===this.props.selected) style=styles.selected;
		return E(View,{style:{padding:3}},
			E(TouchableHighlight,{underlayColor:'silver',
				onPress:this.press.bind(this,idx) },
			 E(Text,{style:style},item.t))
			,E(View,{style:styles.seperator})
		);
	}
	,render :function() {
		styles.popup.left=this.props.x;
		styles.popup.top=this.props.y;
		return (
			E(Modal,{transparent:true},
				E(TouchableHighlight,{onPress:this.dismiss}
					,E(View,{style:styles.dismissArea})),
				E(View,{style:styles.popup},
					E(ListView,{dataSource:this.state.dataSource,
					renderRow:this.renderRow})
				)
			)
		);
	}
})
var BreadCrumbDropdown=React.createClass({
	propTypes:{
		items:PT.array.isRequired
		,selected:PT.number
		,onSelect:PT.func
		,level:PT.number.isRequired //which level
		,keyword:PT.string
	}
	,popupX:0
	,popupY:0
	,getInitialState:function(){
		return {popup:false};
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
	,renderOptions:function(option,idx) {
		return E(Option,{key:idx},option);
	}
	,select:function(){
		this.setState({popup:true});
	}
	,closePopup:function(){
		this.setState({popup:false});
	}
	,renderPopup:function(){
		if (this.state.popup) {
			return E(Popup,{level:this.props.level,
				onSelect:this.props.onSelect,
				selected:this.props.selected,
				x:this.popupX,y:this.popupY,
				onClose:this.closePopup,items:this.props.items});
		}
	}
	,componentDidMount:function() {
		if (!this.refs.me)return;
		setTimeout(function(){
			if(this.refs.me) this.refs.me.measure(function(ox,oy,width,height,px,py){
				if (px+styles.popup.width>win.width) {
					px=win.width-styles.popup.width;
				}
				this.popupX=px;
				this.popupY=py+height;
			}.bind(this));
		}.bind(this),10);
	}
	,render:function(){
		var item=this.props.items[this.props.selected];
		if (!item) return E(View,{ref:"me"});
		var style=JSON.parse(JSON.stringify(styles.link));
		if (this.state.popup) style.color='black';

		var t=item.t;
		if (this.props.level+1<this.props.total && t.length>7) t=t.substr(0,6)+'...';
		return (
			E(View,{ref:"me"},
				this.renderPopup(),

			 	E(TouchableHighlight,{onPress:this.select,
			 		activeOpacity:0.5,underlayColor:'white'}
					,E(Text,{key:'text',style:style},(this.props.level?this.props.separator:"")+t))
			)
		);

	}
});

var styles={
	link:{color:'#007AFF',fontSize:20},
	selected:{backgroundColor:'#70AAFF',padding:3,fontSize:20},
	popup:{padding:5,borderRadius:5,borderColor:'silver',shadowOpacity:0.5,
	borderWidth:1,height:280,top:70,width:280,left:20,backgroundColor:'white'},
	dismissArea:{position:'absolute',width:1000,height:1000},
	seperator:{height:1,backgroundColor:'silver'}
}

module.exports=BreadCrumbDropdown;