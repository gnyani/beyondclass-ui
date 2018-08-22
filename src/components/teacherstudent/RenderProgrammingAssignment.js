import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import {notify} from 'react-notify-toast'
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
    languageValue: ["javascript","javascript","javascript","javascript","javascript"],
    hackerRankCodes: '',
    langcodes: [20, 20, 20, 20, 20],
    mode: ["javascript","javascript","javascript","javascript","javascript"],
    submitConfirm : false,
    timeout: 5000,
     isIdle: false,
     changeLangDialog: false,
     totalActiveTime: null,
     questions: [],
     i: '',
     value: '',
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

setModeConfirm = (i,e,index,value) =>{
  this.setState({
    changeLangDialog: true,
    i: i,
    value: value,
  })
}

setMode = () => {
  var map = new Map(Object.entries(HelloWorldTemplates))
  var editorModesMap = new Map(Object.entries(editorModes))
  var hackerRankLangNotationMap=new Map(Object.entries(hackerRankLangNotation))
  var newLanguageValue = this.state.languageValue.slice()
  var newLangCodes = this.state.langcodes.slice()
  newLanguageValue[this.state.i] = hackerRankLangNotationMap.get(this.state.value)
  var newLanguage = this.state.language.slice()
  newLanguage[this.state.i] = this.state.value
  newLangCodes[this.state.i] = this.state.hackerRankCodes[hackerRankLangNotationMap.get(this.state.value)]
  var newMode = this.state.mode.slice()
  newMode[this.state.i] = editorModesMap.get(this.state.value)
  var newSource = this.state.source.slice()
  newSource[this.state.i] = map.get(this.state.value)
  this.setState({
    languageValue: newLanguageValue,
    langcodes: newLangCodes,
    language: newLanguage,
    mode: newMode,
    source: newSource,
    changeLangDialog: false,
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
       var langcodes = response.langCodes ? response.langCodes : this.state.langcodes
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
         langcodes: langcodes,
         questions: response.questions.slice(),
         mode: mode,
         source: source,
         theme: theme,
         totalActiveTime: totalActiveTime
       })
     })
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
          questions:this.state.questions.slice(),
          source: this.state.source.slice(),
          language: this.state.mode.slice(),
          langcode: this.state.langcodes,
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
         langCodes: this.state.langcodes,
         tempassignmentid: this.props.assignmentid,
         theme: this.state.theme,
         email: this.props.email,
         timespent : this.state.totalActiveTime,
      })
    }).then(response => {
      if(response.status === 200){
        if(option === 'autosave')
        notify.show("Your work got autosaved","success")
        else{
          notify.show('Your work is saved,you can come back anytime here to continue',"success")
          this.context.router.history.goBack()
        }
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
    changeLangDialog: false,
  })
}

displayQuestions(){
  var buffer = []
  for(var i =0;i<this.state.questions.length;i++)
  {
    buffer.push(<div key={i}>
      <Grid fluid>
      <Row center="xs">
      <Col xs>
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.convertToEditorState(this.state.questions[i])} />
      <br />
      </Col>
      </Row>
      </Grid>
    <Editor state={"Assignment"} question={this.state.questions[i]}  email={this.props.email}  assignmentid={this.props.assignmentid}
            languageValue={this.state.langcodes[i]} setMode={this.setModeConfirm.bind(this,i)} setTheme={this.setTheme.bind(this,i)} mode={this.state.mode[i]}
            language={this.state.language[i]} theme={this.state.theme[i]}  source={this.state.source[i]} onChange={this.onChange.bind(this,i)}/>

      <br />
      <br />
      </div>)
  }
  return buffer
}

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.setMode}
      />]

    const actions1 = [
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
    <Grid fluid className="nogutter">
    <Row center="xs" bottom="xs">
    <Col xs>
    <br />
    {this.displayQuestions()}
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={6} sm={6} md={4} lg={3}>
    <FlatButton label="Save" labelStyle={{textTransform: 'none'}}
      style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
       icon={<Save />} disabled={this.state.saveButton} onClick={this.saveProgrammingAssignment.bind(this,'save')} />
    </Col>
    <Col xs={6} sm={6} md={4} lg={3}>
    <FlatButton label="Submit" className="AnnounceButton" labelStyle={{textTransform: "none", fontSize: '1em'}}
       icon={<Send />} disabled={this.state.submitButton} onClick={this.handleSubmit}/>
    </Col>
    </Row>
    </Grid>
    <br /><br />

    <Dialog
          title="Are you sure you want to submit this assignment ?"
          modal={false}
          actions={actions1}
          open={this.state.submitConfirm}
          autoScrollBodyContent={true}
          titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
          onRequestClose={this.handleClose}
        >
    </Dialog>
    <Dialog
          title="Your work in the current language could be lost. Are you sure?"
          modal={false}
          actions={actions}
          open={this.state.changeLangDialog}
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
