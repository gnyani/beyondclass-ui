import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import AddBox from 'material-ui/svg-icons/content/add-box'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
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
import MenuItem from 'material-ui/MenuItem'
import RichTextEditorToolBarOnFocus from './RichTextEditorToolBarOnFocus'
import TestCases from './TestCases'
import Save from 'material-ui/svg-icons/content/save'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import IdleTimer from 'react-idle-timer'

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
    questionValue: '',
    message: '',
    numQuestions: 1,
    allinputs:[],
    alloutputs:[],
    inputs: [],
    outputs: [],
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
  if(this.props.assignmentid){
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
          isDataLoaded: true,
          questionsEditoStates: newEditorStates.slice(),
          allinputs: response.inputs,
          alloutputs: response.outputs,
          numQuestions: response.numberOfQuesPerStudent,
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
        body: JSON.stringify({
          email: this.props.loggedinuser,
          batch : this.props.class,
          lastdate: this.state.controlledDate,
          questions: this.state.questions,
          inputs: this.state.allinputs,
          outputs: this.state.alloutputs,
          message: this.state.message,
          numberOfQuesPerStudent: this.state.numQuestions,
          assignmentType: 'CODING'
       })
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
  if(event.target.value.trim() !== ''){
    OldOutputs[index] = event.target.value
    this.setState({
      outputs: OldOutputs,
    })
  }else{
    OldOutputs.splice(index,1)
    var OldInputs = this.state.inputs.slice()
    OldInputs.splice(index,1)
    this.setState({
      inputs: OldInputs,
      outputs: OldOutputs,
    })
  }
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
    if(NewOutputs.length > 1){
      if(event.target.value.trim() !== ''){
       NewOutputs[index] = event.target.value
       Outputs[qindex] = NewOutputs
       this.setState({
         alloutputs: Outputs,
       })
      }else{
       NewOutputs.splice(index,1)
       Outputs[qindex] = NewOutputs
       var OldInputs = this.state.allinputs.slice()
       var NewInputs = OldInputs[qindex]
       NewInputs.splice(index,1)
       OldInputs[qindex] = NewInputs
       this.setState({
         alloutputs: Outputs,
         allinputs: OldInputs,
       })
      }
    }
    else if(NewOutputs.length === 1){
      if(event.target.value.trim() !== ''){
       NewOutputs[index] = event.target.value
       Outputs[qindex] = NewOutputs
       this.setState({
         alloutputs: Outputs,
       })
      }
    }
}

handleClose = () => {
  this.setState({
    submitConfirm: false,
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
  notify.show("Please Add atleast one Question","warning")
  else if(this.state.numQuestions > this.state.questions.length)
  notify.show("number of questions cannot be more than total number of questions","warning")
  else {
    this.setState({
      submitConfirm: true,
    })
  }
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
       body: JSON.stringify({
         email: this.props.loggedinuser,
         batch : this.props.class,
         lastdate: this.state.controlledDate,
         questions: this.state.questions,
         inputs: this.handleAllInputs(this.state.allinputs),
         outputs: this.state.alloutputs,
         message: this.state.message,
         numberOfQuesPerStudent: this.state.numQuestions,
         assignmentType: 'CODING'
      })
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
  var question = this.state.questionValue
  if(question.trim() === "")
    notify.show("You cannot add empty Question","warning")
  else if(this.state.inputs.length === 0)
     notify.show("Please add atleast one test case for each question","warning")
  else
  {
  newquestions.push(this.state.contentState)
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
    showTextField: false,
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
    <Col xs={10} md={10} sm={8} lg={8}>
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
        <Col xs={10} md={10} sm={8} lg={8}>
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
      <div className="ProgrammingAssignment">
      <Grid fluid >
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <br /><br />
      <FlatButton key={1} label="Go Back"   labelStyle={{textTransform: 'none'}}
        style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        alt="loading" icon={<NavigationArrowBack />}
       onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <br /><br />
      <Row center="xs" bottom="xs">
      <Col xs={6} sm={6} md={4} lg={5}>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" minDate={this.state.minDate} defaultDate={new Date(this.state.controlledDate)} onChange={this.handleDateChange} />
      </Col>
      <Col xs={6} sm={6} md={4} lg={4}>
      <TextField hintText="Additional Comments" style={{width:'75%'}} value={this.state.message} floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
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
      </Grid>
      {this.displayQuestions()}
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      <br /><br />
      {this.renderTextField()}
      <br /><br />
      <FlatButton label="Add Question" labelStyle={{textTransform: 'none'}}
        style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
         icon={<Add />} onClick={this.handleShowTextField} />
      <br /><br />
      </Col>
      </Row>
      <br />
      <Row center="xs">
      <Col xs={6} sm={6} md={4} lg={3}>
      <FlatButton label = "Save" labelStyle={{textTransform: 'none'}}
        style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        primary={true} disabled={this.state.saveButton} icon={<Save />} onClick={this.validateSaveCreateAssignment.bind('save')} />
      </Col>
      <Col xs={6} sm={6} md={4} lg={3}>
      <FlatButton label="Submit" labelStyle={{textTransform: 'none'}}
        style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        primary={true} disabled={this.state.buttonDisabled} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
      </Col>
      </Row>
      <br /><br />
      </Grid>
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
