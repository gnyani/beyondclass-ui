import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import CircularProgressbar from 'react-circular-progressbar'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import RejectIcon from 'material-ui/svg-icons/navigation/close'
import Download from 'material-ui/svg-icons/file/file-download'
import {Card} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {transparent} from 'material-ui/styles/colors'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class Reports extends Component{

constructor(){
  super();
  this.state={
    numberOfDaysLeft : '',
    totalNumberOfDays : '',
    numberOfStudentsSubmitted: '',
    totalEligibleNumberOfStudents: '',
    percentdaysCompleted: '',
    percentStudentsSubmitted: '',
    submittedStudents: '',
    evaluationsDone: '',
    percentOfEvaluationsDone: '',
    isDataLoaded: false,
  }
  this.renderListItems = this.renderListItems.bind(this)
}

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/stats', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: this.props.assignmentid
    }).then(response =>{
      if(response.status === 200)
      return response.json()
      else if(response.status === 302){
         window.location.reload()
      }
    }).then(response => {
      this.setState({
        numberOfDaysLeft : response.numberOfDaysLeft,
        totalNumberOfDays : response.totalNumberOfDays,
        numberOfStudentsSubmitted: response.numberOfStudentsSubmitted,
        totalEligibleNumberOfStudents: response.totalEligibleNumberOfStudents,
        percentdaysCompleted: response.percentdaysCompleted,
        percentStudentsSubmitted: response.percentStudentsSubmitted,
        submittedStudents: response.submitAssignment,
        evaluationsDone: response.evaluationsDone,
        percentOfEvaluationsDone: response.percentOfEvaluationsDone,
        isDataLoaded: true,
      })
    })
}

nonZeroSubmissions = () => {
  var buffer=[]
    var src = 'http://'+properties.getHostName+':8080/assignments/generate/excel/'+this.props.assignmentid
  if(this.state.numberOfStudentsSubmitted && this.state.numberOfStudentsSubmitted>0)
  {
 buffer.push(
  <div key={1}>
  <p className="paragraph">Submitted Students</p>
  <br />
  <Grid fluid>
  <Row center="xs">
  <Col xs>
    <form method="post" action={src}>
    <FlatButton type="submit" label="Download Reports" className="download" icon={<Download color="white"/>}/>
    </form>
  </Col>
  </Row>
  </Grid>
  <br />
  </div>)
}else{
  buffer.push(<p key={1} className="paragraph">No Submissions on this assignment yet</p>)
}
return buffer
}


renderListItems(){
  var buffer = []
  for(let i=0; i< this.state.submittedStudents.length;i++)
  {
    var submittedDate = new Date(this.state.submittedStudents[i].submissionDate)
  if(this.state.submittedStudents[i].status==='PENDING_APPROVAL')
 buffer.push(<div key={i}><ListItem
        primaryText={this.state.submittedStudents[i].email}
        leftAvatar={<Avatar src={this.state.submittedStudents[i].propicurl} />}
        rightIconButton={<IconButton
                        touch={true}
                        tooltip="Evaluate"
                        tooltipPosition="bottom-left"
                        containerElement={<Link to={'/teacher/assignment/'+this.props.assignmentid+'*'+this.state.submittedStudents[i].email+'/evaluate'} />}
                        >
                        <CheckIcon color="green" />
                        </IconButton>}
    containerElement={<Link to={'/teacher/assignment/'+this.props.assignmentid+'*'+this.state.submittedStudents[i].email+'/evaluate'} />}
    secondaryText={<p>Submitted on {submittedDate.getDate()+"-"+(submittedDate.getMonth()+1)+"-"+submittedDate.getFullYear()+" at "+submittedDate.getHours()+":"+submittedDate.getMinutes()}</p>}
    />
    <Divider inset={true} />
    </div>)
else if(this.state.submittedStudents[i].status === 'REJECTED')
{
    buffer.push(<div key={i}><ListItem
           primaryText={this.state.submittedStudents[i].email}
           leftAvatar={<Avatar src={this.state.submittedStudents[i].propicurl} />}
           rightIconButton={<IconButton
                           touch={true}
                           tooltip="Rejected"
                           tooltipPosition="bottom-left"
                           >
                           <RejectIcon color="red" />
                           </IconButton>}
          containerElement={<Link to={'/teacher/assignment/'+this.props.assignmentid+'*'+this.state.submittedStudents[i].email+'/evaluate'} />}
       secondaryText={<p>Submitted on {submittedDate.getDate()+"-"+(submittedDate.getMonth()+1)+"-"+submittedDate.getFullYear()+" at "+submittedDate.getHours()+":"+submittedDate.getMinutes()}</p>}
       />
       <Divider inset={true} />
       </div>)
    }
    else {
      buffer.push(<div key={i}><ListItem
         primaryText={this.state.submittedStudents[i].email}
         leftAvatar={<Avatar src={this.state.submittedStudents[i].propicurl} />}
         rightAvatar={<Avatar color='purple' backgroundColor={transparent}
            > {this.state.submittedStudents[i].marksGiven} </Avatar>}
         containerElement={<Link to={'/teacher/assignment/'+this.props.assignmentid+'*'+this.state.submittedStudents[i].email+'/evaluate'} />}
         secondaryText={<p>Submitted on {submittedDate.getDate()+"-"+(submittedDate.getMonth()+1)+"-"+submittedDate.getFullYear()+" at "+submittedDate.getHours()+":"+submittedDate.getMinutes()}</p>}

         />
         <Divider inset={true} />
         </div>)
    }
  }
  return buffer;
}
  render(){
if(this.state.isDataLoaded)
return(
      <StayVisible
      {... this.props}>
      <div className="Reports">
      <br />
      <Grid fluid>
      <Row around="xs">
      <Col xs={10} sm={10} md={7} lg={4}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.state.percentdaysCompleted} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Days Left</span><br />
       <span className="stat">{this.state.numberOfDaysLeft}/{this.state.totalNumberOfDays} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      <Col xs={10} sm={10} md={7} lg={4}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.state.percentStudentsSubmitted} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Submissions</span><br />
       <span className="stat">{this.state.numberOfStudentsSubmitted}/{this.state.totalEligibleNumberOfStudents} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      <Col xs={10} sm={10} md={7} lg={4}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.state.percentOfEvaluationsDone} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Evaluations Done</span><br />
       <span className="stat">{this.state.evaluationsDone}/{this.state.numberOfStudentsSubmitted} </span>
       </Col>
       </Row>
       </Grid>
      </Card>
      </Col>
      </Row>
      </Grid>
      </div>
      <br />
      <Divider />
      <div className="Reports">
      {this.nonZeroSubmissions()}
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={11} sm={11} md={9} lg={8}>
      <List>
      {this.renderListItems()}
      </List>
      </Col>
      </Row>
      </Grid>
      </div>
      </StayVisible>)
else
      return(
<StayVisible
  {... this.props}>
  <br />
  <Grid fluid>
  <Row center="xs" className="RefreshIndicator">
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
  </Grid>
    </StayVisible>)
  }
}
Reports.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Reports)
