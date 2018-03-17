import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Grid,Row,Col} from 'react-flexbox-grid'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorReadOnly from './RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'

var properties = require('../properties.json');

class ViewQuestions extends Component{

constructor(){
  super()
  this.state={
    questions: [],
    isDataLoaded: false,
  }
}


componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/getquestions', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: this.props.assignmentid
    }).then(response => {
      if(response.status === 200){
       return response.json()
      }
    }).then(response =>{
      this.setState({
        questions: response,
        isDataLoaded: true,
      })
    }).catch(response =>{
      notify.show("Please login before viewing questions")
      this.context.router.history.push('/');
    })
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
}

renderAssignmentQuestions(){
  var buffer=[]
  var questions=this.state.questions
  for(let i=0;i<questions.length;i++){
  buffer.push(<li key={i}><RichTextEditorReadOnly editorStyle={{position: 'relative',bottom: '3.5vmin'}} editorState={this.convertToEditorState(questions[i])} /></li>)
  }
  return buffer;
}


  render(){
    if(this.state.isDataLoaded)
    return(
      <div>
      <ul>{this.renderAssignmentQuestions()}</ul>
      </div>
    )
    else
    return(
      <Grid fluid className="RefreshIndicator" key={1}>
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
    )
  }
}

ViewQuestions.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ViewQuestions)
