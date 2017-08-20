import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card'
import {lightBlue300} from 'material-ui/styles/colors'
import {FileFileDownload} from '../../styledcomponents/SvgIcons.js'
import { Grid, Row, Cell } from 'react-inline-grid'
import FlatButton from 'material-ui/FlatButton'

var properties = require('../properties.json');
class StudentTeacherAssignments extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      fileNames: [],
    }
  }

componentWillMount(){
  this.getAssignments()
}
getAssignments(){
  fetch('http://'+properties.getHostName+':8080/teacher/student/assignmentslist', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         teacherclass: this.props.class,
      })
     }).then(response => {
       if(response.status === 200)
       {
          return response.json();
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       var newfileNames=[]
       for(let i=0;i<response.length;i++){
         newfileNames.push(response[i].split('/').pop())
       }
       this.setState({
         links : response,
         fileNames: newfileNames,
       })
    })
}
list(buffer){
  if(this.state.links.length === 0)
  buffer.push(<p>No Assignments found</p>)
  else{
  for(let i=0; i<this.state.links.length; i++){
    buffer.push( <Cell is="7 tablet-7" key={i}><div>
         <Card
         style={{borderRadius:"2em"}}
         >
           <CardHeader
             title="Posted By"
             subtitle={this.state.links[i].split('-')[5]}
           />
           <CardMedia>
             <img  title="assignments" alt="" src={this.state.links[i]} className="iframe"/>
           </CardMedia>
           <CardTitle title={this.state.links[i].split('-')[6]} subtitle="assignment" />
           <CardActions>
             <form method="post" action={this.state.links[i]+"/download"}>
             <FlatButton type="submit" label="Download" style={{width:"80%"}} icon={<FileFileDownload color={lightBlue300} />}/>
             </form>
           </CardActions>
         </Card>
      </div></Cell>
  )
  }
}
  return buffer;
}
  render(){
    var buffer=[];
    return(
      <div className="announcements">
        <p className="paragraph"> Your Assignments List </p>
        <div>
        <Grid>
        <Row is="center">
        {this.list(buffer)}
        </Row>
        </Grid>
        </div>
      </div>
    )
  }
}
export default StudentTeacherAssignments;
