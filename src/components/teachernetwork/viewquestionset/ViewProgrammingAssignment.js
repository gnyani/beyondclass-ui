import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {notify} from 'react-notify-toast'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'
import {Media} from '../../utils/Media'
import styled from 'styled-components'
import { EditorState, convertFromRaw } from 'draft-js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorReadOnly from '../../teacher/RichTextEditorReadOnly'
import ViewTestCases from './ViewTestCases'
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

class ViewProgrammingAssignment extends Component{
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
          allinputs: response.inputs,
          alloutputs: response.outputs,
          controlledDate: response.lastdate,
        })
      })
      .catch(response => {
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
    <Col xs>
    <RichTextEditorReadOnly editorStyle={{borderStyle:'solid',borderWidth:'0.1px'}} editorState={this.state.questionsEditoStates[i].value} />
    </Col>
    </Row>
    <Row center="xs">
    <Col xs={10} md={10} sm={8} lg={8}>
    <ViewTestCases inputs={this.state.allinputs[i]} qindex={i}
    outputs={this.state.alloutputs[i]}/>
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
      <Col xs={6} sm={6} md={4} lg={5}>
      <DatePicker hintText="Last Date" floatingLabelText="Last Date" minDate={this.state.minDate} defaultDate={new Date(this.state.controlledDate)} disabled={true} />
      </Col>
      <Col xs={6} sm={6} md={4} lg={4}>
      <TextField hintText="Additional Comments" style={{width:'75%'}} value={this.state.message} floatingLabelText="Additional Comments"  disabled={true}/>
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
ViewProgrammingAssignment.contextTypes = {
    router: PropTypes.object
};

export default withRouter(ViewProgrammingAssignment)
