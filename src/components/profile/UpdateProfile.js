import React,{Component} from 'react'
import styled from 'styled-components'
import '../../styles/student-adda.css'
import {Grid,Row,Cell} from 'react-inline-grid'
import TextField from 'material-ui/TextField'
import {Edit} from '../../styledcomponents/SvgIcons.js'
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast';
import {NavigationArrowForward} from '../../styledcomponents/SvgIcons.js';
import MenuItem from 'material-ui/MenuItem'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
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
    yearDisabled: true,
    semDisabled: true,
    dobDisabled: true,
    controlledDate: props.dob,
  }
  this.handleFirstNameDisable = this.handleFirstNameDisable.bind(this)
  this.handleLastNameDisable = this.handleLastNameDisable.bind(this)
  this.handleYearDisable = this.handleYearDisable.bind(this)
  this.handleSemDisable = this.handleSemDisable.bind(this)
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
handleYearChange = (event, index, year) => this.setState({year});
handleSemChange = (event, index, sem) => this.setState({sem});
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
handleYearDisable(){
  this.setState({
    yearDisabled: false,
  })
}
handleDobDisable(){
  this.setState({
    dobDisabled: false,
  })
}
handleSemDisable(){
  this.setState({
    semDisabled: false,
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
componentWillMount(){

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
          year: this.state.year,
          sem: this.state.sem,
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
      <div>
      <div className="announcements ">
      <p className="paragraph">Edit your profile</p>
      </div>
      <Grid>
      <Row is="center">
      <Cell is ="3 phone-3 tablet-3"><div>
      <TextField floatingLabelText="First Name" disabled={this.state.firstNameDisabled} value={this.state.firstName} onChange={this.handleFirstNameChange}/>
      </div></Cell>
      <Cell is ="bottom 1 phone-1 tablet-1"><div>
      <IconButton onClick={this.handleFirstNameDisable}> <Edit color="red"/> </IconButton>
      </div></Cell>
      <Cell is ="3 phone-3 tablet-3"><div>
      <TextField floatingLabelText="Last Name"  disabled={this.state.lastNameDisabled} value={this.state.lastName} onChange={this.handleLastNameChange}/>
      </div></Cell>
      <Cell is ="bottom 1 phone-1 tablet-1"><div>
      <IconButton onClick={this.handleLastNameDisable}> <Edit color="red"/> </IconButton>
      </div></Cell>
      </Row>
      </Grid>
      <Grid>
      <Row is="center">
      <Cell is ="3 phone-3 tablet-3"><div>
      <SelectField
       floatingLabelText="Year"
        value={this.state.year}
        onChange={this.handleYearChange}
        disabled={this.state.yearDisabled}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
        <MenuItem value={3} primaryText="Three" />
        <MenuItem value={4} primaryText="Four" />
      </SelectField>
      </div></Cell>
      <Cell is ="bottom 1 phone-1 tablet-1"><div>
      <IconButton onClick={this.handleYearDisable}> <Edit color="red"/> </IconButton>
      </div></Cell>
      <Cell is ="3 phone-3 tablet-3"><div>
      <SelectField
       floatingLabelText="Semester"
        value={this.state.sem}
        onChange={this.handleSemChange}
        disabled={this.state.semDisabled}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
      </SelectField>
      </div></Cell>
      <Cell is ="bottom 1 phone-1 tablet-1"><div>
      <IconButton onClick={this.handleSemDisable}> <Edit color="red"/> </IconButton>
      </div></Cell>
      </Row>
      </Grid>
      <Grid>
      <Row is="center">
      <Cell is="3 tablet-3 phone-3"><div>
      <DatePicker hintText="Date of Birth" disabled={this.state.dobDisabled} openToYearSelection={true} defaultDate={new Date(this.state.controlledDate)}
      onChange={this.handleDateChange}  onDismiss={this.handleDateDismiss}/>
      </div></Cell>
      <Cell is ="bottom 1 phone-1 tablet-1"><div>
      <IconButton onClick={this.handleDobDisable}> <Edit color="red"/> </IconButton>
      </div></Cell>
      </Row>
      </Grid>
      <div className="UpdateProfile">
      <FlatButton label="Update" labelStyle={{textTransform: "none"}} labelPosition="before" alt="loading" icon={<NavigationArrowForward color="white"/>}
                 className="button" onClick={this.updateProfile} />
      </div>
      </div>
      </StayVisible>
    )
  }
}
export default UpdateProfile;
