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
import DisplayObjectiveAssignment from './DisplayObjectiveAssignment'
import Dialog from 'material-ui/Dialog'
import Download from 'material-ui/svg-icons/file/file-download'
import RenderCodingAssignmentResult from './RenderCodingAssignmentResult'
import TextField from 'material-ui/TextField'
import { get } from 'lodash'

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
     questionIndex: [],
     assignmentMarks: 3,
     timespent: '',
     insight1: '',
     insight2: '',
     insight3: '',
     insight4: '',
     insight5: '',
     assignmentType: '',
     codingAssignmentResponse: [],
     mode: '',
     inputs: [],
     options: [],
     validity: [],
     outputs: [],
     userName: '',
     rollNumber: '',
     remarks: '',
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
           }else{
             notify.show('Sorry something Went wrong',"error")
           }
         }).then(response =>{
           this.setState({
             questions:response.submittedQuestions,
             answers:response.submitAssignment.answers,
             answersContentStates: response.submitAssignment.answersContentStates,
             assignmentType: response.createAssignment.assignmentType,
             timespent: response.timespent,
             questionIndex: response.submitAssignment.questionIndex,
             inputs: response.createAssignment.inputs,
             options: response.createAssignment.options,
             validity: response.createAssignment.validity,
             userValidity: response.submitAssignment.userValidity,
             outputs: response.createAssignment.outputs,
             userName: response.userName,
             rollNumber: response.rollNumber,
             remarks: get(response,'submitAssignment.remarks',''),
             codingAssignmentResponse : response.submitAssignment.codingAssignmentResponse,
             mode: response.submitAssignment.mode,
             isDataLoaded: true,
           })
         }).catch(response => {
         notify.show("Please login your session expired","error");
         this.context.router.history.push('/');
        });

 fetch('http://'+properties.getHostName+':8080/assignments/teacher/insights/'+this.props.submissionid.replace('*','-'), {
          credentials: 'include',
          method: 'GET'
       }).then(response => {
         if(response.status === 200)
         return response.json()
       }).then( response => {
         var insight1 = (response.insight1 !== null ? response.insight1 : '' )
         var insight2 = (response.insight2 !== null ? response.insight2 : '' )
         var insight3 = (response.insight3 !== null ? response.insight3 : '' )
         var insight4 = (response.insight4 !== null ? response.insight4 : '' )
         var insight5 = (response.insight5 !== null ? response.insight5 : '' )
         this.setState({
           insight1: insight1,
           insight2: insight2,
           insight3: insight3,
           insight4: insight4,
           insight5: insight5,
         })
       }).catch(response => {
       notify.show("Please login your session expired","error");
       this.context.router.history.push('/');
      });
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
           remarks: this.state.remarks,
           status: 'REJECTED',
         })
       }).then(response => {
         if(response.status === 200)
         {notify.show("Assignment Evaluated Successfully","success")
         this.context.router.history.goBack()
       }
         else {
           notify.show("Sorry Something Went Wrong","error")
         }
         this.handleClose()
       }).catch(response => {
       notify.show("Please login your session expired","error");
       this.context.router.history.push('/');
      });
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
           remarks: this.state.remarks,
           status: 'ACCEPTED',
         })
       }).then(response => {
         if(response.status === 200)
         {notify.show("Assignment Evaluated Successfully","success")
         this.context.router.history.goBack()
       }
         else {
           notify.show("Sorry Something Went Wrong","error")
         }
         this.handleClose()
       }).catch(response => {
       notify.show("Please login your session expired","error");
       this.context.router.history.push('/');
      });
  }

  handleMarksChange(valueAsNumber){
    this.setState({
      assignmentMarks: valueAsNumber
    })
  }

