import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import SubjectAutoCompleteForNotesAndAssign from '../utils/SubjectAutoCompleteForNotesAndAssign.js'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import AddBox from 'material-ui/svg-icons/content/add-box'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import RaisedButton from 'material-ui/RaisedButton'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import { EditorState } from 'draft-js'
import RichTextEditor from './RichTextEditor'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorReadOnly from './RichTextEditorReadOnly'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

var properties = require('../properties.json')

class AssignmentContent extends Component{
constructor(){
  super();
  this.state={
    minDate: new Date(),
    questions: [],
    subject: '',
    showTextField: false,
    questionValue: '',
    message: '',
    controlledDate: null,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
  }
  this.renderTextField = this.renderTextField.bind(this)
  this.displayQuestions = this.displayQuestions.bind(this)
  this.Enter = this.Enter.bind(this)
}

Enter(event){
  if(event.key === 'Enter'){
    this.addQuestion()
   }
}

validateCreateAssignment = () => {
  if(this.state.subject === '')
  notify.show("Please select the subject of the assignment","warning")
  else if(this.state.controlledDate === null)
  notify.show("Please select last submission date","warning")
  else if(this.state.questions.length === 0)
  notify.show("Please add atlease one question","warning")
  else {
    this.submitCreateAssignment()
  }
}

submitCreateAssignment(){
  fetch('http://'+properties.getHostName+':8080/assignments/create', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.loggedinuser,
         subject: this.state.subject,
         batch : this.props.class,
         lastdate: this.state.controlledDate,
         message: this.state.message,
         questions: this.state.questions,
      })
    }).then(response =>{
      if(response.status === 200)
      {
      notify.show("Assignment Created successfully","success")
      this.setState({
        createAssignmentDialog: false,
        shouldRender: new Date(),
      })
      this.context.router.history.goBack()
    }else if(response.status === 302){
      this.context.router.history.push('/')
    }else{
      notify.show("Something went wrong","error")
    }
    })
}

onEditorStateChange: Function = (editorState) => {
  this.setState({
    editorState,
  });
};

onContentStateChange: Function = (contentState) => {
  var text= ''
  var blocks=contentState.blocks
   for(var i=0;i<blocks.length;i++)
   {
     text = text + blocks[i].text
   }
   this.setState({
     contentState,
     questionValue: text,
   });
};


addQuestion = () => {
  var newquestions = this.state.questions.slice()
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  var question = this.state.questionValue
  if(question.trim() === "")
  notify.show("You cannot add empty Question","warning")
  else
  {
  newquestions.push(this.state.contentState)
  newquestionEditorStates.push(this.state.editorState)
  }
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates,
    questionValue: '',
    editorState:EditorState.createEmpty(),
    showTextField: false,
  })
}



deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  newquestions.splice(i,1)
  this.setState({
    questions: newquestions
  })
}

handleSubjectChange = (subjectValue) => {
  this.setState({
    subject: subjectValue
  })
}

handleDateChange = (event, date) => {
  this.setState({
    controlledDate: date,
  });
}

handleMessageChange = (event) => {
  this.setState({
    message:event.target.value
  })
}

handleShowTextField = () => {
  this.setState({
    showTextField: true,
  })
}

displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.state.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid  key={i}>
    <Row start="xs">
    <Col xs={10} sm={10} md={11} lg={11}>
    <li className="displayQuestions"><RichTextEditorReadOnly editorState={this.state.questionsEditoStates[i]} /></li>
    </Col>
    <Col xs={2} sm={2} md={1} lg={1}>
    <IconButton onClick={this.deleteQuestion.bind(this,i)}><Delete color="red" viewBox="0 0 20 20" /></IconButton>
    </Col>
    </Row>
    </Grid>
  )
}
return buffer;
}

renderTextField(){
  var buffer=[]
  if(this.state.showTextField){
    buffer.push(
      <div key={this.state.showTextField}>
      <Grid fluid className="nogutter">
      <Row center="xs" middle="xs">
      <Col xs={10} sm={10} md={10} lg={11}>
      <RichTextEditor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange}
        onContentStateChange={this.onContentStateChange} placeholder='Start typing a question'  />
      </Col>
      <Col xs={2} sm={2} md={2} lg={1}>
      <IconButton onClick={this.addQuestion}><AddBox viewBox='0 0 20 20' color="green"/></IconButton>
      </Col>
      </Row>
      </Grid>
      <br />
      </div>)
  }
  else{
    buffer.push("")
  }
  return buffer;
}
  render(){
    return(
      <StayVisible
        {...this.props}
      >
      <div className="TeacherAssignment">
      <Grid fluid>
      <Row start="xs" bottom="xs">
      <Col xs>
      <SubjectAutoCompleteForNotesAndAssign branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
      </Col>
      <Col xs>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row start="xs">
      <Col xs>
      <TextField style={{width: '75%'}} hintText="Additional Comments" floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      </Grid>
      <ul>{this.displayQuestions()}</ul>
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      {this.renderTextField()}
      <RaisedButton label="Add Question" primary={true} icon={<Add />} onClick={this.handleShowTextField} />
      <br /><br /><br />
      <RaisedButton label = "Submit" primary={true} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
      </Col>
      </Row>
      </Grid>

      </div>
      </StayVisible>)
  }
}
AssignmentContent.contextTypes = {
    router: PropTypes.object
};

export default withRouter(AssignmentContent)
