import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import RichTextEditorAndCopyPasteDisabled from './RichTextEditorAndCopyPasteDisabled'
import IdleTimer from 'react-idle-timer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'

var properties = require('../properties.json');

class DisplayAssignmentQuestions extends Component{

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
     editorState: EditorState.createEmpty(),
     contentState: '',
     submitButton: false,
     saveButton: false,
     answersEditorStates: [],
     answersContentStates: [],
     confirmSubmitDialog: false,
  }
  this.displayQuestions = this.displayQuestions.bind(this);
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
}

saveOrSubmit = (option) => {
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
saveAssignment = (option) => {
   this.setState({
     saveButton: true,
   })
  fetch('http://'+properties.getHostName+':8080/assignments/student/save', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.email,
         tempassignmentid: this.props.assignmentid,
         answers: this.state.answers,
         answersContentStates: this.state.answersContentStates,
         timespent: this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        if(option === 'autosave' )
        notify.show("Your work is auto saved","success")
        else{
          notify.show('Your work is saved,you can come back anytime here to continue',"success")
          this.context.router.history.goBack()
        }
      }else if(response.status === 500){
        notify.show('Sorry something went wrong please try again',"error")
      }
      this.setState({
        saveButton: false,
      })
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}
submitAssignment = () => {
  this.setState({
    submitButton: true,
  })
  fetch('http://'+properties.getHostName+':8080/assignments/student/submit', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.email,
         tempassignmentid: this.props.assignmentid,
         answers: this.state.answers,
         answersContentStates: this.state.answersContentStates,
         timespent: this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        notify.show('Your Assignment got submitted successfully',"success")
        this.context.router.history.goBack()
      }else if(response.status === 500){
        notify.show('Sorry something went wrong please try again',"error")
      }
      this.setState({
        submitButton: false,
      })
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}
isValidForSaveOrSubmit = () => {
  var flag = false
  for(let i=0 ; i < this.state.questions.length ; i++)
  {
    if(typeof this.state.answers[i] !== "undefined" && this.state.answers[i] !== null){
      let answer = this.state.answers[i].trim()
      if(answer !== ''){
        flag = true
      }
    }else{
      notify.show("Please attempt all the answers", "warning")
      flag = false
      break;
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



componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/get/'+this.props.assignmentid, {
         method: 'POST',
         credentials: 'include',
         headers: {
             'mode': 'cors',
             'Content-Type': 'application/json'
           },
         body: this.props.email,
     }).then(response => {
       if(response.status === 200)
       return response.json()
       else if(response.status === 403){
         notify.show("You might have already submitted the assignment or the assignment got expired","warning")
         this.context.router.history.goBack()
       }
       else{
         notify.show("something is not right","error")
       }
     }).then(response => {
        var newanswersEditorStates = []
        for(var i=0; i< response.questions.length ; i++){
          if(response.answersContentStates){
            if(typeof response.answersContentStates[i] !== "undefined"  && response.answersContentStates[i] !== null){
             newanswersEditorStates.push(EditorState.createWithContent(convertFromRaw(response.answersContentStates[i])))
           }else{
             newanswersEditorStates.push(this.state.editorState)
           }
         }else{
           newanswersEditorStates.push(this.state.editorState)
         }
        }
          this.setState({
                questions: response.questions,
                answers: response.answers || [],
                answersContentStates: response.answersContentStates || [],
                answersEditorStates: newanswersEditorStates,
                assignmentType: response.assignmentType,
                totalActiveTime: response.timespent,
              })
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


onArrayEditorStateChange: Function = (index,editorState) => {
  var newEditorStates = this.state.answersEditorStates.slice()
  newEditorStates[index] = editorState
  this.setState({
    answersEditorStates: newEditorStates
  });
};

onArrayContentStateChange: Function = (index,contentState) => {
  var text= ''
  var blocks=contentState.blocks
   for(var i=0;i<blocks.length;i++)
   {
     text = text + blocks[i].text
   }
   if(text.trim() !== ''){
    var newAnswers = this.state.answers.slice()
    newAnswers[index] = text
    var newContentStates = this.state.answersContentStates.slice()
    newContentStates[index] = contentState
    this.setState({
      answers: newAnswers,
      answersContentStates: newContentStates
    })
   }
};

displayQuestions(){
  var buffer =[]
  for(let i=0 ; i < this.state.questions.length ;i++){
    buffer.push(<div key={i}>
      <Grid fluid>
      <Row start="xs">
      <Col xs>
      <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.state.questions[i])} />
      <br />
      </Col>
      </Row>
      <Row start="xs">
      <Col xs>
        <RichTextEditorAndCopyPasteDisabled editorStyle={{borderStyle:'solid',borderWidth:'0.1px', height: '180px'}}
          editorState={this.state.answersEditorStates[i]}
          onEditorStateChange={this.onArrayEditorStateChange} onContentStateChange={this.onArrayContentStateChange}
          questionNumber = {i}
          />
      <br />
      </Col>
      </Row>
      </Grid>
      <br />
      </div>)
  }
  return buffer
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

    return(
    <div className="DisplayAssignmentQuestions">
     {this.displayQuestions()}
     <Grid fluid>
     <Row start="xs">
     <Col xs={11} sm={11}  md={10} lg={10}>
     <Grid fluid className="nogutter">
     <Row end="xs" top="xs">
     <Col lg={8}>
     <FlatButton label="Save"
       disabled={this.state.saveButton} labelStyle={{textTransform: 'none'}}
       style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        icon={<Save />} onClick={this.saveOrSubmit.bind(this,'save')}/>
     </Col>
     <Col lg={2}>
     <FlatButton label="Submit" className="AnnounceButton" labelStyle={{textTransform: "none", fontSize: '1em'}}
       disabled={this.state.submitButton}
        icon={<Send color="white"/>} onClick={this.handleDialogOpen}/>
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
    </div>
    )
  }
}

DisplayAssignmentQuestions.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DisplayAssignmentQuestions)
