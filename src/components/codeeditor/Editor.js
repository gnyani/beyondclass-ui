import React,{Component} from 'react'
import RenderEditor from './RenderEditor'
import Loadable from 'react-loadable'
import Loading from '../Loading'
import Checkbox from 'material-ui/Checkbox'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import Compile from 'material-ui/svg-icons/file/cloud-upload'
import {notify} from 'react-notify-toast'
import {HelloWorldTemplates} from './HelloWorldTemplates'
import {editorModes,hackerRankLangNotation} from './Utils'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Save from 'material-ui/svg-icons/content/save'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

var properties = require('../properties.json')

const ShowSaveTags = Loadable({
  loader: () => import('./ShowSaveTags'),
  loading: Loading,
  timeout: 10000,
})

const RenderCodingAssignmentResult = Loadable({
  loader: () => import('./RenderCodingAssignmentResult'),
  loading: Loading,
  timeout: 10000,
})

const Inputoutput = Loadable({
  loader: () => import('./Inputoutput'),
  loading: Loading,
  timeout: 10000,
})


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
    saveDialog: false,
    submitConfirm: false,
    timeout: 5000,
     isIdle: false,
     totalActiveTime: null,
     disabledLanguage: false,
     runtime: '',
     memory: '',
     description: '',
     snippetTags: [],

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

handleDescriptionChange = (event) =>{
  this.setState({
    description: event.target.value
  })
}

openSaveDialog = () => {
  if(this.state.value.trim() === "")
  notify.show("Source code cannot be empty","error")
  else{
  this.setState({
    saveDialog: true,
  })
}
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
  if(this.state.value.trim() === "")
  notify.show("Source code cannot be empty","error")
  else{
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
      else if(response.status === 500){
        notify.show("Sorry something went wrong or you might not be connected to internet","error")
      }
    }).then(response =>{
      if(response){
      var result = response.result
     this.setState({
        buttonDisabled: false,
        compileError:result.compilemessage,
        stdErr: result.stderr,
        stdOut: result.stdout,
        message: result.message,
        runtime: result.time,
        memory: result.memory,
      },function callback(){
        this.scrollToBottom();
      })
    } else{
      this.setState({
        buttonDisabled: false
      })
    }
    }).catch(response => {
    notify.show("Please login before you can compile your program","error");
    this.context.router.history.push('/');
   });
 }
}

compileAndRun = () => {
  if(this.props.source.trim() === "")
  notify.show("Source code cannot be empty","error")
  else{
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
      else if(response.status === 500){
        notify.show("Sorry something went wrong or you might not be connected to internet","error")
      }

    }).then(response =>{
      if(response)
      this.setState({
        assignmentStatus: response.codingAssignmentStatus,
        expected: response.expected,
        actual: response.actual,
        passCount: response.passCount,
        totalCount: response.totalCount,
        failedCase: response.failedCase,
        errorMessage: response.errorMessage,
        runtime: response.runtime,
        memory: response.memory,
        buttonDisabled: false
      },function callback(){
        this.scrollToBottom();
      })
      else{
        this.setState({
          buttonDisabled: false
        })
      }
    }).catch(response => {
        notify.show("Please login before you compile your program","error");
        this.context.router.history.push('/');
   })
 }
}


componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/hackerrank/languages', {
          credentials: 'include',
           method: 'GET',
        }).then(response => {
          if(response.status === 200)
          return response.json()
          else if(response.status === 500)
          notify.show("Please check your internet connectivity","error")
        }).then(response => {
          if(response)
          this.setState({
            hackerRankCodes: response.languages.codes
          })
        }).catch(response => {
        notify.show("Please login before accessing code editor","error");
        this.context.router.history.push('/');
       });

}

addSnippetTag = (tag) => {
  var currentTags = this.state.snippetTags.slice()
  if(currentTags.length >= 4)
  {
    notify.show("You can add only 3 tags per snippet","warning")
  }else{
  currentTags.push(tag)
  this.setState({
    snippetTags: currentTags
  })
 }
}
removeSnippetTag = (index) => {
  var currentTags = this.state.snippetTags.slice()
  currentTags.splice(index,1)
  console.log(currentTags.toString())
  this.setState({
    snippetTags: currentTags
  })
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
             setTheme={this.setTheme} setMode={this.setMode}  language={this.state.language}  onChange={this.onChange}/>
<br />
  <Grid fluid>
<Row center="xs">
<Col xs={11} sm={11} md={6} lg={6}>
<Checkbox
  label="Test Against Custom Input"
  checked={this.state.checked}
  onCheck={this.updateCheck}
  style={{maxWidth: 250 }}
/>
      {this.showInputTextArea()}
</Col>
<Col xs={6} sm={6} md={3} lg={3}>
<RaisedButton label = "Save" primary={true}  icon={<Save />} onClick={this.openSaveDialog}/>
</Col>
<Col xs={6} sm={6} md={3} lg={3}>
<RaisedButton label = "Compile & Run" primary={true} disabled={this.state.buttonDisabled} icon={<Compile />} onClick={this.submitRequest}/>
</Col>
</Row>
</Grid>

<br /><br />
<Inputoutput submissionStarted={this.state.submissionStarted} buttonDisabled={this.state.buttonDisabled}
    compileError={this.state.compileError} stdErr={this.state.stdErr} stdOut={this.state.stdOut}
    testcases={this.state.testcases} runtime={this.state.runtime} memory={this.state.memory}
    message={this.state.message}/>
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
     actual={this.state.actual} errorMessage={this.state.errorMessage} runtime={this.state.runtime} memory={this.state.memory}
     failedCase={this.state.failedCase} passCount={this.state.passCount} totalCount={this.state.totalCount}/>
    </div>
  )
}
return buffer
}
saveCodeSnippet = () => {
  if(this.state.snippetTags.length === 0)
  notify.show("Please add atleast one tag","warning")
  else{
      this.handleClose()
      fetch('http://'+properties.getHostName+':8080/assignments/codeeditor/save', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             source: this.state.value,
             language: this.state.mode,
             tags: this.state.snippetTags,
             description: this.state.description,
             email: this.props.loggedinuser,
          })
        }).then(response => {
          if(response.status === 201){
            notify.show("Snippet saved successfully","success")
            this.setState({
              description: '',
              snippetTags: [],
            })
            this.props.handleReloadListChange()
          }
          else if(response.status === 500)
          notify.show("something is not right please try again later","error")
        }).catch(response => {
          notify.show("Your session expired please copy your code to notepad and refresh the page")
        })

  }
}

handleClose = () => {
  this.setState({
   saveDialog: false,
  })
}
  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.saveCodeSnippet}
      />]
    return(
       <div>
      {this.showCheckBoxAndCompile()}
      <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.endDiv = el; }}>
        </div>
        <Dialog
              title="Save Code Snippet"
              modal={false}
              actions={actions}
              open={this.state.saveDialog}
              titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
              onRequestClose={this.handleClose}
            >
            <ShowSaveTags snippetTags={this.state.snippetTags} removeSnippetTag={this.removeSnippetTag}
            addSnippetTag={this.addSnippetTag} handleDescriptionChange={this.handleDescriptionChange}
            description={this.state.description}/>
        </Dialog>
       </div>)
  }
}
Editor.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Editor)
