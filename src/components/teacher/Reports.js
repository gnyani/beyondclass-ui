import React,{Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import CircularProgressbar from 'react-circular-progressbar'
import {Grid,Row,Col} from 'react-flexbox-grid'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import {notify} from 'react-notify-toast'
import {List, ListItem} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import {EvaluateIcon} from '../../styledcomponents/SvgIcons'
import RejectIcon from 'material-ui/svg-icons/navigation/close'
import Notify from 'material-ui/svg-icons/social/notifications-active'
import NotifcationsOff from 'material-ui/svg-icons/social/notifications-off'
import Notifications from 'material-ui/svg-icons/social/notifications'
import Email from 'material-ui/svg-icons/communication/email'
import EmailOutline from 'material-ui/svg-icons/communication/mail-outline.js'
import Download from 'material-ui/svg-icons/file/file-download'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import AssignmentReturn from 'material-ui/svg-icons/action/assignment-return'
import {Card} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import { withRouter } from 'react-router'
import Dialog from 'material-ui/Dialog'
import Checkbox from 'material-ui/Checkbox'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types'
import {transparent} from 'material-ui/styles/colors'
import {grey400} from 'material-ui/styles/colors'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


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
    studentsWorked: '',
    percentOfStudentsWorked: '',
    isDataLoaded: false,
    notifyOptionsDialog: false,
    emailChecked: false,
    notificationChecked: true,
    indexToActivate: 1000,
    confirmActivate: false,
  }
  this.renderListItems = this.renderListItems.bind(this)
}


getRightIconMenu = (i) => {
  var rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
      <Link to={'/teacher/assignment/'+this.props.assignmentid+'*'+this.state.submittedStudents[i].email+'/evaluate'} >
      <MenuItem
        leftIcon={<EvaluateIcon color="red" />}
        >
        Evaluate
      </MenuItem>
     </Link>
      <MenuItem
        leftIcon={<AssignmentReturn color="blue" />}
        onClick={this.confirmActivateAssignment.bind(this,i)}
        >
        ReActivate
      </MenuItem>
    </IconMenu>
  );

return rightIconMenu
}

confirmActivateAssignment = (i) => {
  if(this.state.percentdaysCompleted === 100){
    notify.show("This Assignment has already expired, you cannot ReActivate a expired assignment","warning")
  }
  else{
    this.setState({
      indexToActivate: i,
      confirmActivate: true,
    })
  }
}

reActivateAssignment = () => {
  this.handleClose()
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/activate/'+this.props.assignmentid, {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: this.state.submittedStudents[this.state.indexToActivate].email
    }).then(response =>{
      if(response.status === 200){
      notify.show("Assignment Activated Successfully","success")
    }else if(response.status === 204){
      notify.show("Assignment Not Found, Contact Admin","error")
    }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
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
        studentsWorked: response.studentsWorked,
        percentOfStudentsWorked: response.percentOfStudentsWorked,
        percentOfEvaluationsDone: response.percentOfEvaluationsDone,
        isDataLoaded: true,
      })
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}

showNotifyOptions = () => {
  this.setState({
    notifyOptionsDialog: true,
  })
}
updateEmailCheck = () => {
  this.setState((oldState) => {
    return {
      emailChecked: !oldState.emailChecked,
    };
  });
}
updateNotificationCheck = () => {
  this.setState((oldState) => {
    return {
      notificationChecked: !oldState.notificationChecked,
    };
  });
}

