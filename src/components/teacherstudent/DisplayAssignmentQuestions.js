import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
class DisplayAssignmentQuestions extends Component{

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
      <Row start="xs">
      <Col xs>
      <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.props.questions[i])} />
      <br />
      </Col>
      </Row>
      <Row start="xs">
      <Col xs={11} sm={11} md={10} lg={10}>
      <div className="paper">
      <div className="paper-content">
    <textarea key={i} placeholder="Start Typing Your Answer" value={this.props.answers[i]}
    onDrag={(event)=>{event.preventDefault()}} onDrop={(event)=>{event.preventDefault()}}
    onCut={(event)=>{event.preventDefault()}} onCopy={(event)=>{event.preventDefault()}}
    onPaste={(event)=>{event.preventDefault()}} onChange={this.props.handleAnswerChange.bind(this,i)}
    autoComplete='off' />
    </div></div>
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
    return(
    <div className="DisplayAssignmentQuestions">
     {this.displayQuestions()}
    </div>
    )
  }
}

export default DisplayAssignmentQuestions
