import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import SubjectAutoCompleteForNotesAndAssign from '../utils/SubjectAutoCompleteForNotesAndAssign.js'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import Add from 'material-ui/svg-icons/content/add'
import AddBox from 'material-ui/svg-icons/content/add-box'
import RaisedButton from 'material-ui/RaisedButton'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'

class AssignmentContent extends Component{
constructor(){
  super();
  this.state={
    minDate: new Date(),
  }
  this.renderTextField = this.renderTextField.bind(this)
  this.displayQuestions = this.displayQuestions.bind(this)
  this.Enter = this.Enter.bind(this)
}

Enter(event){
  if(event.key === 'Enter'){
    this.props.addQuestion()
   }
}

displayQuestions(){
  var buffer=[]
  for(let i=0; i < this.props.questions.length ; i++)
  {
  buffer.push(
    <Grid fluid  key={i}>
    <Row start="xs">
    <Col xs={10} sm={10} md={11} lg={11}>
    <li className="displayQuestions">{this.props.questions[i]}</li>
    </Col>
    <Col xs={2} sm={2} md={1} lg={1}>
    <IconButton onClick={this.props.deleteQuestion.bind(this,i)}><Delete color="red" viewBox="0 0 20 20" /></IconButton>
    </Col>
    </Row>
    </Grid>
  )
}
return buffer;
}

  renderTextField(){
  var buffer=[]
  if(this.props.showTextField){
    buffer.push(
      <div key={this.props.showTextField}>
      <Grid fluid className="nogutter">
      <Row start="xs" top="xs">
      <Col xs={10} sm={10} md={11} lg={11}>
      <TextField hintText="Add a Question" fullWidth={true} onKeyPress={this.Enter} onChange={this.props.handleQuestionValue}/>
      </Col>
      <Col xs={2} sm={2} md={1} lg={1}>
      <IconButton onClick={this.props.addQuestion}><AddBox color="green"/></IconButton>
      </Col>
      </Row>
      </Grid>
      <br />
      </div>)
  }
  else{
    buffer.push("")
  }
  return buffer;
  }
  render(){
    return(<div className="TeacherAssignment">
      <Grid fluid>
      <Row start="xs" bottom="xs">
      <Col xs>
      <SubjectAutoCompleteForNotesAndAssign branch={this.props.branch} handleSubjectChange={this.props.handleSubjectChange} />
      </Col>
      <Col xs>
      <DatePicker hintText="Last Date" minDate={this.state.minDate} onChange={this.props.handleDateChange} />
      </Col>
      </Row>
      <Row start="xs">
      <Col xs>
      <TextField hintText="Additional Comments" floatingLabelText="Additional Comments" fullWidth={true} onChange={this.props.handleMessageChange}/>
      </Col>
      </Row>
      </Grid>
      <ol>{this.displayQuestions()}</ol>
      <Grid fluid>
      <Row center="xs">
      <Col xs>
      {this.renderTextField()}
      <RaisedButton label="Add Question" primary={true} icon={<Add />} onClick={this.props.handleShowTextField} />
      <br /><br /><br />
      </Col>
      </Row>
      </Grid>
      </div>)
  }
}

export default AssignmentContent
