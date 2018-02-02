import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import RenderEditor from './RenderEditor'
import Checkbox from 'material-ui/Checkbox'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import Compile from 'material-ui/svg-icons/file/cloud-upload'
import Inputoutput from './Inputoutput'
import {notify} from 'react-notify-toast'
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
    timeout: 5000,
     isIdle: false,
     totalActiveTime: null,
     disabledLanguage: false,

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

scrollToBottom = () => {
  this.endDiv.scrollIntoView({ behavior: "smooth" });
}

submitRequest(){
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.state.languageValue]
  this.setState({
    buttonDisabled: true,
    submissionStarted: true,
  })
  this.scrollToBottom();
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
      if(response.status === 200)
      return response.json()
    }).then(response =>{
      var result = response.result

      this.setState({
        buttonDisabled: false,
        compileError:result.compilemessage,
        stdErr: result.stderr,
        stdOut: result.stdout,
        message: result.message,
      },function callback(){
        this.scrollToBottom();
      })
    }).catch(response => {
    notify.show("Please login before you can compile your program","error");
    this.context.router.history.push('/');
   });

}

compileAndRun = () => {
  var codeslist = this.state.hackerRankCodes
  var langcode = codeslist[this.props.languageValue]
  this.setState({
    buttonDisabled: true,
    submissionStarted: true,
  })
    this.scrollToBottom();
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/assignment/compile', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         source: this.props.source,
         lang: langcode,
         assignmentid: this.props.assignmentid,
         question: this.props.question,
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
      },function callback(){
        this.scrollToBottom();
      })
    }).catch(response => {
    notify.show("Please login before you compile your program","error");
    this.context.router.history.push('/');
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
        }).catch(response => {
        notify.show("Please login before accessing code editor","error");
        this.context.router.history.push('/');
       });

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
<div className="Editor" key={1}>
<RenderEditor value={this.state.value} theme={this.state.theme} mode={this.state.mode} fontSize={this.state.fontSize}
             showGutter={this.state.showGutter} showPrintMargin={this.state.showPrintMargin} highlightActiveLine={this.state.highlightActiveLine}
             setTheme={this.setTheme} setMode={this.setMode} disabledLanguage={this.state.disabledLanguage} language={this.state.language}  onChange={this.onChange}/>
<br />
  <Grid fluid>
<Row center="xs">
<Col xs={11} sm={11} md={8} lg={8}>
<Checkbox
  label="Test Against Custom Input"
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



  buffer.push(
    <div key={1}>
    <RenderEditor value={this.props.source} theme={this.props.theme} mode={this.props.mode} fontSize={this.state.fontSize}
                 showGutter={this.state.showGutter} showPrintMargin={this.state.showPrintMargin} highlightActiveLine={this.state.highlightActiveLine}
                 setTheme={this.props.setTheme} setMode={this.props.setMode} disabledLanguage={this.props.disabledLanguage} language={this.props.language}  onChange={this.props.onChange}/>
    <br />
    <Grid fluid className="nogutter">
    <Row center="xs" top="xs">
    <Col xs>
    <RaisedButton label="Compile & Run" primary = {true}  icon={<Compile />} disabled={this.state.buttonDisabled} onClick={this.compileAndRun}/>
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

    return(
      <StayVisible
      {...this.props}
      >

      {this.showCheckBoxAndCompile()}


      <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.endDiv = el; }}>
        </div>
    </StayVisible>)
  }
}
Editor.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Editor)
