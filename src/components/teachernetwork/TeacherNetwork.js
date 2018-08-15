import React, {Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {Card, CardActions,CardText,CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {ActionThumbUp,CommunicationComment} from '../../styledcomponents/SvgIcons.js';
import {notify} from 'react-notify-toast'
import View from 'material-ui/svg-icons/action/view-list'
import TextField from 'material-ui/TextField'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import ListDataComponent from '../teacherstudent/ListDataComponent'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Copy from 'material-ui/svg-icons/content/content-copy'
import ListBatches from '../teacher/ListBatches.js'
import ListComments from './ListComments'
import Pagination from 'material-ui-pagination';
import IconButton from 'material-ui/IconButton';
import Tree from 'material-ui/svg-icons/hardware/device-hub.js'
import ClearAll from 'material-ui/svg-icons/action/highlight-off.js'
import SubjectAutoComplete from '../utils/SubjectAutoComplete.js'
import ListPulledTeachers from './ListPulledTeachers.js'
import { get } from 'lodash'

var properties = require('../properties.json');


const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}`

class TeacherNetwork extends Component{
  constructor(){
    super();
    this.state={
      isDataLoaded: false,
      response: '',
      likeCount: [],
      commentBox: [],
      commentText: '',
      comments: [],
      likes: [],
      likedUsers: [],
      activeIndex: '',
      likeDialogOpen: false,
      commentDialogOpen: false,
      selectBatchDialog: false,
      showPulledUsersDialog: false,
      batchIndex: null,
      showRefreshIndicator: false,
      total: 3,
      display:4,
      number: 1,
	    subjectValue:'',
      key: 1,
    }
  }

handlePageChange= (number) => {
     this.setState({
       number: number,
       users:[],
       messages:[],
       message : '',
	    })
this.getData(this.state.subjectValue,number);
};

handleClearFilter = () => {
    this.setState({
  	    subjectValue:'',
  	    number:1,
  	    key: this.state.key+1,
  	  },function(){
  	    this.getData('',1)
  	  })
  	}

handleSubjectChange = (subjectValue) => {
  	    this.setState({
                subjectValue:subjectValue,
        	      number: 1,
        	    })
	    this.getData(subjectValue,1);
};


 addLike = (setId, index) => {
   fetch('http://'+properties.getHostName+':8080/teachersnetwork/viewquestionsets/'+setId+'/like', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/text'
           },
       credentials: 'include',
       body: this.props.loggedinuser,
     }).then(response => {
       if(response.status === 200)
       return response.json()
       else if(response.status === 500){
         notify.show("Something went wrong", "error")
       }
     }).then(response =>{
       var newLikesCount = this.state.likeCount.slice()
       var newLikedUsers = this.state.likedUsers.slice()
       newLikesCount[index] = response.length
       newLikedUsers[index] = response
       this.setState({
         likeCount: newLikesCount,
         likedUsers: newLikedUsers
       })
     })
 }

 handleOpen = (i) => {
   this.setState({
     likeDialogOpen: true,
     activeIndex: i,
   })
 }

handlePulledUsersDialog = (i) => {
  this.setState({
    showPulledUsersDialog: true,
    activeIndex: i,
  })
}

 postComment = (setId, index) => {
   if(this.state.commentText.trim() === ''){
     notify.show("Cannot post empty comment", "warning")
   }else
   fetch('http://'+properties.getHostName+':8080/teachersnetwork/viewquestionsets/'+setId+'/comment', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         username: this.props.username,
         commentContent: this.state.commentText,
       }),
     }).then(response => {
       if(response.status === 200){
         notify.show("Comment posted successfully", "success")
        return response.json()
       }
       else {
         notify.show("Something went wrong", "error")
       }
     }).then(response =>{
       var newComments = this.state.comments.slice()
       newComments[index] = response
       this.setState({
         comments: newComments,
         commentBox: [],
       })
     }).catch(response => {
     notify.show("Please login your session expired","error");
     this.context.router.history.push('/');
    });
 }

 handlePull = (i) => {
     this.setState({
       activeIndex: i,
       selectBatchDialog: true,
   })
 }

handleCommentChange = (e) => this.setState({commentText:e.target.value});

 showCommentBox(setId, i){
   var commentBox = []
   commentBox[i]= <div style={{display:'flex',marginLeft:'5%'}}>
                           <TextField
                           hintText="Say Something"
                           onChange = {this.handleCommentChange.bind(this)}
                           multiLine={true}
                           rows={1}
                           rowsMax={4}
                           style={{width:'70%'}}
                           />
                         <FlatButton label="comment" type="button" onClick ={this.postComment.bind(this,setId,i)} />
                           </div>

   this.setState({
     commentBox: commentBox,
   })
 }

 handleEdit = (i) => {
   if(this.state.response[i].previousAssignmentType === 'THEORY'){
     this.context.router.history.push('/teacher/create/edit/'+this.state.response[i].referenceAssignmentId)
   }else if(this.state.response[i].previousAssignmentType === 'CODING'){
     this.context.router.history.push('/teacher/createpa/edit/'+this.state.response[i].referenceAssignmentId)
   }else if(this.state.response[i].previousAssignmentType === 'OBJECTIVE'){
    this.context.router.history.push('/teacher/createobjectiveassignment/edit/'+this.state.response[i].referenceAssignmentId)
   }
 }

  listQuestionSets = () => {
    var buffer = []
    var response = this.state.response
    var attributes = ['College','Branch','Question Set Type','Description','Subject', 'Questions Type']
  if(this.state.isDataLoaded === true && this.state.response.length > 0){
    for(var i=0; i < response.length; i++){
      var values = [get(response[i],"postedUser.college",''), get(response[i],"postedUser.branch",''),response[i].questionSetType, response[i].questionSetDescription, get(response[i],"subject",''), response[i].previousAssignmentType ]
      var createdDate = new Date(response[i].createdAt)
      buffer.push(
        <div key={i}>
        <Card>
          <CardHeader className="cardHeader"
            title={response[i].email}
            subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
            avatar={get(response[i],"postedUser.normalpicUrl",'') || get(response[i],"postedUser.googlepicUrl",'')}
          />
        <Grid fluid>
          <Row around="xs">
            <Col xs>
            <CardText className="table">
              <ListDataComponent attribute={attributes} value={values} />
            </CardText>
            </Col>
          </Row>
        </Grid>
         <Grid fluid>
         <Row center="xs" middle="xs">
         <Col xs>
          <CardActions>
           <FlatButton label="View"
             labelStyle={{textTransform: 'none',fontSize: '1em'}} onClick={this.handleEdit.bind(this,i)}
             style={{verticalAlign: 'middle',backgroundColor: "#30b55b", color: 'white'}}
              icon={<View />} />
           </CardActions>
         </Col>
         <Col xs>
           <FlatButton label={"Pull"}
             labelStyle={{textTransform: 'none',fontSize: '1em'}} onClick={this.handlePull.bind(this,i)}
             style={{verticalAlign: 'middle',backgroundColor: "#30b55b", color: 'white'}}
              icon={<Copy />} />
         </Col>
         <Col xs>
           <FlatButton label={"("+response[i].referenceAssignmentUsers.length+") Tree"}
             labelStyle={{textTransform: 'none',fontSize: '1em'}} onClick={this.handlePulledUsersDialog.bind(this,i)}
             style={{verticalAlign: 'middle',backgroundColor: "#30b55b", color: 'white'}}
              icon={<Tree />} />
         </Col>
          </Row>
          <CardActions>
            <div >
            <Grid fluid>
            <Row center="xs" between="xs">
            <Col xs={4} sm={4} md={4} lg={6}>
           <a onClick={this.handleOpen.bind(this,i)} style={{color:'#30b55b'}}> {this.state.likeCount[i]} likes </a>
           </Col>
            </Row>
            </Grid>
            <Grid fluid>
            <Row >
            <Col xs>
            <FlatButton type="button" label="Like"  fullWidth={true} onClick ={this.addLike.bind(this,this.state.response[i].id,i)}
              icon={<ActionThumbUp color='#30b55b' viewBox="0 0 30 30" />}/>
            </Col>
            <Col xs>
            <FlatButton type="submit" label="Comment" fullWidth={true}  onClick={this.showCommentBox.bind(this,this.state.response[i].id,i)}
               icon={<CommunicationComment color='#30b55b' viewBox="0 0 30 30" />}/>
            </Col>
            </Row>
            </Grid>
            </div>
          </CardActions>
          </Grid>
          <Grid fluid className="nogutter">
            <Row start="xs">
              <Col xs>
              <CardText >
                <ListComments comments={this.state.comments[i]} />
              </CardText>
              </Col>
            </Row>
          </Grid>
          {this.state.commentBox[i]}
        </Card>
        <br />
      </div>
      )
    }
  }else if(this.state.response.length === 0 && this.state.isDataLoaded === true){
    buffer.push(<p key={1} className="paragraph">No public question sets available</p>)
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
    return buffer
  }
getData = (param,pageNumber) => {
  fetch('http://'+properties.getHostName+':8080/teachersnetwork/viewquestionsets?subject='+param+'&pageNumber='+pageNumber, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          if(response.status === 200 )
          return response.json()
          else if(response.status === 204){
            this.setState({
              isDataLoaded: true,
              response:[] ,
              likeCount: [],
              comments: [],
              likedUsers: [],
              total: response.totalPages,
            })
          }
          else if (response.status === 500){
            notify.show("something went wrong","error")
          }
        }).then(response => {
          if(response){
            var newLikeCount = []
            var newComments = []
            var newLikedUsers = []
            for (var i =0 ; i < response.content.length; i++){
                newLikeCount.push(response.content[i].likedBy.length)
                newLikedUsers.push(response.content[i].likedBy.slice())
                newComments.push(response.content[i].comments.slice())
            }
            this.setState({
              isDataLoaded: true,
              response: response.content,
              likeCount: newLikeCount,
              comments: newComments,
              likedUsers: newLikedUsers,
              total: response.totalPages
            })
          }
        }).catch(response => {
        notify.show("Please login your session expired","error");
        this.context.router.history.push('/');
       });
}
  componentDidMount(){
   this.getData('',1)
  }

  updateBatchSelection = (batches) => {
    this.setState({
      batchIndex: batches[0]
    })
  }


  submitDuplicateAssignmentRequest = () => {
    var batch = this.props.batches[this.state.batchIndex]
    if(typeof batch === "undefined"){
      notify.show("Please  select a batch", "error")
    }else{
      this.setState({
        showRefreshIndicator: true
      })
      fetch('http://'+properties.getHostName+':8080/teachersnetwork/get/assignment/'+this.state.response[this.state.activeIndex].referenceAssignmentId+'?questionsetid='+this.state.response[this.state.activeIndex].id, {
        credentials: 'include',
        method: 'GET'
        }).then(response => {
          if(response.status === 200 )
          return response.json()
          else{
            notify.show("something went wrong","error")
          }
        }).then(response => {
          this.decideRedirectAssignment(null ,response.assignmentType, batch, response)
        })
    }
  }

  decideRedirectAssignment = (id,type,batch,assignment ) => {
    if(type === 'THEORY')
    this.context.router.history.push({
      pathname: '/teacher/create/'+batch+'/saved/'+id,
      state: {assignment: assignment}
    })
    else if(type === 'OBJECTIVE')
    this.context.router.history.push({
      pathname: '/teacher/createobjectiveassignment/'+batch+'/saved/'+id,
      state: {assignment: assignment}
    })
    else{
      this.context.router.history.push({
        pathname: '/teacher/createpa/'+batch+'/saved/'+id,
        state: {assignment: assignment}
      })
    }
  }

  handleClose = () => {
    this.setState({
      likeDialogOpen: false,
      commentDialogOpen: false,
      selectBatchDialog: false,
      showPulledUsersDialog: false,
    })
  }
  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />]
      const actions1 = [
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
    return(
      <StayVisible
        {...this.props}
      >
      <div>
      <Grid fluid>
    <Row between='xs' bottom='xs'>
       <Col xs lg={9}>
	       <SubjectAutoComplete branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} key={this.state.key}/>
	       <IconButton tooltip="Clear filter" onClick={this.handleClearFilter} >
	       <ClearAll/>
	       </IconButton>
        </Col>
    	 <Col xs >
	      <Pagination
	      total = { this.state.total }
	      current = { this.state.number }
	      display = { this.state.display }
	      onChange = { this.handlePageChange}
	      />
       </Col>
    </Row>
      <Row around = "xs">
      <Col xs={11} sm={11} md={7} lg={7} className="Reports">
      <br />
      {this.listQuestionSets()}
      </Col>
      </Row>
      </Grid>
      </div>
      <Dialog
            title="Liked Users"
            modal={false}
            actions={actions}
            open={this.state.likeDialogOpen}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          {this.state.likedUsers[this.state.activeIndex]}
      </Dialog>
      <Dialog
            title="Select the batch to pull the assignment"
            modal={true}
            actions={actions1}
            open={this.state.selectBatchDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "#39424d"}}
            onRequestClose={this.handleClose}
          >
          <ListBatches batches={this.props.batches} showRefreshIndicator={this.state.showRefreshIndicator} updateBatchSelection={this.updateBatchSelection}/>
      </Dialog>
      <Dialog
            title="Teachers who pulled this assignment"
            modal={true}
            actions={actions}
            open={this.state.showPulledUsersDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "#39424d"}}
            onRequestClose={this.handleClose}
          >
         <ListPulledTeachers questionsets={this.state.response[this.state.activeIndex]}/>
      </Dialog>
      </StayVisible>
    )
  }
}

TeacherNetwork.contextTypes = {
    router: PropTypes.object
};

export default withRouter(TeacherNetwork)
