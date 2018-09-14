import React,{Component} from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import TextField from 'material-ui/TextField'


class TestCases extends Component{


renderOptions = () => {
  var buffer = []
  var greatersize = this.props.outputs.length;
  for(var i=0;i< Math.min(greatersize+1,4) ;i++){
    if(typeof this.props.qindex !== 'undefined'){
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn>
             <TextField key={i} value={this.props.inputs[i] || ''}
             multiLine={true}
             underlineShow={false}
             floatingLabelText="Input"
             style={{width:'100%',paddingBottom:'24px'}}
             onChange={this.props.handleInputsChange.bind(this,this.props.qindex,i)}/>
             </TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.outputs[i] || ''}
             multiLine={true}
             underlineShow={false}
             style={{width:'100%',paddingBottom:'24px'}}
             floatingLabelText="Output"
             onChange={this.props.handleOutputsChange.bind(this,this.props.qindex,i)}/></TableRowColumn>
        </TableRow>
      )
    } else{
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn>
             <TextField key={i} value={this.props.inputs[i] || ''}
             multiLine={true}
             underlineShow={false}
             style={{width:'100%',paddingBottom:'24px'}}
             floatingLabelText="Input"
             onChange={this.props.handleInputsChange.bind(this,i)}/></TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.outputs[i] || ''}
             multiLine={true}
             underlineShow={false}
             style={{width:'100%',paddingBottom:'24px'}}
             floatingLabelText="Output"
             onChange={this.props.handleOutputsChange.bind(this,i)}/></TableRowColumn>
        </TableRow>
      )
    }
  }
  return buffer
}


  render(){

    if(typeof this.props.qindex !== 'undefined'){
      return(
        <div>
        <Table
            fixedHeader={true}
          >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
            >
          <TableRow>
            <TableHeaderColumn tooltip="Input Test Case">Input</TableHeaderColumn>
            <TableHeaderColumn tooltip="Output Test Case">Output</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
              displayRowCheckbox={false}
              deselectOnClickaway={false}
            >
           {this.renderOptions()}
        </TableBody>
        </Table>
        </div>
      )
    }else{
      return(
        <div>
        <Table
            fixedHeader={true}
          >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
            >
            <TableRow>
                <TableHeaderColumn colSpan="4" style={{textAlign: 'center',fontWeight: 'bold',fontSize: '1em'}}>
                  Give Inputs and Outputs seperated by newline
                </TableHeaderColumn>
              </TableRow>
        </TableHeader>
        <TableBody
              displayRowCheckbox={false}
              deselectOnClickaway={false}
            >
           {this.renderOptions()}
        </TableBody>
        </Table>
        </div>
      )
    }
  }
}
export default TestCases
