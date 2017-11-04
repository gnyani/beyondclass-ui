import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import {notify} from 'react-notify-toast'
import Divider from 'material-ui/Divider'
import {Card, CardTitle, CardText} from 'material-ui/Card'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import FlatButton from 'material-ui/FlatButton'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import RejectIcon from 'material-ui/svg-icons/navigation/close'
import NumericInput from 'react-numeric-input'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`


const numberstyle ={
  wrap: {
            background: '#E2E2E2',
            boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
            padding: '2px 2.26ex 2px 2px',
            borderRadius: '6px 3px 3px 6px',
            fontSize: 32
        },
        input: {
            borderRadius: '4px 2px 2px 4px',
            color: '#988869',
            padding: '0.1ex 1ex',
            border: '1px solid #ccc',
            marginRight: 4,
            display: 'block',
            fontWeight: 100,
            fontSize: 20,
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)'
        },
        'input:focus' : {
            border: '1px inset #69C',
            outline: 'none'
        },
        arrowUp: {
            borderBottomColor: 'rgba(66, 54, 0, 0.63)'
        },
        arrowDown: {
            borderTopColor: 'rgba(66, 54, 0, 0.63)'
        }
}


class EvaluateAssignment extends Component{

 constructor(props){
   super(props);
   this.state={
     assignmentid: this.props.submissionid.split('*')[0],
     email: this.props.submissionid.split('*')[1],
     questions: [],
     answers: [],
     assignmentMarks: 3,
     timespent: '',
     isDataLoaded: false,
     acceptDialog: false,
     rejectDialog: false,
   }
   this.renderAssignment = this.renderAssignment.bind(this)
   this.handleMarksChange = this.handleMarksChange.bind(this)
   this.renderEvaluateButtons = this.renderEvaluateButtons.bind(this)
   this.renderInsights = this.renderInsights.bind(this)
 }

  componentDidMount(){
    fetch('http://'+properties.getHostName+':8080/assignments/evaluate', {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body:JSON.stringify({
           email: this.state.email,
           assignmentid: this.state.assignmentid,
         })
       }).then(response =>{
           if(response.status===200){
             return response.json();
           }else if(response.status === 302){
             this.context.router.history.push('/')
           }else{
             notify.show('Sorry something Went wrong',"error")
           }
         }).then(response =>{

           this.setState({
             questions:response.createAssignment.questions,
             answers:response.submitAssignment.answers,
             timespent: response.timespent,
             isDataLoaded: true,
           })
         })
  }
  rejectAssignment = () => {
    fetch('http://'+properties.getHostName+':8080/assignments/update/evaluation/'+this.state.assignmentid+this.state.email, {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body:JSON.stringify({
           marks: 0,
           status: 'REJECTED',
         })
       }).then(response => {
         if(response.status === 200)
         {notify.show("Assignment Evaluated Successfully","success")
         this.context.router.history.goBack()
       }else if(response.status === 302){
         this.context.router.history.push('/')
       }
         else {
           notify.show("Sorry Something Went Wrong","error")
         }
         this.handleClose()
       })
  }

  acceptAssignment = () => {
    fetch('http://'+properties.getHostName+':8080/assignments/update/evaluation/'+this.state.assignmentid+this.state.email, {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body:JSON.stringify({
           marks: this.state.assignmentMarks,
           status: 'ACCEPTED',
         })
       }).then(response => {
         if(response.status === 200)
         {notify.show("Assignment Evaluated Successfully","success")
         this.context.router.history.goBack()
       }else if(response.status === 302){
         this.context.router.history.push('/')
       }
         else {
           notify.show("Sorry Something Went Wrong","error")
         }
         this.handleClose()
       })
  }

  handleMarksChange(valueAsNumber){
    this.setState({
      assignmentMarks: valueAsNumber
    })
  }

  openAcceptAssignmentDialog(){
    this.setState({
      acceptDialog: true,
    })
  }

  openRejectAssignmentDialog(){
    this.setState({
      rejectDialog: true,
    })
  }

  renderInsights(){
    var buffer = []
    if(this.props.userrole === 'teacher'){
      buffer.push(
        <Grid fluid>
        <Row around="xs">
        <Col xs={11} sm={11} md={9} lg={8}>
        <div className="insightsBorder"><h4>Some Insights</h4>
                  <p> Time Spent : {this.state.timespent} </p>
                 </div>
        </Col>
         </Row>
       </Grid>  )
    }
    return buffer
  }

  renderAssignment(){
   var buffer = []
   for(let i=0; i<this.state.questions.length;i++){
     buffer.push(
       <Grid fluid key={i}>
       <Row around="xs">
       <Col xs={11} sm={11} md={9} lg={8}>
       <Card>
      <CardTitle className="displayQuestions" title={'Q. '+this.state.questions[i]} />
      <CardText className="displayAnswers">
      {'Ans: '+this.state.answers[i]}
      </CardText>
      </Card>
      <br /><br />
      </Col>
      </Row>
      </Grid>
    )
   }
   return buffer;
  }

  handleClose = () => {
    this.setState({acceptDialog: false,rejectDialog: false});
  };

  renderEvaluateButtons(){
    var buffer=[]
    if(this.props.userrole === 'teacher')
    buffer.push(
      <div>
      <Grid fluid  >
      <Row center="xs" middle="xs">
      <Col xs={4} sm={4} md={4} lg={1}>
      <p style={{fontWeight:'Bold'}}> Marks: </p>
      </Col>
      <Col xs={6} sm={6} md={6} lg={2}>
      <NumericInput style={numberstyle} value={this.state.assignmentMarks} precision={1} size={8} step={0.5}
      min={0} max={5} mobile={false} onChange={this.handleMarksChange.bind(this)}
    />
    </Col>
      </Row>
      </Grid>
      <br /><br />
      <Grid fluid key={new Date()}>
          <Row center="xs">
          <Col xs={11} sm={11} md={6} lg={4}>
          <FlatButton className="button" label="Accept" icon={<CheckIcon color="white"/>} onClick={this.openAcceptAssignmentDialog.bind(this)}/>
          </Col>
          <Col xs={11} sm={11} md={6} lg={4}>
          <FlatButton className="button" label="Reject" icon={<RejectIcon color="white"/>} onClick={this.openRejectAssignmentDialog.bind(this)}/>
          </Col>
          </Row>
          </Grid>
        </div>)
    else {
      buffer.push(
        <Grid fluid>
        <Row center="xs">
        <Col xs={9} sm={9} md={6} lg={5}>
        <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading" icon={<NavigationArrowBack color="white"/>}
                 className="button" onClick={()=>{this.context.router.history.goBack()}} />
        </Col>
        </Row>
        </Grid>)
    }
    return buffer
  }

  render(){

    const actions1 = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Confirm"
          primary={true}
          onTouchTap={this.acceptAssignment}
        />,
      ]
const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
    />,
    <FlatButton
      label="Confirm"
      primary={true}
      onTouchTap={this.rejectAssignment}
    />,
  ]

   if(this.state.isDataLoaded)
    return(
      <StayVisible
      {... this.props}>
      <div className="EvaluateAssignment">
      <p className="paragraph">Submitted By {this.state.email} </p>
      <Divider />
      <br />
      {this.renderInsights()}
      <br />
      {this.renderAssignment()}
      <br />
      {this.renderEvaluateButtons()}
      <Dialog
        title={"Are you sure you want to accept assignment with  "+this.state.assignmentMarks +" marks" }
        modal={true}
        actions={actions1}
        open={this.state.acceptDialog}
        autoScrollBodyContent={true}
        titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
        onRequestClose={this.handleClose}
      >
  </Dialog>
        <Dialog
          title={"Are you sure you want to reject this assignment"}
          modal={true}
          actions={actions}
          open={this.state.rejectDialog}
          autoScrollBodyContent={true}
          titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
          onRequestClose={this.handleClose}
        >
      </Dialog>
      </div>
      </StayVisible>
    )
    else
          return(
    <StayVisible
      {... this.props}>
      <br />
      <Grid fluid className="RefreshIndicator">
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
      </Grid>
        </StayVisible>)
  }
}

EvaluateAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(EvaluateAssignment)
