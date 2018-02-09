import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import RichTextEditor from './RichTextEditor'
import DatePicker from 'material-ui/DatePicker'
import Add from 'material-ui/svg-icons/content/add'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import {Grid,Row,Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import {notify} from 'react-notify-toast'
import AddBox from 'material-ui/svg-icons/content/add-box'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Delete from 'material-ui/svg-icons/action/delete'
import RichTextEditorReadOnly from './RichTextEditorReadOnly'
import {EditorState} from 'draft-js'
import TestCases from './TestCases'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
var properties = require('../properties.json')

class ProgrammingAssignment extends Component{
  constructor(){
    super();
    this.state={
      editorState: EditorState.createEmpty(),
      minDate: new Date(new Date().setDate(new Date().getDate()+1)),

      controlledDate: null,
      showTextFields: false,
      questions: [],
      questionsEditoStates: [],
      questionValue: '',
      contentState: '',
      input: '',
      output: '',
      inputs: [],
      outputs: [],
      allinputs: [],
      alloutputs: [],
      numQuestions: 1,
      showQuestionBox: true,
      buttonDisabled: false,
      submitConfirm: false,
      message: '',
    }
    this.renderTestCaseTabs = this.renderTestCaseTabs.bind(this)
    this.displayQuestions = this.displayQuestions.bind(this)
  }

  handleDateChange = (event, date) => {
    this.setState({
      controlledDate: date,
    });
  }

  changeInputs = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  changeOutputs = (event) => {
   this.setState({
     output: event.target.value
   })
  }

  handleMessageChange = (event) => {
    this.setState({
      message:event.target.value
    })
  }

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

  addTestCase = () => {
    var inputs=this.state.inputs.slice()
    var outputs=this.state.outputs.slice()
    inputs.push(this.state.input)
    outputs.push(this.state.output)
    this.setState({
      inputs: inputs,
      outputs: outputs,
      showTextFields: false,
    })
  }

  addQuestion = () => {
    var newquestions = this.state.questions.slice()
    var newquestionEditorStates = this.state.questionsEditoStates.slice()
    var question = this.state.questionValue
    if(question.trim() === "")
      notify.show("You cannot add empty Question","warning")
    else if(this.state.inputs.length === 0)
       notify.show("Please add atlease one test case for each question","warning")
    else
    {
    newquestions.push(this.state.contentState)
    newquestionEditorStates.push(this.state.editorState)
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
      showQuestionBox: false,
    })

    }
  }

  removeTestCase = (i) => {
    var newInputs = this.state.inputs.slice()
    newInputs.splice(i,1)
    var newOutputs = this.state.outputs.slice()
    newOutputs.splice(i,1)
    this.setState({
      inputs: newInputs,
      outputs: newOutputs,
    })
  }

  renderPratialTestCases = () => {
    var buffer = []
    for(var i=0;i<this.state.outputs.length;i++)
    {
    buffer.push(
      <Grid fluid key={i}>
      <p className="testcaseparagraph"> TestCase{i}: </p>
      <Row center="xs" middle="xs">
      <Col xs={9} sm={9} md={5} lg={5}>
      <textarea  value={this.state.inputs[i]} rows="4"
      className="testcasesDisplay" disabled={true}/>
      </Col>
      <Col xs={9} sm={9} md={5} lg={5}>
      <textarea  value={this.state.outputs[i]} rows="4"  className="testcasesDisplay"  disabled={true} />
      </Col>
      <Col xs={2} sm={2} md={2} lg={1} >
      <IconButton onClick={this.removeTestCase.bind(this,i)}><Delete viewBox='0 0 20 20' color="red"/></IconButton>
      </Col>
      </Row>
      </Grid>
    )
  }
  return buffer
}

