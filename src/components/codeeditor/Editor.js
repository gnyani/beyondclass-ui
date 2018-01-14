import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import RenderEditor from './RenderEditor'
import Checkbox from 'material-ui/Checkbox'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import Compile from 'material-ui/svg-icons/file/cloud-upload'
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'
import Inputoutput from './Inputoutput'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RenderCodingAssignmentResult from './RenderCodingAssignmentResult'
import {HelloWorldTemplates} from './HelloWorldTemplates'
import {editorModes,hackerRankLangNotation} from './Utils'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

var properties = require('../properties.json')


const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

const defaultValue =
`console.log("Welcome to Beyond Class");`;


class Editor extends Component{

constructor(){
  super();
  this.state={
    compileError: '',
    stdErr: '',
    stdOut: '',
    message: '',
    buttonDisabled: false,
    saveButton : false,
    submitButton: false,
    submissionStarted: false,
    hackerRankCodes: '',
    value: defaultValue,
    languageValue: 'javascript',
    testcases: '',
    language: 'Javascript',
    theme: 'textmate',
    mode: 'javascript',
    fontSize: 14,
    showGutter: true,
    showPrintMargin: false,
    highlightActiveLine: true,
    checked: false,
    assignmentStatus: '',
    expected: '',
    actual: '',
    passCount: '',
    totalCount: '',
    failedCase: '',
    errorMessage: '',
    submitConfirm: false,
  }
  this.setTheme = this.setTheme.bind(this);
  this.setMode = this.setMode.bind(this);
  this.onChange = this.onChange.bind(this);
  this.submitRequest = this.submitRequest.bind(this);
  this.updateCheck = this.updateCheck.bind(this);
  this.changeTestCases = this.changeTestCases.bind(this);
}

changeTestCases(event){
  this.setState({
    testcases: event.target.value,
  })
}

handleSubmit = () => {
  this.setState({
    submitConfirm: true,
  })
}

handleClose = () => {
  this.setState({
    submitConfirm: false,
  })
}

onChange(newValue) {
  this.setState({
    value: newValue,
    source: newValue,
    submissionStarted: false,
  })
}

getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}


updateCheck() {
  this.setState((oldState) => {
    return {
      checked: !oldState.checked,
    };
  });
}

setTheme = (e,index,value) => {
  this.setState({
    theme: value
  })
}
setMode = (e,index,value) => {
  var map = new Map(Object.entries(HelloWorldTemplates))
  var editorModesMap = new Map(Object.entries(editorModes))
  var hackerRankLangNotationMap=new Map(Object.entries(hackerRankLangNotation))
  this.setState({
    languageValue: hackerRankLangNotationMap.get(value),
    language: value,
    mode: editorModesMap.get(value),
    value: map.get(value),
    source: map.get(value)
  })
}
submitRequest(){
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.state.languageValue]
  this.setState({
    buttonDisabled: true,
    submissionStarted: true,
  })

  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/submit', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.value,
         lang: langcode,
         testcases: this.state.testcases,
      })
    }).then(response => {
      return response.json()
    }).then(response =>{
      var result = response.result

      this.setState({
        buttonDisabled: false,
        compileError:result.compilemessage,
        stdErr: result.stderr,
        stdOut: result.stdout,
        message: result.message,
      })

    })
}

compileAndRun = () => {
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.state.languageValue]
  this.setState({
    buttonDisabled: true,
    submissionStarted: true,
  })

  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/assignment/compile', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.source,
         lang: langcode,
         assignmentid: this.props.assignmentid,
      })
    }).then(response =>{
      if(response.status === 200)
      return response.json()
    }).then(response =>{
      this.setState({
        assignmentStatus: response.codingAssignmentStatus,
        expected: response.expected,
        actual: response.actual,
        passCount: response.passCount,
        totalCount: response.totalCount,
        failedCase: response.failedCase,
        errorMessage: response.errorMessage,
        buttonDisabled: false
      })
    })
}

saveProgrammingAssignment = () => {
  this.setState({
    saveButton: true
  })
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/assignment/save', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.value,
         language: this.state.mode,
         tempassignmentid: this.props.assignmentid,
         theme: this.state.theme,
         email: this.props.email
      })
    }).then(response => {
      if(response.status === 200){
        notify.show("Assignment Saved successfully","success")
        return response.text()
      }else{
        notify.show("Sorry something went wrong please try again","error")
      }
    }).then(response =>{
      this.setState({
        saveButton : false
      })
    })

}

submitProgrammingAssignment = () => {
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.state.languageValue]
  this.setState({
    submitButton: true,
    submitConfirm: false,
  })
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/assignment/submit', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.state.source,
         language: this.state.mode,
         langcode: langcode,
         tempassignmentid: this.props.assignmentid,
         theme: this.state.theme,
         email: this.props.email
      })
    }).then(response => {
      if(response.status === 200){
        notify.show("Assignment Submitted successfully","success")
        this.context.router.history.goBack()
        return response.text()
      }else{
        notify.show("Sorry something went wrong please try again","error")
      }
    }).then(response =>{
      this.setState({
        submitButton : false
      })
    })
}

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/languages', {
          credentials: 'include',
           method: 'GET',
        }).then(response => {
          if(response.status === 200)
          return response.json()
        }).then(response => {
          this.setState({
            hackerRankCodes: response.languages.codes
          })
        })
