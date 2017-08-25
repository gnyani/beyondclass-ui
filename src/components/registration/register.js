import React,{Component} from 'react'
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Intro from './intro.js';
import PersonalInfo from './personalinfo.js';
import ClassDetails from './classdetails.js'
import {NavigationArrowForward,NavigationArrowBack} from '../../styledcomponents/SvgIcons.js'
import '../../styles/student-adda.css';
import Slider from 'react-slick';
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

var properties = require('../properties.json');

class Register extends Component{
    constructor() {
      super();
      this.state = {
        YearValue : 0,
        SemesterValue : 0,
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
        hostel : 'No',
        mobilenumber : '',
        controlledDate: null,
        currentSlide: 0,
        Values: [],
      }
      this.validateDetails = this.validateDetails.bind(this);
      this.getUserDetails = this.getUserDetails.bind(this);
      this.next = this.next.bind(this)
      this.previous = this.previous.bind(this)
      this.previousButton = this.previousButton.bind(this);
      this.nextButton = this.nextButton.bind(this);
      this.handleMobileChange = this.handleMobileChange.bind(this)
  }

  componentWillMount(){
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
          year: this.state.YearValue,
          sem: this.state.SemesterValue,
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
        this.context.router.history.push('/dashboard');
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
           classes: this.state.Values.slice(),
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
         this.context.router.history.push('/dashboard');
       }
         else{
           notify.show(response,"error")
         }
       })
 }
 }

 handleValuesChange = (event, index, Values) =>  this.setState({Values});

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
 handleUniversityChange = (event, index, UniversityValue) => this.setState({UniversityValue});
 handleCollegeChange = (event, index, CollegeValue) => this.setState({CollegeValue});
 handleYearChange = (event, index, YearValue) => this.setState({YearValue});
 handleSemChange = (event, index, SemesterValue) => this.setState({SemesterValue })
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

validateDetails(){
 if((this.state.userrole==="student") && (this.state.UniversityValue === 1 || this.state.CollegeValue === 1 || this.state.YearValue === 0 ||
    this.state.SemesterValue === 0 || this.state.BranchValue === 1 || this.state.SectionValue === 1))
 notify.show("please fill in all the mandatory fields which are followed by *","error");
 else if((this.state.userrole === "teacher") && (this.state.UniversityValue === 1 || this.state.CollegeValue === 1 ||
       this.state.BranchValue === 1 || this.state.Values.length === 0 ))
notify.show("please fill in all the mandatory fields which are followed by *","error");
 else{
   this.registerUser();
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
  buffer.push(  <FlatButton key={new Date()} label="Register" labelStyle={{textTransform: "none"}} labelPosition="before" icon={<NavigationArrowForward color="white"/>}
              className="nextButton" onClick={this.validateDetails} />)
}
else{
  buffer.push(  <FlatButton key={new Date()} label="Next" labelStyle={{textTransform: "none"}} labelPosition="before" icon={<NavigationArrowForward color="white"/>}
              className="nextButton" onClick={this.next} />)
}
return buffer;
}

  render(){

    var settings = {
      dots: true,
      infinite: false,
      arrows: false,
      adaptiveHeight: false,
    };
    return(
      <div style={{backgroundColor:"rgb(244,244,244)",height:"135%"}}>
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
            YearValue={this.state.YearValue} SemesterValue={this.state.SemesterValue} BranchValue={this.state.BranchValue}
            SectionValue={this.state.SectionValue}  handleUniversityChange={this.handleUniversityChange}
            handleCollegeChange={this.handleCollegeChange} handleYearChange={this.handleYearChange}
            handleSemChange={this.handleSemChange} handleBranchChange={this.handleBranchChange}
            handleSectionChange={this.handleSectionChange} userrole={this.state.userrole} Values={this.state.Values}
            handleValuesChange={this.handleValuesChange}/></div>
        </Slider>
        <br /> <br /> <br />
        <div className="register" >
          {this.previousButton()}
          {this.nextButton()}
        </div>
      </div>
    </div>
    )
  }
}

Register.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Register);
