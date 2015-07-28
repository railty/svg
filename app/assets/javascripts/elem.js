var ElemDisplay = React.createClass({displayName: "ElemDisplay",
  render: function() {
    return (
      React.createElement("div", null, 
        "props:", this.props.data.mouse.pt.x, ", ", this.props.data.mouse.pt.y, ", ", this.props.data.mouse.button
      )
    );
  }
});

var Elem = React.createClass({displayName: "Elem",
  getInitialState: function() {
    console.log("init");
    return {data: this.props.data};
  },
  onClick(e){
    console.log("click:");

      var newWidth = this.state.data.selection.width + 11;
      console.log(newWidth);

      var newData = React.addons.update(this.state.data, {
        selection: {
          width: {$set: newWidth}
        }
      });

      console.log(newData);
      this.setState({data: newData});
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(ElemDisplay, {data: this.state.data}), 
        React.createElement("button", {onClick: this.onClick}, "testXY"), 
        React.createElement("button", {onClick: this.onClick}, "testButton"), 
        React.createElement("button", {onClick: this.onClick}, "testAll")
      )
    );
  }
});
