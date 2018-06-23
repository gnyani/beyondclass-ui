import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Delete from 'material-ui/svg-icons/action/delete'
import View from 'material-ui/svg-icons/action/view-list'
import ViewReport from 'material-ui/svg-icons/content/content-paste'
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {Card, CardActions,CardText,CardHeader, CardTitle} from 'material-ui/Card'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Download from 'material-ui/svg-icons/file/file-download'
import ViewQuestions from './ViewQuestions'
import Edit from 'material-ui/svg-icons/image/edit.js'
import Settings from 'material-ui//svg-icons/action/settings-applications.js'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Copy from 'material-ui/svg-icons/content/content-copy'
import ListBatches from './ListBatches.js'


var properties = require('../properties.json');

const styles = {
  mediumIcon: {
    width: 48,
    height: 48,
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  }
}
class ListAssignments extends Component{

constructor(){
  super();
  this.state={
   savedAssignmentIds:[],
   savedCreatedDates:[],
   savedAssignmentTypes: [],
   savedAssignmentSubjects: [],
   assignmentIds: [],
   propicUrls: [],
   createdDates: [],
   subjects:[],
   lastDates:[],
   additionalComments: [],
   expanded:[],
   assignmentType: [],
   deleteConfirm: false,
   isDataLoaded: false,
   selectBatchDialog: false,
   selectBatchDialogWhenOneBatch: false,
   index: '',
   batchIndex: null,
   showRefreshIndicator: false,
  }
  this.listAssignments = this.listAssignments.bind(this)
  this.deleteAssignment = this.deleteAssignment.bind(this)
}


componentDidMount(){

  fetch('http://'+properties.getHostName+':8080/assignments/teacher/saved/list', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.email,
         batch: this.props.class,
      })
    }).then(response =>{
      if(response.status === 200)
      return response.json();
      else if(response.status === 204){
        this.setState({
          savedAssignmentIds: [],
          savedCreatedDates: [],
          savedAssignmentTypes: [],
          savedAssignmentSubjects: [],
        })
      }
      else{
        notify.show("Failed to Load Assignments","Error")
      }
    }).then(response => {
      var newSavedAssignmentIds = []
      var newSavedCreatedDates = []
      var newSavedAssignmentTypes = []
      var newSavedAssignmentSubjects = []
      if(response)
      for(let i=0; i<response.length;i++){
        newSavedAssignmentIds.push(response[i].assignmentid)
        newSavedCreatedDates.push(response[i].createDate)
        newSavedAssignmentTypes.push(response[i].assignmentType)
        newSavedAssignmentSubjects.push(response[i].subject)
      }
      this.setState({
        savedAssignmentIds: newSavedAssignmentIds,
        savedAssignmentTypes: newSavedAssignmentTypes,
        savedCreatedDates: newSavedCreatedDates,
        savedAssignmentSubjects: newSavedAssignmentSubjects,
      })
    })

  fetch('http://'+properties.getHostName+':8080/assignments/teacher/list', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         email: this.props.email,
         batch: this.props.class,
      })
    }).then(response =>{
      if(response.status === 200)
      return response.json();
      else if(response.status === 204){
        this.setState({
          assignmentIds: [],
          propicUrls: [],
          createdDates: [],
          subjects: [],
          lastDates: [],
          assignmentType: [],
          additionalComments: [],
        })
      }
      else{
        notify.show("Failed to Load Assignments","Error")
      }
    }).then(response => {
      var newassignmentIds=[]
      var newpropicUrls=[]
      var newcreatedDates=[]
      var newsubjects=[]
      var newlastDates=[]
      var newadditionalComments=[]
      var newassignmentType=[]
      if(response)
      for(let i=0; i<response.length;i++){
        newassignmentIds.push(response[i].assignmentid)
        newpropicUrls.push(response[i].propicurl)
        newcreatedDates.push(response[i].createDate)
        newsubjects.push(response[i].subject)
        newlastDates.push(response[i].lastdate)
        newassignmentType.push(response[i].assignmentType)
        if(response[i].message !== null && response[i].message.trim() !== '')
        newadditionalComments.push('Additional Comments : '+response[i].message)
        else {
          newadditionalComments.push(response[i].message)
        }
      }
      this.setState({
        assignmentIds: newassignmentIds,
        propicUrls: newpropicUrls,
        createdDates: newcreatedDates,
        subjects: newsubjects,
        lastDates: newlastDates,
        assignmentType: newassignmentType,
        additionalComments: newadditionalComments,
        isDataLoaded: true,
      })
    }).catch(response => {
    notify.show("Please login before viewing dashboard","error");
    this.context.router.history.push('/');
   });
}


handleExpand(i){
  var newExpanded =[]
  newExpanded[i] = !this.state.expanded[i]
   this.setState({expanded: newExpanded});
 };

updateBatchSelection = (batches) => {
  this.setState({
    batchIndex: batches[0]
  })
}

shouldComponentUpdate(){
  return true
}

handleConfirmDelete(i){
  this.setState({
    deleteConfirm:true,
    index:i,
  })
}

