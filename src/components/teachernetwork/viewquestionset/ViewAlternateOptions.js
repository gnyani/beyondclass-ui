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

class ViewAlternateOptions extends Component{

renderOptions = () => {
  var buffer = []
  for(var i=0;i<this.props.options.length+1;i++){
  if(i < this.props.options.length ){
    if(this.props.questionValidity !== null)
    var selected = (this.props.questionValidity.indexOf(i) > -1)
    else {
      selected = false
    }
    if(typeof this.props.qindex !== 'undefined'){
      buffer.push(
        <TableRow key={i} selected={selected}>
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i] || ''} underlineShow={false}
             hintText="Start typing the option text"
             multiLine={true}
             style={{width:'100%'}}
             />
             </TableRowColumn>
        </TableRow>
      )
    } else{
      buffer.push(
        <TableRow key={i} selected={selected}>
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i] || ''} underlineShow={false}
             hintText="Start typing the option text"
             multiLine={true}
             style={{width:'100%'}}
            />
            </TableRowColumn>
        </TableRow>
      )
    }
  }else{

    if(typeof this.props.qindex !== 'undefined'){
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i] || ''} underlineShow={false}
             hintText="Start typing the option text"
             multiLine={true}
             style={{width:'100%'}}
             />
             </TableRowColumn>
        </TableRow>
      )
    } else{
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i] || ''} underlineShow={false}
             hintText="Start typing the option text"
             multiLine={true}
             style={{width:'100%'}}
             />
             </TableRowColumn>
        </TableRow>
      )
    }
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
            multiSelectable={true}
          >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={true}
            enableSelectAll={false}
            >
          <TableRow>
            <TableHeaderColumn tooltip="The Index">Index</TableHeaderColumn>
            <TableHeaderColumn tooltip="Option Value">Option</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
              displayRowCheckbox={true}
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
            multiSelectable={true}
          >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={true}
            enableSelectAll={false}
            >
            <TableRow>
                <TableHeaderColumn colSpan="2" style={{textAlign: 'center',fontWeight: 'bold',fontSize: '1em'}}>
                  Check all the correct Options
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
            <TableHeaderColumn tooltip="The Index">Index</TableHeaderColumn>
            <TableHeaderColumn tooltip="Option Value">Option</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
              displayRowCheckbox={true}
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
export default ViewAlternateOptions
