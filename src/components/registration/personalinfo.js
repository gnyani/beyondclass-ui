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
    <Grid fluid>
    <Row >
    <Col xs={8} md={6} lg={3}>
    <h4 className="h4"> Basic Info </h4>
    </Col>
    </Row>
   </Grid>
    <Grid fluid>
    <Row between="xs">
    <Col xs={12} md={8} lg={5}>
       <TextField floatingLabelText="First Name"  value={this.props.firstName} />
    </Col>
    <Col xs={12} md={8} lg={5}>
       <TextField floatingLabelText="Last Name"  value={this.props.lastName} />
     </Col>
     </Row>
    </Grid>

    <Grid fluid>
    <Row bottom="xs" between="xs">
    <Col xs={12} md={8} lg={5}>
    <DatePicker floatingLabelText="Date of Birth" hintText="Date of Birth" openToYearSelection={true} maxDate={maxDate}
    value={this.props.controlledDate} onChange={this.props.handleDateChange} onDismiss={this.props.handleDateDismiss}/>
    </Col>
    <Col xs={12} md={8} lg={5}>
    <div style={{width:"85%"}}><Phone
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
    <Grid fluid>
    <Row center="xs">
    <Col xs={12} md={8} lg={4}>
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
