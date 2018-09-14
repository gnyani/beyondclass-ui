import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import {DeleteOutline} from '../../styledcomponents/SvgIcons'
import View from 'material-ui/svg-icons/action/view-list'
import ViewReport from 'material-ui/svg-icons/content/content-paste'
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import {Link} from 'react-router-dom'
import Public from 'material-ui/svg-icons/social/public.js'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {Card, CardActions,CardText,CardHeader} from 'material-ui/Card'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Download from 'material-ui/svg-icons/file/file-download'
import ViewQuestions from './ViewQuestions'
import Add from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit.js'
import Settings from 'material-ui//svg-icons/action/settings-applications.js'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import ListDataComponent from '../teacherstudent/ListDataComponent'
import Copy from 'material-ui/svg-icons/content/content-copy'
import ListBatches from './ListBatches.js'
import {get} from 'lodash'


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
   postedToNetwork:[],
   savedAssignmentTypes: [],
   savedAssignmentSubjects: [],
   savedAssignmentIdReferences: [],
   assignmentIds: [],
   propicUrls: [],
   createdDates: [],
   subjects:[],
   lastDates:[],
   createdBy: [],
   creatorCollege: [],
   additionalComments: [],
   questionSetReferenceId: [],
   expanded:[],
   assignmentType: [],
   deleteConfirm: false,
   openNetworkDialog: false,
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
          savedAssignmentIdReferences: [],
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
      var newSavedAssignmentIdReferences = []
      var newPostedToNetwork = []
      if(response)
      for(let i=0; i<response.length;i++){
        newSavedAssignmentIds.push(response[i].assignmentid)
        newSavedCreatedDates.push(response[i].createDate)
        newSavedAssignmentTypes.push(response[i].assignmentType)
        newSavedAssignmentSubjects.push(response[i].subject)
        newSavedAssignmentIdReferences.push(get(response[i],"author.questionSetReferenceId", ''))
        newPostedToNetwork.push(response[i].postedToNetwork?response[i].postedToNetwork:false)
      }
      this.setState({
        savedAssignmentIds: newSavedAssignmentIds,
        savedAssignmentTypes: newSavedAssignmentTypes,
        savedCreatedDates: newSavedCreatedDates,
        savedAssignmentSubjects: newSavedAssignmentSubjects,
        savedAssignmentIdReferences: newSavedAssignmentIdReferences,
        postedToNetwork: newPostedToNetwork
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
          questionSetReferenceId: [],
          createdBy: [],
          creatorCollege: [],
          postedToNetwork: []
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
      var newquestionSetReferenceIds=[]
      var newcreatedBy=[]
      var newcreatorCollege=[]
      var newPostedToNetwork=[]
      if(response)
      for(let i=0; i<response.length;i++){
        newassignmentIds.push(response[i].assignmentid)
        newpropicUrls.push(response[i].propicurl)
        newcreatedDates.push(response[i].createDate)
        newsubjects.push(response[i].subject)
        newlastDates.push(response[i].lastdate)
        newassignmentType.push(response[i].assignmentType)
        newquestionSetReferenceIds.push(get(response[i],"author.questionSetReferenceId",''))
        newadditionalComments.push(response[i].message)
        newcreatedBy.push(get(response[i],"author.realOwner.firstName",'')+get(response[i],"author.realOwner.lastName",''))
        newcreatorCollege.push(get(response[i],"author.realOwner.college",''))
        newPostedToNetwork.push(response[i].postedToNetwork)
      }
      this.setState({
        assignmentIds: newassignmentIds,
        propicUrls: newpropicUrls,
        createdDates: newcreatedDates,
        subjects: newsubjects,
        lastDates: newlastDates,
        assignmentType: newassignmentType,
        additionalComments: newadditionalComments,
        questionSetReferenceId: newquestionSetReferenceIds,
        createdBy: newcreatedBy,
        creatorCollege: newcreatorCollege,
        isDataLoaded: true,
        postedToNetwork:newPostedToNetwork
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

handleConfirmDelete = (i) =>{
  this.setState({
    deleteConfirm:true,
    index:i,
  })
}

handleClose = () => {
  this.setState({deleteConfirm: false, selectBatchDialog: false,selectBatchDialogWhenOneBatch: false, openNetworkDialog: false});
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
  buffer.push(<p key={i}><b>Subject: </b> {this.state.savedAssignmentSubjects[i]}</p>)
  return buffer
}

decideAction = (i) => {
  var buffer = []
  if(this.state.savedAssignmentTypes[i] === 'THEORY')
  buffer.push(<FlatButton key={i} label="Continue Working"
  labelStyle={{textTransform: 'none', fontSize: '1em'}}
  style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
  icon={<RightIcon />}
  containerElement={<Link to={'/teacher/create/'+this.props.class+'/saved/'+this.state.savedAssignmentIds[i]}/>} />)
  else if(this.state.savedAssignmentTypes[i] === 'OBJECTIVE')
  buffer.push(<FlatButton key={i} label="Continue Working" labelStyle={{textTransform: 'none', fontSize: '1em'}}
  style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax', textTransform: 'none'}}
  icon={<RightIcon />}
  containerElement={<Link to={'/teacher/createobjectiveassignment/'+this.props.class+'/saved/'+this.state.savedAssignmentIds[i]}/>} />)
  else {
    buffer.push(<FlatButton  key={i} label="Continue Working" labelStyle={{textTransform: 'none',fontSize: '1em'}}
    style={{verticalAlign: 'middle',border: "0.08em solid #30b55b",color: "#30b55b",borderRadius: '1vmax', textTransform: 'none'}}
    icon={<RightIcon />}
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

    buffer.push(<p className="paragraph uprcase" key={this.state.savedAssignmentIds.length+1}>Your draft assigments for class {this.props.class} </p>)
    for(let i=0; i<this.state.savedAssignmentIds.length; i++){
        var createdDate = new Date(this.state.savedCreatedDates[i])
      buffer.push(
        <Grid fluid key={i}>
        <Row around="xs">
        <Col xs={11} sm={11} md={7} lg={7} >
           <Card
            onExpandChange={this.handleConfirmDelete.bind(this,i)}
            >
            <CardHeader className="cardHeader"
            title={this.props.email}
            subtitle={"Saved on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
            avatar={this.state.propicUrls[i]}
            showExpandableButton={true}
            closeIcon={<DeleteOutline color="red" />}
            openIcon={<DeleteOutline color="red" />}
            />
             <CardText style={{textAlign:"center"}}>
             <p><b>Assignment Type: </b> {this.state.savedAssignmentTypes[i]}</p>
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

openDialogForNetwork = (i) => {
  this.setState({
    activeIndex : i,
    openNetworkDialog: true,
  })
}

postToNetwork = () => {
  var createdAssignment;
  fetch('http://'+properties.getHostName+':8080/assignments/teacher/get/assignment/publish/'+this.state.assignmentIds[this.state.activeIndex],{
          credentials: 'include',
          method: 'GET'
        }).then(response => {
          if(response.status === 200){
            return response.json()
          }else{
            notify.show("Something went wrong", "error")
          }
        }).then (response => {
          createdAssignment = response
          return createdAssignment
        }).then(createdAssignment => {
          this.postAssignment(createdAssignment)
          var newPostedToNetwork=this.state.postedToNetwork.slice()
          newPostedToNetwork[this.state.activeIndex]=true
          this.setState({
            postedToNetwork:newPostedToNetwork

          })
        }).catch(response => {
        notify.show("Please login before posting an announcement","error");
        this.context.router.history.push('/');
       });
}

postAssignment = (createdAssignment) => {
  fetch('http://'+properties.getHostName+':8080/teachersnetwork/savequestionset', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify(createdAssignment),
    }).then(response => {
      if(response.status === 200){
        notify.show("Successfully posted to the network", "success")
      }else{
        notify.show("Something went wrong", "error")
      }
      this.handleClose()
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
  var attributes = ['Assignment Type','Subject','Last Date', 'Comments', 'Created By']
if(this.state.assignmentIds.length !== 0)
{
  buffer.push(<p className="paragraph uprcase" key={this.state.assignmentIds.length+1}>Your assignments for class {this.props.class} </p>)
  for(let i=0; i<this.state.assignmentIds.length; i++){
    var lastDate = new Date(this.state.lastDates[i])
    var values = [this.state.assignmentType[i],this.state.subjects[i],
    lastDate.getDate()+"-"+(lastDate.getMonth()+1)+"-"+lastDate.getFullYear()+" at 11:59 PM",
    this.state.additionalComments[i], this.state.createdBy[i]+' ('+this.state.creatorCollege[i]+')']
    var createdDate = new Date(this.state.createdDates[i])
    var src = 'http://'+properties.getHostName+':8080/assignments/get/questions/'+this.state.assignmentIds[i]
    buffer.push(
      <Grid fluid key={i}>
      <Row around="xs">
      <Col xs={11} sm={11} md={7} lg={7} >
         <Card
          onExpandChange={this.handleEdit.bind(this,i)}
          expanded={this.state.expanded[i]}
          >
          <CardHeader className="cardHeader"
            title={this.props.email}
            subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
            avatar={this.state.propicUrls[i]}
            showExpandableButton={true}
            closeIcon={<Edit  />}
            openIcon={<Edit  />}
          />
         <CardText className="table">
             <ListDataComponent attribute={attributes} value={values} />
         </CardText>
           <CardText expandable={true} >
            <ViewQuestions assignmentid={this.state.assignmentIds[i]} />
          </CardText>
          <Grid fluid>
          <Row center="xs" middle="xs">
          <Col xs>
            <CardActions>
              <FlatButton label="View Reports"
                labelStyle={{textTransform: 'none',fontSize: '1em'}}
                style={{verticalAlign: 'middle',backgroundColor: "#30b55b", color: 'white'}}
                icon={<ViewReport />}
               containerElement={<Link to={'/teacher/reports/view/'+this.state.assignmentIds[i]}/>} />
           </CardActions>
           </Col>
           <Col xs>
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
                  <MenuItem primaryText="Download Questions" leftIcon={<Download />} onClick={this.downloadQuestions.bind(this)}/>
                </form>
                  <MenuItem primaryText="Duplicate" leftIcon={<Copy  />} onClick={this.selectBatch.bind(this,i)}/>
                  <MenuItem primaryText="View Questions" leftIcon={<View  />} onClick={this.handleExpand.bind(this,i)}/>
                </IconMenu>
              </CardActions>
           </Col>
           <Col xs>
            <CardActions>
             <IconButton tooltip="Publish"
               iconStyle={styles.mediumIcon}
               style={styles.medium} disabled={this.state.postedToNetwork[i]}
               onClick = {this.openDialogForNetwork.bind(this,i)}
               >
                      <Public />
                </IconButton>
              </CardActions>
           </Col>
           </Row>
           </Grid>
         </Card>
         <br />
      </Col>
      </Row>
      </Grid>
  )
}
}else if(this.state.isDataLoaded){
  buffer.push(<p className="paragraph uprcase" key={1}>You did not give any Assigments to this class yet !!!</p>)
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
      onTouchTap={this.postToNetwork}
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

    const actions3 = [
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

    const actions2 = [
        <FlatButton
          label="Close"
          primary={true}
          onTouchTap={this.handleClose}
        />
      ]
    return(
      <div className="TeacherAssignment">
      <Grid flex>
        <Row around='xs'>
          <Col xs={12} sm={12} md={12} lg={12} className="fab-btn">
          <IconMenu iconButtonElement={
                  <IconButton
                    touch={true}
                    tooltip="New Assignment"
                    tooltipPosition="top-left"
                    className="fab-icon-btn"
                  >
                    <Add className="whitecol"/>
                  </IconButton>
                }>
            <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/create'} >
              <MenuItem >
              Theory Assignment
              </MenuItem>
            </Link>
            <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/createobjectiveassignment'} >
              <MenuItem >
              Objective Assignment
              </MenuItem>
            </Link>
            <Link style={{textDecoration: 'none'}} to={'/teacher/'+this.props.class+'/createpa'} >
              <MenuItem >
              Programming Assignment
              </MenuItem>
            </Link>
          </IconMenu>
          </Col>
        </Row>
      </Grid>
      {this.listSavedAssignments()}
      {this.listAssignments()}
      <Dialog
            title="Your are about to share your assignment to the community"
            modal={true}
            actions={actions1}
            open={this.state.openNetworkDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "#39424d"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      <Dialog
            title="Select the batch to duplicate the assignment"
            modal={true}
            actions={actions}
            open={this.state.selectBatchDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "#39424d"}}
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
            titleStyle={{textAlign:"center",color: "#39424d"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      <Dialog
            title="Are you sure you want to delete this draft?"
            modal={true}
            actions={actions3}
            open={this.state.deleteConfirm}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "#39424d"}}
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
