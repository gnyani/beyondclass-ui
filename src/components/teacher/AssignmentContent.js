import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import {SubjectsNameLookup} from '../utils/Subjects.js'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import CheckIcon from 'material-ui/svg-icons/action/assignment.js'
import Save from 'material-ui/svg-icons/content/save'
import SelectField from 'material-ui/SelectField'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'
import {DeleteOutline} from '../../styledcomponents/SvgIcons'
import IconButton from 'material-ui/IconButton'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState,convertFromRaw } from 'draft-js'
import RichTextEditor from './RichTextEditor'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import RichTextEditorToolBarOnFocus from './RichTextEditorToolBarOnFocus'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import IdleTimer from 'react-idle-timer'
import Divider from 'material-ui/Divider'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

var properties = require('../properties.json')

let id = 0;

class AssignmentContent extends Component{
constructor(){
  super();
  var date = new Date();
    date.setHours(0,0,0,0)
    date.setDate(new Date().getDate()+3)
  this.state={
    minDate: new Date(new Date().setDate(new Date().getDate()+1)),
    questions: [],
    subject: '',
    showTextField: false,
    questionValue: '',
    subjectValue: '',
    message: '',
    numQuestions: 1,
    controlledDate: date,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    addQuestionDialog: false,
    submitButton: false,
    saveButton: false,
    submitConfirm: false,
    isDataLoaded: false,
    timeout: 5000,
    isIdle: false,
    totalActiveTime: null,
    postedToNetwork: false,
  }
  this.renderTextField = this.renderTextField.bind(this)
  this.displayQuestions = this.displayQuestions.bind(this)
}

handleClose = () => {
  this.setState({
    submitConfirm: false,
    addQuestionDialog: false,
  })
}

validateSaveCreateAssignment = (option) => {
  if((this.state.questions.length === 0 && option === 'autosave') || (this.state.subject === "" && option === 'autosave')){
    //do nothing
  }
  else if(this.state.questions.length === 0)
  notify.show("Please add atleast one question before you can save the assignment","warning")
  else if(this.state.subject === ""){
    notify.show("Please select the subject","warning")
  }
  else{
    this.saveCreateAssignment(option)
  }
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
componentDidMount(){
  if(this.props.assignmentid &&  this.props.assignmentid !== 'null'){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/get/'+this.props.assignmentid, {
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
          subject: response.subject,
          controlledDate: response.lastdate,
          isDataLoaded: true,
          subjectValue: SubjectsNameLookup[response.subject],
          questionsEditoStates: newEditorStates.slice(),
          numQuestions: response.numberOfQuesPerStudent,
          postedToNetwork: response.postedToNetwork
        })
      }).catch(response => {
      notify.show("Please login your session expired","error");
      this.context.router.history.push('/');
     });
   }else if(this.props.location.state){
     var response = this.props.location.state.assignment
     var newEditorStates = []
     for(let i=0; i<response.questions.length;i++){
      newEditorStates.push({id:++id,value:EditorState.createWithContent(convertFromRaw(response.questions[i]))})
     }
     this.setState({
       questions: response.questions,
       message: response.message,
       subject: response.subject,
       controlledDate: this.state.controlledDate,
       isDataLoaded: true,
       subjectValue: SubjectsNameLookup[response.subject],
       questionsEditoStates: newEditorStates.slice(),
       numQuestions: response.numberOfQuesPerStudent,
       postedToNetwork: response.postedToNetwork
     })
   }
   else{
      this.setState({
        isDataLoaded:true,
      })
    }
    this._interval = setInterval(() => {
      if(this.state.isIdle === false)
      this.setState({
        totalActiveTime: this.state.totalActiveTime + 20000
      });
      if(this.state.totalActiveTime % 20000 === 0 )
      {
        this.validateSaveCreateAssignment('autosave')
      }
    }, 20000);
}

componentWillUnmount() {
    clearInterval(this._interval);
}

