import React,{Component} from  'react'
import styled from 'styled-components'
import {Media} from '../utils/Media'
import Divider from 'material-ui/Divider'
import {Grid,Row,Col} from 'react-flexbox-grid'
import DisplayAssignmentQuestions from './DisplayAssignmentQuestions.js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {notify} from 'react-notify-toast'
import RenderProgrammingAssignment from './RenderProgrammingAssignment'
import RenderObjectiveAssignment from './RenderObjectiveAssignment'
import RefreshIndicator from 'material-ui/RefreshIndicator'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class SubmitAssignment extends Component{

constructor(){
  super();
  this.state={
   assignmentType: ''
  }
}


componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/get/assignmenttype/'+this.props.assignmentid, {
          credentials: 'include',
           method: 'GET',
        }).then(response => {
          if(response.status === 200)
          return response.text()
          else if(response.status === 403){
            notify.show("Assignment not found", "error")
          }
        }).then(response => {
          this.setState({
            assignmentType: response
          })
        })
}

  render(){
    if(this.state.assignmentType === '"THEORY"')
    {
    return(
      <StayVisible
      {...this.props}>
      <div className="announcements">
        <p className="paragraph">Submit Assignment</p>
      <Divider />
      <DisplayAssignmentQuestions email={this.props.loggedinuser} assignmentid={this.props.assignmentid}
        onArrayEditorStateChange={this.onArrayEditorStateChange}
        onArrayContentStateChange={this.onArrayContentStateChange}/>
      </div>
 <br /><br />
      </StayVisible>
    )
}

else if(this.state.assignmentType === '"CODING"')
{
    return(
      <StayVisible
      {...this.props}>
      <div className="ProgrammingAssignment">
        <p className="paragraph">Submit Assignment</p>
      <Divider />
      <RenderProgrammingAssignment  assignmentid={this.props.assignmentid} email={this.props.loggedinuser}
      questions={this.state.questions}/>
      </div>
      </StayVisible>
    )
}
else if(this.state.assignmentType === '"OBJECTIVE"')
{
    return(
      <StayVisible
      {...this.props}>
      <div className="ProgrammingAssignment">
        <p className="paragraph">Submit Assignment</p>
      <Divider />
      <RenderObjectiveAssignment  assignmentid={this.props.assignmentid} email={this.props.loggedinuser}/>
      </div>
      </StayVisible>
    )
}else{
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
SubmitAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(SubmitAssignment)
