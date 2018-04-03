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

class StudentOptions extends Component{

renderOptions = () => {
  var buffer = []
  for(var i=0;i<this.props.options.length;i++){
    if(typeof this.props.questionValidity !== 'undefined'){
      var selected = (this.props.questionValidity.indexOf(i) > -1)
        buffer.push(
          <TableRow key={i} selected={selected}>
               <TableRowColumn>{i+1}</TableRowColumn>
               <TableRowColumn>
               <TextField key={i} value={this.props.options[i]} underlineShow={false}/>
               </TableRowColumn>
          </TableRow>
        )
    }else{
      buffer.push(
        <TableRow key={i} >
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i]} underlineShow={false}/>
             </TableRowColumn>
        </TableRow>
      )
    }
  }
  return buffer
}


  render(){
   if(this.props.validity.length === 1){
     return(
       <div>
       <Table
           fixedHeader={true}
           multiSelectable={false}
           onRowSelection={this.props.handleQuestionValidityChange.bind(this,this.props.qindex)}
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
           onRowSelection={this.props.handleQuestionValidityChange.bind(this,this.props.qindex)}
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
   }
 }
}
export default StudentOptions
