import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import {notify} from 'react-notify-toast'
import RaisedButton from 'material-ui/RaisedButton'
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'
import Editor from '../codeeditor/Editor'

var properties = require('../properties.json')

class RenderProgrammingAssignment extends Component{

constructor(){
  super();
  this.state={
    saveButton : false,
    submitButton: false,
    source: [],
    language: [],
    theme: [],
    timespent: 0,
  }
  this.displayQuestions = this.displayQuestions.bind(this);
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
}

componentDidMount(){

}

saveProgrammingAssignment = (option) => {
  this.setState({
    saveButton: true
  })
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/assignment/save', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.value,
         language: this.state.mode,
         tempassignmentid: this.props.assignmentid,
         theme: this.state.theme,
         email: this.props.email,
         timespent : this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        if(option === 'autosave')
        notify.show("Your work got autosaved","success")
        notify.show("Assignment Saved successfully","success")
        return response.text()
      }
      else{
        notify.show("Sorry something went wrong please try again","error")
      }
    }).then(response =>{
      this.setState({
        saveButton : false
      })
    })

}

displayQuestions(){
  var buffer =[]
  for(let i=0 ; i < this.props.questions.length ;i++){
    buffer.push(<div key={i}>
      <Grid fluid>
      <Row center="xs">
      <Col xs>
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.props.questions[i])} />
      <br />
      </Col>
      </Row>
      </Grid>
    <Editor state={"Assignment"} questionnumber={i} email={this.props.email}  assignmentid={this.props.assignmentid}/>

      <br />
      <br />
      </div>)
  }
  return buffer
}

  render(){
    return(
    <div >
    <Grid fluid>
    <Row center="xs" bottom="xs">
    <Col xs>
    <br />
    {this.displayQuestions()}
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={6} sm={6} md={4} lg={3}>
    <RaisedButton label="Save" primary = {true} icon={<Save />} disabled={this.state.saveButton} />
    </Col>
    <Col xs={6} sm={6} md={4} lg={3}>
    <RaisedButton label="Submit" primary = {true} icon={<Send />} disabled={this.state.submitButton} onClick={this.handleSubmit}/>
    </Col>
    </Row>
    </Grid>
    <br /><br />
    </div>
    )
  }
}

export default RenderProgrammingAssignment
