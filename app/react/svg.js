
var sz = 1;
var Msg = React.createClass({
  render: function() {
    return (
      <div>{this.props.data.mouse.x.toFixed(2)},{this.props.data.mouse.y.toFixed(2)}</div>
    );
  }
});
var Mouse = React.createClass({
  render: function() {
    var x, y;
    if (this.props.corner == 'lt'){
      x = this.props.data.x - sz;
      y = this.props.data.y - sz;
    }
    if (this.props.corner == 'rb'){
      x = this.props.data.x + sz;
      y = this.props.data.y + sz;
    }
    return (
      <rect x={x} y={y} height={2*sz} width={2*sz} />
    );
  }
});

var Handle = React.createClass({
  getInitialState: function() {
    return {
      x: this.props.data.x,
      y: this.props.data.y
    };
  },
  render: function() {
    return (
      <rect id="handle" x={this.state.x}  y={this.state.y} height={sz} width= {sz} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} />
    );
  }
});

var Ellipse = React.createClass({
  onSelect: function(e){
    console.log("select");
  },
  render: function() {
    return (
      <ellipse cx={this.props.data.cx}  cy={this.props.data.cy} rx={this.props.data.rx} ry= {this.props.data.ry} onClick={this.onSelect} />
    );
  }
});

var SvgCanvas = React.createClass({
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
      <svg id='svg' width="400px" height="400px" viewBox="0 0 100 100" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} >
      <g id="canvas" transform="matrix(1 0 0 -1 0 100)">
        <rect x='0' y='0' height='100' width='100' className='border' />
        <Handle data={this.props.data.handles[0]}/>
        <Mouse data={this.props.data.mouse} corner='lt' />
        <Mouse data={this.props.data.mouse} corner='rb'/>
        <Ellipse data={this.props.data.ellipse}/>
      </g>
      </svg>
    );
  }
});

var SvgAttrs = React.createClass({
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
      <div>
        <input type="number" min="5" max="180" step="1" value={this.state.data.cx} name="cx" onChange={this.handleChange} />
      </div>
    );
  }
});

var Svg = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  onChange: function(data2) {
    this.setState({data: React.addons.update(data, {
      ellipse: {$set: data2}
    })});
  },
  onMouseChange(pt){
    var mouse = {x:pt.x, y:pt.y};
    this.setState({data: React.addons.update(data, {
      mouse: {$set: mouse}
    })});
    console.log("mouse down2:"+mouse);
  },
  render: function() {
    return (
      <div>
        <SvgCanvas data={this.state.data} onMouseChange={this.onMouseChange} />
        <SvgAttrs data={this.state.data.ellipse} onChange={this.onChange} />
        <Msg data={this.state.data} />
      </div>
    );
  }
});
