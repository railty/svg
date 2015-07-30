var ElemDisplay = React.createClass({displayName: "ElemDisplay",
  render: function() {
    return (
      React.createElement("svg", null, 
        React.createElement("rect", {x: "0", y: "0", width: "100%", height: "100%"}), 
        React.createElement("rect", {x: "0", y: "0", width: "100%", height: "50%"}), 
        React.createElement("text", {x: "50%", y: "50%"}, 
      		"Look, I’m centered!"
      	)
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
