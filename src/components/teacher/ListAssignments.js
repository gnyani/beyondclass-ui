import React,{Component} from 'react'
import {notify} from 'react-notify-toast'
import {Grid,Row,Col} from 'react-flexbox-grid'
import Delete from 'material-ui/svg-icons/action/delete'
import View from 'material-ui/svg-icons/action/view-list'
import ViewReport from 'material-ui/svg-icons/content/content-paste'
import {Link} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import RichTextEditorReadOnly from './RichTextEditorReadOnly'
import { EditorState,convertFromRaw } from 'draft-js'
import {Card, CardActions,CardText,CardHeader, CardTitle} from 'material-ui/Card'
import RefreshIndicator from 'material-ui/RefreshIndicator'


var properties = require('../properties.json');
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
   assignmentType: [],
   deleteConfirm: false,
   isDataLoaded: false,
   index: '',
  }
  this.listAssignments = this.listAssignments.bind(this)
  this.deleteAssignment = this.deleteAssignment.bind(this)
}


componentDidMount(){
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
          questions: [],
          assignmentType: [],
          additionalComments: [],
        })
      }else if(response.status === 302){
         window.location.reload()
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
      var newquestions=[]
      var newadditionalComments=[]
      var newassignmentType=[]
      if(response)
      for(let i=0; i<response.length;i++){
        newassignmentIds.push(response[i].assignmentid)
        newpropicUrls.push(response[i].propicurl)
        newcreatedDates.push(response[i].createDate)
        newsubjects.push(response[i].subject)
        newlastDates.push(response[i].lastdate)
        newquestions.push(response[i].questions)
        newassignmentType.push(response[i].assignmentType)
        if(response[i].message !== null && response[i].message.trim() !== '')
        newadditionalComments.push('Additional Comments : '+response[i].message)
        else {
          newadditionalComments.push(response[i].message)
        }
      }
      console.log("question are" + JSON.stringify(newquestions))
      this.setState({
        assignmentIds: newassignmentIds,
        propicUrls: newpropicUrls,
        createdDates: newcreatedDates,
        subjects: newsubjects,
        lastDates: newlastDates,
        questions: newquestions,
        assignmentType: newassignmentType,
        additionalComments: newadditionalComments,
        isDataLoaded: true,
      })
    })
}

convertToEditorState = (object) => {
const contentState = convertFromRaw(object)
const editorState = EditorState.createWithContent(contentState)
return editorState
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
  buffer.push(<li key={i}><RichTextEditorReadOnly editorStyle={{position: 'relative',bottom: '3.5vmin'}} editorState={this.convertToEditorState(questions[i])} /></li>)
  }
  return buffer;
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
  this.setState({deleteConfirm: false});
};

deleteAssignment(){
  fetch('http://'+properties.getHostName+':8080/assignments/'+this.state.assignmentIds[this.state.index]+'/delete',{
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
         }else if(response.status === 302){
            window.location.reload()
         }
          else {
            notify.show("Sorry something Went wrong","error")
          }
        })

}

listAssignments(){
  var buffer = []
if(this.state.assignmentIds.length !== 0)
{
  buffer.push(<p className="paragraph" key={this.state.assignmentIds.length+1}>Your Assigments for class {this.props.class} </p>)
  for(let i=0; i<this.state.assignmentIds.length; i++){
    var lastDate = new Date(this.state.lastDates[i])
    var createdDate = new Date(this.state.createdDates[i])
    buffer.push(
      <Grid fluid key={i}>
      <Row start="xs">
      <Col xs={12} sm={12} md={12} lg={12} >
         <Card
          onExpandChange={this.handleConfirmDelete.bind(this,i)}
          expanded={this.state.expanded[i]}
          >
          {/*Add this icon when you are ready for deleting,not a good option to delete since students submissions will be screwed
            showExpandableButton={true}
            closeIcon={<Delete color="red" viewBox="0 0 20 20"/>}
          openIcon={<Delete color="red" viewBox="0 0 20 20"/>}*/}
           <CardHeader className="cardHeader"
             title={this.props.email}
             subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
             avatar={this.state.propicUrls[i]}
           />

           <CardTitle style={{textAlign:"center"}} title={this.state.subjects[i]} subtitle={"last date :"+lastDate.getDate()+"-"+(lastDate.getMonth()+1)+"-"+lastDate.getFullYear()}  />
           <CardText style={{textAlign:"center"}}>
           <p>{'AssignmentType: ' +this.state.assignmentType[i]}</p>
           <br />
           <p>{this.state.additionalComments[i]}</p>
           </CardText>
           <CardText expandable={true} >
            <ul>{this.renderAssignmentQuestions(i)}</ul>
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
              <RaisedButton label="View Reports" primary={true} icon={<ViewReport />}
               containerElement={<Link to={'/teacher/reports/view/'+this.state.assignmentIds[i]}/>} />
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
    return(
      <div className="TeacherAssignment">
      {this.listAssignments()}
      <Dialog
            title="Are you sure about deleting this assignment"
            modal={true}
            actions={actions1}
            open={this.state.deleteConfirm}
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
