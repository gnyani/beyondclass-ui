import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RichTextEditorReadOnly from '../teacher/RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import {notify} from 'react-notify-toast'
import Save from 'material-ui/svg-icons/content/save'
import Send from 'material-ui/svg-icons/content/send'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import IdleTimer from 'react-idle-timer'
import StudentOptions from './StudentOptions'

var properties = require('../properties.json')

class RenderObjectiveAssignment extends Component{

constructor(){
  super();
  this.state={
    saveButton : false,
    submitButton: false,
    submitConfirm : false,
    questions: [],
    options: [],
    validity: [],
    userValidity: [],
    timeout: 5000,
    isIdle: false,
    totalActiveTime: null,
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


componentDidMount(){
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
       if(response.options){
         this.setState({
           questions: response.questions.slice(),
           options: response.options.slice(),
           validity: response.validity.slice(),
         })
         if(response.userValidity){
           this.setState({
             userValidity:response.userValidity.slice()
           })
         }else{
           var userVal = []
           for(let i=0;i<this.state.validity.length;i++){
             var temp =[]
             userVal[i] = temp
           }
           this.setState({
             userValidity: userVal.slice()
           })}
         }
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
         this.saveObjectiveAssignment('autosave')
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

 submitObjectiveAssignment = () => {

   this.setState({
     submitButton: true,
     submitConfirm: false,
   })


   fetch('http://'+properties.getHostName+':8080/assignments/student/submit', {
          method: 'POST',
          headers: {
                'mode': 'cors',
                'Content-Type': 'application/json'
            },
        credentials: 'include',
        body: JSON.stringify({
          userValidity: this.state.userValidity.slice(),
          tempassignmentid: this.props.assignmentid,
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

saveObjectiveAssignment = (option) => {
  this.setState({
    saveButton: true
  })
  fetch('http://'+properties.getHostName+':8080/assignments/student/objectiveSave', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         userValidity: this.state.userValidity,
         tempassignmentid: this.props.assignmentid,
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

handleValidityChange = (qindex, changedValidity) => {
  var newUserValidity = this.state.userValidity.slice()
    newUserValidity[qindex]=changedValidity
    this.setState({
      userValidity: newUserValidity
    })
}

displayQuestions(){
  var buffer =[]
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
      <Row center="xs">
      <Col xs={8} sm={8} md={6} lg={5}>
      <StudentOptions options={this.state.options[i]}
      qindex={i} validity={this.state.validity[i]} questionValidity={this.state.userValidity[i]}
      handleQuestionValidityChange={this.handleValidityChange}/>
      <br />
      </Col>
      </Row>
      </Grid>
      </div>)
  }
  return buffer
}

  render(){

    const actions1 = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitObjectiveAssignment}
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
    <FlatButton label="Save"  labelStyle={{textTransform: 'none'}}
    style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
      icon={<Save />} disabled={this.state.saveButton} onClick={this.saveObjectiveAssignment.bind(this,'save')} />
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
RenderObjectiveAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(RenderObjectiveAssignment)