notifyOthers = () => {
  if(this.state.percentStudentsSubmitted === 100)
  notify.show("Everybody in this class had already submitted the assignment","warning")
  else if(this.state.percentdaysCompleted === 100)
  notify.show("This Assignment has already expired","warning")
  else{
    this.showNotifyOptions()
  }
}
nonZeroSubmissions = () => {
  var buffer=[]
  buffer.push(<Grid fluid key={0}>
        <Row center="xs">
        <Col xs={9} sm={9} md={6} lg={5}>
        <br /><br />
        <FlatButton key={1} label="Go Back" labelStyle={{textTransform: "none"}}  alt="loading" icon={<NavigationArrowBack color="white"/>}
                 className="button" onClick={()=>{this.context.router.history.goBack()}} />
        </Col>
        </Row>
        </Grid>)
    var src = 'http://'+properties.getHostName+':8080/assignments/generate/excel/'+this.props.assignmentid
  if(this.state.numberOfStudentsSubmitted && this.state.numberOfStudentsSubmitted>0)
  {
 buffer.push(
  <div key={1}>
  <p className="paragraph">Submitted Students</p>
  <br />
  <Grid fluid>
  <Row center="xs">
  <Col xs={6} sm={6} md={4} lg={3}>
    <form method="post" action={src}>
    <FlatButton type="submit" label="Download Reports" className="download" icon={<Download color="white"/>}/>
    </form>
  </Col>
  <Col xs={6} sm={6} md={4} lg={3}>
  <FlatButton label="Notify Others" className="download" icon={<Notify color="white"/>} onClick={this.notifyOthers}/>
  </Col>
  </Row>
  </Grid>
  <br />
  </div>)
}else{
  buffer.push(<Grid fluid key={1} className="paragraph">
               <br />
               <Row center="xs">
               No Submissions on this assignment yet
               </Row>
               <br />
               <Row center = "xs">
               <Col xs={6} sm={6} md={4} lg={3}>
               <FlatButton label="Notify All" className="download" icon={<Notify color="white"/>} onClick={this.notifyOthers}/>
               </Col>
               </Row>
               </Grid>)
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
        rightIconButton={this.getRightIconMenu(i)}
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
           rightIconButton={this.getRightIconMenu(i)}
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
notifyRequest = () => {
if(this.state.notificationChecked === false && this.state.emailChecked === false){
  notify.show("Please select at least one option to notify","warning")
}else{
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/notify', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.state.emailChecked,
         notification: this.state.notificationChecked,
         assignmentId: this.props.assignmentid,
       })
    }).then(response =>{
      if(response.status === 200){
      notify.show("Notified Successfully","success")
      this.setState({
          notifyOptionsDialog: false,
       })
     }else if(response.status === 406){
       notify.show("Sorry, You can notify only once per assignment per day","warning")
       this.setState({
           notifyOptionsDialog: false,
        })
     }
      else {
        notify.show("Sorry Something Went Wrong,Please Try again in sometime","error")
      }
    }).catch(response => {
    notify.show("Please login your session expired","error");
    this.context.router.history.push('/');
   });
}
}

printNotificationOptions = () => {
  var buffer = []
  if(this.state.emailChecked === true && this.state.notificationChecked === true){
    buffer.push(<p key={1}>***We are going to send both email and notification !!!***</p>)
  }else if(this.state.emailChecked === true){
    buffer.push(<p key={1}>***We are going to send only a email !!!***</p>)
  }else if(this.state.notificationChecked === true){
    buffer.push(<p key={1}>***We are going to send only a notification !!!***</p>)
  }else{
    buffer.push(<p key={1}>***You should select atleast one option to notify students !!!***</p>)
  }
  return buffer
}

handleClose = () => {
  this.setState({
    notifyOptionsDialog: false,
    confirmActivate: false,
  })
}
  render(){
    const actions = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.notifyRequest}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]

      const actions1 = [
        <FlatButton
          label="Confirm"
          primary={true}
          onTouchTap={this.reActivateAssignment}
        />,
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />]
if(this.state.isDataLoaded)
return(
      <StayVisible
      {... this.props}>
      <div className="Reports">
      <br />
      <Grid fluid>
      <Row around="xs">
      <Col xs={10} sm={10} md={7} lg={5}>
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
      <Col xs={10} sm={10} md={7} lg={5}>
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
      <Col xs={10} sm={10} md={7} lg={5}>
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
      <Col xs={10} sm={10} md={7} lg={5}>
      <br />
      <Card className="card">
      <Grid fluid >
      <Row around="xs">
      <Col xs={5} sm={5} md={5} lg={5}>
      <br />
      <CircularProgressbar percentage={this.state.percentOfStudentsWorked} strokeWidth={8}/>
       <br /><br />
       </Col>
       <Col xs>
       <br /><br /><br />
       <span className="statsparagraph">Students Started Working</span><br />
       <span className="stat">{this.state.studentsWorked}/{this.state.totalEligibleNumberOfStudents} </span>
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
      <Dialog
            title="How would you like to Notify"
            modal={false}
            actions={actions}
            open={this.state.notifyOptionsDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          <Checkbox
          label="Send Notification"
          checkedIcon={<Notifications/>}
          uncheckedIcon={<NotifcationsOff/>}
          checked={this.state.notificationChecked}
          onCheck={this.updateNotificationCheck}
          />
          <Checkbox
          label="Send Email"
          checkedIcon={<Email />}
          uncheckedIcon={<EmailOutline />}
          checked={this.state.emailChecked}
          onCheck={this.updateEmailCheck}
          />
          <Grid fluid>
          <Row center="xs">
          {this.printNotificationOptions()}
          </Row>
          </Grid>
      </Dialog>

      <Dialog
            title="Are you sure about re-activating the assignment for this student"
            modal={false}
            actions={actions1}
            open={this.state.confirmActivate}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
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
