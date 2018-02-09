import React,{Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'

class TestCases extends Component{

  constructor(props) {
    super(props);
    this.state = {
      value: 'stdin',
    };
  }



  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render(){
    return(
      <div className="ProgrammingAssignment">
      <Tabs
      value={this.state.value}
      onChange={this.handleChange}
      inkBarStyle={{backgroundColor:"#FFA107"}}
      >
        <Tab
          value='stdin'
          label="STDIN"
          buttonStyle={{backgroundColor: '#4d86cf'}}
        >
        <textarea key={1} placeholder="Give your input seperated by a space or use new line" rows="5"
        className="testcases"  value={this.props.input} onChange={this.props.changeInputs} autoComplete='off'/>
        </Tab>
        <Tab
          value='stdout'
          label="STDOUT"
          buttonStyle={{backgroundColor: '#4d86cf'}}
        >
        <textarea key={1} placeholder="Give the corresponding output to your input seperated by a space or use new line" rows="5"
        className="testcases" value={this.props.output} onChange={this.props.changeOutputs} autoComplete='off'/>
        </Tab>
        </Tabs>
        </div>
    )
  }
}

export default TestCases
