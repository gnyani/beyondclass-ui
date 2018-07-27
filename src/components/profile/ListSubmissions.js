import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import {Card,CardHeader,CardActions,CardText} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ListDataComponent from '../teacherstudent/ListDataComponent'
import Download from 'material-ui/svg-icons/file/file-download'

var properties = require('../properties.json');

class ListSubmissions extends Component{

renderSubmittedAssignments(){
  var buffer=[]
  var submissions = this.props.submitAssignmentList
  var assignments = this.props.assignmentsList
  var attributes = ['Assignment Type','Subject','Status','Submitted On']
  if(submissions.length !== 0){
    buffer.push(<p className="paragraph" key={submissions.length+1}> Your submissions </p>)
    for(let i=0; i<submissions.length ; i++){
      var date = new Date(submissions[i].submissionDate)
      var values = [assignments[i].assignmentType,assignments[i].subject,submissions[i].status+ ' with '+submissions[i].marksGiven+' marks',
             date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()]
      var values1 = [assignments[i].assignmentType,assignments[i].subject,submissions[i].status,
                    date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()]
      var src = 'http://'+properties.getHostName+':8080/assignments/get/submission/'+assignments[i].assignmentid+'*'+submissions[i].email
      if(submissions[i].status==='ACCEPTED')
      buffer.push(
           <Grid fluid key={i}>
           <Row around="xs">
           <Col xs={11} sm={11} md={7} lg={7}>
           <Card>
           <CardHeader className="cardHeader"  title='Assignment By' subtitle={assignments[i].email} avatar={assignments[i].propicurl}/>
           <CardText className="table">
           <ListDataComponent attribute={attributes} value={values} />
           </CardText>
           <CardActions>
           <Grid fluid>
           <Row center="xs" top="xs">
           <Col xs className="EvaluateAssignment">
           <FlatButton label="View Assignment" className="button"
           containerElement={
             <Link to={'/teacher/assignment/'+assignments[i].assignmentid+'*'+submissions[i].email+'/evaluate'} />
           }/>
           </Col>
           <Col xs={3} sm={3} md={3} lg={2}>
            <form method="get" action={src}>
             <FloatingActionButton mini={true} type="submit" backgroundColor={'#30b55b'}>
               <Download />
             </FloatingActionButton>
           </form>
           </Col>
           </Row>
           </Grid>
           </CardActions>
           </Card>
           <br />
           </Col>
           </Row>
           </Grid>
         )
      else{
        buffer.push(
             <Grid fluid key={i}>
             <Row around="xs">
             <Col xs={11} sm={11} md={7} lg={7}>
             <Card>
             <CardHeader className="cardHeader" title='Assignment By' subtitle={assignments[i].email} avatar={assignments[i].propicurl}/>
               <CardText className="table">
               <ListDataComponent attribute={attributes} value={values1} />
               </CardText>
             <CardActions>
             <Grid fluid>
             <Row center="xs" top="xs">
             <Col xs className="EvaluateAssignment">
             <FlatButton label="View Assignment" className="button"
             containerElement={
               <Link to={'/teacher/assignment/'+assignments[i].assignmentid+'*'+submissions[i].email+'/evaluate'} />
             }/>
             </Col>
             <Col xs={3} sm={3} md={3} lg={2}>
               <form method="get" action={src}>
               <FloatingActionButton type="submit" mini={true} backgroundColor={'#30b55b'}>
                 <Download />
               </FloatingActionButton>
             </form>
             </Col>
             </Row>
             </Grid>
             </CardActions>
             </Card>
             <br />
             </Col>
             </Row>
             </Grid>
           )
      }
    }

  }else if(submissions.length === 0){
    buffer.push(<p className="paragraph">You did not submit any assignments till date </p>)
  }
  return buffer;
}


  render(){
      if(this.props.submitAssignmentList)
    return(
     <div className="Reports">
     {this.renderSubmittedAssignments()}
     </div>
    )
    else{
      return(<Grid fluid className="RefreshIndicator">
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


export default ListSubmissions
