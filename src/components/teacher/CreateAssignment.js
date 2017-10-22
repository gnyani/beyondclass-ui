import React,{Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Add from 'material-ui/svg-icons/content/add'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import AssignmentContent from './AssignmentContent'
import ListAssignments from './ListAssignments'
import {notify} from 'react-notify-toast'

var properties = require('../properties.json');

class CreateAssignment extends Component{
constructor(){
  super();
  this.state={
    createAssignmentDialog : false,
    questions: [],
    subject: '',
    showTextField: false,
    questionValue: '',
    message: '',
    controlledDate: null,
    shouldRender: null,
  }
  this.openCreateAssignmentDialog = this.openCreateAssignmentDialog.bind(this)
  this.handleSubjectChange = this.handleSubjectChange.bind(this)
  this.validateCreateAssignment = this.validateCreateAssignment.bind(this)
}
openCreateAssignmentDialog(){
  this.setState({
    createAssignmentDialog: true
  })
}

handleMessageChange = (event) => {
  this.setState({
    message:event.target.value
  })
}

validateCreateAssignment(){
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
         email: this.props.email,
         subject: this.state.subject,
         batch : this.props.class,
         lastdate: this.state.controlledDate,
         message: this.state.message,
         questions: this.state.questions,
      })
    }).then(response =>{
      if(response.status === 200)
      notify.show("Assignment Created successfully","success")
      this.setState({
        createAssignmentDialog: false,
        shouldRender: new Date(),
      })
    })
}

handleQuestionValue = (event) =>{
  this.setState({
    questionValue: event.target.value
  })
}

handleDateChange = (event, date) => {
  this.setState({
    controlledDate: date,
  });
};

addQuestion = () => {
  var newquestions = this.state.questions.slice()
  var question = this.state.questionValue
  if(question.trim() === "")
  notify.show("You cannot add empty Question","warning")
  else
  {
  if(question[question.length-1] === '?' || question[question.length-2] === '?')
  newquestions.push(question)
  else {
    newquestions.push(question+'?')
  }
  this.setState({
    questions: newquestions,
    questionValue: '',
    showTextField: false,
  })
}
}

handleShowTextField = () => {
  this.setState({
    showTextField: true,
  })
}
deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  newquestions.splice(i,1)
  this.setState({
    questions: newquestions
  })
}

handleSubjectChange(subjectValue){
  this.setState({
    subject: subjectValue
  })
}

handleClose = () => {
  this.setState({createAssignmentDialog: false});
};

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
        onTouchTap={this.validateCreateAssignment}
      />,
    ]
    return(<div>
      <Grid fluid>
      <Row center='xs'>
      <Col xs>
      <br />
      <RaisedButton label="New Assignment" primary={true} icon={<Add />} onClick={this.openCreateAssignmentDialog} />
      <br /> <br />
      </Col>
      </Row>
      </Grid>
      <Divider />
      <br />
      <ListAssignments class={this.props.class} email={this.props.email} key={this.state.shouldRender} branch={this.props.branch}/>
      <Dialog
            title="Create New Assignment"
            modal={true}
            actions={actions1}
            open={this.state.createAssignmentDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          <AssignmentContent branch={this.props.branch} handleSubjectChange={this.handleSubjectChange}
          showTextField={this.state.showTextField} handleShowTextField={this.handleShowTextField}
          addQuestion={this.addQuestion} handleQuestionValue={this.handleQuestionValue}
          questions={this.state.questions} deleteQuestion={this.deleteQuestion}
          handleMessageChange={this.handleMessageChange} handleDateChange={this.handleDateChange}
           />
      </Dialog>
      </div>)
  }
}


export default CreateAssignment
