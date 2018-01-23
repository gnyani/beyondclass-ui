import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import AddBox from 'material-ui/svg-icons/content/add-box'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import SelectField from 'material-ui/SelectField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState } from 'draft-js'
import RichTextEditor from './RichTextEditor'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
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
    numQuestions: 1,
    controlledDate: null,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    submitButton: false,
    submitConfirm: false,
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

handleClose(){
  this.setState({
    submitConfirm: false,
  })
}

validateCreateAssignment = () => {
  if(this.state.subject === '')
  notify.show("Please select the subject of the assignment","warning")
  else if(this.state.controlledDate === null)
  notify.show("Please select last submission date","warning")
  else if(this.state.questions.length === 0)
  notify.show("Please add atleast one question","warning")
  else if(this.state.questions.length < this.state.numQuestions)
  notify.show("Number of Questions should be greater than or equal to the number of questions given to each student","warning")
  else {
    this.setState({
      submitConfirm: true
    })
  }
}

submitCreateAssignment = () => {
  this.setState({
    submitButton: true,
    submitConfirm: false,
  })
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
         assignmentType: 'THEORY',
         numberOfQuesPerStudent: this.state.numQuestions,
      })
    }).then(response =>{
      this.setState({
        submitButton: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Created successfully","success")
      this.setState({
        shouldRender: new Date(),
      })
      this.context.router.history.goBack()
    }else if(response.status === 302){
       window.location.reload()
    }else{
      notify.show("Something went wrong please try again","error")
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
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates,
    questionValue: '',
    editorState:EditorState.createEmpty(),
    showTextField: false,
  })
  }
}



deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  newquestions.splice(i,1)
  this.setState({
    questions: newquestions
  })
}

handleNumberChange = (event, index, numQuestions) => this.setState({numQuestions});

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

  if(this.state.showTextField === true)
   {
  this.addQuestion()
  }else{
  this.setState({
    showTextField: true,
  })
}
}

displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.state.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid  key={i}>
    <Row start="xs">
    <Col xs={10} sm={10} md={11} lg={11}>
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
    editorState={this.state.questionsEditoStates[i]} />
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
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitCreateAssignment}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]

    return(
      <StayVisible
        {...this.props}
      >
      <div className="TeacherAssignment">
      <Grid fluid>
      <Row center="xs" bottom="xs">
      <Col xs>
      <SubjectAutoComplete type="syllabus" branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
      </Col>
      <Col xs>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '75%'}} hintText="Additional Comments" floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      <br />
      <Row center="xs" middle='xs'>
      <Col xs={8} sm={8} md={7} lg={4} >
      <h4>Number of Questions to be given to each Student:</h4>
      </Col>
      <Col xs={4} sm={4} md={3} lg={3}>
      <SelectField
        value={this.state.numQuestions}
        onChange={this.handleNumberChange}
        style={{width: '50%'}}
      >
        <MenuItem value={1}  primaryText="One" />
        <MenuItem value={2}  primaryText="Two" />
        <MenuItem value={3}  primaryText="Three" />
        <MenuItem value={4}  primaryText="Four" />
        <MenuItem value={5}  primaryText="Five" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      {this.displayQuestions()}
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      <br /><br />
      {this.renderTextField()}
      <br /><br />
      <RaisedButton label="Add Question" primary={true} icon={<Add />} onClick={this.handleShowTextField} />
      <br /><br /><br />
      <RaisedButton label = "Submit" primary={true} disabled={this.state.submitButton} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
      </Col>
      </Row>
      </Grid>
      <Dialog
            title="Are you sure about creating this assignment, Once submitted it cannot be deleted or edited"
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </div>
      </StayVisible>)
  }
}
AssignmentContent.contextTypes = {
    router: PropTypes.object
};

export default withRouter(AssignmentContent)
