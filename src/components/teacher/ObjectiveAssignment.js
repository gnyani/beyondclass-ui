import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import AddBox from 'material-ui/svg-icons/content/add-box'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState, convertFromRaw } from 'draft-js'
import RichTextEditor from './RichTextEditor'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {SubjectsNameLookup} from '../utils/Subjects.js'
import MenuItem from 'material-ui/MenuItem'
import RichTextEditorToolBarOnFocus from './RichTextEditorToolBarOnFocus'
import AlternateOptions from './AlternateOptions'
import Save from 'material-ui/svg-icons/content/save'
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

let id=0;

class ObjectiveAssignment extends Component{
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
    message: '',
    numQuestions: 1,
    options:[],
    validity:[],
    questionOptions: [],
    questionValidity: [],
    controlledDate: date,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    submitButton: false,
    submitConfirm: false,
    timeout: 5000,
    isIdle: false,
    totalActiveTime: null,
    saveButton: false,
    isDataLoaded: false,
  }
  this.renderTextField = this.renderTextField.bind(this)
  this.displayQuestions = this.displayQuestions.bind(this)
}

componentDidMount(){
  if(this.props.assignmentid && this.props.assignmentid !== 'null'){
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
          isDataLoaded: true,
          questionsEditoStates: newEditorStates.slice(),
          options: response.options.slice(),
          validity: response.validity.slice(),
          subjectValue: SubjectsNameLookup[response.subject],
          numQuestions: response.numberOfQuesPerStudent,
          controlledDate: response.lastdate,
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
        isDataLoaded: true,
        questionsEditoStates: newEditorStates.slice(),
        options: response.options.slice(),
        validity: response.validity.slice(),
        subjectValue: SubjectsNameLookup[response.subject],
        numQuestions: response.numberOfQuesPerStudent,
        controlledDate: response.lastdate,
      })
   }else {
      this.setState({
        isDataLoaded:true,
      })
    }
    this._interval = setInterval(() => {
      if(this.state.isIdle === false)
      this.setState({
        totalActiveTime: this.state.totalActiveTime + 1000
      });
      if(this.state.totalActiveTime % 20000 === 0 )
      {
        this.validateSaveCreateAssignment('autosave')
      }
     }, 1000);
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

 validateSaveCreateAssignment = (option) => {
   if(this.state.questions.length === 0 && option === 'autosave'){
     //do nothing
   }
   else if(this.state.questions.length === 0)
       notify.show("Please add atleast one question before you can save the assignment","warning")
   else{
     this.saveCreateAssignment(option)
   }
 }
 getBody = () => {
   var buffer = ''
   if(this.props.location.state){
   buffer = {
       email: this.props.loggedinuser,
       batch : this.props.class,
       lastdate: this.state.controlledDate,
       questions: this.state.questions,
       options: this.state.options,
       validity: this.state.validity,
       message: this.state.message,
       subject: this.state.subject,
       numberOfQuesPerStudent: this.state.numQuestions,
       author: {
         questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
         realOwner: this.props.location.state.assignment.author.realOwner,
       },
       assignmentType: 'OBJECTIVE'
     }
   }
  else{
      buffer = {
       email: this.props.loggedinuser,
       batch : this.props.class,
       lastdate: this.state.controlledDate,
       questions: this.state.questions,
       options: this.state.options,
       validity: this.state.validity,
       message: this.state.message,
       subject: this.state.subject,
       numberOfQuesPerStudent: this.state.numQuestions,
       assignmentType: 'OBJECTIVE'
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
       notify.show("Something went wrong, please try again","error")
     }
     }).catch(response => {
     notify.show("Please login your session expired","error");
     this.context.router.history.push('/');
    });
}

 handleQuestionOptionsChange =  (index, event) => {
   var OldOptions = this.state.questionOptions.slice()
   if(event.target.value.trim() !== ''){
     OldOptions[index] = event.target.value
   }else{
     OldOptions.splice(index,1)
   }
   this.setState({
     questionOptions: OldOptions,
   })
 }

handleQuestionValidityChange = (newValidity) => {
  this.setState({
    questionValidity: newValidity,
  })
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
      options: this.state.options,
      validity: this.state.validity,
      author: {
        questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
        realOwner: this.props.location.state.assignment.author.realOwner,
      },
      assignmentType: 'OBJECTIVE',
      numberOfQuesPerStudent: this.state.numQuestions,
   }
  }else{
    buffer = {
      email: this.props.loggedinuser,
      subject: this.state.subject,
      batch : this.props.class,
      lastdate: this.state.controlledDate,
      message: this.state.message,
      questions: this.state.questions,
      options: this.state.options,
      validity: this.state.validity,
      assignmentType: 'OBJECTIVE',
      numberOfQuesPerStudent: this.state.numQuestions,
    }
  }
  return buffer
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
       body: JSON.stringify(this.getAssignmentBody())
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

