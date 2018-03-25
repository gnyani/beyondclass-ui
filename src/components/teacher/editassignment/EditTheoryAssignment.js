import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState,convertFromRaw } from 'draft-js'
import RichTextEditorToolBarOnFocus from '../RichTextEditorToolBarOnFocus'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RefreshIndicator from 'material-ui/RefreshIndicator'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

var properties = require('../../properties.json')

let id = 0;

class AssignmentContent extends Component{
constructor(){
  super();
  this.state={
    minDate: new Date(new Date().setDate(new Date().getDate()+1)),
    questions: [],
    questionValue: '',
    message: '',
    controlledDate: new Date(new Date().setDate(new Date().getDate()+3)),
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    submitButton: false,
    submitConfirm: false,
    isDataLoaded: false,
  }
  this.displayQuestions = this.displayQuestions.bind(this)
}

handleClose = () => {
  this.setState({
    submitConfirm: false,
  })
}


validateUpdateAssignment = () => {
  if(this.state.controlledDate === null)
  notify.show("Please select last submission date","warning")
  else {
    this.setState({
      submitConfirm: true
    })
  }
}

onArrayEditorStateChange: Function = (index,editorState) => {
  var newEditorStates = this.state.questionsEditoStates.slice()
  newEditorStates[index].value = editorState
  this.setState({
    questionsEditoStates: newEditorStates
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
    var newQuestions = this.state.questions.slice()
    newQuestions[index] = contentState
    this.setState({
      questions: newQuestions
    })
   }
};

componentDidMount(){
  if(this.props.assignmentid){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/get/assignment/'+this.props.assignmentid, {
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if(response.status === 200)
        return response.json()
        else if (response.status === 204 || response.status === 400) {
        }
      }).then(response => {
        if(response){
         var newEditorStates = []
        for(let i=0; i<response.questions.length;i++){
          newEditorStates.push({id:++id,value:EditorState.createWithContent(convertFromRaw(response.questions[i]))})
          }
        }
        this.setState({
          questions: response.questions,
          message: response.message,
          isDataLoaded: true,
          controlledDate: response.lastdate,
          questionsEditoStates: newEditorStates.slice(),
          numQuestions: response.numberOfQuesPerStudent,
        })
      }).catch(response => {
      notify.show("Please login your session expired","error");
      this.context.router.history.push('/');
     });
    }else{
      this.setState({
        isDataLoaded:true,
      })
    }
}
submitUpdateAssignment = () => {
  this.setState({
    submitButton: true,
    submitConfirm: false,
  })
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/update/'+this.props.assignmentid, {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         lastdate: this.state.controlledDate,
         message: this.state.message,
         questions: this.state.questions,
         assignmentType: 'THEORY',
      })
    }).then(response =>{
      this.setState({
        submitButton: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Updated successfully","success")
      this.context.router.history.goBack()
    }else{
      notify.show("Something went wrong please try again","error")
    }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
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


displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.state.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid key={this.state.questionsEditoStates[i].id}>
    <Row start="xs">
    <Col xs>
    <RichTextEditorToolBarOnFocus editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
    onEditorStateChange={this.onArrayEditorStateChange} onContentStateChange={this.onArrayContentStateChange}
    editorState={this.state.questionsEditoStates[i].value} questionNumber={i} />
    </Col>
    </Row>
    </Grid>
  )
}
return buffer;
}

  render(){
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitUpdateAssignment}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]
    if(this.state.isDataLoaded){
    return(
      <StayVisible
        {...this.props}
      >
      <div className="TeacherAssignment">
      <Grid fluid >
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <br /><br />
      <FlatButton key={1} label="Go Back"   alt="loading" icon={<NavigationArrowBack color="white"/>}
      className="button" onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row center="xs" bottom="xs">
      <Col xs>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" defaultDate={new Date(this.state.controlledDate)} minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '75%'}} value={this.state.message} hintText="Additional Comments" floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      </Grid>
      {this.displayQuestions()}
      <br /> <br />
      <Grid fluid>
      <Row center='xs' middle='xs'>
      <Col xs>
      <RaisedButton label = "Update" primary={true} disabled={this.state.submitButton} icon={<CheckIcon />} onClick={this.validateUpdateAssignment} />
      </Col>
      </Row>
      </Grid>
      <br /> <br />
      <Dialog
            title={"Are you sure about updating this assignment with last date : "+this.state.controlledDate}
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
    }else{
      return(<Grid fluid className="RefreshIndicator" key={1}>
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
      </Grid>)
    }
  }
}
AssignmentContent.contextTypes = {
    router: PropTypes.object
};

export default withRouter(AssignmentContent)
