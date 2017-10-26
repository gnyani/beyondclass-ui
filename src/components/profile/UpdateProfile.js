import React,{Component} from 'react'
import styled from 'styled-components'
import '../../styles/student-adda.css'
import {Grid,Row,Col} from 'react-flexbox-grid'
import TextField from 'material-ui/TextField'
import {Edit} from '../../styledcomponents/SvgIcons.js'
import IconButton from 'material-ui/IconButton';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast';
import {NavigationArrowForward} from '../../styledcomponents/SvgIcons.js';
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

class UpdateProfile extends Component{
constructor(props){
  super();
  this.state={
    firstName: props.username,
    lastName: props.lastName,
    year: parseInt(props.year,10),
    sem: parseInt(props.sem,10),
    firstNameDisabled: true,
    lastNameDisabled: true,
    dobDisabled: true,
    controlledDate: props.dob,
  }
  this.handleFirstNameDisable = this.handleFirstNameDisable.bind(this)
  this.handleLastNameDisable = this.handleLastNameDisable.bind(this)
  this.handleDobDisable = this.handleDobDisable.bind(this)
  this.updateProfile = this.updateProfile.bind(this)
}
handleFirstNameChange =(event, newValue) => {
  this.setState({
   firstName : newValue,
  })
}
handleLastNameChange =(event, newValue) => {
  this.setState({
   lastName : newValue,
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
handleDobDisable(){
  this.setState({
    dobDisabled: false,
  })
}
handleFirstNameDisable(){
  this.setState({
    firstNameDisabled: false
  })
}
handleLastNameDisable(){
  this.setState({
    lastNameDisabled: false
  })
}
componentDidMount(){

}
updateProfile(){
  fetch('http://'+properties.getHostName+':8080/user/update/profile', {
          credentials: 'include',
          method: 'POST',
          headers: {
                'mode': 'cors',
                'Content-Type': 'application/json'
            },
          body: JSON.stringify({
          firstName: this.state.firstName,
          lastName : this.state.lastName,
          dob: this.state.controlledDate,
        })
      }).then(response => {
        return response.text();
      }).then(response =>{
        if(response === "success")
        {
        notify.show("Profile Updated successfully","success")
        window.location.reload()
      }
        else {
        notify.show("Sorry something went wrong please try again later","error")
        }
      })
}
  render(){
    return(
      <StayVisible
      {...this.props}
      >
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={7}>
      <div>
      <div className="announcements ">
      <p className="paragraph">Edit your profile</p>
      </div>
      <Grid fluid>
      <Row start="xs" bottom="xs">
      <Col xs={4} sm={4} md={4} lg={5}>
      <TextField floatingLabelText="First Name" style={{width:"100%"}} disabled={this.state.firstNameDisabled} value={this.state.firstName} onChange={this.handleFirstNameChange}/>
      </Col>
      <Col xs={2} sm={2} md={2} lg={1}>
      <IconButton onClick={this.handleFirstNameDisable}> <Edit color="red" viewBox='0 0 30 30'/> </IconButton>
      </Col>
      <Col xs={4} sm={4} md={4} lg={5}>
      <TextField floatingLabelText="Last Name" style={{width:"100%"}} disabled={this.state.lastNameDisabled} value={this.state.lastName} onChange={this.handleLastNameChange}/>
      </Col>
      <Col xs={2} sm={2} md={2} lg={1}>
      <IconButton onClick={this.handleLastNameDisable}> <Edit color="red" viewBox='0 0 30 30'/> </IconButton>
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row start="xs" bottom="xs">
      <Col xs={4} sm={4} md={4} lg={5}>
      <DatePicker floatingLabelText="Date of Birth" hintText="Date of Birth" disabled={this.state.dobDisabled} openToYearSelection={true} defaultDate={new Date(this.state.controlledDate)}
      onChange={this.handleDateChange} textFieldStyle={{width:"100%"}} onDismiss={this.handleDateDismiss}/>
      </Col>
      <Col xs={1} sm={1} md={1} lg={1}>
      <IconButton onClick={this.handleDobDisable}> <Edit color="red" viewBox='0 0 30 30'/> </IconButton>
      </Col>
      </Row>
      </Grid>
      <div className="UpdateProfile">
      <FlatButton label="Update" labelStyle={{textTransform: "none"}} labelPosition="before" alt="loading" icon={<NavigationArrowForward color="white"/>}
                 className="button" onClick={this.updateProfile} />
      </div>
      </div>
      </Col>
      </Row>
      </Grid>
      </StayVisible>
    )
  }
}
export default UpdateProfile;