addQuestion = () => {
  var newquestions = this.state.questions.slice()
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  var newOptions = this.state.options.slice()
  var newValidity = this.state.validity.slice()
  var question = this.state.questionValue

  if(question.trim() === "")
    notify.show("You cannot add empty Question","warning")
  else if(this.state.questionOptions.length === 0){
    notify.show("Please add atleast one option","warning")
  }else if(this.state.questionValidity.length === 0){
    notify.show("Please select atleast one correct answer","warning")
  }
  else
  {
  newquestions.push(this.state.contentState)
  newquestionEditorStates.push({id: ++id,value:this.state.editorState})
  newOptions.push(this.state.questionOptions)
  newValidity.push(this.state.questionValidity)
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates,
    options: newOptions,
    validity: newValidity,
    questionValue: '',
    questionOptions: [],
    questionValidity: [],
    editorState: EditorState.createEmpty(),
    showTextField: false,
  })

  }
}

deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  var newOptions = this.state.options.slice()
  var newValidity = this.state.validity.slice()
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  newquestionEditorStates.splice(i,1)
  newquestions.splice(i,1)
  newOptions.splice(i,1)
  newValidity.splice(i,1)
  this.setState({
    questions: newquestions,
    validity: newValidity,
    options: newOptions,
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

handleShowTextField = () => {

  if(this.state.showTextField === true)
   {
  this.addQuestion()
  }else{
  this.setState({
    editorState: EditorState.createEmpty(),
    showTextField: true,
  })
}
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
    <Col xs={2} sm={2} md={1} lg={1}>
    <IconButton onClick={this.deleteQuestion.bind(this,i)}><Delete color="red" viewBox="0 0 20 20" /></IconButton>
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
      <Row center="xs" >
        <Col xs={10} md={10} sm={7} lg={6}>
      <AlternateOptions options={this.state.questionOptions}
      handleOptionsChange={this.handleQuestionOptionsChange}
      questionValidity={this.state.questionValidity}
      handleQuestionValidityChange={this.handleQuestionValidityChange}
      />
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
if(this.state.isDataLoaded){
    return(
      <StayVisible
        {...this.props}
      >
      <div className="TeacherAssignment">
        <Grid >
          <Row center="xs">
            <Col xs lg={9}>
              <h4 className="paragraph">Objective Assignment</h4>
              <Divider />
            </Col>
          </Row>
        </Grid>
      <Grid fluid>
      <Row center="xs" bottom="xs">
      <Col xs>
      <SubjectAutoComplete type="syllabus" branch={this.props.branch} searchText={this.state.subjectValue} handleSubjectChange={this.handleSubjectChange} />
      </Col>
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
      <Row center="xs" middle='xs'>
      <Col xs={8} sm={8} md={7} lg={4} >
      <h4>Number of Questions to be given to each Student:</h4>
      </Col>
      <Col xs={4} sm={4} md={3} lg={3}>
      <SelectField
        value={this.state.numQuestions}
        onChange={this.handleNumberChange}
        style={{width: '70%'}}
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
        <MenuItem value={11}  primaryText="Eleven" />
        <MenuItem value={12}  primaryText="Twelve" />
        <MenuItem value={13}  primaryText="Thirteen" />
        <MenuItem value={14}  primaryText="Fourteen" />
        <MenuItem value={15}  primaryText="Fifteen" />
        <MenuItem value={16}  primaryText="Sixteen" />
        <MenuItem value={17}  primaryText="Seventeen" />
        <MenuItem value={18}  primaryText="Eighteen" />
        <MenuItem value={19}  primaryText="Nineteen" />
        <MenuItem value={20}  primaryText="Twenty" />
        <MenuItem value={21}  primaryText="TwentyOne" />
        <MenuItem value={22}  primaryText="TwentyTwo" />
        <MenuItem value={23}  primaryText="TwentyThree" />
        <MenuItem value={24}  primaryText="TwentyFour" />
        <MenuItem value={25}  primaryText="TwentyFive" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row end="xs" middle="xs">
        <Col xs={7} sm={7} md={7} lg={3}>
          <FlatButton label="Add Question" labelStyle ={{textTransform: 'none'}}
             style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
            primary={true} icon={<Add />} onClick={this.handleShowTextField} />
        </Col>
        <Col xs={4} sm={4} md={4} lg={2}>
          <FlatButton label = "Save" primary={true} labelStyle ={{textTransform: 'none'}}
            style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
            disabled={this.state.saveButton} icon={<Save />} onClick={this.validateSaveCreateAssignment.bind('save')} />
        </Col>
        <Col xs={1} sm={1} md={1} lg={1}>
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
        </Col>
        </Row>
        <Row end='xs' middle='xs'>
        <Col xs>
            <FlatButton key={1} label="Go Back"
              alt="loading" icon={<NavigationArrowBack color="#30b55b"/>} labelStyle ={{textTransform: 'none'}}
              style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
             onClick={()=>{this.context.router.history.goBack()}} />
        </Col>
        <Col xs>
        <FlatButton label = "Submit" primary={true} labelStyle ={{textTransform: 'none'}}
           style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
          disabled={this.state.submitButton} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
        </Col>
        <Col xs={1} sm={1} md={1} lg={1}>
        </Col>
        </Row>
        </Grid>
        <br /> <br />
      <Dialog
            title={"Are you sure about creating this assignment with last date : "+new Date(this.state.controlledDate)+", Once submitted it cannot be deleted or edited"}
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
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
ObjectiveAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ObjectiveAssignment)
