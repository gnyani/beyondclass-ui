import React,{Component} from 'react'
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Intro from './intro.js';
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import PersonalInfo from './personalinfo.js';
import ClassDetails from './classdetails.js'
import {NavigationArrowForward,NavigationArrowBack} from '../../styledcomponents/SvgIcons.js'
import {isValidPhoneNumber} from 'react-phone-number-input'
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../../styles/student-adda.css';
import Slider from 'react-slick';
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";


var properties = require('../properties.json');

class Register extends Component{
    constructor() {
      super();
      this.state = {
        startYearValue : new Date().getFullYear(),
        BranchValue : 1,
        SectionValue : 1,
        CollegeValue : 1,
        UniversityValue: 1,
        username: ' ',
        isLoaded : 'false' ,
        propiclink : ' ',
        firstName : ' ',
        lastName : ' ',
        rollno : ' ',
        userrole: "student",
        hostel : false,
        mobilenumber : '',
        controlledDate: null,
        currentSlide: 0,
        batches: [],
        confirmDialog: false,
        otpDialog: false,
        otp: 0,
      }
      this.validateDetails = this.validateDetails.bind(this);
      this.getUserDetails = this.getUserDetails.bind(this);
      this.next = this.next.bind(this)
      this.previous = this.previous.bind(this)
      this.previousButton = this.previousButton.bind(this);
      this.nextButton = this.nextButton.bind(this);
      this.handleMobileChange = this.handleMobileChange.bind(this)
      this.validateOtp = this.validateOtp.bind(this)
      this.generateOtp = this.generateOtp.bind(this)
  }

  componentDidMount(){
    this.getUserDetails()
  }

 getUserDetails(){
   fetch('http://'+properties.getHostName+':8080/user/google/auth', {
            credentials: 'include',
            method: 'GET'
         }).then(response => {
           return response.json()
         }).then(response => {
           this.setState({
             username : response.userAuthentication.details.name,
             lastName : response.userAuthentication.details.family_name,
             propiclink: response.userAuthentication.details.picture,
             firstName: response.userAuthentication.details.given_name,
             isLoaded : 'true'
           })
         }).catch(response => {
         notify.show("Please Authenticate with Google before registering","warning");
         this.context.router.history.push('/');
        });
     }

validateOtp(){
  fetch('http://'+properties.getHostName+':8080/user/validate/otp', {
          credentials: 'include',
          method: 'POST',
          headers: {
                'mode': 'cors',
                'Content-Type': 'application/json'
            },
          body: this.state.otp
      }).then(response => {
        return response.text()
      }).then(response =>{
      if(response === 'success')
      this.registerUser()
      else {
      notify.show("please enter a valid Otp","error")
      }
  })

}

 registerUser(){
   if(this.state.userrole === "student")
  {  fetch('http://'+properties.getHostName+':8080/users/registration', {
          credentials: 'include',
          method: 'POST',
          headers: {
                'mode': 'cors',
                'Content-Type': 'application/json'
            },
          body: JSON.stringify({
          firstName: this.state.firstName,
          lastName : this.state.lastName,
          university: this.state.UniversityValue,
          college: this.state.CollegeValue,
          startYear: this.state.startYearValue,
          branch: this.state.BranchValue,
          section: this.state.SectionValue,
          rollno: this.state.rollno,
          hostel: this.state.hostel,
          mobilenumber: this.state.mobilenumber,
          dob: this.state.controlledDate,
          userrole: this.state.userrole,
        })
      }).then(response => {
        return response.text();
      }).then(response => {
        if(response === 'User registration successful')
        {
        notify.show("User registration successful for "+this.state.username,"success")
        this.context.router.history.push('/announcements');
      }
        else{
          notify.show(response,"error")
        }
      })
 }else{
   fetch('http://'+properties.getHostName+':8080/users/registration', {
           credentials: 'include',
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
           body: JSON.stringify({
           firstName: this.state.firstName,
           lastName : this.state.lastName,
           university: this.state.UniversityValue,
           college: this.state.CollegeValue,
           branch: this.state.BranchValue,
           batches: this.state.batches.slice(),
           mobilenumber: this.state.mobilenumber,
           dob: this.state.controlledDate,
           userrole: this.state.userrole,
         })
       }).then(response => {
         return response.text();
       }).then(response => {
         if(response === 'User registration successful')
         {
         notify.show("User registration successful for "+this.state.username,"success")
         this.context.router.history.push('/teacher/'+this.state.batches[0]);
       }
         else{
           notify.show(response,"error")
         }
       })
 }
 }

