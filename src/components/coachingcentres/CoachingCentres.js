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
       ratingValue: 1,
     }
     this.populateData = this.populateData.bind(this)
     this.renderOrgCards = this.renderOrgCards.bind(this)
     this.handleContactBoxclose = this.handleContactBoxclose.bind(this)
     this.handleRatingChange = this.handleRatingChange.bind(this)
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
      <div key={i} style={{textAlign:'centre'}}>
      <br /> <br /> <br />
        <Card style={{width:'80%',marginLeft:'10%'}} >
          <CardHeader
            title={this.state.orgname[i]}
            style={fontStyle}
            subtitle={this.state.coachingType}
          />
          <CardText style={{textAlign:'center'}}>
           {this.state.description[i]}
          </CardText>
          <CardActions>
            <div >
            <Rating
            value={this.state.rating[i]}
            max={5}
            onChange={this.handleRatingChange(i)}
            />
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
}
}
return buffer;
}
handleRatingChange(value,i) {
    this.setState({ratingValue: value});
}
showReviewBox(i){
  var reviewBox = []
  reviewBox[i]=   <div>
                          <Rating
                          value={this.state.ratingValue}
                          max={5}
                          onClick={this.handleRatingChange.bind(this)}
                          onChange={(value)=>this.handleRatingChange(value,i)}
                          />
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
    reviewBox: reviewBox,
  })
}
postReview(i){

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
handleContactBoxclose(){
  this.setState({
    contactbox: false
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
             newrating.push(response[i].rating)
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
         })
         console.log("users" + this.state.orgname[0],"messages" + this.state.feedetailsImages[0])
        })
}

  render(){

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleContactBoxclose}
      />]

   return (
     <StayVisible
     {...this.props}
     >
     <div style={{marginLeft:'10%'}}>
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
     <RaisedButton label="Go" disabled={this.state.buttonDisabled} onClick={this.populateData}/>
     </div></Cell>
     </Row>
     </Grid>
    </div>
<Divider />
   {this.renderOrgCards()}
<Dialog
      title="ContactInfo"
      modal={false}
      actions={actions}
      open={this.state.contactbox}
      onRequestClose={this.handleContactBoxclose}
    >
    {this.state.contactdata}
</Dialog>
     </StayVisible>
   )
  }

}

export default CoachingCentres