if(this.props.state==="Assignment"){
  fetch('http://'+properties.getHostName+':8080/assignments/get/'+this.props.assignmentid, {
         method: 'POST',
         credentials: 'include',
         headers: {
             'mode': 'cors',
             'Content-Type': 'application/json'
           },
         body: this.props.email,
     }).then(response => {
       if(response.status === 200)
       return response.json()
       else if(response.status === 302){
         this.context.router.history.push('/')
       }
       else{
         notify.show("something is not right","error")
       }
     }).then(response => {
       var source = response.source ? response.source : this.state.value
       var mode = response.language ? response.language : this.state.mode
       var theme = response.theme ? response.theme : this.state.theme
       this.setState({
         languageValue: mode,
         mode: mode,
         source: source,
         theme: theme,
       })
     })
  }
}
showInputTextArea(){
  var buffer = []
  if(this.state.checked)
  buffer.push(<textarea key={1} placeholder="Give your input seperated by a space or use new line" rows="10" cols="40"
  className="testcases"  value={this.state.testcases} onChange={this.changeTestCases} autoComplete='off'/>)
  return buffer
}
showCheckBoxAndCompile = () =>{

var buffer=[]
if(typeof this.props.state === "undefined")
{
buffer.push(
<div className="Editor">
<RenderEditor value={this.state.value} theme={this.state.theme} mode={this.state.mode} fontSize={this.state.fontSize}
             showGutter={this.state.showGutter} showPrintMargin={this.state.showPrintMargin} highlightActiveLine={this.state.highlightActiveLine}
             setTheme={this.setTheme} setMode={this.setMode} language={this.state.language}  onChange={this.onChange}/>
<br />
  <Grid fluid>
<Row center="xs">
<Col xs={11} sm={11} md={8} lg={8}>
<Checkbox
  label="Test Againt Custom Input"
  checked={this.state.checked}
  onCheck={this.updateCheck}
  style={{maxWidth: 250 }}
/>
      {this.showInputTextArea()}
</Col>
<Col xs={11} sm={11} md={3} lg={3}>
<RaisedButton label = "Compile & Run" primary={true} disabled={this.state.buttonDisabled} icon={<Compile />} onClick={this.submitRequest}/>
</Col>
</Row>
</Grid>

<br /><br />
<Inputoutput submissionStarted={this.state.submissionStarted} buttonDisabled={this.state.buttonDisabled}
    compileError={this.state.compileError} stdErr={this.state.stdErr} stdOut={this.state.stdOut}
    testcases={this.state.testcases} message={this.state.message}/>
<br /><br /><br /><br />
</div>
)
}
else if(this.props.state==="Assignment"){

var language = this.getKeyByValue(editorModes,this.state.mode)

  buffer.push(
    <div key={1}>
    <RenderEditor value={this.state.source} theme={this.state.theme} mode={this.state.mode} fontSize={this.state.fontSize}
                 showGutter={this.state.showGutter} showPrintMargin={this.state.showPrintMargin} highlightActiveLine={this.state.highlightActiveLine}
                 setTheme={this.setTheme} setMode={this.setMode} language={language}  onChange={this.onChange}/>
    <br />
    <Grid fluid >
    <Row start="xs">
    <Col xs={11} sm={11}  md={10} lg={10}>
    <Grid fluid className="nogutter">
    <Row end="xs" top="xs">
    <Col xs>
    <RaisedButton label="Complie & Run" primary = {true}  icon={<Compile />} disabled={this.state.buttonDisabled} onClick={this.compileAndRun}/>
    </Col>
    <Col xs>
    <RaisedButton label="Save" primary = {true} icon={<Save />} disabled={this.state.saveButton} onClick={this.saveProgrammingAssignment}/>
    </Col>
    <Col xs>
    <RaisedButton label="Submit" primary = {true} icon={<Send />} disabled={this.state.submitButton} onClick={this.handleSubmit}/>
    </Col>
    </Row>
    </Grid>
    </Col>
    </Row>
    </Grid>
    <br /><br/><br />
    <RenderCodingAssignmentResult assignmentStatus={this.state.assignmentStatus} expected={this.state.expected}
     actual={this.state.actual} errorMessage={this.state.errorMessage}
     failedCase={this.state.failedCase} passCount={this.state.passCount} totalCount={this.state.totalCount}/>
    </div>
  )
}
return buffer
}


  render(){
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitProgrammingAssignment}
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

      {this.showCheckBoxAndCompile()}
      <Dialog
            title="Are you sure you want to submit this assignment ?"
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>

    </StayVisible>)
  }
}
Editor.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Editor)
