import React, {Component} from 'react'
import {notify} from 'react-notify-toast'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {List, ListItem} from 'material-ui/List'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'

var properties = require('../properties.json');

class ListBatchStudents extends Component{

  constructor(){
    super();
    this.state = {
      response: '',
      isDataLoaded: false,
    }
  }

 renderStudentsList = () => {
   var buffer = []
   if(this.state.isDataLoaded){
     console.log(this.state.response)
     if(typeof this.state.response === 'undefined'){
       buffer.push(<h4>No students enrolled in this class yet, please contact beyondclass for adding new students </h4>)
     }else{
       for(var i=0; i<this.state.response.length; i++){
         buffer.push(
           <div>
            <ListItem
            leftAvatar={<Avatar src={this.state.response[i].normalpicUrl||this.state.response[i].googlepicUrl} />}
            disabled={true}
            primaryText={this.state.response[i].firstName+this.state.response[i].lastName}
            secondaryText={this.state.response[i].email}
            />
            <Divider inset={true} />
          </div>
         )
       }
     }
  }
  else{
     buffer.push(<Grid fluid className="RefreshIndicator">
     <br /><br /><br />
     <br /><br /><br />
     <br /><br /><br />
     <br /><br /><br />
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
     <br /><br /><br />
     <br /><br /><br />
     </Grid>)
   }
   return buffer
 }

  componentDidMount() {
    fetch('http://'+properties.getHostName+':8080/get/students/list?batch='+this.props.batch,{
      credentials: 'include',
      method: 'GET'
    }).then(response => {
      if(response.status === 200){
        return response.json()
      }else if(response.status === 204){
        return response
      }else if(response.status === 500){
        notify.show("Something went wrong", "error")
      }
    }).then(response => {
      this.setState({
        response: response,
        isDataLoaded: true,
      })
    })
}

    render(){
    return(
      <div>
      <List>
      {this.renderStudentsList()}
      </List>
      </div>
    )
    }
}

export default ListBatchStudents