_onActive = () => {
   this.setState({ isIdle: false });
 }

 _onIdle = () => {
   this.setState({
     isIdle: true,
    });
 }
 getBody = () => {
   var buffer = ''
   if(this.props.location.state){
   buffer = {
     email: this.props.loggedinuser,
     subject: this.state.subject,
     batch : this.props.class,
     lastdate: this.state.controlledDate,
     message: this.state.message,
     questions: this.state.questions,
     assignmentType: 'THEORY',
     numberOfQuesPerStudent: this.state.numQuestions,
     postedToNetwork: this.state.postedToNetwork,
     author: {
         questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
         realOwner: this.props.location.state.assignment.author.realOwner,
       },
     }
   }
  else{
      buffer = {
        email: this.props.loggedinuser,
        subject: this.state.subject,
        batch : this.props.class,
        lastdate: this.state.controlledDate,
        message: this.state.message,
        questions: this.state.questions,
        assignmentType: 'THEORY',
        numberOfQuesPerStudent: this.state.numQuestions,
        postedToNetwork: this.state.postedToNetwork,
     }
   }
   return buffer
 }

saveCreateAssignment = (option) => {
  this.setState({
    saveButton: true,
  })
  fetch('http://'+properties.getHostName+':8080/assignments/create/save', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify(this.getBody())
    }).then(response =>{
      this.setState({
        saveButton: false,
      })
      if(response.status === 200 && option === 'autosave')
      {
      notify.show("Assignment Auto-Saved successfully","success")
     }
      else if(response.status === 200)
      {
      notify.show("Assignment Saved successfully","success")
      this.context.router.history.goBack()
    }else{
      notify.show("Something went wrong please try again","error")
    }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}
getAssignmentBody = () => {
  var buffer = ''
  if(this.props.location.state){
    buffer = {
      email: this.props.loggedinuser,
      subject: this.state.subject,
      batch : this.props.class,
      lastdate: this.state.controlledDate,
      message: this.state.message,
      questions: this.state.questions,
      assignmentType: 'THEORY',
      numberOfQuesPerStudent: this.state.numQuestions,
      postedToNetwork: this.state.postedToNetwork,
      author: {
        questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
        realOwner: this.props.location.state.assignment.author.realOwner,
      }
   }
  }else{
    buffer = {
      email: this.props.loggedinuser,
      subject: this.state.subject,
      batch : this.props.class,
      lastdate: this.state.controlledDate,
      message: this.state.message,
      questions: this.state.questions,
      assignmentType: 'THEORY',
      numberOfQuesPerStudent: this.state.numQuestions,
      postedToNetwork: this.state.postedToNetwork,
    }
  }
  return buffer
}
submitCreateAssignment = (option) => {
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
       body: JSON.stringify(this.getAssignmentBody())
    }).then(response =>{
      this.setState({
        submitButton: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Created successfully","success")
      this.context.router.history.goBack()
    }else{
      notify.show("Something went wrong please try again","error")
    }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
   if(this.props.location.state){
     fetch('http://'+properties.getHostName+':8080/teachersnetwork/questionset/'+this.props.location.state.assignment.author.questionSetReferenceId+'/adduser/',{
       method: 'POST',
       headers: {
             'mode': 'cors',
             'Content-Type': 'application/json'
         },
     credentials: 'include',
     body: JSON.stringify(this.props.location.state.assignment.author.realOwner),
      }).catch(response => {
      notify.show("Please login your session expired","error");
      this.context.router.history.push('/');
     });
    }
}

onEditorStateChange: Function = (editorState) => {
  this.setState({
    editorState,
  });
};

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
  newquestionEditorStates.push({id:++id,value:this.state.editorState})
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates,
    questionValue: '',
    editorState:EditorState.createEmpty(),
    showTextField: false,
    addQuestionDialog: false,
  })
 }
}

handleAddQuestionDialog = () => {
  this.setState({
    addQuestionDialog: true,
  })
}


deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  newquestions.splice(i,1)
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  newquestionEditorStates.splice(i,1)
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates
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

displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.state.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid key={this.state.questionsEditoStates[i].id}>
    <Row start="xs" bottom="xs">
    <Col xs={10} sm={10} md={11} lg={11}>
    <RichTextEditorToolBarOnFocus editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px',borderTop:'2px solid darkgery'}}
    onEditorStateChange={this.onArrayEditorStateChange} onContentStateChange={this.onArrayContentStateChange}
    questionNumber = {i}
    editorState={this.state.questionsEditoStates[i].value} />
    </Col>

    <Col xs={2} sm={2} md={1} lg={1}>
    <IconButton onClick={this.deleteQuestion.bind(this,i)}><DeleteOutline color="red" /></IconButton>
    </Col>
    </Row>
    </Grid>
  )
}
return buffer;
}

