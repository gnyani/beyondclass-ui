import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import UpdateIcon from 'material-ui/svg-icons/action/update.js'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import Dialog from 'material-ui/Dialog'
import { EditorState, convertFromRaw } from 'draft-js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorToolBarOnFocus from '../RichTextEditorToolBarOnFocus'
import TestCases from '../TestCases'
import RefreshIndicator from 'material-ui/RefreshIndicator'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

var properties = require('../../properties.json')

let id=0;

class EditProgrammingAssignment extends Component{
constructor(){
  super();
  var date = new Date();
    date.setHours(0,0,0,0)
    date.setDate(new Date().getDate()+3)
  this.state={
    minDate: new Date(new Date().setDate(new Date().getDate()+1)),
    questions: [],
    questionValue: '',
    message: '',
    allinputs:[],
    alloutputs:[],
    controlledDate: date,
    editorState: EditorState.createEmpty(),
    contentState: '',
    questionsEditoStates: [],
    submitButton: false,
    submitConfirm: false,
    isDataLoaded: false,
  }
  this.displayQuestions = this.displayQuestions.bind(this)
}

componentDidMount(){
  if(this.props.assignmentid){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/get/assignment/'+this.props.assignmentid, {
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
  })
}

validateUpdateAssignment = () => {
  if(this.state.controlledDate === null)
  notify.show("Please select last submission date","warning")
  else {
    this.setState({
      submitConfirm: true
    })
  }
}

cleanArray = (actual) => {
  var newArray = []
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

handleAllOutputs = (alloutputs) => {
  var newAllOutputs = []
  for (var i = 0; i < alloutputs.length; i++){
    newAllOutputs.push(this.cleanArray(alloutputs[i].slice()))
  }
 return newAllOutputs
}

handleAllInputs = (allinputs) => {
  var newAllInputs = []
  for (var i=0; i<allinputs.length;i++){
    var newInputs = allinputs[i].slice(0,this.state.alloutputs[i].length)
    newAllInputs.push(this.cleanArray(newInputs))
  }
 return newAllInputs
}

submitUpdateAssignment = () => {
  this.setState({
    buttonDisabled: true,
    submitConfirm: false,
  })
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/update/'+this.props.assignmentid, {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         lastdate: this.state.controlledDate,
         questions: this.state.questions,
         inputs:  this.handleAllInputs(this.state.allinputs),
         outputs: this.handleAllOutputs(this.state.alloutputs),
         message: this.state.message,
         assignmentType: 'CODING'
      })
    }).then(response =>{
      this.setState({
        buttonDisabled: false,
      })
      if(response.status === 200)
      {
      notify.show("Assignment Updated successfully","success")
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
    <Col xs>
    <RichTextEditorToolBarOnFocus editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
    onEditorStateChange={this.onArrayEditorStateChange} onContentStateChange={this.onArrayContentStateChange}
    questionNumber = {i}
    editorState={this.state.questionsEditoStates[i].value} />
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

  render(){
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitUpdateAssignment}
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
      <FlatButton key={1} label="Go Back"   alt="loading" icon={<NavigationArrowBack />}
      labelStyle ={{textTransform: 'none'}} style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
      onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <br /><br />
      <Row center="xs" bottom="xs">
      <Col xs>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" minDate={this.state.minDate} defaultDate={new Date(this.state.controlledDate)} onChange={this.handleDateChange} />
      </Col>
      </Row>
      <Row center="xs" bottom="xs">
      <Col xs>
      <TextField hintText="Additional Comments" style={{width:'75%'}} value={this.state.message} floatingLabelText="Additional Comments"  onChange={this.handleMessageChange}/>
      </Col>
      </Row>
      <br />
      </Grid>
      {this.displayQuestions()}
      <Grid fluid>
      <br />
      <Row center="xs" middle="xs">
      <Col xs>
      <FlatButton label = "Update" primary={true} disabled={this.state.submitButton} icon={<UpdateIcon />}
        labelStyle ={{textTransform: 'none'}} style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
        onClick={this.validateUpdateAssignment} />
      </Col>
      </Row>
      <br /><br />
      </Grid>
      <Dialog
            title={"Are you sure about updating this assignment with last date : "+new Date(this.state.controlledDate)}
            modal={false}
            actions={actions}
            open={this.state.submitConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </div>
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
EditProgrammingAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(EditProgrammingAssignment)
