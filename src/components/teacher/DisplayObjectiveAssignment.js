import React,{Component} from 'react'
import { EditorState,convertFromRaw } from 'draft-js'
import {Grid, Row, Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import ColoredStudentOptions from './ColoredStudentOptions'

class DisplayObjectiveAssignment extends Component{

convertToEditorState = (object) => {
  const contentState = convertFromRaw(object)
  const editorState = EditorState.createWithContent(contentState)
  return editorState
}

displayQuestions = () => {
  var buffer = []
  for(var i=0; i< this.props.questions.length; i++){
    buffer.push(
      <div key={i}>
      <Grid fluid>
      <Row around="xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <div className='shadow'>
      <RichTextEditorReadOnly editorStyle={{borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.props.questions[i])} />
      </div>
      </Col>
      </Row>
      <Row around = "xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <div className='shadow'>
      <ColoredStudentOptions options = {this.props.options[i]} userValidity = {this.props.userValidity[i]}
      validity = {this.props.validity[i]}/>
      </div>
      </Col>
      </Row>
      </Grid>
      </div>
    )
  }
  return buffer
}

  render(){
    return(
      <div>
      {this.displayQuestions()}
      </div>
    )
  }
}

export default DisplayObjectiveAssignment
