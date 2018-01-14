import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import Editor from '../codeeditor/Editor'

class RenderProgrammingAssignment extends Component{

constructor(){
  super();
  this.displayQuestions = this.displayQuestions.bind(this);
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
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
    <Editor state={"Assignment"} email={this.props.email}  assignmentid={this.props.assignmentid}/>

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
    </Grid>
    </div>
    )
  }
}

export default RenderProgrammingAssignment
