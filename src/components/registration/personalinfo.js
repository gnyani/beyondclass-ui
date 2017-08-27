import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Row, Cell } from 'react-inline-grid';
import Phone from 'react-phone-number-input';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
//for react-phone-number-input
import 'react-phone-number-input/rrui.css'
import  'react-phone-number-input/style.css'

import '../../styles/student-adda.css';


class PersonalInfo extends Component{

  render(){
    return(
    <div className="personalinfo">
    <h4 className="h4"> Basic Info </h4>
    <Grid>
    <Row is="start">
    <Cell is="6 tablet-8"><div>
    <TextField floatingLabelText="First Name"  value={this.props.firstName} />
    </div></Cell>
    <Cell is="6 tablet-8"><div>
    <TextField floatingLabelText="Last Name"  value={this.props.lastName} />
    </div></Cell>
    </Row>
    </Grid>
    <Grid>
    <Row is="start">
    <Cell is="6 tablet-8"><div>
    <DatePicker floatingLabelText="Date of Birth"  value={this.props.controlledDate} onChange={this.props.handleDateChange} onDismiss={this.props.handleDateDismiss}/>
    </div></Cell>
    <Cell is="middle 5 tablet-8"><div>
    <Phone
     country="IN"
     placeholder="Enter phone number"
     value={ this.props.mobilenumber }
     onChange={ this.props.handleMobileChange }
     style={{marginTop:'7%'}}
     />
    </div></Cell>
    </Row>
    </Grid>
    <br />
  <RadioButtonGroup
     name="userroles"
     className="RadioButtonGroup"
     defaultSelected="student"
     onChange={this.props.handleRadioButtonChange}
   >
    <RadioButton value="student" label="Student" className="RadioButton" />
    <RadioButton value="teacher" label="Teacher" className="RadioButton" />
  </RadioButtonGroup>
    </div>
    )
  }
}

export default PersonalInfo;