renderTextField(){
  var buffer=[]
    buffer.push(
      <div key={this.state.showTextField}>
      <Grid fluid className="nogutter">
      <Row center="xs" middle="xs">
      <Col xs={10} sm={10} md={10} lg={11}>
      <RichTextEditor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange}
        onContentStateChange={this.onContentStateChange} placeholder='Start typing a question'  />
      </Col>
      </Row>
      </Grid>
      <br />
      </div>)
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

      const actions1 = [
        <FlatButton
          label="Add"
          primary={true}
          onTouchTap={this.addQuestion}
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
            <Col xs lg={9}>
              <h4 className="paragraph" style={{margin: '20px 0px'}}>Theory Assignment</h4>
              <Divider />
            </Col>
          </Row>
        </Grid>
      <br />
      <Grid fluid className="cont">
      <Row center="xs" bottom="xs">
      <Col xs>
      <SubjectAutoComplete type="syllabus" branch={this.props.branch} searchText={this.state.subjectValue} handleSubjectChange={this.handleSubjectChange} />
      </Col>
      <Col xs>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" defaultDate={new Date(this.state.controlledDate)} minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '81%'}} value={this.state.message}  floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      <br />
      <Row center="xs" middle='xs'>
      <Col xs={8} sm={8} md={7} lg={7} >
      <h4 className="robfont">Number of Questions to be given to each Student:</h4>
      </Col>
      <Col xs={4} sm={4} md={5} lg={5} className="text-left">
      <SelectField
        value={this.state.numQuestions}
        onChange={this.handleNumberChange}
        style={{width: '50%'}}
        maxHeight={200}
      >
        <MenuItem value={1}  primaryText="One" />
        <MenuItem value={2}  primaryText="Two" />
        <MenuItem value={3}  primaryText="Three" />
        <MenuItem value={4}  primaryText="Four" />
        <MenuItem value={5}  primaryText="Five" />
        <MenuItem value={6}  primaryText="Six" />
        <MenuItem value={7}  primaryText="Seven" />
        <MenuItem value={8}  primaryText="Eight" />
        <MenuItem value={9}  primaryText="Nine" />
        <MenuItem value={10}  primaryText="Ten" />
      </SelectField>
      </Col>
      </Row>
      <Divider style={{margin: '18px 0px 18px'}}/>
      <Row >
        <Col xs={7} sm={7} md={10} lg={10}>
          <FlatButton label="Add Question" labelStyle ={{textTransform: 'none'}}
             style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
            primary={true} icon={<Add />} onClick={this.handleAddQuestionDialog} />
        </Col>
        <Col xs={4} sm={4} md={2} lg={2} className="text-center">
          <FlatButton label = "Save" primary={true} labelStyle ={{textTransform: 'none'}}
            style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
            disabled={this.state.saveButton} icon={<Save />} onClick={this.validateSaveCreateAssignment.bind('save')} />
        </Col>
        <Col xs={1} sm={1} md={1} lg={1}>
        </Col>
      </Row>
      {this.displayQuestions()}
      <br /><br />
      <br /><br />
      <Row end='xs' middle='xs' style={{marginBottom: '40px'}}>
      <Col xs style={{textAlign:'left'}}>
          <FlatButton key={1} label="Go Back"
            alt="loading" icon={<NavigationArrowBack color="#30b55b"/>} labelStyle ={{textTransform: 'none'}}
            style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
           onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      <Col xs>
      <FlatButton label = "Schedule" primary={true} labelStyle ={{textTransform: 'none'}}
         style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        disabled={this.state.submitButton} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
      </Col>
      </Row>
      </Grid>
      <br /><br />
      <Dialog
            title={"Are you sure about creating this assignment with last date : "+this.state.controlledDate+", Once submitted it cannot be deleted"}
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      <Dialog
            title={"Add Question"}
            modal={false}
            actions={actions1}
            open={this.state.addQuestionDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          {this.renderTextField()}
      </Dialog>
      </div>
      <IdleTimer
      ref="idleTimer"
      activeAction={this._onActive}
      idleAction={this._onIdle}
      timeout={this.state.timeout}
      startOnLoad={false}
      format="MM-DD-YYYY HH:MM:ss.SSS">

      {/*<h1>Time Spent: {this.state.totalActiveTime}</h1>*/}
      </IdleTimer>
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
