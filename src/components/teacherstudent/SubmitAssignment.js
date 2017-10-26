import React,{Component} from  'react'
import styled from 'styled-components'
import {notify} from 'react-notify-toast'
import {Media} from '../utils/Media'
import Divider from 'material-ui/Divider'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import DisplayAssignmentQuestions from './DisplayAssignmentQuestions.js'
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
var properties = require('../properties.json');

class SubmitAssignment extends Component{

constructor(){
  super();
  this.state={
    questions: [],
    answers: []
  }
     this.handleAnswerChange = this.handleAnswerChange.bind(this);
     this.saveOrSubmit = this.saveOrSubmit.bind(this);
}

saveOrSubmit(option){
  if(this.isValidForSaveOrSubmit()){
    if(option === 'save'){
      this.saveAssignment()
    }else {
      this.submitAssignment()
    }
  }else{
    notify.show("please attempt atlease one answer","warning")
  }
}
saveAssignment(){
  fetch('http://'+properties.getHostName+':8080/assignments/student/save', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.loggedinuser,
         tempassignmentid: this.props.assignmentid,
         answers: this.state.answers,
      })
    }).then(response => {
      if(response.status === 200){
        notify.show('Your work is saved,you can come back anytime here to continue',"success")
      }else if(response.status === 302){
        this.context.router.history.push('/')
      }else if(response.status === 500){
        notify.show('Sorry something went wrong please try again',"error")
      }
    })
}
submitAssignment(){
  fetch('http://'+properties.getHostName+':8080/assignments/student/submit', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.loggedinuser,
         tempassignmentid: this.props.assignmentid,
         answers: this.state.answers,
      })
    }).then(response => {
      if(response.status === 200){
        notify.show('Your Assignment got submitted successfully',"success")
        this.context.router.history.goBack()
      }else if(response.status === 302){
        this.context.router.history.push('/')
      }else if(response.status === 500){
        notify.show('Sorry something went wrong please try again',"error")
      }
    })
}
isValidForSaveOrSubmit = () => {
  var flag = false
  console.log('answers are' +this.state.answers)
  for(let i=0 ; i < this.state.answers.length ; i++)
  {
    let answer = this.state.answers[i].trim()
    if(answer !== ''){
      flag = true
    }
  }
  return flag
}

handleAnswerChange(i,event) {
  var newAnswers = this.state.answers.slice()
  newAnswers[i] = event.target.value
  this.setState({
    answers: newAnswers,
  })
}

  componentDidMount(){
    fetch('http://'+properties.getHostName+':8080/assignments/get/'+this.props.assignmentid, {
           method: 'POST',
           credentials: 'include',
           headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
             },
           body: this.props.loggedinuser,
       }).then(response => {
         if(response.status === 200)
         return response.json()
         else if(response.status === 302){
           this.context.router.history.push('/')
         }
         else{
           notify.show("something is not right","error")
         }
       }).then(response => {
         if(response.answers){
         this.setState({
           questions: response.questions,
           answers: response.answers,
         })
       }else{
         this.setState({
           questions: response.questions,
         })
       }
       })
}
  render(){
    return(
      <StayVisible
      {...this.props}>
      <div className="announcements">
        <p className="paragraph">Submit Assignment</p>
      <Divider />
      <DisplayAssignmentQuestions questions={this.state.questions} answers={this.state.answers} handleAnswerChange={this.handleAnswerChange}/>
      </div>
      <Grid fluid>
      <Row start="xs">
      <Col xs={11} sm={11}  md={10} lg={10}>
      <Grid fluid className="nogutter">
      <Row end="xs" top="xs">
      <Col lg={8}>
      <RaisedButton label="Save" primary = {true} icon={<Save />} onClick={this.saveOrSubmit.bind(this,'save')}/>
      </Col>
      <Col lg={2}>
      <RaisedButton label="Submit" primary = {true} icon={<Send />} onClick={this.saveOrSubmit.bind(this,'submit')}/>
      </Col>
      </Row>
      </Grid>
      </Col>
      </Row>
      </Grid>
      <br /><br />
      </StayVisible>
    )
  }
}
SubmitAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(SubmitAssignment)