handleClose = () => {
  this.setState({deleteConfirm: false, selectBatchDialog: false,selectBatchDialogWhenOneBatch: false});
};

deleteAssignment(){
  fetch('http://'+properties.getHostName+':8080/assignments/'+this.state.savedAssignmentIds[this.state.index]+'/delete',{
          credentials: 'include',
          method: 'GET'
        }).then(response =>{
          if(response.status===200)
          {
          notify.show("Deleted successfully","success")
          this.setState({
            deleteConfirm: false,
          })
          this.componentDidMount()
        }
          else {
            notify.show("Sorry something Went wrong","error")
          }
        }).catch(response => {
        notify.show("Please login your session expired","error");
        this.context.router.history.push('/');
       });

}

decideSubject = (i) => {
  var buffer = []
  if(this.state.savedAssignmentTypes[i] === 'THEORY')
  buffer.push(<p key={i}>{'Subject: ' +this.state.savedAssignmentSubjects[i]}</p>)
  return buffer
}

decideAction = (i) => {
  var buffer = []
  if(this.state.savedAssignmentTypes[i] === 'THEORY')
  buffer.push(<RaisedButton key={i} label="Continue Working" primary={true} icon={<RightIcon />}
  containerElement={<Link to={'/teacher/create/'+this.props.class+'/saved/'+this.state.savedAssignmentIds[i]}/>} />)
  else if(this.state.savedAssignmentTypes[i] === 'OBJECTIVE')
  buffer.push(<RaisedButton key={i} label="Continue Working" primary={true} icon={<RightIcon />}
  containerElement={<Link to={'/teacher/createobjectiveassignment/'+this.props.class+'/saved/'+this.state.savedAssignmentIds[i]}/>} />)
  else {
    buffer.push(<RaisedButton  key={i} label="Continue Working" primary={true} icon={<RightIcon />}
   containerElement={<Link to={'/teacher/createpa/'+this.props.class+'/saved/'+this.state.savedAssignmentIds[i]}/>} />)
  }
  return buffer
}

decideRedirectAssignment = (id,type,batch) => {
  if(type === 'THEORY')
  this.context.router.history.push('/teacher/create/'+batch+'/saved/'+id)
  else if(type === 'OBJECTIVE')
  this.context.router.history.push('/teacher/createobjectiveassignment/'+batch+'/saved/'+id)
  else{
    this.context.router.history.push('/teacher/createpa/'+batch+'/saved/'+id)
  }
}

