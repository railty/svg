var ElemDisplay = React.createClass({
  render: function() {
    return (
      <svg>
        <rect x="0" y="0" width="100%" height="100%" />
        <rect x="0" y="0" width="100%" height="50%" />
        <text x="50%" y="50%">
      		Look, I’m centered!
      	</text>
      </svg>
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
