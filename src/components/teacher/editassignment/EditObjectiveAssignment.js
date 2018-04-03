import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState, convertFromRaw } from 'draft-js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import UpdateIcon from 'material-ui/svg-icons/action/update.js'
import RichTextEditorToolBarOnFocus from '../RichTextEditorToolBarOnFocus'
import AlternateOptions from '../AlternateOptions'
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

let id=0;

class EditObjectiveAssignment extends Component{
constructor(){
  super();
  var date = new Date();
    date.setHours(0,0,0,0)
    date.setDate(new Date().getDate()+3)
  this.state={
    minDate: new Date(new Date().setDate(new Date().getDate()+1)),
    questions: [],
    questionValue: '',
    message: '',
    options:[],
    validity:[],
    controlledDate: date,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    submitButton: false,
    submitConfirm: false,
    isDataLoaded: false,
  }
  this.displayQuestions = this.displayQuestions.bind(this)
}

componentDidMount(){
  if(this.props.assignmentid){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/get/assignment/'+this.props.assignmentid, {
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if(response.status === 200)
        return response.json()
        else if (response.status === 204) {
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
          questionsEditoStates: newEditorStates.slice(),
          options: response.options.slice(),
          validity: response.validity.slice(),
          controlledDate: response.lastdate,
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

handleValidityChange = (qindex, changedValidity) => {
  if(changedValidity.length > 0){
    var newValidity = this.state.validity.slice()
    newValidity[qindex] = changedValidity
    this.setState({
      validity: newValidity
    })
  }
}

handleOptionsChange = (qindex, index, event, fourth) => {
  var Options = this.state.options.slice()
  var NewOptions = Options[qindex]
  if(event.target.value.trim() !== ''){
   NewOptions[index] = event.target.value
   Options[qindex] = NewOptions
 }else{
   NewOptions.splice(index,1)
 }
 this.setState({
   options: Options,
 })
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
         options: this.state.options,
         validity: this.state.validity,
         assignmentType: 'OBJECTIVE',
      })
    }).then(response =>{
      this.setState({
        submitButton: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Updated successfully","success")
      this.setState({
        shouldRender: new Date(),
      })
      this.context.router.history.goBack()
    }else{
      notify.show("Something went wrong please try again","error")
    }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
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
    <div key={this.state.questionsEditoStates[i].id}>
    <p className="paragraph"> Question{i+1}</p>
    <Grid fluid >
    <Row start="xs" bottom="xs">
    <Col xs={10} sm={10} md={11} lg={11}>
    <RichTextEditorToolBarOnFocus editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
    onEditorStateChange={this.onArrayEditorStateChange} onContentStateChange={this.onArrayContentStateChange}
    questionNumber = {i}
    editorState={this.state.questionsEditoStates[i].value} />
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={10} md={10} sm={7} lg={5}>
    <AlternateOptions options={this.state.options[i]}
    handleOptionsChange={this.handleOptionsChange} qindex={i}
    questionValidity={this.state.validity[i]}
    handleQuestionValidityChange={this.handleValidityChange}/>
    </Col>
    </Row>
    </Grid>
    </div>
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
      <Grid fluid>
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <br /><br />
      <FlatButton key={1} label="Go Back"   alt="loading" icon={<NavigationArrowBack color="white"/>}
      className="button" onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      <Row center="xs" bottom="xs">
      <Col xs>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} defaultDate={new Date(this.state.controlledDate)} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '75%'}} value={this.state.message} hintText="Additional Comments" floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      <br />
      </Grid>
      {this.displayQuestions()}
      <Grid fluid>
      <br />
      <Row center="xs">
      <Col xs={6} sm={6} md={4} lg={3}>
      <RaisedButton label="Update" primary={true} disabled={this.state.buttonDisabled} icon={<UpdateIcon />} onClick={this.validateUpdateAssignment} />
      </Col>
      </Row>
      <br /><br />
      </Grid>
      <Dialog
            title={"Are you sure about updating this assignment with last date : "+new Date(this.state.controlledDate)}
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
EditObjectiveAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(EditObjectiveAssignment)
