import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import { EditorState, convertFromRaw } from 'draft-js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorReadOnly from '../../teacher/RichTextEditorReadOnly'
import ViewAlternateOptions from './ViewAlternateOptions'
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

class ViewObjectiveAssignment extends Component{
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
    options:[],
    validity:[],
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
          options: response.options.slice(),
          validity: response.validity.slice(),
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
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderRadius:'10',borderWidth:'0.6px'}}
    editorState={this.state.questionsEditoStates[i].value} />
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={10} md={10} sm={7} lg={5}>
    <ViewAlternateOptions options={this.state.options[i]}
     qindex={i} questionValidity={this.state.validity[i]}/>
    </Col>
    </Row>
    </Grid>
    </div>
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
      <Grid fluid>
      <Row center="xs">
      <Col xs={9} sm={9} md={6} lg={5}>
      <br /><br />
      <FlatButton key={1} label="Go Back"   alt="loading"
      icon={<NavigationArrowBack color="#30b55b"/>} labelStyle ={{textTransform: 'none'}}
      style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
       onClick={()=>{this.context.router.history.goBack()}} />
      </Col>
     </Row>
           <br />
      <Row center="xs" bottom="xs">
      <Col xs>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} defaultDate={new Date(this.state.controlledDate)} disabled={true} />
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <TextField style={{width: '75%'}} value={this.state.message} hintText="Additional Comments" floatingLabelText="Additional Comments" disabled={true}/>
      </Col>
      </Row>
      <br />
      </Grid>
      {this.displayQuestions()}
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
ViewObjectiveAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ViewObjectiveAssignment)
