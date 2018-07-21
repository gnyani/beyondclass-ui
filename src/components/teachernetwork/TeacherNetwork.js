import React, {Component} from 'react'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {Card, CardActions,CardText,CardHeader} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {lightBlue300} from 'material-ui/styles/colors'
import {ActionThumbUp,CommunicationComment} from '../../styledcomponents/SvgIcons.js';
import Edit from 'material-ui/svg-icons/image/edit.js'
import {notify} from 'react-notify-toast'
import RaisedButton from 'material-ui/RaisedButton'
import View from 'material-ui/svg-icons/action/view-list'
import RefreshIndicator from 'material-ui/RefreshIndicator'

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
    }
  }


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
       return response.text()
     }).then(response =>{
       var newLikesCount = this.state.likeCount.slice()
       newLikesCount[index] = response
       this.setState({
         likeCount: newLikesCount,
       })
     })
 }

  listQuestionSets = () => {
    var buffer = []
  if(this.state.isDataLoaded === true){
    for(var i=0; i < this.state.response.length; i++){
      var createdDate = new Date(this.state.response[i].createdAt)
      buffer.push(
        <div>
        <Card>
          <CardHeader className="cardHeader"
            title={this.state.response[i].email}
            subtitle={"Created on "+createdDate.getDate()+"-"+(createdDate.getMonth()+1)+"-"+createdDate.getFullYear()+" at "+createdDate.getHours()+":"+createdDate.getMinutes()}
            avatar={""}
            showExpandableButton={true}
            closeIcon={<Edit color="red" viewBox="0 0 22 22"/>}
            openIcon={<Edit color="red" viewBox="0 0 22 22"/>}
          />
          <CardText style={{textAlign:"center"}}>
          <p><b>Question Set Type : </b>{this.state.response[i].questionSetType}</p>
          <br />
          <p><b>Description :</b> {this.state.response[i].questionSetDescription}</p>
          </CardText>
         <Grid fluid>
         <Row center="xs" middle="xs">
         <Col xs>
          <CardActions>
           <RaisedButton label="View" primary={true} icon={<View />} />
           </CardActions>
         </Col>
          </Row>
          <CardActions>
            <div >
            <Grid fluid>
            <Row center="xs" between="xs">
            <Col xs>
           <a > {this.state.likeCount[i]} likes </a>
           </Col>
           <Col xs>
           <a > View Comments</a>
           </Col>
            </Row>
            </Grid>
            <Grid fluid>
            <Row >
            <Col xs>
            <FlatButton type="button" label="Like"  fullWidth={true} onClick ={this.addLike.bind(this,this.state.response[i].id,i)}
              icon={<ActionThumbUp color={lightBlue300} viewBox="0 0 30 30" />}/>
            </Col>
            <Col xs>
            <FlatButton type="submit" label="Comment" fullWidth={true}   icon={<CommunicationComment color={lightBlue300} viewBox="0 0 30 30" />}/>
            </Col>
            </Row>
            </Grid>
            </div>
          </CardActions>
          </Grid>
          <br />
        </Card>
        <br />
      </div>
      )
    }
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

  componentDidMount(){
    fetch('http://'+properties.getHostName+':8080/teachersnetwork/viewquestionsets', {
             credentials: 'include',
             method: 'GET'
          }).then(response => {
            if(response.status === 200 )
            return response.json()
            else{
              notify.show("something went wrong","error")
            }
          }).then(response => {
            var newLikeCount = []
            for (var i =0 ; i < response.length; i++){
              if(response[i].likedBy)
              newLikeCount.push(response[i].likedBy.length)
              else {
                newLikeCount.push(0)
              }
            }
            this.setState({
              isDataLoaded: true,
              response: response,
              likeCount: newLikeCount,
            })
          })
  }
  render(){
    return(
      <StayVisible
        {...this.props}
      >
      <div>
      <Grid fluid>
      <Row around = "xs">
      <Col xs={11} sm={11} md={10} lg={8}>
      <br />
      {this.listQuestionSets()}
      </Col>
      </Row>
      </Grid>
      </div>
      </StayVisible>
    )
  }
}

export default TeacherNetwork
