import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import { EditorState,convertFromRaw } from 'draft-js'
import RichTextEditorReadOnly from '../../teacher/RichTextEditorReadOnly.js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
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

let id = 0;

class ViewTheoryAssignment extends Component{
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
  fetch('http://'+properties.getHostName+':8080/teachersnetwork/get/assignment/'+this.props.assignmentid, {
        credentials: 'include',
        method: 'GET'
      }).then(response => {
        if(response.status === 200)
        return response.json()
        else if (response.status === 204 || response.status === 400) {
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
          controlledDate: response.lastdate,
          questionsEditoStates: newEditorStates.slice(),
          numQuestions: response.numberOfQuesPerStudent,
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



displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.state.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid key={this.state.questionsEditoStates[i].id}>
    <Row start="xs">
    <Col xs>
      <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.state.questionsEditoStates[i].value} />
    </Col>
    </Row>
    </Grid>
  )
}
return buffer;
}

  render(){
    if(this.state.isDataLoaded){
    return(
      <StayVisible
        {...this.props}
      >
      <div className="TeacherAssignment">
      <Grid fluid >
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <br /><br />
      <FlatButton key={1} label="Go Back"
      alt="loading" icon={<NavigationArrowBack />}
      labelStyle ={{textTransform: 'none'}} style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
       onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row center="xs" bottom="xs">
      <Col xs>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" defaultDate={new Date(this.state.controlledDate)} minDate={this.state.minDate} disabled={true} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '75%'}} value={this.state.message} disabled={true} hintText="Additional Comments" floatingLabelText="Additional Comments"  />
      </Col>
      </Row>
      </Grid>
      {this.displayQuestions()}
      <br /> <br />
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
ViewTheoryAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ViewTheoryAssignment)
