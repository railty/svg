
var sz = 1;
var Element = React.createClass({displayName: "Element",
  onClick(e){
    this.props.onSelectRect(e.currentTarget.getBBox());
  },
  render: function() {
    return (
      React.createElement("text", {x: this.props.data.x, y: this.props.data.y, onClick: this.onClick}, this.props.data.text)
    );
  }
});
var Selection = React.createClass({displayName: "Selection",
  render: function() {
    return (
      React.createElement("rect", {id: "selection", x: this.props.data.x, y: this.props.data.y, width: this.props.data.width, height: this.props.data.height})
    );
  }
});
var Msg = React.createClass({displayName: "Msg",
  render: function() {
    return (
      React.createElement("div", null, this.props.data.pt.x.toFixed(2), ",", this.props.data.pt.y.toFixed(2), ",", this.props.data.button)
    );
  }
});
var Mouse = React.createClass({displayName: "Mouse",
  render: function() {
    var x, y;
    if (this.props.corner == 'lt'){
      x = this.props.data.pt.x - sz;
      y = this.props.data.pt.y - sz;
    }
    if (this.props.corner == 'rb'){
      x = this.props.data.pt.x + sz;
      y = this.props.data.pt.y + sz;
    }
    return (
      React.createElement("rect", {x: x, y: y, height: 2*sz, width: 2*sz})
    );
  }
});

var Handle = React.createClass({displayName: "Handle",
  render: function() {
    var x = this.props.data.x - sz;
    var y = this.props.data.y - sz;
    if (this.props.corner=='rb'){
      x = x + this.props.data.width;
      y = y + this.props.data.height;
    }
    if (this.props.corner=='lb'){
      y = y + this.props.data.height;
    }
    if (this.props.corner=='rt'){
      x = x + this.props.data.width;
    }
    return (
      React.createElement("rect", {id: this.props.corner, className: "handle", x: x, y: y, height: sz*2, width: sz*2, onMouseDown: this.props.onMouseDown})
    );
  }
});

var Ellipse = React.createClass({displayName: "Ellipse",
  onSelect: function(e){
    console.log("select");
  },
  render: function() {
    return (
      React.createElement("ellipse", {cx: this.props.data.cx, cy: this.props.data.cy, rx: this.props.data.rx, ry: this.props.data.ry, onClick: this.onSelect})
    );
  }
});

var SvgCanvas = React.createClass({displayName: "SvgCanvas",
  startX: 0,
  startY: 0,
  bMouseDown: false,
  handleSelected: false,
  getXY: function(e){
    var svg = document.getElementById('svg');
    var canvas = document.getElementById('canvas');
    var tm = canvas.getScreenCTM().inverse();

    var pt = svg.createSVGPoint();  // Created once for document
    pt.x = e.clientX;
    pt.y = e.clientY;
    pt = pt.matrixTransform(tm);
    return pt;
  },
  onMouseDown: function(e){
    var pt = this.getXY(e);
    //this.handleSelected = false;
    this.props.onMouseChange(pt);
    this.state.data.handles.forEach(function(handle){
      if ((pt.x > handle.x) && (pt.y > handle.y) && (pt.x < handle.x+sz) && (pt.y < handle.y+sz)){
        this.handleSelected = true;
      }
    });

    this.startX = pt.x;
    this.startY = pt.y;
    this.bMouseDown = true;
  },
  onMouseUp: function(e){
    this.bMouseDown = false;
    this.startX = 0;
    this.startY = 0;
  },
  onMouseMove: function(e){
    //console.log(this.bMouseDown+","+this.handleSelected);
    var pt = this.getXY(e);
    this.props.onMouseChange(pt);
    if (this.bMouseDown){
      var pt = this.getXY(e);
      //console.log(pt);
      var dltX = pt.x - this.startX;
      var dltY = pt.y - this.startY;
      this.startX = pt.x;
      this.startY = pt.y;

      this.setState({data: React.addons.update(data, {
        handles: {$set: [{x:this.state.data.handles[0].x + dltX, y:this.state.data.handles[0].y + dltX}]}
      })});
    }
  },
  getInitialState: function() {
    return {data: this.props.data};
  },
  render: function() {
    //console.log(this.props.data);
    //<g id="canvas" transform="matrix(1 0 0 -1 0 100)">
    return (
      React.createElement("svg", {id: "svg", width: "400px", height: "400px", viewBox: "0 0 100 100", onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove}, 
      React.createElement("g", {id: "canvas", transform: "matrix(1 0 0 1 0 0)"}, 
        React.createElement("rect", {x: "0", y: "0", height: "100", width: "100", className: "border"}), 
        React.createElement(Mouse, {data: this.props.data.mouse, corner: "lt"}), 
        React.createElement(Mouse, {data: this.props.data.mouse, corner: "rb"}), 
        React.createElement(Ellipse, {data: this.props.data.ellipse}), 
        React.createElement(Selection, {data: this.props.data.selection}), 

        ['lt', 'rt', 'lb', 'rb'].map(function(corner) {
          return React.createElement(Handle, {key: corner, corner: corner, data: this.props.data.selection, onMouseDown: this.props.onMouseDown});
        }.bind(this)), 

        this.props.data.elements.map(function(element, i) {
          return React.createElement(Element, {key: i, data: element, onSelectRect: this.props.onSelectRect});
        }.bind(this))
      )
      )
    );
  }
});

var SvgAttrs = React.createClass({displayName: "SvgAttrs",
  getInitialState: function() {
    return {data: this.props.data};
  },
  handleChange: function(event) {
    var cx = parseInt(event.target.value);
    var data = this.state.data;
    data.cx = cx;
    this.setState({data: data});
    this.props.onChange(data);
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {type: "number", min: "5", max: "180", step: "1", value: this.state.data.cx, name: "cx", onChange: this.handleChange})
      )
    );
  }
});

var Svg = React.createClass({displayName: "Svg",
  getInitialState: function() {
    return {data: this.props.data};
  },
  onMouseChange(pt){
    this.setState({data: React.addons.update(this.state.data, {
      mouse: {pt: {$set: pt}}
    })});
  },
  onMouseDown(e){
    var xxx = 1;
    var xx = React.addons.update(this.state.data, {
      mouse: {bt: {$set: xxx}}
    });
    console.log("1111111");
    console.log(this.state.data);
    xx.mouse.pt.x = 1234;
    console.log("222222222");
    console.log(xx);
    this.setState({data: xx}, function(){
      console.log("333333333");
      console.log(this.state.data);
    });
  },
  onSelectRect: function(rc){
    this.setState({data: React.addons.update(this.state.data, {
      selection: {$set: rc}
    })});
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(SvgCanvas, {data: this.state.data, onMouseChange: this.onMouseChange, onSelectRect: this.onSelectRect, onMouseDown: this.onMouseDown}), 
        React.createElement(SvgAttrs, {data: this.state.data.ellipse, onChange: this.onChange}), 
        React.createElement(Msg, {data: this.state.data.mouse})
      )
    );
  }
});
