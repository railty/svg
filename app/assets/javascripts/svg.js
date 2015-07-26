var sz = 20;
var Handle = React.createClass({displayName: "Handle",
  getInitialState: function() {
    return {
      x: this.props.data.x,
      y: this.props.data.y
    };
  },
  render: function() {
    return (
      React.createElement("rect", {id: "handle", x: this.state.x, y: this.state.y, height: sz, width: sz, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove})
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
    console.log("11,"+this.handleSelected);
    this.state.data.handles.forEach(function(handle){
      if ((pt.x > handle.x) && (pt.y > handle.y) && (pt.x < handle.x+sz) && (pt.y < handle.y+sz)){
        this.handleSelected = true;
        console.log("selected,"+this.handleSelected);
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
    console.log(this.bMouseDown+","+this.handleSelected);
    if (this.bMouseDown){
      var pt = this.getXY(e);
      console.log(pt);
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
    console.log(this.props.data);
    return (
      React.createElement("svg", {id: "svg", width: "400px", height: "400px", viewBox: "0 0 100 100", onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove}, 
      React.createElement("g", {id: "canvas", transform: "matrix(1 0 0 -1 0 100)"}, 
        React.createElement("rect", {x: "0", y: "0", height: "100", width: "100", className: "border"}), 
        React.createElement(Handle, {data: this.props.data.handles[0]}), 
        React.createElement(Ellipse, {data: this.props.data.ellipse})
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
  onChange: function(data2) {
    this.setState({data: React.addons.update(data, {
      ellipse: {$set: data2}
    })});
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(SvgCanvas, {data: this.state.data}), 
        React.createElement(SvgAttrs, {data: this.state.data.ellipse, onChange: this.onChange})
      )
    );
  }
});
