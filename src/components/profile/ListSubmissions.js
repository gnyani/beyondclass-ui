import React,{Component} from 'react'
import {Grid,Row,Col} from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import {Card,CardTitle,CardHeader,CardActions,CardText} from 'material-ui/Card'
import {Link} from 'react-router-dom'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Download from 'material-ui/svg-icons/file/file-download'

var properties = require('../properties.json');

class ListSubmissions extends Component{

renderSubmittedAssignments(){
  var buffer=[]
  var submissions = this.props.submitAssignmentList
  var assignments = this.props.assignmentsList
  if(submissions.length !== 0){
    buffer.push(<p className="paragraph" key={submissions.length+1}> Your submissions </p>)
    for(let i=0; i<submissions.length ; i++){
      var date = new Date(submissions[i].submissionDate)
      var src = 'http://'+properties.getHostName+':8080/assignments/get/submission/'+assignments[i].assignmentid+'*'+submissions[i].email
      if(submissions[i].status==='ACCEPTED')
      buffer.push(
           <Grid fluid key={i}>
           <Row around="xs">
           <Col xs={11} sm={11} md={9} lg={8}>
           <Card>
           <CardHeader className="cardHeader"  title='Assignment By' subtitle={assignments[i].email} avatar={assignments[i].propicurl}/>
           <CardText style={{textAlign:'center'}}>
           <p>AssignmentType : {assignments[i].assignmentType}</p>
           </CardText>
           <CardTitle style={{textAlign:'center'}}  title={assignments[i].subject} subtitle={'STATUS : '+submissions[i].status+ ' with '+submissions[i].marksGiven+' marks'  } />
           <CardText style={{textAlign:'center'}}>
           <p>Submitted On {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()} </p>
           </CardText>
           <CardActions>
           <Grid fluid>
           <Row end="xs" top="xs">
           <Col xs className="EvaluateAssignment">
           <FlatButton label="View Assignment" className="button"
           containerElement={
             <Link to={'/teacher/assignment/'+assignments[i].assignmentid+'*'+submissions[i].email+'/evaluate'} />
           }/>
           <br /><br />
           </Col>
           <Col xs={3} sm={3} md={3} lg={4}>
            <form method="get" action={src}>
             <FloatingActionButton mini={true} type="submit">
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
             <Col xs={11} sm={11} md={9} lg={8}>
             <Card>
             <CardHeader className="cardHeader" title='Assignment By' subtitle={assignments[i].email} avatar={assignments[i].propicurl}/>
             <CardText style={{textAlign:'center'}}>
             <p>AssignmentType : {assignments[i].assignmentType}</p>
             </CardText>
             <CardTitle style={{textAlign:'center'}} title={assignments[i].subject} subtitle={'STATUS : '+submissions[i].status} />
             <CardText style={{textAlign:'center'}}>
             <p>Submitted On {date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes()} </p>
             </CardText>
             <CardActions>
             <Grid fluid>
             <Row end="xs" top="xs">
             <Col xs className="EvaluateAssignment">
             <FlatButton label="View Assignment" className="button"
             containerElement={
               <Link to={'/teacher/assignment/'+assignments[i].assignmentid+'*'+submissions[i].email+'/evaluate'} />
             }/>
             <br /><br />
             </Col>
             <Col xs={3} sm={3} md={3} lg={4}>
               <form method="get" action={src}>
               <FloatingActionButton type="submit" mini={true}>
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
