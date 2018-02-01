import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import {notify} from 'react-notify-toast'
import RaisedButton from 'material-ui/RaisedButton'
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import {HelloWorldTemplates} from '../codeeditor/HelloWorldTemplates'
import {editorModes,hackerRankLangNotation} from '../codeeditor/Utils'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import IdleTimer from 'react-idle-timer'
import Editor from '../codeeditor/Editor'

var properties = require('../properties.json')

const defaultValue =
`console.log("Welcome to Beyond Class");`;

class RenderProgrammingAssignment extends Component{

constructor(){
  super();
  this.state={
    saveButton : false,
    submitButton: false,
    source: [defaultValue,defaultValue,defaultValue,defaultValue,defaultValue],
    language: ["Javascript","Javascript","Javascript","Javascript","Javascript"],
    theme: ["textmate","textmate","textmate","textmate","textmate"],
    disabledLanguage: [false,false,false,false],
    languageValue: ["javascript","javascript","javascript","javascript","javascript"],
    hackerRankCodes: '',
    mode: ["javascript","javascript","javascript","javascript","javascript"],
    submitConfirm : false,
    timeout: 5000,
     isIdle: false,
     totalActiveTime: null,
  }
  this.displayQuestions = this.displayQuestions.bind(this);
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
}

getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

setMode = (i,e,index,value) => {
  var map = new Map(Object.entries(HelloWorldTemplates))
  var editorModesMap = new Map(Object.entries(editorModes))
  var hackerRankLangNotationMap=new Map(Object.entries(hackerRankLangNotation))
  var newLanguageValue = this.state.languageValue.slice()
  newLanguageValue[i] = hackerRankLangNotationMap.get(value)
  var newLanguage = this.state.language.slice()
  newLanguage[i] = value
  var newMode = this.state.mode.slice()
  newMode[i] = editorModesMap.get(value)
  var newSource = this.state.source.slice()
  newSource[i] = map.get(value)
  this.setState({
    languageValue: newLanguageValue,
    language: newLanguage,
    mode: newMode,
    source: newSource
  })
}

setTheme = (i,e,index,value) => {
  var newtheme = this.state.theme.slice()
  newtheme[i] = value
  this.setState({
    theme: newtheme
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
        notify.show("Please login your session expired","error");
        this.context.router.history.push('/');
       });


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
       else if(response.status === 403){
         notify.show("You might have already submitted the assignment or the assignment got expired","warning")
         this.context.router.history.goBack()
       }
       else{
         notify.show("something is not right","error")
       }
     }).then(response => {
       var source = response.source ? response.source : this.state.source
       var mode = response.language ? response.language : this.state.mode
       var theme = response.theme ? response.theme : this.state.theme
       var totalActiveTime = response.timespent ? response.timespent : this.state.totalActiveTime
       var map = new Map(Object.entries(HelloWorldTemplates))
      var language = []
      var disabled = []

       for(var i=0;i<mode.length;i++)
        language[i] = this.getKeyByValue(editorModes,mode[i])
       for(i=0;i<language.length;i++)
       {
       var template = map.get(language[i])
        disabled[i] = false
       if(template !== source[i].trim())
       {
         disabled[i] = true
       }
     }
       this.setState({
         languageValue: mode.slice(),
         language: language,
         mode: mode,
         source: source,
         disabledLanguage: disabled.slice(),
         theme: theme,
         totalActiveTime: totalActiveTime
       })
     }).catch(response => {
     notify.show("Please login your session expired","error");
     this.context.router.history.push('/');
    });
     this._interval = setInterval(() => {
       if(this.state.isIdle === false)
       this.setState({
         totalActiveTime: this.state.totalActiveTime + 1000
       });
       if(this.state.totalActiveTime % 60000 === 0 )
       {
         this.saveProgrammingAssignment('autosave')
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

 submitProgrammingAssignment = () => {
   var codeslist = this.state.hackerRankCodes
   var langcode = []
   for(var i=0;i<this.state.languageValue.length;i++)
   langcode[i] = codeslist[this.state.languageValue[i]]

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
          questions:this.props.questions.slice(),
          source: this.state.source.slice(),
          language: this.state.mode.slice(),
          langcode: langcode,
          tempassignmentid: this.props.assignmentid,
          theme: this.state.theme.slice(),
          email: this.props.email,
          timespent: this.state.totalActiveTime,
       })
     }).then(response => {
       if(response.status === 200){
         notify.show("Assignment Submitted successfully","success")
         this.context.router.history.goBack()
         return response.text()
       }
       else{
         notify.show("Sorry something went wrong please try again","error")
       }
     }).then(response =>{
       this.setState({
         submitButton : false
       })
     }).catch(response => {
     notify.show("Please login your session expired","error");
     this.context.router.history.push('/');
    });
 }

saveProgrammingAssignment = (option) => {
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
         source: this.state.source,
         language: this.state.mode,
         tempassignmentid: this.props.assignmentid,
         theme: this.state.theme,
         email: this.props.email,
         timespent : this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        if(option === 'autosave')
        notify.show("Your work got autosaved","success")
        notify.show("Assignment Saved successfully","success")
        return response.text()
      }
      else{
        notify.show("Sorry something went wrong please try again","error")
      }
    }).then(response =>{
      this.setState({
        saveButton : false
      })
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}

onChange = (i,newValue) => {
  var newsource = this.state.source.slice()
  newsource[i] = newValue
  this.setState({
    source: newsource,
    submissionStarted: false,
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

displayQuestions(){
  var buffer =[]
  for(var i =0;i<this.props.questions.length;i++)
  {
    buffer.push(<div key={i}>
      <Grid fluid>
      <Row center="xs">
      <Col xs>
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.props.questions[i])} />
      <br />
      </Col>
      </Row>
      </Grid>
    <Editor state={"Assignment"} question={this.props.questions[i]}  email={this.props.email}  assignmentid={this.props.assignmentid}
            languageValue={this.state.languageValue[i]} setMode={this.setMode.bind(this,i)} setTheme={this.setTheme.bind(this,i)} mode={this.state.mode[i]}
            language={this.state.language[i]} theme={this.state.theme[i]} disabledLanguage={this.state.disabledLanguage[i]} source={this.state.source[i]} onChange={this.onChange.bind(this,i)}/>

      <br />
      <br />
      </div>)
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
    <div >
    <Grid fluid>
    <Row center="xs" bottom="xs">
    <Col xs>
    <br />
    {this.displayQuestions()}
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={6} sm={6} md={4} lg={3}>
    <RaisedButton label="Save" primary = {true} icon={<Save />} disabled={this.state.saveButton} onClick={this.saveProgrammingAssignment.bind(this,'save')} />
    </Col>
    <Col xs={6} sm={6} md={4} lg={3}>
    <RaisedButton label="Submit" primary = {true} icon={<Send />} disabled={this.state.submitButton} onClick={this.handleSubmit}/>
    </Col>
    </Row>
    </Grid>
    <br /><br />

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

    <IdleTimer
    ref="idleTimer"
    activeAction={this._onActive}
    idleAction={this._onIdle}
    timeout={this.state.timeout}
    startOnLoad={false}
    format="MM-DD-YYYY HH:MM:ss.SSS">

    {/*<h1>Time Spent: {this.state.totalActiveTime}</h1>*/}
    </IdleTimer>
    </div>
    )
  }
}
RenderProgrammingAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(RenderProgrammingAssignment)
