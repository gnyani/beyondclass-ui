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
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import DisplayProgrammingAssignment from './DisplayProgrammingAssignment'
import Dialog from 'material-ui/Dialog'
import RenderCodingAssignmentResult from '../codeeditor/RenderCodingAssignmentResult'

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
     insight1: '',
     insight2: '',
     assignmentType: '',
     mode: '',
     inputs: [],
     outputs: [],
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
              window.location.reload()
           }else{
             notify.show('Sorry something Went wrong',"error")
           }
         }).then(response =>{

           this.setState({
             questions:response.createAssignment.questions,
             answers:response.submitAssignment.answers,
             assignmentType: response.createAssignment.assignmentType,
             timespent: response.timespent,
             inputs: response.createAssignment.inputs,
             outputs: response.createAssignment.outputs,
             codingAssignmentResponse : response.submitAssignment.codingAssignmentResponse,
             mode: response.submitAssignment.mode,
             isDataLoaded: true,
           })
         })

 fetch('http://'+properties.getHostName+':8080/assignments/teacher/insights/'+this.props.submissionid.replace('*','-'), {
          credentials: 'include',
          method: 'GET'
       }).then(response => {
         if(response.status === 200)
         return response.json()
         else if(response.status === 302)
          window.location.reload()
       }).then( response => {
         var insight1 = (response.insight1 !== null ? response.insight1 : '' )
         var insight2 = (response.insight2 !== null ? response.insight2 : '' )
         this.setState({
           insight1: insight1,
           insight2: insight2
         })
       })
  }
  rejectAssignment = () => {
    fetch('http://'+properties.getHostName+':8080/assignments/update/evaluation/'+this.state.assignmentid+'-'+this.state.email, {
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
          window.location.reload()
       }
         else {
           notify.show("Sorry Something Went Wrong","error")
         }
         this.handleClose()
       })
  }

  convertToEditorState = (object) => {
  const contentState = convertFromRaw(object)
  const editorState = EditorState.createWithContent(contentState)
  return editorState
  }

  acceptAssignment = () => {
    fetch('http://'+properties.getHostName+':8080/assignments/update/evaluation/'+this.state.assignmentid+'-'+this.state.email, {
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
         window.location.reload()
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
    var response = this.state.codingAssignmentResponse
    if(this.props.userrole === 'teacher' && this.state.assignmentType==='THEORY'){
      buffer.push(
        <Grid fluid key={1}>
        <Row around="xs">
        <Col xs={11} sm={11} md={9} lg={8}>
                <div >
                <fieldset>
                  <legend >Summary</legend>
                  <p> Time Spent : {this.state.timespent} </p>
                  <p>{this.state.insight1}</p>
                  <p>{this.state.insight2}</p>
                  </fieldset>
                 </div>
        </Col>
         </Row>
       </Grid>  )
    }else if(this.props.userrole === 'teacher' && this.state.assignmentType==='CODING'){
      console.log("response status is" + response.codingAssignmentStatus)
      buffer.push(
        <div key={1}>
        <RenderCodingAssignmentResult assignmentStatus={response.codingAssignmentStatus} expected={response.expected}
         actual={response.actual} errorMessage={response.errorMessage}
         failedCase={response.failedCase} passCount={response.passCount} totalCount={response.totalCount}/>
         </div>
      )
    }
    return buffer
  }

  renderAssignment(){
   var buffer = []
if(this.state.assignmentType ===  'THEORY')
{
   for(let i=0; i<this.state.questions.length;i++){
     buffer.push(
       <Grid fluid key={i}>
       <Row around="xs">
       <Col xs={11} sm={11} md={9} lg={8}>
       <Card>
      <CardTitle className="displayQuestions" title={<RichTextEditorReadOnly editorState={this.convertToEditorState(this.state.questions[i])} />} />
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
 }else{
   buffer.push(
     <div key={1}>
     <DisplayProgrammingAssignment mode={this.state.mode} questions={this.state.questions}
     source={this.state.answers} inputs={this.state.inputs} outputs={this.state.outputs}/>
     </div>
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
      <div key={1}>
      <Grid fluid  >
      <Row center="xs" middle="xs">
      <Col xs={4} sm={4} md={4} lg={1}>
      <p style={{fontWeight:'Bold'}}> Marks: </p>
      </Col>
      <Col xs={6} sm={6} md={6} lg={2}>
      <NumericInput style={numberstyle} value={this.state.assignmentMarks} precision={1} size={8} step={0.5}
      min={1} max={5} mobile={false} onChange={this.handleMarksChange.bind(this)}
    />
    </Col>
      </Row>
      </Grid>
      <br /><br />
      <Grid fluid >
          <Row center="xs">
          <Col xs={11} sm={11} md={6} lg={4}>
          <FlatButton className="button" label="Accept" icon={<CheckIcon color="white"/>} onClick={this.openAcceptAssignmentDialog.bind(this)}/>
          </Col>
          <Col xs={11} sm={11} md={6} lg={4}>
          <FlatButton className="button" label="Reject" icon={<RejectIcon color="white"/>} onClick={this.openRejectAssignmentDialog.bind(this)}/>
          </Col>
          </Row>
          <br /><br />
          </Grid>
        </div>)
    else {
      buffer.push(
        <Grid fluid key={1}>
        <Row center="xs">
        <Col xs={9} sm={9} md={6} lg={5}>
        <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading" icon={<NavigationArrowBack color="white"/>}
                 className="button" onClick={()=>{this.context.router.history.goBack()}} />
        <br /><br />
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
