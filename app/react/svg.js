
"use strict";
var sz = 1.5;

var TBox = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      bbox: null
    };
  },
  componentDidMount: function(){
    console.log("mount");
    var t = React.findDOMNode(this).getElementsByTagName("text")[0];
    var bbox = t.getBBox();
    this.setState({bbox: bbox});

    console.log(t.getBBox());
    console.log(t.getExtentOfChar(1));
    console.log(t.getExtentOfChar(2));
    console.log(t.getExtentOfChar(3));
    console.log(t.getExtentOfChar(4));
    console.log(t.getExtentOfChar(5));
    console.log(t.getExtentOfChar(6));
  },
  render: function() {
    var x = this.props.data.x + this.props.data.width / 2;
    var y = this.props.data.y + this.props.data.height / 2;
    var rx = 1;
    var ry = 1;
    if (this.state.bbox != null) {
      rx = this.props.data.width / this.state.bbox.width;
      ry = this.props.data.height / this.state.bbox.height;
    }
    var transform = "scale(" + rx + "," + ry + ")";
    if (this.state.bbox == null) return (
      <g id={this.props.data.id}>
        <rect x={this.props.data.x} y={this.props.data.y} width={this.props.data.width} height={this.props.data.height} />
        <text x={x} y={y}>{this.props.data.text}</text>
      </g>
    )
    else return (
      <g id={this.props.data.id}>
        <rect x={this.state.bbox.x} y={this.state.bbox.y} width={this.state.bbox.width} height={this.state.bbox.height} />
        <rect x={this.props.data.x} y={this.props.data.y} width={this.props.data.width} height={this.props.data.height} />
        <text x={x/rx} y={y/ry} transform={transform}>{this.props.data.text}</text>
      </g>
    )
  }
});

var Element = React.createClass({
  onClick(e){
    var t = e.currentTarget;
    var tm = t.getCTM();
    var tm2 = tm.inverse();
    var bbox = t.getBBox();

    var svg = document.getElementById('svg');
    var pt = svg.createSVGPoint();  // Created once for document
    pt.x = bbox.x+bbox.width;
    pt.y = bbox.y+bbox.height;
    var pt2 = pt.matrixTransform(tm);
    var pt3 = pt.matrixTransform(tm2);

    this.props.onSelected(e.currentTarget.getBBox(), e.currentTarget.id);
  },
  render: function() {
    switch(this.props.data.tag) {
        case 'tb':
          return (
            <TBox data={this.props.data} />
          );
        default:
            console.log("unknown tag");
    }
  }
});

var Handle = React.createClass({
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
    if (this.props.corner=='mt'){
      x = x + this.props.data.width/2;
    }
    if (this.props.corner=='lm'){
      y = y + this.props.data.height/2;
    }
    return (
      <rect id={this.props.corner} className="handle" x={x}  y={y} height={sz*2} width= {sz*2} onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp} />
    );
  }
});

var Selection = React.createClass({
  render: function() {
    return (
      <g id='selection'>
        <rect  x={this.props.data.x} y={this.props.data.y} width={this.props.data.width} height={this.props.data.height} />
        {['lt', 'rt', 'lb', 'rb', 'mt', 'lm'].map(function(corner) {
          return <Handle key={corner} corner={corner} data={this.props.data} onMouseUp={this.props.onMouseUp} onMouseDown={this.props.onMouseDown} />;
        }.bind(this))}
      </g>
    );
  }
});

var Canvas = React.createClass({
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
    e.stopPropagation();
    e.preventDefault();
    var pt = this.getXY(e);
    this.props.onMouseDown(pt, e.currentTarget.id);
  },
  onMouseUp: function(e){
    e.stopPropagation();
    e.preventDefault();
    var pt = this.getXY(e);
    this.props.onMouseUp(pt, e.currentTarget.id);
  },
  onMouseMove: function(e){
    var pt = this.getXY(e);
    this.props.onMouseMove(pt, e.currentTarget.id);
  },
  render: function() {
    //<g id="canvas" transform="matrix(1 0 0 -1 0 100)">
    //<g id="canvas" transform="matrix(1 0 0 1 0 0)">
    return (
      <svg id='svg' width="400px" height="400px" viewBox="0 0 100 100" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} >
      <g id="canvas" transform="matrix(1 0 0 1 0 0)">
        <rect x='0' y='0' height='100' width='100' className='border' />
        <Selection data={this.props.data.selection} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}/>

        {this.props.data.elements.map(function(element, i) {
          return <Element key={i} data={element} onSelected={this.props.onSelected} />;
        }.bind(this))}
      </g>
      </svg>
    );
  }
});

