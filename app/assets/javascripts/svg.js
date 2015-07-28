
"use strict";
var sz = 1;

var Element = React.createClass({displayName: "Element",
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
    return (
      React.createElement("text", {id: this.props.data.id, x: this.props.data.x, y: this.props.data.y, transform: this.props.data.transform, onClick: this.onClick}, this.props.data.text)
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
      React.createElement("rect", {id: this.props.corner, className: "handle", x: x, y: y, height: sz*2, width: sz*2, onMouseDown: this.props.onMouseDown, onMouseUp: this.props.onMouseUp})
    );
  }
});

var Selection = React.createClass({displayName: "Selection",
  render: function() {
    return (
      React.createElement("g", {id: "selection"}, 
        React.createElement("rect", {x: this.props.data.x, y: this.props.data.y, width: this.props.data.width, height: this.props.data.height}), 
        ['lt', 'rt', 'lb', 'rb'].map(function(corner) {
          return React.createElement(Handle, {key: corner, corner: corner, data: this.props.data, onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown});
        }.bind(this))
      )
    );
  }
});

var Canvas = React.createClass({displayName: "Canvas",
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
    return (
      React.createElement("svg", {id: "svg", width: "400px", height: "400px", viewBox: "0 0 100 100", onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onMouseMove: this.onMouseMove}, 
      React.createElement("g", {id: "canvas", transform: "matrix(1 0 0 1 0 0)"}, 
        React.createElement("rect", {x: "0", y: "0", height: "100", width: "100", className: "border"}), 
        React.createElement(Selection, {data: this.props.data.selection, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp}), 

        this.props.data.elements.map(function(element, i) {
          return React.createElement(Element, {key: i, data: element, onSelected: this.props.onSelected});
        }.bind(this))
      )
      )
    );
  }
});

var Msg = React.createClass({displayName: "Msg",
  render: function() {
    return (
      React.createElement("div", null, this.props.data.pt.x.toFixed(2), ",", this.props.data.pt.y.toFixed(2), ",", this.props.data.button, ",", this.props.data.draging.toString())
    );
  }
});

var Svg = React.createClass({displayName: "Svg",
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
      var scaleX = this.state.data.selection.width/this.state.data.mouse.dragSelection.width;
      var scaleY = this.state.data.selection.height/this.state.data.mouse.dragSelection.height;
      var translateX = (1 - scaleX) * this.state.data.selection.x;
      var translateY = (1 - scaleY) * this.state.data.selection.y;
      var transform = "translate(" + translateX + "," + translateY + ") scale(" + scaleX + "," + scaleY + ")";
      console.log(transform);
      /*
      this.setState({data: React.addons.update(this.state.data, {
        mouse: {
          dragging: {$set: false},
          dragStart: {$set: null},
          dragCorner: {$set: null},
          dragSelection: {$set: null},
        },
      })});
      */
      var newData = React.addons.update(this.state.data, {});
      newData.elements.forEach(function(element){
        if (element.id == this.state.data.selection.elementId){
          element.transform = transform;
        }
      }.bind(this));
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
      React.createElement("div", null, 
        React.createElement(Canvas, {data: this.state.data, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onMouseUp: this.onMouseUp, onSelected: this.onSelected}), 
        React.createElement(Msg, {data: this.state.data.mouse})
      )
    );
  }
});
