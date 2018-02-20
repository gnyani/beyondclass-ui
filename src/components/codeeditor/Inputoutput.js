import React,{Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Input from 'material-ui/svg-icons/action/input'
import Visibility from 'material-ui/svg-icons/action/view-headline'
import Output from './OutputTab'


class Inputoutput extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: 'stdout',
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

getInputTestCases(){
  var buffer = []
   if(this.props.testcases !== '')
   buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value={this.props.testcases.split(/[\s \n]+/)} />)
   else {
     buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value='No Test Inputs Given' />)
   }
   return buffer
}
  render(){
  if(this.props.submissionStarted)
    return(
  <Tabs
  className="tabs"
  value={this.state.value}
  onChange={this.handleChange}
  inkBarStyle={{backgroundColor:"#FFA107"}}
  >
    <Tab
      value='stdin'
      icon={<Input />}
      label="STDIN"
      buttonStyle={{backgroundColor: '#4d86cf'}}
    >
    {this.getInputTestCases()}
    </Tab>
    <Tab
      value='stdout'
      icon={<Visibility />}
      label="STDOUT"
      buttonStyle={{backgroundColor: '#4d86cf'}}
    >
    <Output buttonDisabled={this.props.buttonDisabled} stdOut={this.props.stdOut} stdErr={this.props.stdErr}
     compileError={this.props.compileError} runtime={this.props.runtime} memory={this.props.memory}  
     message={this.props.message}/>
    </Tab>
  </Tabs>)
  else {
    return(<p> </p>)
  }
}
}

export default Inputoutput
