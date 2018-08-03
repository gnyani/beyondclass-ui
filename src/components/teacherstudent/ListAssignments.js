import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import View from 'material-ui/svg-icons/action/view-list'
import ViewReport from 'material-ui/svg-icons/content/content-paste'
import {Link} from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import ListDataComponent from './ListDataComponent'
import ViewQuestions from '../teacher/ViewQuestions'
import {Card, CardActions,CardText,CardHeader} from 'material-ui/Card'
import {get} from 'lodash'

var properties = require('../properties.json')

class ListAssignments extends Component{

constructor(){
  super();
  this.state={
   assignmentIds: [],
   propicUrls: [],
   createdDates: [],
   subjects:[],
   lastDates:[],
   additionalComments: [],
   assignmentType: [],
   createdBy: [],
   creatorCollege: [],
   expanded:[],
   isDataLoaded: false,
  }
  this.listAssignments = this.listAssignments.bind(this)
}


componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/assignments/student/list', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body:this.props.email,
    }).then(response =>{
      if(response.status === 200)
      return response.json();
      else if(response.status === 204){
        return response
      }
      else{
        notify.show("Failed to Load Assignments","Error")
        return response
      }
    }).then(response => {
      var newassignmentIds=[]
      var newpropicUrls=[]
      var newcreatedDates=[]
      var newsubjects=[]
      var newlastDates=[]
      var newadditionalComments=[]
      var newassignmentType=[]
      var newcreatedBy=[]
      var newcreatorCollege=[]
      for(let i=0; i<response.length;i++){
        newassignmentIds.push(response[i].assignmentid)
        newpropicUrls.push(response[i].propicurl)
        newcreatedDates.push(response[i].createDate)
        newsubjects.push(response[i].subject)
        newlastDates.push(response[i].lastdate)
        newassignmentType.push(response[i].assignmentType)
        newadditionalComments.push(response[i].message)
        newcreatedBy.push(get(response[i],"author.realOwner.firstName",'')+get(response[i],"author.realOwner.firstName",''))
        newcreatorCollege.push(get(response[i],"author.realOwner.college",''))
      }
      this.setState({
        assignmentIds: newassignmentIds,
        propicUrls: newpropicUrls,
        createdDates: newcreatedDates,
        subjects: newsubjects,
        lastDates: newlastDates,
        assignmentType: newassignmentType,
        additionalComments: newadditionalComments,
        createdBy: newcreatedBy,
        creatorCollege: newcreatorCollege,
        isDataLoaded: true,
      })
    })
    .catch(response => {
    notify.show("Please login again your session expired","error");
    this.context.router.history.push('/');
   })
}

handleExpand(i){
  var newExpanded =[]
  newExpanded[i] = !this.state.expanded[i]
   this.setState({expanded: newExpanded});
 };



listAssignments(){
  var buffer = []
  var attributes = ['Assignment Type','Subject','Last Date', 'Comments', 'Created By']
if(this.state.assignmentIds.length !== 0)
{
  buffer.push(<p className="paragraph" key={this.state.assignmentIds.length+1}>Your pending assigments</p>)
  for(let i=0; i<this.state.assignmentIds.length; i++){
    var lastDate = new Date(this.state.lastDates[i])
    var createdDate = new Date(this.state.createdDates[i])
    var values = [this.state.assignmentType[i],this.state.subjects[i],
    lastDate.getDate()+"-"+(lastDate.getMonth()+1)+"-"+lastDate.getFullYear()+" at 11:59 PM",
    this.state.additionalComments[i], this.state.createdBy[i]+' ('+ this.state.creatorCollege[i]+')']
    buffer.push(
      <Grid fluid key={i}>
      <Row center="xs">
      <Col xs={12} sm={12} md={7} lg={7} >
         <Card
          expanded={this.state.expanded[i]}
          >
          <Grid fluid className="nogutter">
          <Row start="xs" top="xs">
          <Col xs>
           <CardHeader
           className="cardHeader"
             title={this.state.assignmentIds[i].split('-')[6]}
             subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
             avatar={this.state.propicUrls[i]}
           />
           </Col>
           </Row>
           </Grid>
           <CardText className="table">
                <ListDataComponent attribute={attributes} value={values}/>
           </CardText>
           <CardText expandable={true} >
            <ViewQuestions assignmentid={this.state.assignmentIds[i]}/>
          </CardText>
          <Grid fluid>
          <Row center="xs">
          <Col xs>
           <CardActions>
            <FlatButton label="View Questions"  labelStyle={{textTransform: 'none'}}
              style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
              icon={<View />} onClick={this.handleExpand.bind(this,i)}/>
            </CardActions>
          </Col>
          <Col xs>
            <CardActions>
              <FlatButton label="Take Assignment"
                 icon={<ViewReport color="white"/>} className="AnnounceButton" labelStyle={{textTransform: "none", fontSize: '1em'}}
               containerElement={<Link to={'/student/assignments/take/'+this.state.assignmentIds[i]}/>} />
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
}else if(this.state.assignmentIds.length === 0 && this.state.isDataLoaded === true){
  buffer.push(<p className="fontreq assgn" key={1} >You are all caught up !!!</p>)
}else{
  buffer.push(
  <Grid fluid className="RefreshIndicator" key={1}>
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
    return(
      <div className="TeacherAssignment">
      {this.listAssignments()}
      </div>
    )
  }
}
ListAssignments.contextTypes = {
    router: PropTypes.object
};
export default withRouter(ListAssignments)
