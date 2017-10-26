import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import View from 'material-ui/svg-icons/action/view-list'
import ViewReport from 'material-ui/svg-icons/content/content-paste'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {Card, CardActions,CardText,CardHeader, CardTitle} from 'material-ui/Card'

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
   questions:[],
   additionalComments: [],
   expanded:[],
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
      }else if(response.status === 302){
        this.context.router.history.push('/')
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
      var newquestions=[]
      var newadditionalComments=[]
      for(let i=0; i<response.length;i++){
        newassignmentIds.push(response[i].assignmentid)
        newpropicUrls.push(response[i].propicurl)
        newcreatedDates.push(response[i].createDate)
        newsubjects.push(response[i].subject)
        newlastDates.push(response[i].lastdate)
        newquestions.push(response[i].questions)
        if(response[i].message.trim() !== '')
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
        questions: newquestions,
        additionalComments: newadditionalComments,
      })
    })
}

handleExpand(i){
  var newExpanded =[]
  newExpanded[i] = !this.state.expanded[i]
   this.setState({expanded: newExpanded});
 };

renderAssignmentQuestions(index){
  var buffer=[]
  var questions=this.state.questions[index]
  for(let i=0;i<questions.length;i++){
  buffer.push(<li className="displayQuestions" key={i}>{questions[i]}</li>)
  }
  return buffer;
}




listAssignments(){
  var buffer = []
if(this.state.assignmentIds.length !== 0)
{
  buffer.push(<p className="paragraph" key={new Date()}>Your Pending Assigments</p>)
  for(let i=0; i<this.state.assignmentIds.length; i++){
    var lastDate = new Date(this.state.lastDates[i])
    var createdDate = new Date(this.state.createdDates[i])
    buffer.push(
      <Grid fluid key={i}>
      <Row start="xs">
      <Col xs={12} sm={12} md={12} lg={12} >
         <Card
          expanded={this.state.expanded[i]}
          >
          <Grid fluid className="nogutter">
          <Row start="xs" top="xs">
          <Col xs>
           <CardHeader
           className="cardHeader"
             title={this.props.email}
             subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
             avatar={this.state.propicUrls[i]}
           />
           </Col>
           </Row>
           </Grid>
           <CardTitle style={{textAlign:"center"}} title={this.state.subjects[i]} subtitle={"last date :"+lastDate.getDate()+"-"+(lastDate.getMonth()+1)+"-"+lastDate.getFullYear()}  />
           <CardText style={{textAlign:"center"}}>
           <p>{this.state.additionalComments[i]}</p>
           </CardText>
           <CardText expandable={true} >
            <ol>{this.renderAssignmentQuestions(i)}</ol>
          </CardText>
          <Grid fluid>
          <Row center="xs">
          <Col xs>
           <CardActions>
            <RaisedButton label="View Questions" primary={true} icon={<View />} onClick={this.handleExpand.bind(this,i)}/>
            </CardActions>
          </Col>
          <Col xs>
            <CardActions>
              <RaisedButton label="Take Assignment" primary={true} icon={<ViewReport />}
               containerElement={<Link to={'/student/assignments/take/'+this.state.assignmentIds[i]}/>} />
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
}else{
  buffer.push(<p className="paragraph" >You are all caught up !!!</p>)
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
