import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import TextareaAutosize from 'react-textarea-autosize'

class OutputTab extends Component{

checkStatus(){
  var buffer = []
  var status
  if(this.props.compileError !== '' && this.props.compileError !== 'Syntax OK\n')
  {
  status = 'COMPILE_ERROR'
  buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value={"STATUS : "+status} />)
}else if(this.props.message && this.props.message[0] === 'Runtime error'){
  status = 'RUNTIME_EXCEPTION'
  buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value={"STATUS : "+status} />)
}
  else {
    status = 'SUCCESS'
    buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value={"STATUS : "+status} />)
  }
  return buffer
}

giveConsoleOutput(){
  var buffer = []
  var stdoutstring = ''
  var stderrstring = ''
  if(this.props.compileError !== '' && this.props.compileError !== 'Syntax OK\n')
  buffer.push(<input type="text"  className="OutputTextInput" key={1} disabled={true} value={this.props.compileError}/>)
   else if(this.props.message && this.props.message[0] === 'Runtime error')
   {
     if(this.props.stdErr.length === 1)
     stderrstring = this.props.stdErr[0]
     else{
       for (var i=0;i<this.props.stdErr.length;i++){
         stderrstring = stderrstring+'CASE '+(i+1)+': '+this.props.stdErr[i]+'\n'
       }
     }
    buffer.push(<TextareaAutosize className="OutputTextInput" maxRows={10} key={1} disabled={true} value={stderrstring} />)
  }
  else{
    if(this.props.stdOut.length === 1)
    stdoutstring = this.props.stdOut[0]
    else{
    for (i=0;i<this.props.stdOut.length;i++){
      stdoutstring = stdoutstring+'CASE '+(i+1)+':\n'+this.props.stdOut[i]+'\n'
    }
  }
    buffer.push(<TextareaAutosize maxRows={10} className="OutputTextInput" key={1} disabled={true} value={stdoutstring} />)
  }
  return buffer
}


  render(){
    if(this.props.buttonDisabled)
    return(<Grid fluid>
    <Row center="xs" className="RefreshIndicator">
    <Col xs>
    <br />
      <RefreshIndicator
         size={50}
         left={45}
         top={0}
         loadingColor="#FF9800"
         status="loading"
         className="refresh"
        />
        <br /><br /><br />
    </Col>
    </Row>
    </Grid>)
    else {
      return(<div>
          {this.checkStatus()}
         {this.giveConsoleOutput()}
         </div> )
    }
  }
}
export default OutputTab