renderRows = (j) => {
  var buffer = []
  var inputs = this.state.allinputs[j]
  var outputs = this.state.alloutputs[j]
  for(var i=0;i<outputs.length;i++)
  {
    buffer.push(
          <tr key={i}>
            <td>{inputs[i]}</td>
            <td>{outputs[i]}</td>
        </tr>
    )
  }
  return buffer
}


  renderTestCases = (j) => {
    var buffer = []
    buffer.push(
      <Grid fluid key={1}>
      <Row center="xs">
      <Col xs={10} sm ={10} md={6} lg={5}>
      <table >
            <tbody>
             <tr>
               <th>Inputs</th>
               <th>Outputs</th>
            </tr>
            {this.renderRows(j)}
          </tbody>
        </table>
      </Col>
      </Row>
      </Grid>
    )
    return buffer
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
           inputs: this.state.allinputs,
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

handleShowQuestionBox = () => {
  this.setState({
    showQuestionBox: !this.state.showQuestionBox
  })
}

displayQuestions(){
    var buffer=[]
    for(let i=0; i < this.state.questions.length ; i++)
    {
    buffer.push(
      <div key={i}>
      <p className="paragraph"> Question{i+1}:</p>
      <Grid fluid >
      <Row start="xs">
      <Col xs={10} sm={10} md={11} lg={11}>
      <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
      editorState={this.state.questionsEditoStates[i]} />
      </Col>
      <Col xs={2} sm={2} md={1} lg={1}>
      <IconButton onClick={this.deleteQuestion.bind(this,i)}><Delete color="red" viewBox="0 0 20 20" /></IconButton>
      </Col>
      </Row>
      </Grid>
      {this.renderTestCases(i)}
      </div>
    )
  }
  return buffer
}

displayQuestionBox = () => {
  var buffer = []
  if(this.state.showQuestionBox){
  buffer.push(
    <Grid fluid>
    <Row center="xs" middle="xs">
    <Col xs>
    <RichTextEditor  editorState={this.state.editorState} onEditorStateChange={this.onEditorStateChange}
    onContentStateChange={this.onContentStateChange}
    placeholder='Please Type the question along with one Test Input and Test Output'/>
    </Col>
    <Col xs={2} sm={2} md={2} lg={1}>
    <IconButton onClick={this.addQuestion}><AddBox viewBox='0 0 20 20' color="green"/></IconButton>
    </Col>
    </Row>
    </Grid>
  )
  }
  else{
    buffer.push("")
  }
  return buffer
}


  renderTestCaseTabs(){
   var buffer=[]
   if(this.state.showTextFields){
     buffer.push(
       <Grid fluid key={1}>
       <Row around="xs" middle="xs">
       <Col xs={10} sm={10} md={10} lg={10}>
       <TestCases key={1} input={this.state.input} output={this.state.output}
         changeInputs = {this.changeInputs} changeOutputs={this.changeOutputs}/>
       </Col>
       <Col xs={2} sm={2} md={2} lg={2}>
       <IconButton onClick={this.addTestCase}><AddBox viewBox='0 0 20 20' color="green"/></IconButton>
       </Col>
       </Row>
       </Grid>
     )
   }
   return buffer;
  }

  handleClose = () =>{
    this.setState({
      submitConfirm: false,
    })
  }

  handleNumberChange = (event, index, numQuestions) => this.setState({numQuestions});

  handleShowTextFields = () => {
  this.setState({
    showTextFields: !this.state.showTextFields,
  })
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
    return(
      <StayVisible
        {...this.props}
      >
      <div className="ProgrammingAssignment">
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
      <br /><br />
      <Row center="xs" bottom="xs">
      <Col xs={6} sm={6} md={4} lg={5}>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} onChange={this.handleDateChange} />
      </Col>
      <Col xs={6} sm={6} md={4} lg={4}>
      <TextField hintText="Additional Comments" style={{width:'75%'}} floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
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
      <br />
      {this.displayQuestionBox()}
      <br />
      {this.renderPratialTestCases()}
      <br />
      {this.renderTestCaseTabs()}
      <br />
      <br />
      <br />
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      <RaisedButton label="Add TestCase" primary={true} icon={<Add />} onClick={this.handleShowTextFields} />
      </Col>
      </Row>
      <br />
      <Row center="xs">
      <Col xs>
      <RaisedButton label="Add Question" primary={true} icon={<Add />} onClick={this.handleShowQuestionBox} />
      </Col>
      </Row>
      <br />
      <Row center="xs">
      <Col xs>
      <RaisedButton label="Submit" primary={true} disabled={this.state.buttonDisabled} icon={<CheckIcon />} onClick={this.validateCreateAssignment} />
      </Col>
      </Row>
      </Grid>
      <br /><br />
      </div>
      <Dialog
            title="Are you sure about creating this assignment, Once submitted it cannot be deleted or edited"
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </StayVisible>
    )
  }
}

ProgrammingAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ProgrammingAssignment)
