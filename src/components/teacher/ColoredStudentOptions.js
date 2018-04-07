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
    if(typeof this.props.userValidity !== 'undefined'){
      if(this.props.userValidity !== null)
      var selected = (this.props.userValidity.indexOf(i) > -1)
      else {
        selected = false
      }
      var valid = (this.props.validity.indexOf(i) > -1)
     if(selected === true){
       if(valid === true){
         buffer.push(
           <TableRow key={i} selected={selected}>
                <TableRowColumn style={{backgroundColor: 'green'}}>{i+1}</TableRowColumn>
                <TableRowColumn style={{backgroundColor: 'green'}}>
                <TextField key={i} value={this.props.options[i]} underlineShow={false}
                multiLine={true}
                style={{width:'100%'}}/>
                </TableRowColumn>
           </TableRow>
         )
       }else{
         buffer.push(
           <TableRow key={i} selected={selected}>
                <TableRowColumn style={{backgroundColor: '#ff3333'}}>{i+1}</TableRowColumn>
                <TableRowColumn style={{backgroundColor: '#ff3333'}}>
                <TextField key={i} value={this.props.options[i]} underlineShow={false}
                multiLine={true}
                style={{width:'100%'}}/>
                </TableRowColumn>
           </TableRow>
         )
       }
     }
    else{
      if(valid === true){
        buffer.push(
          <TableRow key={i} selectable={false}>
               <TableRowColumn style={{backgroundColor: 'green'}}>{i+1}</TableRowColumn>
               <TableRowColumn style={{backgroundColor: 'green'}}>
               <TextField key={i} value={this.props.options[i]} underlineShow={false}
               multiLine={true}
               style={{width:'100%'}}/>
               </TableRowColumn>
          </TableRow>
        )
      }
    else{
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn >{i+1}</TableRowColumn>
             <TableRowColumn >
             <TextField key={i} value={this.props.options[i]} underlineShow={false}
             multiLine={true}
             style={{width:'100%'}}/>
             </TableRowColumn>
        </TableRow>
      )
    }
  }
  }
    else{
      buffer.push(
        <TableRow key={i} selectable={false}>
             <TableRowColumn>{i+1}</TableRowColumn>
             <TableRowColumn>
             <TextField key={i} value={this.props.options[i]} underlineShow={false}
             multiLine={true}
             style={{width:'100%'}}/>
             </TableRowColumn>
        </TableRow>
      )
    }
  }
  return buffer
}


  render(){
    if(this.props.userValidity !==null && this.props.userValidity.length === 1){
      return(
        <div>
        <Table
            fixedHeader={true}
            multiSelectable={false}
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