 handleBatchesChange = (event, index, batches) =>  this.setState({batches});

 handleRadioButtonChange =(event,newValue) =>{
  this.setState({ userrole : newValue })
 }
 handleMobileChange(newValue){
   this.setState({
    mobilenumber : newValue,
   })
}
 handleDateChange = (event, date) => {
   this.setState({
     controlledDate: date,
   });
 }
 handleDateDismiss = (event, date) => {
   this.setState({
     controlledDate: null,
   });
 }
 handleOtp = (event) => {
  this.setState({
    otp: event.target.value,
  });
};
 handleUniversityChange = (event, index, UniversityValue) => this.setState({UniversityValue});
 handleCollegeChange = (event, index, CollegeValue) => this.setState({CollegeValue});
 handleYearChange = (event, index, startYearValue) => this.setState({startYearValue});
 handleSectionChange = (event, index, SectionValue) => this.setState({SectionValue});
 handleBranchChange = (event, index, BranchValue) => this.setState({BranchValue});
 handleHostelChange =(event) =>
  this.setState({
   hostel : event.target.value,
   isLoaded :'true'
  })

handleRollChange=(event, newValue) =>{
  this.setState({
    rollno: newValue,
    isLoaded:'true'
  })
}
handleConfirmClassDialog(){
  this.setState({
    confirmDialog: true,
  })
}

validateDetails(){
  if(isValidPhoneNumber(this.state.mobilenumber) === false)
  {
   notify.show("please enter a valid mobilenumber","error")
 }
 else if(this.state.userrole==="student"){
   if(this.state.UniversityValue === 1 || this.state.CollegeValue === 1 || this.state.YearValue === 0 ||
       this.state.SemesterValue === 0 || this.state.BranchValue === 1 || this.state.SectionValue === 1)
       notify.show("please fill in all the mandatory fields which are followed by *","error")
    else {
      this.handleConfirmClassDialog()
    }
 }
 else if(this.state.userrole === "teacher"){
   if(this.state.UniversityValue === 1 || this.state.CollegeValue === 1 ||
          this.state.BranchValue === 1 || this.state.batches.length === 0)
   notify.show("please fill in all the mandatory fields which are followed by *","error");
   else{
     this.generateOtp()
   }
 }
}

componentDidmount(){
  this.setState({
    isLoaded : 'false',
    valueyear : 0,
    BranchValue : '1',
    SectionValue : 1,
    SemesterValue : 0,
    CollegeValue : 1,
    UniversityValue: 1,
    username: ' ',
    propiclink : ' ',
    firstName : ' ',
    lastName : ' ',
  })
}

next() {
   this.slider.slickNext()
 }
 previous() {

   this.slider.slickPrev()
 }
previousButton(){
var buffer=[];
  if(this.state.currentSlide === 0)
  {
    buffer = [];
  }else{
    buffer.push(<FlatButton key={1} label="Previous" labelStyle={{textTransform: "none"}} icon={<NavigationArrowBack color="white"/>}
               className="previousButton" onClick={this.previous} />);
  }
  return buffer;
 }
nextButton(){
 var buffer=[];
if(this.state.currentSlide === 2)
{
  buffer.push(  <FlatButton key={new Date()} label="Register" labelStyle={{textTransform: "none"}}  icon={<NavigationArrowForward color="white"/>}
              className="nextButton" onClick={this.validateDetails} />)
}
else if(this.state.currentSlide === 1){
  buffer.push(  <FlatButton key={new Date()} label="Next" labelStyle={{textTransform: "none"}}  icon={<NavigationArrowForward color="white"/>}
              className="nextButton" onClick={this.next} />)
}
else{
  buffer.push(  <FlatButton key={new Date()} label="Next" labelStyle={{textTransform: "none"}}  icon={<NavigationArrowForward color="white"/>}
              style={{position:"relative",right:"50%"}}  className="nextButton" onClick={this.next} />)
}
return buffer;
}
handleClose = () => {
  this.setState({confirmDialog: false,otpDialog: false});
};

generateOtp(){
  fetch('http://'+properties.getHostName+':8080/user/generate/otp', {
         credentials: 'include',
         method: 'POST',
         headers: {
            'mode': 'cors',
            'Content-Type': 'application/json'
          },
         body: this.state.mobilenumber
        }).then(response => {
          if(response.status === 200)
          return response.text()
          else if(response.status === 302)
           window.location.reload()
        }).then(response =>{
          if(response !== 'success')
          notify.show("Could not generate OTP please try again","error")
          else {
            this.setState({confirmDialog: false,otpDialog: true})
          }
        })
}

