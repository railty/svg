var ElemDisplay = React.createClass({
  render: function() {
    return (
      <div>
        props:{this.props.data.mouse.pt.x}, {this.props.data.mouse.pt.y}, {this.props.data.mouse.button}
      </div>
    );
  }
});

var Elem = React.createClass({
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
      <div>
        <ElemDisplay data={this.state.data} />
        <button onClick={this.onClick}>testXY</button>
        <button onClick={this.onClick}>testButton</button>
        <button onClick={this.onClick}>testAll</button>
      </div>
    );
  }
});
