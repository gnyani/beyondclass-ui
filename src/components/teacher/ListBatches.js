import React, {Component} from 'react'
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {isEqual} from 'lodash'

class ListBatches extends Component{

displayBatches = () => {
  var buffer = []
  for(var i=0; i< this.props.batches.length;i++){
    buffer.push(
      <TableRow key={i}>
        <TableRowColumn>{this.props.batches[i]}</TableRowColumn>
      </TableRow>
    )
  }
  return buffer
}

shouldComponentUpdate(nextProps, nextState){
  return !isEqual(nextProps, this.props)
}

  render(){
    if(this.props.showRefreshIndicator === false)
    return(
      <div>
      <Table
      onRowSelection={this.props.updateBatchSelection}>
      <TableBody>
      {this.displayBatches()}
      </TableBody>
      </Table>
      </div>
    )
    else{
     return(<Grid fluid className="RefreshIndicator" key={1}>
      <Row center="xs">
      <Col xs>
        <RefreshIndicator
           size={50}
           left={45}
           top={0}
           loadingColor="#FF9800"
           status="loading"
           className="refresh"
          />
      </Col>
      </Row>
      </Grid>)
    }
  }
}

export default ListBatches
