import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Phone from 'react-phone-number-input';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
//for react-phone-number-input
import 'react-phone-number-input/rrui.css'
import  'react-phone-number-input/style.css'

import '../../styles/student-adda.css';


const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 15);
maxDate.setHours(0, 0, 0, 0);


class PersonalInfo extends Component{

  render(){
    return(
    <div className="personalinfo">
    <Grid fluid className="nogutter">
    <Row around="xs">
    <Col xs={11} sm={11} md={11} lg={11}>
    <h4 className="h4"> Basic Info </h4>
    </Col>
    </Row>
   </Grid>
    <Grid fluid className="nogutter">
    <Row around="xs">
    <Col xs={11} sm={11} md={5} lg={5}>
       <TextField floatingLabelText="First Name"  value={this.props.firstName} style={{width:"80%"}}/>
    </Col>
    <Col xs={11} sm={11} md={5} lg={5}>
       <TextField floatingLabelText="Last Name"  value={this.props.lastName} style={{width:"80%"}}/>
     </Col>
     </Row>
    </Grid>
    <Grid fluid className="nogutter">
    <Row bottom="xs" around="xs">
    <Col xs={11} sm={11} md={5} lg={5}>
    <DatePicker floatingLabelText="Date of Birth" hintText="Date of Birth" openToYearSelection={true} maxDate={maxDate}
    style={{width:"80%"}} value={this.props.controlledDate} onChange={this.props.handleDateChange} onDismiss={this.props.handleDateDismiss}/>
    </Col>
    <Col xs={11} sm={11} md={5} lg={5}>
    <div style={{width:"85%",marginTop:"10%"}}><Phone
     country="IN"
     placeholder="Enter phone number"
     value={ this.props.mobilenumber }
     onChange={ this.props.handleMobileChange }
     />
     </div>
    </Col>
    </Row>
    </Grid>
    <br /> <br />
    <Grid fluid className="nogutter">
    <Row center="xs">
    <Col xs={11} sm={11} md={5} lg={5}>
  <RadioButtonGroup
     name="userroles"
     className="RadioButtonGroup"
     defaultSelected="student"
     onChange={this.props.handleRadioButtonChange}
   >
    <RadioButton value="student" label="Student" className="RadioButton" />
    <RadioButton value="teacher" label="Teacher" className="RadioButton" />
  </RadioButtonGroup>
  </Col>
  </Row>
 </Grid>
 <br />
    </div>
    )
  }
}

export default PersonalInfo;