listSavedAssignments = () => {
  var buffer = []
  if(this.state.savedAssignmentIds.length !== 0)
  {
    buffer.push(<p className="paragraph" key={this.state.savedAssignmentIds.length+1}>Your Draft Assigments for class {this.props.class} </p>)
    for(let i=0; i<this.state.savedAssignmentIds.length; i++){
      var createdDate = new Date(this.state.savedCreatedDates[i])
      buffer.push(
        <Grid fluid key={i}>
        <Row start="xs">
        <Col xs={12} sm={12} md={12} lg={12} >
           <Card
            onExpandChange={this.handleConfirmDelete.bind(this,i)}
            >
             <CardHeader className="cardHeader"
               title={this.props.email}
               subtitle={"Saved on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
               avatar={this.state.propicUrls[i]}
               showExpandableButton={true}
               closeIcon={<Delete color="red" viewBox="0 0 20 20"/>}
               openIcon={<Delete color="red" viewBox="0 0 20 20"/>}
             />
             <CardText style={{textAlign:"center"}}>
             <p>{'AssignmentType: ' +this.state.savedAssignmentTypes[i]}</p>
             <br />
             {this.decideSubject(i)}
             </CardText>
            <Grid fluid>
            <Row center="xs">
            <Col xs>
              <CardActions>
              {this.decideAction(i)}
             </CardActions>
             </Col>
             </Row>
             </Grid>
             <br />
           </Card>
           <br />
        </Col>
        </Row>
        </Grid>
    )
  }
  }
  return buffer;
  }


handleEdit = (i) => {
  if(this.state.assignmentType[i] === 'THEORY'){
    this.context.router.history.push('/teacher/create/'+this.props.class+'/edit/'+this.state.assignmentIds[i])
  }else if(this.state.assignmentType[i] === 'CODING'){
    this.context.router.history.push('/teacher/createpa/'+this.props.class+'/edit/'+this.state.assignmentIds[i])
  }else if(this.state.assignmentType[i] === 'OBJECTIVE'){
   this.context.router.history.push('/teacher/createobjectiveassignment/'+this.props.class+'/edit/'+this.state.assignmentIds[i])
  }
}

submitDuplicateAssignmentRequest = () => {
  var batch = this.props.batches[this.state.batchIndex]
  this.setState({
    showRefreshIndicator: true
  })

  fetch('http://'+properties.getHostName+':8080/assignments/teacher/duplicate/'+this.state.assignmentIds[this.state.activeIndex], {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: batch,
    }).then(response => {
      if(response.status === 201){
        return response.json()
      }else{
        notify.show("Sorry something went wrong","error")
      }
    }).then(response => {
        this.decideRedirectAssignment(response.assignmentid,response.assignmentType,response.batch)
    })
}

selectBatch = (i) => {
  if(this.props.batches.length > 1){
    this.setState({
      activeIndex: i,
      selectBatchDialog: true,
  })
}else{
  this.setState({
    activeIndex: i,
    selectBatchDialogWhenOneBatch: true,
  })
}
}

downloadQuestions = () => {
  document.getElementById("form_download_id").submit()
}

listAssignments(){
  var buffer = []
if(this.state.assignmentIds.length !== 0)
{
  buffer.push(<p className="paragraph" key={this.state.assignmentIds.length+1}>Your Assigments for class {this.props.class} </p>)
  for(let i=0; i<this.state.assignmentIds.length; i++){
    var lastDate = new Date(this.state.lastDates[i])
    var createdDate = new Date(this.state.createdDates[i])
    var src = 'http://'+properties.getHostName+':8080/assignments/get/questions/'+this.state.assignmentIds[i]
    buffer.push(
      <Grid fluid key={i}>
      <Row start="xs">
      <Col xs={12} sm={12} md={12} lg={12} >
         <Card
          onExpandChange={this.handleEdit.bind(this,i)}
          expanded={this.state.expanded[i]}
          >
           <CardHeader className="cardHeader"
             title={this.props.email}
             subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
             avatar={this.state.propicUrls[i]}
             showExpandableButton={true}
             closeIcon={<Edit color="red" viewBox="0 0 22 22"/>}
             openIcon={<Edit color="red" viewBox="0 0 22 22"/>}
           />

           <CardTitle style={{textAlign:"center"}} title={this.state.subjects[i]} subtitle={"last date :"+(lastDate.getDate())+"-"+(lastDate.getMonth()+1)+"-"+lastDate.getFullYear()+" at 11:59 PM"}  />
           <CardText style={{textAlign:"center"}}>
           <p>{'AssignmentType: ' +this.state.assignmentType[i]}</p>
           <br />
           <p>{this.state.additionalComments[i]}</p>
           </CardText>
          <Grid fluid>
          <Row center="xs" middle="xs">
          <Col xs>
           <CardActions>
            <RaisedButton label="View Questions" primary={true} icon={<View />} onClick={this.handleExpand.bind(this,i)}/>
            </CardActions>
          </Col>
          <Col xs>
            <CardActions>
              <RaisedButton label="View Reports" primary={true} icon={<ViewReport />}
               containerElement={<Link to={'/teacher/reports/view/'+this.state.assignmentIds[i]}/>} />
           </CardActions>
           </Col>
           <Col xs={3} sm={3} md={3} lg={3} >
             <CardActions>
               <IconMenu
                  iconButtonElement={<IconButton
                    iconStyle={styles.mediumIcon}
                    style={styles.medium}
                    >
                    <Settings />
                    </IconButton>}
                >
                <form method="get" action={src} id="form_download_id">
                  <MenuItem primaryText="Download Questions" leftIcon={<Download color="blue"/>} onClick={this.downloadQuestions.bind(this)}/>
                </form>
                  <MenuItem primaryText="Duplicate" leftIcon={<Copy color="red" />} onClick={this.selectBatch.bind(this,i)}/>
                </IconMenu>

             </CardActions>
           </Col>

           </Row>
           </Grid>
           <CardText expandable={true} >
            <ViewQuestions assignmentid={this.state.assignmentIds[i]} />
          </CardText>
           <br />
         </Card>
         <br />
      </Col>
      </Row>
      </Grid>
  )
}
}else if(this.state.isDataLoaded){
  buffer.push(<p className="paragraph" key={1}>You did not give any Assigments to this class yet </p>)
}else{
  buffer.push(<Grid fluid className="RefreshIndicator" key={1}>
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
return buffer;
}

  render(){
const actions1 = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
    />,
    <FlatButton
      label="Confirm"
      primary={true}
      onTouchTap={this.deleteAssignment}
    />,
  ]

  const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.submitDuplicateAssignmentRequest}
      />,
    ]

    const actions2 = [
        <FlatButton
          label="Close"
          primary={true}
          onTouchTap={this.handleClose}
        />
      ]
    return(
      <div className="TeacherAssignment">
      {this.listSavedAssignments()}
      {this.listAssignments()}
      <Dialog
            title="Are you sure about deleting this draft assignment"
            modal={true}
            actions={actions1}
            open={this.state.deleteConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      <Dialog
            title="Select the batch to duplicate the assignment"
            modal={true}
            actions={actions}
            open={this.state.selectBatchDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          <ListBatches batches={this.props.batches} showRefreshIndicator={this.state.showRefreshIndicator} updateBatchSelection={this.updateBatchSelection}/>
      </Dialog>
      <Dialog
            title="You cannot duplicate the assignment since you have only 1 class listed"
            modal={true}
            actions={actions2}
            open={this.state.selectBatchDialogWhenOneBatch}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </div>
    )
  }
}
ListAssignments.contextTypes = {
    router: PropTypes.object
};
export default withRouter(ListAssignments)
