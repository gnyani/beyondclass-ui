import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Row, Cell } from 'react-inline-grid';
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
    <Cell is="6 tablet-8"><div>
    <TextField  floatingLabelText="Mobile"  onChange={this.props.handleMobileChange}/>
    </div></Cell>
    </Row>
    </Grid>
    </div>
    )
  }
}

export default PersonalInfo;
