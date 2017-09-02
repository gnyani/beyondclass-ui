import React,{Component} from 'react'
import styled from 'styled-components'
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader,CardText} from 'material-ui/Card';
import {blue500,lightBlue300} from 'material-ui/styles/colors';
import {MapsRateReview,CommunicationContacts,CommunicationLocationOn} from '../../styledcomponents/SvgIcons.js';
import { Rating } from 'material-ui-rating'
import {notify} from 'react-notify-toast';
import {Tabs, Tab} from 'material-ui/Tabs';
import '../../styles/student-adda.css';
import UnauthorizedPage from '../UnauthorizedPage.js'
import {Media} from '../utils/Media'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`
const fontStyle={
  fontFamily: "'Comic Sans MS',sans-serif",
  fontSize:'140%',
  fontStyle: 'italic',
  fontWeight: '500',
  letterSpacing: '2px',
  wordWrap: 'break-word',
  width:'100%',
  height:'150%',
  textTransform: 'uppercase',
  color: blue500
}



class CoachingCentres extends Component{

   constructor() {
     super();
     this.state ={
       contactbox: false,
       buttonDisabled: false,
       coachingType : 1,
       city : 1,
       area : 1,
       contactdata : [],
       coachingcentreId : [],
       orgname : [],
       description : [],
       email : [],
       mobilenumber : [],
       feedetailsImages : [],
       rating : [],
       reviewBox: [],
       reviewText: '',
       ratingValue: [],
       valueofi: 0,
       buffer:[],
       positiveReviews:[],
       normalReviews:[],
       negativeReviews:[],
       ratingDone: false,
       reviewBoxOpen: false,
       feedetails: false,
       isDataLoaded: false,
     }
     this.populateData = this.populateData.bind(this)
     this.renderOrgCards = this.renderOrgCards.bind(this)
     this.handleDialogclose = this.handleDialogclose.bind(this)
     this.handleRatingChange = this.handleRatingChange.bind(this)
     this.showReviewBox = this.showReviewBox.bind(this)
     this.handleReviewBoxOpen = this.handleReviewBoxOpen.bind(this)
     this.handleShowFeeDetails = this.handleShowFeeDetails.bind(this)
     this.fetchReviews = this.fetchReviews.bind(this)
   }

   handleCoachingChange = (event, index, coachingType) => this.setState({coachingType});
   handleCityChange = (event, index, city) => this.setState({city});
   handleAreaChange = (event, index, area) => this.setState({area});

renderOrgCards(){
 var buffer = []
  var i=0;
if(this.state.coachingcentreId.length!==0)
{ for (i=0;i<this.state.coachingcentreId.length;i++){
  buffer.push(
      <div key={i} >
      <br /> <br /> <br />
        <Card className="card" >
          <CardHeader
            title={this.state.orgname[i]}
            style={fontStyle}
            subtitle={this.state.coachingType}
          />
          <CardText className="cardText">
           {this.state.description[i]}
          </CardText>
          <CardActions>
            <div>
            <h1 className="rating">{this.state.rating[i]}</h1>
            <div className="stars">
            <Rating
            value={this.state.rating[i]}
            max={5}
            readOnly
            />
            </div>
            <Grid fluid>
            <Row between="xs">
            <Col xs>
            <a  className="link" onClick={this.handleReviewBoxOpen.bind(this,i)}> View Reviews</a>
            </Col>
            <Col xs>
            <a  className="link" onClick={this.handleShowFeeDetails.bind(this,i)}>Fee Details</a>
            </Col>
            </Row>
            </Grid>
            <Grid fluid>
            <Row >
            <Col xs>
            <FlatButton type="button" label="Review&Rating" fullWidth={true} icon={<MapsRateReview color={lightBlue300} />} onClick={this.showReviewBox.bind(this,i)}/>
            </Col>
            <Col xs>
            <FlatButton type="button" label="Contact" fullWidth={true} icon={<CommunicationContacts color={lightBlue300} />} onClick={this.showContactbox.bind(this,i)} />
            </Col>
            <Col xs>
            <FlatButton type="button" label="Location" fullWidth={true} icon={<CommunicationLocationOn color={lightBlue300} />} onClick={this.showContactbox.bind(this,i)} />
            </Col>
            </Row>
            </Grid>
            </div>
          </CardActions>
          {this.state.reviewBox[i]}
        </Card>
     </div>)
}
}
this.setState({
  buffer: buffer,
  isDataLoaded: true,
})
}
handleRatingChange(value) {
    var valuearr=[]
    valuearr[this.state.valueofi] = value
    this.setState({ratingDone: true,ratingValue: valuearr.slice(),isDataLoaded: true},
                function onStateChange() {
               this.showReviewBox(this.state.valueofi)
             });
}
handleReviewBoxOpen(i){
      this.fetchReviews(i);
}

handleShowFeeDetails(i){
  this.setState({
    feedetails: true,
    currentFeeImage: this.state.feedetailsImages[i]
  })
}
fetchReviews(i){
fetch('http://'+properties.getHostName+':8080/coachingcentres/get/'+this.state.coachingcentreId[i]+'/reviews',{
          credentials: 'include',
          method: 'GET'
        }).then(response => {
         return response.json()
        }).then(response => {
          var newPositiveReviews = []
          var newNormalReviews = []
          var newNegativeReviews = []
          for(let i=0;i<response.length;i++)
          {
            if(response[i].rating.toString() === "4" || response[i].rating.toString() === "5")
            {
              newPositiveReviews.push(<div key={i} ><p>{response[i].email}:{response[i].review}</p><Divider /> </div>)
            }else if (response[i].rating.toString() === "3") {
              newNormalReviews.push(<div key={i} ><p>{response[i].email}:{response[i].review}</p><Divider /> </div>)
            }else if (response[i].rating.toString() === "1" || response[i].rating.toString === "2") {
              newNegativeReviews.push(<div key={i}><p>{response[i].email}:{response[i].review}</p><Divider /> </div>)
            }
          }
          this.setState({
          positiveReviews : newPositiveReviews.slice(),
          normalReviews: newNormalReviews.slice(),
          negativeReviews: newNegativeReviews.slice(),
          reviewBoxOpen: true,
         });
        })
}

showReviewBox(i){
  console.log("reviewBox  is"+ this.state.reviewBox[i] +"is ratingDone" +this.state.ratingDone)
  var reviewBox = []
  if(typeof this.state.reviewBox[i] === "undefined" ||  this.state.ratingDone === true  )
  {
  reviewBox[i]=   <div>
                        <div className="stars">
                          <Rating
                          value={this.state.ratingValue[i]}
                          max={5}
                          onChange={this.handleRatingChange.bind(this)}
                          />
                        </div>
                          <div style={{display:'flex',marginLeft:'5%'}}>
                          <TextField
                          hintText="Say Something about this place.Your feebback matters"
                          onChange = {this.handleReviewChange.bind(this)}
                          multiLine={true}
                          rows={1}
                          rowsMax={4}
                          style={{width:'80%'}}
                          />
                          <FlatButton label="comment" type="button" onClick ={this.postReview.bind(this,i)} />
                          </div>
                          </div>

  this.setState({
    valueofi: i,
    ratingDone: false,
    reviewBox: reviewBox,
    isDataLoaded:true,
  },function afterStateChange(){
    this.renderOrgCards()
  })
}else{
  reviewBox = []
  this.setState({
    valueofi: i,
    reviewBox: reviewBox.slice(),
    ratingDone: false,
    isDataLoaded:true,
  },function afterStateChange(){
    this.renderOrgCards()
  })
}
}
postReview(i){
  if(this.state.ratingValue===0)
  notify.show("please give some rating before submitting","warning")
  else{
  fetch('http://'+properties.getHostName+':8080/coachingcentres/post/'+this.state.coachingcentreId[i],{
    method: 'POST' ,
    headers: {
          'mode': 'cors',
          'Content-Type': 'application/json'
      },
  credentials: 'include',
  body: JSON.stringify({
    rating: this.state.ratingValue[i],
    review : this.state.reviewText,
 })
}).then(response => {
  if(response.status === 200)
  {
     return response.text();
  }
  else{
    let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
    notify.show("sorry something went wrong","custom",5000,myColor)
  }
}).then(response => {
  notify.show("Review posted successfully","success")
})
}
this.setState({
  reviewText:' ',
  ratingValue: 0,
},function OnstateChange(){
  this.renderOrgCards()
})
}
handleReviewChange = (e) => this.setState({reviewText:e.target.value});

showContactbox(i){
 this.populateContactData(i)
}

populateContactData()
{
  var buffer= []
  var i = 0
    buffer.push(
      <div key={i}>
      <br /><br />
      <div style={{display:'flex'}}>
       <li> <p style={fontStyle}> Email : {this.state.email[i]}</p> </li>
       </div>
       <br /> <br /><br />
       <div style={{display:'flex'}}>
       <li><p style={fontStyle}> Phone : {this.state.mobilenumber[i]} </p></li>
       </div>
       <br />
      </div>
    )
    this.setState({
      contactbox: true,
      contactdata: buffer
    })
}
handleDialogclose(){
  this.setState({
    contactbox: false,
    reviewBoxOpen: false,
    feedetails: false,
  })
}

populateData(){
  this.setState({
    buttonDisabled: true
  })
  fetch('http://'+properties.getHostName+':8080/coachingcentres/get/'+this.state.coachingType+"-"+this.state.city+"-"+this.state.area, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.json()
        }).then(response => {
          var newcoachingcentreId = []
          var neworgname = []
          var newdescription= []
          var newemail = []
          var newmobilenumber = []
          var newfeedetailsImages = []
          var newrating = []
          for(let i=0;i<response.length;i++)
           {
             newcoachingcentreId.push(response[i].caochingcentreId)
             neworgname.push(response[i].orgname)
             newdescription.push(response[i].description)
             newemail.push(response[i].contactinfo.email)
             newmobilenumber.push(response[i].contactinfo.mobileNumber)
             newfeedetailsImages.push(response[i].feesdetailsUrl)
             newrating.push(response[i].rating.toString().substring(0, 3))
          }
           this.setState({
               coachingcentreId: newcoachingcentreId,
               orgname: neworgname,
               description: newdescription,
               email: newemail,
               mobilenumber: newmobilenumber,
               feedetailsImages: newfeedetailsImages,
               buttonDisabled: false,
               rating: newrating,
         },function afterStateChange () {
              this.renderOrgCards();
          })
        })
}

  render(){

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialogclose}
      />]
if(this.props.userrole==="student")
{   return (
     <StayVisible
     {...this.props}
     >
     <br /><br />
    <Grid fluid>
    <Row around="xs">
    <Col xs={12} sm={12} md={10} lg={8}>
    <div className="coachingcentres">
     <div className="div">
     <Grid fluid>
     <Row middle="xs">
     <Col xs>
     <DropDownMenu
       value={this.state.coachingType}
       onChange={this.handleCoachingChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="ExaminationType*" />
       <MenuItem value={'GRE'} label="GRE" primaryText="GRE" />
       <MenuItem value={'GMAT'} label="GMAT" primaryText="GMAT" />
     </DropDownMenu>
     </Col>

     <Col xs>
     <DropDownMenu
       value={this.state.city}
       onChange={this.handleCityChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="City*" />
       <MenuItem value={'HYD'} label="HYD" primaryText="Hyderabad" />
     </DropDownMenu>
     </Col>
     <Col xs>
     <DropDownMenu
       value={this.state.area}
       onChange={this.handleAreaChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="Area*" />
       <MenuItem value={"HYMN"}  label="HYMN" primaryText="HimayatNagar" />
       <MenuItem value={"AMP"} label="AMP" primaryText="Ameerpet" />
     </DropDownMenu>
     </Col>
     <Col xs>
     <RaisedButton label="Go" disabled={this.state.buttonDisabled} onClick={this.populateData.bind(this)}/>
     </Col>
     </Row>
     </Grid>
    </div>
<Divider />
 {this.state.buffer}
 <br /> <br /> <br />
<Dialog
      title="ContactInfo"
      modal={false}
      actions={actions}
      open={this.state.contactbox}
      onRequestClose={this.handleDialogclose}
    >
    {this.state.contactdata}
</Dialog>
<Dialog
      title="ContactInfo"
      modal={false}
      actions={actions}
      open={this.state.contactbox}
      onRequestClose={this.handleDialogclose}
    >
    {this.state.contactdata}
</Dialog>
<Dialog
      title="FeeDetails"
      modal={false}
      actions={actions}
      open={this.state.feedetails}
      onRequestClose={this.handleDialogclose}
    >
    <img src={this.state.currentFeeImage} alt="loading" />
</Dialog>
<Dialog
  title="Reviews"
  actions={actions}
  modal={false}
  open={this.state.reviewBoxOpen}
  autoScrollBodyContent={true}
  onRequestClose={this.handleDialogClose}
>
          <Tabs>
           <Tab label="Positive" className="coachingcentres">
             <div >
                {this.state.positiveReviews}
             </div>
           </Tab>
           <Tab label="Normal" >
             <div>
                 {this.state.normalReviews}
             </div>
           </Tab>
           <Tab label="Negative">
             <div >
                 {this.state.negativeReviews}
             </div>
           </Tab>
          </Tabs>
</Dialog>
</div>
</Col>
</Row>
</Grid>
     </StayVisible>
   )
 }else{
   return(<UnauthorizedPage />)
 }
}
}

export default CoachingCentres