var Msg = React.createClass({
  render: function() {
    return (
      <div>{this.props.data.pt.x.toFixed(2)},{this.props.data.pt.y.toFixed(2)},{this.props.data.button},{this.props.data.draging.toString()}</div>
    );
  }
});

var Svg = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  onMouseMove: function(pt, elem){
    this.setState({data: React.addons.update(this.state.data, {
      mouse: {pt: {$set: pt}}
    })});
    if (this.state.data.mouse.dragging){
      this.dragging(pt, elem);
    }
  },
  onMouseDown: function(pt, elem){
    this.setState({data: React.addons.update(this.state.data, {
      mouse: {
        pt: {$set: pt},
      },
    })});

    if (elem != "svg"){
      this.setState({data: React.addons.update(this.state.data, {
        mouse: {
          dragging: {$set: true},
          dragStart: {$set: pt},
          dragCorner: {$set: elem},
          dragSelection: {$set: this.state.data.selection},
        },
      })});
    }
  },
  onMouseUp: function(pt, elem){
    console.log("release:"+pt.x+","+pt.y);
    this.setState({data: React.addons.update(this.state.data, {
      mouse: {
        pt: {$set: pt},
      },
    })});

    if (this.state.data.mouse.dragging){
      var newData = React.addons.update(this.state.data, {});

      if (this.state.data.mouse.dragCorner == 'rb'){
        var scaleX = this.state.data.selection.width/this.state.data.mouse.dragSelection.width;
        var scaleY = this.state.data.selection.height/this.state.data.mouse.dragSelection.height;
        //var translateX = (1 - scaleX) * this.state.data.selection.x;
        //var translateY = (1 - scaleY) * this.state.data.selection.y;
        var translateX = this.state.data.mouse.dragSelection.x/scaleX;
        var translateY = (this.state.data.selection.height + this.state.data.mouse.dragSelection.y)/scaleY;

        //var transform = "translate(" + translateX + "," + translateY + ") scale(" + scaleX + "," + scaleY + ")";
        var transform = "scale(" + scaleX + "," + scaleY + ")";
        console.log(transform);
        newData.elements.forEach(function(element){
          if (element.id == this.state.data.selection.elementId){
            element.transform = transform;
            //element.x = translateX;
            //eglement.y = translateY;
            console.log(element);
          }
        }.bind(this));
      }

      if (this.state.data.mouse.dragCorner == 'mt' || this.state.data.mouse.dragCorner == 'lm'){
        var translateX = this.state.data.selection.x - this.state.data.mouse.dragSelection.x;
        var translateY = this.state.data.selection.y - this.state.data.mouse.dragSelection.y;
        var transform = "translate(" + translateX + "," + translateY + ")";
        console.log(transform);
        newData.elements.forEach(function(element){
          if (element.id == this.state.data.selection.elementId){
            //element.transform = transform;
            element.x = element.x + translateX;
            element.y = element.y + translateY;
            console.log(element);
          }
        }.bind(this));
      }

      newData.mouse.dragging = false;
      newData.mouse.dragStart = null;
      newData.mouse.dragCorner = null;
      newData.mouse.dragSelection = null;
      this.setState({data: newData});
    }
  },
  dragging: function(pt, corner){
    var dltx = pt.x - this.state.data.mouse.dragStart.x;
    var dlty = pt.y - this.state.data.mouse.dragStart.y;
    if (this.state.data.mouse.dragCorner == 'rb'){
      this.setState({data: React.addons.update(this.state.data, {
        selection: {
          width: {$set: this.state.data.mouse.dragSelection.width + dltx},
          height: {$set: this.state.data.mouse.dragSelection.height + dlty}
        }
      })});
    }
  if (this.state.data.mouse.dragCorner == 'mt' || this.state.data.mouse.dragCorner == 'lm'){
    this.setState({data: React.addons.update(this.state.data, {
      selection: {
        x: {$set: this.state.data.mouse.dragSelection.x + dltx},
        y: {$set: this.state.data.mouse.dragSelection.y + dlty}
      }
    })});
  }
  },
  onSelected: function(rc, id){
    this.setState({data: React.addons.update(this.state.data, {
      selection: {
        x: {$set: rc.x},
        y: {$set: rc.y},
        width: {$set: rc.width},
        height: {$set: rc.height},
        elementId: {$set: id},
      }
    })});
  },
  render: function() {
    return (
      <div>
        <Canvas data={this.state.data} onMouseMove={this.onMouseMove} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onSelected={this.onSelected} />
        <Msg data={this.state.data.mouse} />
      </div>
    );
  }
});
