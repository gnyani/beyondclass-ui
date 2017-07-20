import React,{Component} from 'react'
//import {notify} from 'react-notify-toast';
import styled from 'styled-components'
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { Grid, Row, Cell } from 'react-inline-grid';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader,CardText} from 'material-ui/Card';
import {blue500,lightBlue300} from 'material-ui/styles/colors';
import {MapsRateReview,CommunicationContacts,CommunicationLocationOn} from '../../styledcomponents/SvgIcons.js';
import { Rating } from 'material-ui-rating'
import {notify} from 'react-notify-toast';
import {Tabs, Tab} from 'material-ui/Tabs';
import '../../styles/student-adda.css';
//import StarRating from 'react-star-rating';
//import StarRatingComponent from 'react-star-rating-component';
//import GoogleMapComponent from './GoogleMap.js'


const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
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
       ratingValue: 0,
       valueofi: 0,
       buffer:[],
       positiveReviews:[],
       normalReviews:[],
       negativeReviews:[],
       reviewBoxOpen: false,
       isDataLoaded: false,
     }
     this.populateData = this.populateData.bind(this)
     this.renderOrgCards = this.renderOrgCards.bind(this)
     this.handleDialogclose = this.handleDialogclose.bind(this)
     this.handleRatingChange = this.handleRatingChange.bind(this)
     this.showReviewBox = this.showReviewBox.bind(this)
     this.handleReviewBoxOpen = this.handleReviewBoxOpen.bind(this)
     this.fetchReviews = this.fetchReviews.bind(this)
   }

   handleCoachingChange = (event, index, coachingType) => this.setState({coachingType});
   handleCityChange = (event, index, city) => this.setState({city});
   handleAreaChange = (event, index, area) => this.setState({area});

renderOrgCards(){
 var buffer = []
  var i=0;
  console.log("inside loadTimeline")
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
            <Grid>
            <Row is="start">
            <Cell is="stretch 4 tablet-2"><div>
            <FlatButton type="button" label="Review&Rating" fullWidth={true} icon={<MapsRateReview color={lightBlue300} />} onClick={this.showReviewBox.bind(this,i)}/>
            </div></Cell>
            <Cell is="stretch 4 tablet-2"><div>
            <FlatButton type="button" label="Contact" fullWidth={true} icon={<CommunicationContacts color={lightBlue300} />} onClick={this.showContactbox.bind(this,i)} />
            </div></Cell>
            <Cell is="stretch 4 tablet-2"><div>
            <FlatButton type="button" label="Location" fullWidth={true} icon={<CommunicationLocationOn color={lightBlue300} />} onClick={this.showContactbox.bind(this,i)} />
            </div></Cell>
            </Row>
            </Grid>
            </div>
          </CardActions>
          {this.state.reviewBox[i]}
        </Card>
     </div>)
    // console.log(JSON.stringify(this.state.reviewBox[i]),"full log is"+JSON.stringify(this.state.reviewBox))
}
}
this.setState({
  buffer: buffer,
  isDataLoaded: true,
})
}
handleRatingChange(value) {
    console.log("value is"+value)
    this.setState({ratingValue: value},this.showReviewBox(this.state.valueofi));
}
handleReviewBoxOpen(i){
      this.fetchReviews(i);
}
fetchReviews(i){
fetch('http://localhost:8080/coachingcentres/get/'+this.state.coachingcentreId[i]+'/reviews',{
          credentials: 'include',
          method: 'GET'
        }).then(response => {
         console.log("status is" + response.status);
         return response.json()
        }).then(response => {
          var newPositiveReviews = []
          var newNormalReviews = []
          var newNegativeReviews = []
          for(let i=0;i<response.length;i++)
          {
            console.log(response[i].review)
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
         console.log("reviews" + JSON.stringify(this.state.normalReviews) ,"without state" +JSON.stringify(newNormalReviews) )
        })
}

showReviewBox(i){
  var reviewBox = []
  console.log("this method got called")
  reviewBox[i]=   <div>
                        <div className="stars">
                          <a onClick={this.handleReviewBoxOpen.bind(this,i)}> View Reviews</a>
                          <Rating
                          value={this.state.ratingValue}
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
    reviewBox: reviewBox,
    isDataLoaded:true,
  },function afterStateChange(){
    this.renderOrgCards()
  })
  console.log(JSON.stringify(this.state.reviewBox[i]))
}
postReview(i){
  if(this.state.ratingValue===0)
  notify.show("please give some rating before submitting","warning")
  else{
  fetch('http://localhost:8080/coachingcentres/post/'+this.state.coachingcentreId[i],{
    method: 'POST' ,
    headers: {
          'mode': 'cors',
          'Content-Type': 'application/json'
      },
  credentials: 'include',
  body: JSON.stringify({
    rating: this.state.ratingValue,
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
  console.log("response text is" + response)
  notify.show("Review posted successfully","success")
  console.log(this.state.response)
})
this.renderOrgCards()
}
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
  })
}

populateData(){
  this.setState({
    buttonDisabled: true
  })
  fetch('http://localhost:8080/coachingcentres/get/'+this.state.coachingType+"-"+this.state.city+"-"+this.state.area, {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
          return response.json()
        }).then(response => {
          console.log("response content is" + JSON.stringify(response.length))
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
         console.log("users" + this.state.orgname[0],"messages" + this.state.feedetailsImages[0])
        })
}

  render(){

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialogclose}
      />]

   return (
     <StayVisible
     {...this.props}
     >
    <div className="coachingcentres">
     <div className="div">
     <Grid>
     <Row is="start">
     <Cell is="3 tablet-2 phone-2"><div>
     <DropDownMenu
       value={this.state.coachingType}
       onChange={this.handleCoachingChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="ExaminationType*" />
       <MenuItem value={'GRE'} label="GRE" primaryText="GRE" />
       <MenuItem value={'GMAT'} label="GMAT" primaryText="GMAT" />
     </DropDownMenu>
     </div></Cell>

     <Cell is="2 tablet-2 phone-2"><div>
     <DropDownMenu
       value={this.state.city}
       onChange={this.handleCityChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="City*" />
       <MenuItem value={'HYD'} label="HYD" primaryText="Hyderabad" />
     </DropDownMenu>
     </div></Cell>
     <Cell is="3 tablet-2 phone-2"><div>
     <DropDownMenu
       value={this.state.area}
       onChange={this.handleAreaChange}
       autoWidth={true}
     >
       <MenuItem value={1} primaryText="Area*" />
       <MenuItem value={"HYMN"}  label="HYMN" primaryText="HimayatNagar" />
       <MenuItem value={"AMP"} label="AMP" primaryText="Ameerpet" />
     </DropDownMenu>
     </div></Cell>
     <Cell is="1 tablet-2 phone-2"><div>
     <RaisedButton label="Go" disabled={this.state.buttonDisabled} onClick={this.populateData.bind(this)}/>
     </div></Cell>
     </Row>
     </Grid>
    </div>
<Divider />
 {this.state.buffer}
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
  title="Reviews"
  actions={actions}
  modal={false}
  open={this.state.reviewBoxOpen}
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
     </StayVisible>
   )
  }

}

export default CoachingCentres
