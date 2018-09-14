import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import {SubjectsNameLookup} from '../utils/Subjects.js'
import Add from 'material-ui/svg-icons/content/add'
import CheckIcon from 'material-ui/svg-icons/action/assignment.js'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import {DeleteOutline} from '../../styledcomponents/SvgIcons'
import IconButton from 'material-ui/IconButton'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState, convertFromRaw } from 'draft-js'
import RichTextEditor from './RichTextEditor'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import RichTextEditorToolBarOnFocus from './RichTextEditorToolBarOnFocus'
import TestCases from './TestCases'
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

class ProgrammingAssignment extends Component{
constructor(){
  super();
  var date = new Date();
    date.setHours(0,0,0,0)
    date.setDate(new Date().getDate()+3)
  this.state={
    minDate: new Date(new Date().setDate(new Date().getDate()+1)),
    questions: [],
    showTextField: false,
    subject: '',
    questionValue: '',
    message: '',
    numQuestions: 1,
    allinputs:[],
    alloutputs:[],
    inputs: [],
    outputs: [],
    controlledDate: date,
    threshold: 80,
    thresholdarray: [],
    subjectValue: '',
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
    postedToNetwork: false,
    addQuestionDialog: false,
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
          subjectValue: SubjectsNameLookup[response.subject],
          isDataLoaded: true,
          questionsEditoStates: newEditorStates.slice(),
          allinputs: response.inputs,
          alloutputs: response.outputs,
          numQuestions: response.numberOfQuesPerStudent,
          thresholdarray: response.thresholdarray,
          controlledDate: new Date(response.lastdate),
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
      }this.setState({
        questions: response.questions,
        message: response.message,
        subject: response.subject,
        isDataLoaded: true,
        questionsEditoStates: newEditorStates.slice(),
        subjectValue: SubjectsNameLookup[response.subject],
        allinputs: response.inputs,
        alloutputs: response.outputs,
        numQuestions: response.numberOfQuesPerStudent,
        thresholdarray: response.thresholdarray,
        controlledDate: this.state.controlledDate,
        postedToNetwork: response.postedToNetwork
      })
   }else{
      this.setState({
        isDataLoaded:true,
      })
    }
    this._interval = setInterval(() => {
      if(this.state.isIdle === false)
      this.setState({
        totalActiveTime: this.state.totalActiveTime + 20000
      });
      if(this.state.totalActiveTime % 60000 === 0 )
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

 validateSaveCreateAssignment = (option) => {
   if((this.state.questions.length === 0 || this.state.subject === '') && option === 'autosave'){
     //do nothing
   }
   else if(this.state.questions.length === 0 || this.state.subject === '')
       notify.show("Please add atleast one question and select subject before you can save the assignment","warning")
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
       subject: this.state.subject,
       lastdate: this.state.controlledDate,
       questions: this.state.questions,
       inputs: this.state.allinputs,
       thresholdarray: this.state.thresholdarray,
       outputs: this.state.alloutputs,
       message: this.state.message,
       postedToNetwork: this.state.postedToNetwork,
       numberOfQuesPerStudent: this.state.numQuestions,
       assignmentType: 'CODING',
       author: {
         questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
         realOwner: this.props.location.state.assignment.author.realOwner,
       },
     }
   }
  else{
      buffer = {
        email: this.props.loggedinuser,
        batch : this.props.class,
        subject: this.state.subject,
        lastdate: this.state.controlledDate,
        questions: this.state.questions,
        thresholdarray: this.state.thresholdarray,
        inputs: this.state.allinputs,
        outputs: this.state.alloutputs,
        message: this.state.message,
        postedToNetwork:this.state.postedToNetwork,
        numberOfQuesPerStudent: this.state.numQuestions,
        assignmentType: 'CODING'
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

 handleQuestionInputsChange =  (index, event) => {
   var OldInputs = this.state.inputs.slice()
     OldInputs[index] = event.target.value
   this.setState({
     inputs: OldInputs,
   })
 }

handleQuestionOutputsChange = (index, event) => {
  var OldOutputs = this.state.outputs.slice()
    OldOutputs[index] = event.target.value
    this.setState({
      outputs: OldOutputs,
    })
}



handleInputsChange = (qindex, index, event) => {
  var Inputs = this.state.allinputs.slice()
  var NewInputs = Inputs[qindex]
   NewInputs[index] = event.target.value
   Inputs[qindex] = NewInputs
   this.setState({
     allinputs: Inputs,
   })

}

handleOutputsChange = (qindex, index, event) => {
    var Outputs = this.state.alloutputs.slice()
    var NewOutputs = Outputs[qindex]
       NewOutputs[index] = event.target.value
       Outputs[qindex] = NewOutputs
       this.setState({
         alloutputs: Outputs,
       })
}

handleClose = () => {
  this.setState({
    submitConfirm: false,
    addQuestionDialog: false,
  })
}

handleAllInputs = (allinputs) => {
  var newInputs = []
  for (var i=0; i<allinputs.length;i++){
    var newAllInputs = allinputs[i].slice(0,this.state.alloutputs[i].length)
    newInputs.push(newAllInputs)
  }
 return newInputs
}

validateCreateAssignment = () => {
  if(this.state.controlledDate === null)
  notify.show("Please select last submission date","warning")
  else if(this.state.questions.length === 0)
  notify.show("Please add atleast one question","warning")
  else if(this.state.numQuestions > this.state.questions.length)
  notify.show("Number of questions cannot be more than total number of questions","warning")
  else {
    this.setState({
      submitConfirm: true,
    })
  }
}

getAssignmentBody = () => {
  var buffer = ''
  if(this.props.location.state){
    buffer = {
      email: this.props.loggedinuser,
      batch : this.props.class,
      subject: this.state.subject,
      lastdate: this.state.controlledDate,
      thresholdarray: this.state.thresholdarray,
      questions: this.state.questions,
      inputs: this.handleAllInputs(this.state.allinputs),
      outputs: this.state.alloutputs,
      message: this.state.message,
      numberOfQuesPerStudent: this.state.numQuestions,
      assignmentType: 'CODING',
      postedToNetwork: this.state.postedToNetwork,
      author: {
        questionSetReferenceId: this.props.location.state.assignment.author.questionSetReferenceId,
        realOwner: this.props.location.state.assignment.author.realOwner,
      }

   }
  }else{
    buffer = {
      email: this.props.loggedinuser,
      batch : this.props.class,
      subject: this.state.subject,
      lastdate: this.state.controlledDate,
      thresholdarray: this.state.thresholdarray,
      questions: this.state.questions,
      inputs: this.handleAllInputs(this.state.allinputs),
      outputs: this.state.alloutputs,
      message: this.state.message,
      numberOfQuesPerStudent: this.state.numQuestions,
      assignmentType: 'CODING',
      postedToNetwork: this.state.postedToNetwork
    }
  }
  return buffer
}

submitCreateAssignment = () => {
  this.setState({
    buttonDisabled: true,
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
        buttonDisabled: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Created successfully","success")
      this.context.router.history.goBack()
    }else{
      notify.show("Something went wrong, please try again","error")
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
  var newthresholdarray = this.state.thresholdarray.slice()
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  var question = this.state.questionValue
  if(question.trim() === "")
    notify.show("You cannot add empty Question","warning")
  else if(this.state.inputs.length === 0)
     notify.show("Please add atleast one test case for each question","warning")
  else
  {
  newquestions.push(this.state.contentState)
  newthresholdarray.push(this.state.threshold)
  newquestionEditorStates.push({id: ++id,value:this.state.editorState})
  var allinputs = this.state.allinputs.slice()
  var alloutputs = this.state.alloutputs.slice()
  allinputs.push(this.state.inputs)
  alloutputs.push(this.state.outputs)
  this.setState({
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates,
    questionValue: '',
    editorState:EditorState.createEmpty(),
    inputs: [],
    outputs: [],
    input: '',
    output: '',
    allinputs: allinputs,
    alloutputs: alloutputs,
    thresholdarray: newthresholdarray,
    showTextField: false,
    addQuestionDialog: false,
  })

  }
}

deleteQuestion = (i) => {
  var newquestions = this.state.questions.slice()
  newquestions.splice(i,1)
  var newquestionEditorStates = this.state.questionsEditoStates.slice()
  newquestionEditorStates.splice(i,1)
  var newallinputs = this.state.allinputs.slice()
  newallinputs.splice(i,1)
  var newalloutputs = this.state.alloutputs.slice()
  newalloutputs.splice(i,1)
  this.setState({
    allinputs: newallinputs,
    alloutputs: newalloutputs,
    questions: newquestions,
    questionsEditoStates: newquestionEditorStates
  })
}

handleNumberChange = (event, index, numQuestions) => this.setState({numQuestions});
handleThresholdChange = (event, index, threshold) => this.setState({threshold});

handleSubjectChange = (subjectValue) => {
  this.setState({
    subject: subjectValue
  })
}

handleAddQuestionDialog = () => {
  this.setState({
    addQuestionDialog: true,
    threshold: 80,
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
    <IconButton onClick={this.deleteQuestion.bind(this,i)}><DeleteOutline color="red" /></IconButton>
    </Col>
    </Row>
    <Row center="xs" style={{marginTop:'20px'}}>
    <Col xs lg={8} className="objassalt">
    <TestCases inputs={this.state.allinputs[i]}
    handleInputsChange={this.handleInputsChange} qindex={i}
    outputs={this.state.alloutputs[i]}
    handleOutputsChange={this.handleOutputsChange}/>
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
    buffer.push(
      <div key={this.state.showTextField}>
      <Grid fluid className="nogutter">
      <Row end="xs" middle="xs">
        <Col xs={6} sm={6} md={6} lg={6} >
        <SelectField
          floatingLabelText="Plagiarism Threshold"
          value={this.state.threshold}
          onChange={this.handleThresholdChange}
          style={{width: '50%',textAlign: 'left'}}
          maxHeight={200}
        >
          <MenuItem value={50}  primaryText="50" />
          <MenuItem value={60}  primaryText="60" />
          <MenuItem value={70}  primaryText="70" />
          <MenuItem value={80}  primaryText="80" />
          <MenuItem value={90}  primaryText="90" />
          <MenuItem value={95}  primaryText="95" />
        </SelectField>
        </Col>
       </Row>
      <Row center="xs" middle="xs">
      <Col xs>
      <RichTextEditor editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange}
        onContentStateChange={this.onContentStateChange} placeholder='Start typing a question'  />
      </Col>
      </Row>
      <Row center="xs"  style={{marginTop:'20px'}}>
        <Col xs lg={10} className="objassalt">
      <TestCases inputs={this.state.inputs}
      handleInputsChange={this.handleQuestionInputsChange}
      outputs={this.state.outputs}
      handleOutputsChange={this.handleQuestionOutputsChange}
      />
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
      <div className="ProgrammingAssignment">
        <Grid fluid>
          <Row center="xs">
            <Col xs lg={9}>
              <h4 className="paragraph">Programming Assignment</h4>
              <Divider />
            </Col>
          </Row>
        </Grid>
      <Grid fluid className="cont">
      <br /><br />
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
      >
        <MenuItem value={1}  primaryText="One" />
        <MenuItem value={2}  primaryText="Two" />
        <MenuItem value={3}  primaryText="Three" />
        <MenuItem value={4}  primaryText="Four" />
        <MenuItem value={5}  primaryText="Five" />
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
            title={"Are you sure about creating this assignment with last date : "+new Date(this.state.controlledDate)+", Once submitted it cannot be deleted"}
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
ProgrammingAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ProgrammingAssignment)
