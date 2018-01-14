import React,{Component} from  'react'
import styled from 'styled-components'
import {notify} from 'react-notify-toast'
import {Media} from '../utils/Media'
import Divider from 'material-ui/Divider'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import DisplayAssignmentQuestions from './DisplayAssignmentQuestions.js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import IdleTimer from 'react-idle-timer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RenderProgrammingAssignment from './RenderProgrammingAssignment'
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
    answers: [],
    timeout: 5000,
     remaining: null,
     isIdle: false,
     totalActiveTime: null,
     assignmentType: '',
     confirmSubmitDialog: false,
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
saveAssignment(option){
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
         timespent: this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        if(option === 'autosave' )
        notify.show("Your work is auto saved","success")
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
         timespent: this.state.totalActiveTime,
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
  for(let i=0 ; i < this.state.answers.length ; i++)
  {
    let answer = this.state.answers[i].trim()
    if(answer !== ''){
      flag = true
    }
  }
  return flag
}

handleDialogOpen = () => {
  this.setState({
    confirmSubmitDialog: true,
  })
}
handleClose = () => {
  this.setState({
    confirmSubmitDialog: false,
  })
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
           assignmentType: response.assignmentType,
           totalActiveTime: response.timespent,
         })
       }else{
         this.setState({
           questions: response.questions,
           assignmentType: response.assignmentType,
         })
       }
       })

this._interval = setInterval(() => {
  if(this.state.isIdle === false)
  this.setState({
    totalActiveTime: this.state.totalActiveTime + 1000
  });
  if(this.state.totalActiveTime % 30000 === 0 && this.state.assignmentType === 'THEORY')
  {
    this.saveAssignment('autosave')
  }
 }, 1000);

}


componentWillUnmount() {
    clearInterval(this._interval);
}

_onActive = () => {
   this.setState({ isIdle: false });
 }

 _onIdle = () => {
   this.setState({
     isIdle: true,
    });
 }


  render(){

    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.saveOrSubmit.bind(this,'submit')}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]

    if(this.state.assignmentType === 'THEORY')
    {
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
      <RaisedButton label="Submit" primary = {true} icon={<Send />} onClick={this.handleDialogOpen}/>
      </Col>
      </Row>
      </Grid>
      </Col>
      </Row>
      </Grid>
      <Dialog
            title="Are you sure you want to submit this assignment ?"
            modal={false}
            actions={actions}
            open={this.state.confirmSubmitDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>

  <IdleTimer
  ref="idleTimer"
  activeAction={this._onActive}
  idleAction={this._onIdle}
  timeout={this.state.timeout}
  startOnLoad={false}
  format="MM-DD-YYYY HH:MM:ss.SSS">

  {/*<h1>Time Spent: {this.state.totalActiveTime}</h1>*/}
  </IdleTimer>
 <br /><br />
      </StayVisible>
    )
}

else if(this.state.assignmentType === 'CODING')
{
    return(
      <StayVisible
      {...this.props}>
      <div className="ProgrammingAssignment">
        <p className="paragraph">Submit Assignment</p>
      <Divider />
      <RenderProgrammingAssignment  assignmentid={this.props.assignmentid} email={this.props.loggedinuser}
      questions={this.state.questions} answers={this.state.answers} handleAnswerChange={this.handleAnswerChange}/>
      </div>
      </StayVisible>
    )
}else{
  return(<p> still loading</p>)
}

}

}
SubmitAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(SubmitAssignment)