  render(){
    const actions1 = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.generateOtp}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]
    const actions = [
      <FlatButton
        label="Go Back"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.validateOtp}
      />
    ]
    var settings = {
      dots: true,
      infinite: false,
      arrows: false,
      adaptiveHeight: true,
    };
    return(
  <div style={{overflow:"auto"}}>
  <br /><br /><br /><br /><br /><br />
    <Grid fluid className="nogutter">
    <Row around="xs">
    <Col xs={11} sm ={11} md={10} lg={8}>
    <div className="RegisterContainer">
      	<Slider ref={c => this.slider = c } {...settings} afterChange={(currentSlide) => {
            this.setState({ currentSlide: currentSlide  })
          }}>
        <div className="intro"><Intro propiclink={this.state.propiclink} userName={this.state.username} /></div>
        <div><PersonalInfo firstName={this.state.firstName} lastName={this.state.lastName} mobilenumber={this.state.mobilenumber}
             handleMobileChange={this.handleMobileChange} handleDateChange={this.handleDateChange}
             handleDateDismiss={this.handleDateDismiss} controlledDate={this.state.controlledDate}
             handleRadioButtonChange={this.handleRadioButtonChange}/>
        </div>
        <div><ClassDetails UniversityValue={this.state.UniversityValue} CollegeValue={this.state.CollegeValue}
            startYearValue={this.state.startYearValue}  BranchValue={this.state.BranchValue}
            SectionValue={this.state.SectionValue}  handleUniversityChange={this.handleUniversityChange}
            handleCollegeChange={this.handleCollegeChange} handleYearChange={this.handleYearChange}
           handleBranchChange={this.handleBranchChange}
            handleSectionChange={this.handleSectionChange} userrole={this.state.userrole} batches={this.state.batches}
            handleBatchesChange={this.handleBatchesChange}/></div>
        </Slider>
        <br /> <br /> <br />
        <Grid fluid className="nogutter">
        <Row center="xs" className="register">
        <Col xs>
          {this.previousButton()}
         </Col>
         <Col xs>
          {this.nextButton()}
        </Col>
        </Row>
        </Grid>
      </div>
      </Col>
      </Row>
      </Grid>
      <br />
      <Dialog
            title="Are you sure you belong to this class ?"
            modal={true}
            actions={actions1}
            open={this.state.confirmDialog}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
          <div style={{textAlign:"center"}}>
          <p>University : {this.state.UniversityValue}</p>
          <p>College: {this.state.CollegeValue} </p>
          <p> Batch: {this.state.startYearValue}-{parseInt(this.state.startYearValue,10)+4}</p>
          <p> Branch: {this.state.BranchValue} </p>
          <p> Section: {this.state.SectionValue} </p>
          <br />
          <p style={{color:"red"}}> Note: You cannot change your Batch later </p>
          </div>
      </Dialog>
      <Dialog
      title="Please Enter 6 digit Otp sent to your mobilenumber"
      modal={true}
      actions={actions}
      open={this.state.otpDialog}
      autoScrollBodyContent={true}
      titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
      onRequestClose={this.handleClose}
      >
      <TextField floatingLabelText="OTP" hintText="enter OTP" onChange={this.handleOtp} style={{marginLeft:"25%"}} />
      </Dialog>
    </div>
    )
  }
}

Register.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Register);