handleRemarksChange = (event) =>{
  this.setState({
    remarks: event.target.value
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

  showRemarks = () => {
    var buffer = []

  if(this.state.remarks && this.state.remarks.trim() !== '')
  buffer.push(
    <p key={new Date()}>Remarks from your teacher : {this.state.remarks}</p>
  )

return buffer
  }

  renderInsights(){
    var buffer = []
    if(this.props.userrole === 'teacher' ){
      buffer.push(
        <Grid fluid key={1}>
        <Row around="xs">
        <Col xs={11} sm={11} md={9} lg={8} className="mtop">
                <div className='shadow'>
                <fieldset>
                  <h3 >Insights<hr></hr></h3>
                  <p> Time Spent : {this.state.timespent} </p>
                  <p>{this.state.insight1}</p>
                  <p>{this.state.insight2}</p>
                  <p>{this.state.insight3}</p>
                  <p>{this.state.insight4}</p>
                  <p>{this.state.insight5}</p>
                  </fieldset>
                 </div>
        </Col>
         </Row>
       </Grid>  )
    }else{
      var src = 'http://'+properties.getHostName+':8080/assignments/get/questions/'+this.state.assignmentid
      buffer.push(
        <Grid fluid key={0}>
          <br /><br />
        <Row around="xs">
        <form method="get" action={src}>
          <FlatButton type="submit" labelStyle={{textTransform: 'none'}}
            style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
            primary={true} label="Download All Questions" className="download" icon={<Download />}/>
        </form>
        </Row>
        <br /><br />
       </Grid>
      )
     if(this.state.assignmentType === 'OBJECTIVE'){
       buffer.push(
         <Grid fluid key={1}>
         <Row around="xs">
         <Col xs={11} sm={11} md={9} lg={8} className="mtop">
                 <div className='shadow'>
                 <fieldset>
                  <h3 >Insights<hr></hr></h3>
                   <p> Time Spent : {this.state.timespent} </p>
                   <p>{this.state.insight1}</p>
                   {this.showRemarks()}
                   </fieldset>
                  </div>
         </Col>
          </Row>
        </Grid>  )
     }else{
       buffer.push(
         <Grid fluid key={1}>
         <Row around="xs">
         <Col xs={11} sm={11} md={9} lg={8} className="mtop">
                 <div className='shadow'>
                 <fieldset>
                 <h3 >Insights<hr></hr></h3>
                   <p> Time Spent : {this.state.timespent} </p>
                   {this.showRemarks()}
                   </fieldset>
                  </div>
         </Col>
          </Row>
        </Grid>  )
     }
    }
    return buffer
  }

  renderAssignment(){
   var buffer = []
   var response = this.state.codingAssignmentResponse

if(this.state.assignmentType ===  'THEORY')
{
   for(let i=0; i<this.state.questions.length;i++){
     buffer.push(
       <Grid fluid key={i}>
       <Row around="xs">
       <Col xs={11} sm={11} md={9} lg={8}>
       <Card>
      <CardTitle className="displayQuestions" title={<RichTextEditorReadOnly editorState={this.convertToEditorState(this.state.questions[i])} style={{margin:'0px;'}}/>} />
      <hr style={{margin: '5px 15px'}}></hr>
      <CardText className="displayAnswers">
      <RichTextEditorReadOnly editorState={this.convertToEditorState(this.state.answersContentStates[i])} editorStyle={{height: '180px'}}/>
      </CardText>
      </Card>
      <br /><br />
      </Col>
      </Row>
      </Grid>
    )
   }
 }else if(this.state.assignmentType === 'OBJECTIVE'){
   buffer.push(<DisplayObjectiveAssignment key={1} questions={this.state.questions} options={this.state.options}
     userValidity={this.state.userValidity} validity={this.state.validity}/>)
 }else{
   for(var i=0; i<this.state.questionIndex.length;i++){
   buffer.push(
     <div key={i}>
     <RenderCodingAssignmentResult assignmentStatus={response[i].codingAssignmentStatus} expected={response[i].expected}
      actual={response[i].actual} errorMessage={response[i].errorMessage} runtime={response[i].runtime || ""} memory={response[i].memory || ""}
      failedCase={response[i].failedCase} passCount={response[i].passCount} totalCount={response[i].totalCount}/>
      <br /><br />
     <DisplayProgrammingAssignment mode={this.state.mode[i]} question={this.state.questions[i]}
     source={this.state.answers[i]} inputs={this.state.inputs[this.state.questionIndex[i]]} outputs={this.state.outputs[this.state.questionIndex[i]]}/>
     </div>
   )
  }
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
      <Row center="xs">
      <TextField
       value = {this.state.remarks || ''}
       onChange = {this.handleRemarksChange}
       style={{width: "60%"}}
       floatingLabelText = "Remarks"
       />
      </Row>
      <br />
      <Row center="xs" middle="xs">
      <Col xs={4} sm={4} md={4} lg={1}>
      <p style={{fontWeight:'Bold',fontFamily:"'Roboto', sans-serif"}}> Marks: </p>
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
          <Col xs={11} sm={11} md={6} lg={4} className='text-left'>
          <FlatButton className="button" label="Accept" icon={<CheckIcon color="#30b55b"/>} onClick={this.openAcceptAssignmentDialog.bind(this)}/>
          </Col>
          <Col xs={11} sm={11} md={6} lg={4} className='text-right'>
          <FlatButton className="button" label="Reject" icon={<RejectIcon color="#30b55b"/>} onClick={this.openRejectAssignmentDialog.bind(this)}/>
          </Col>
          </Row>
          <br /><br />
          <Row center="xs">
          <Col xs={9} sm={9} md={6} lg={5}>
          <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading"
            icon={<NavigationArrowBack color="#30b55b"/>}
                   className="button" onClick={()=>{this.context.router.history.goBack()}} />
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
        <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading"
          icon={<NavigationArrowBack color="#30b55b"/>}
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
      <p className="paragraph">Submitted By {this.state.userName}({this.state.rollNumber}) </p>
      <Divider />
      <br />
      <Grid fluid>
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading"
        icon={<NavigationArrowBack color="#30b55b"/>}
               className="button" onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      </Grid>
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
