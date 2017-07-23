import React,{Component} from 'react'
import DropDownMenu from 'material-ui/DropDownMenu';
import DatePicker from 'material-ui/DatePicker';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Row, Cell } from 'react-inline-grid';

const stylelogin = {
   marginLeft: 425,
   marginRight: 425
 };

 const styleofpropic = {
   overflow:'hidden',
   borderRadius:'20%',
   marginLeft:250,
   height:'12%',
   width : '12%'
 };

const styleleftspace ={
  marginLeft: 20,
  width : '80%'

};
 const styles = {
   headline: {
     fontSize: 24,
     paddingTop: 16,
     marginBottom: 12,
     fontWeight: 400,
     marginLeft: '25%',
   },
   mainheadline:{
     fontSize: 26,
     paddingTop: 0,
     marginBottom: 0,
     fontWeight: 400,
     marginLeft: '30%'
   }
 };

class Register extends Component{
    constructor() {
      super();
      this.state = {
        valueyear : 0,
        valuesemester : 0,
        valuebranch : 1,
        valuesection : 1,
        valuecollege : 1,
        value: 1,
        username: ' ',
        isLoaded : 'false' ,
        propiclink : ' ',
        firstName : ' ',
        lastName : ' ',
        rollno : ' ',
        hostel : 'No',
        mobilenumber : ' ',
        controlledDate: null,
      }
      this.validateDetails = this.validateDetails.bind(this);
      this.getUserDetails = this.getUserDetails.bind(this);
  }

  componentWillMount(){
    this.getUserDetails()
  }

 getUserDetails(){
   fetch('http://localhost:8080/user/name', {
            credentials: 'include',
            method: 'GET'
         }).then(response => {
           return response.text()
         }).then(response => {
           this.setState({
             username : response,
             isLoaded : 'true'
           })
         })
   fetch('http://localhost:8080/user/propic', {
            credentials: 'include',
            method: 'GET'
            }).then(response => {
            return response.text()
            }).then(response => {
            this.setState({
            propiclink : response,
            isLoaded : 'true'
            })
            })
    fetch('http://localhost:8080/user/firstname', {
             credentials: 'include',
             method: 'GET'
             }).then(response => {
             return response.text();
             }).then(response => {
             this.setState({
             firstName : response,
             isLoaded : 'true'
             })
             })
     fetch('http://localhost:8080/user/lastname', {
              credentials: 'include',
              method: 'GET'
              }).then(response => {
              return response.text();
              }).then(response => {
              this.setState({
              lastName : response,
              isLoaded : 'true'
              })
              })
     }

 registerUser(){
   fetch('http://localhost:8080/users/registration', {
          credentials: 'include',
          method: 'POST',
          headers: {
                'mode': 'cors',
                'Content-Type': 'application/json'
            },
          body: JSON.stringify({
          firstName: this.state.firstName,
          lastName : this.state.lastName,
          university: this.state.value,
          college: this.state.valuecollege,
          year: this.state.valueyear,
          sem: this.state.valuesemester,
          branch: this.state.valuebranch,
          section: this.state.valuesection,
          rollno: this.state.rollno,
          hostel: this.state.hostel,
          mobilenumber: this.state.mobilenumber,
          dob: this.state.controlledDate,
        })
      }).then(response => {
        return response.text();
      }).then(response => {
        if(response === 'User registration successful')
        {
        notify.show("User registration successful for"+this.state.username,"success")
        this.context.router.history.push('/dashboard');
      }
        else{
          notify.show(response,"error")
        }
      })
 }
handleChange = (event, index, value) => this.setState({value});
handleCollege = (event, index, valuecollege) => this.setState({valuecollege});
handleSection = (event, index, valuesection) => this.setState({valuesection});
handleBranch = (event, index, valuebranch) => this.setState({valuebranch});
handleYear = (event, index, valueyear) => this.setState({valueyear});
handleSemester = (event, index, valuesemester) => this.setState({valuesemester});
handleHostelChange =(event) =>
  this.setState({
   hostel : event.target.value,
   isLoaded :'true'
  })

handleMobileChange =(event, newValue) => {
  this.setState({
   mobilenumber : newValue,
   isLoaded:'true'
  })
}
handleRollChange=(event, newValue) =>{
  this.setState({
    rollno: newValue,
    isLoaded:'true'
  })
}
handleDateChange = (event, date) => {
  this.setState({
    controlledDate: date,
    isLoaded: 'true'
  });
};
handleDateDismiss = (event, date) => {
  this.setState({
    controlledDate: null,
  });
};

validateDetails(){
 if(this.state.value === 1 || this.state.valuecollege === 1 || this.state.valueyear === 0 ||
    this.state.valuesemester === 0 || this.state.valuebranch === 1 || this.state.valuesection === 1)
 notify.show("please fill in all the mandatory fields which are followed by *","error");
 else{
   this.registerUser();
 }
}

componentDidmount(){
  this.setState({
    isLoaded : 'false',
    valueyear : 0,
    valuebranch : '1',
    valuesection : 1,
    valuesemester : 0,
    valuecollege : 1,
    value: 1,
    username: ' ',
    propiclink : ' ',
    firstName : ' ',
    lastName : ' '
  })
}

  render(){
    return(
      <div>
      <h4 style={styles.mainheadline}>We need a bit more details about you to serve you better</h4>
    <Paper zDepth={2} style={stylelogin}>
      <div>
        <div>
        <h2 style={styles.headline}>Welcome Aboard {this.state.username} !!! </h2>
        <Paper zDepth={2} style={styleofpropic}>
         <img src={this.state.propiclink} style={{width:'100%', height:'auto'}} alt='profile pciture'/>
        {/*  <Avatar
            src={this.state.propiclink}
            size={100}
            style={{border: 0}}
          />*/}
        </Paper>
        </div>
        <Grid>
        <Row is="start">
        <Cell is="middle 2 tablet-2"><div>
        <label style={styleleftspace}>  FirstName: </label>
        </div></Cell>
        <Cell is="5 tablet-2 phone-2"><div>
        <TextField hintText="firstname" value={this.state.firstName} style={styleleftspace} underlineShow={false} />
        </div></Cell>
        <Cell is="middle 2 tablet-2"><div>
        <label style={styleleftspace}> LastName: </label>
        </div></Cell>
        <Cell is="3 tablet-2 phone-2"><div>
        <TextField hintText="lastname" value={this.state.lastName} style={styleleftspace} underlineShow={false} />
        </div></Cell>
        </Row>
        </Grid>
<Divider />
        <Grid>
        <Row is="start">
        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="University*" />
          <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
          <MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />
        </DropDownMenu>
        </div></Cell>

        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.valuecollege}
          onChange={this.handleCollege}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="College*" />
          <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College Of Engineering" />
          <MenuItem value={'OU'} label="OU"  primaryText="Osmania University" />
        </DropDownMenu>
        </div></Cell>
        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.valueyear}
          onChange={this.handleYear}
          autoWidth={true}
        >
          <MenuItem value={0} primaryText="Year*" />
          <MenuItem value={1} primaryText="One" />
          <MenuItem value={2} primaryText="Two" />
          <MenuItem value={3} primaryText="Three" />
          <MenuItem value={4} primaryText="Four" />
        </DropDownMenu>
        </div></Cell>
        </Row>
        </Grid>
  <Divider />
        <Grid>
        <Row is="start">
        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.valuesemester}
          onChange={this.handleSemester}
          autoWidth={true}
        >
          <MenuItem value={0} primaryText="Semester*" />
          <MenuItem value={1} primaryText="One" />
          <MenuItem value={2} primaryText="Two" />
        </DropDownMenu>
        </div></Cell>
        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.valuebranch}
          onChange={this.handleBranch}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="Branch*" />
          <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
          <MenuItem value={'ECE'} label="ECE" primaryText="Ellectronics and Communication Engineering" />
        </DropDownMenu>
        </div></Cell>
        <Cell is="4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.valuesection}
          onChange={this.handleSection}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="Section*" />
          <MenuItem value={'A'} primaryText="A" />
          <MenuItem value={'B'} primaryText="B" />
        </DropDownMenu>
        </div></Cell>
        </Row>
        </Grid>
  <Divider />
        <Grid>
        <Row is="start">
        <Cell is="middle 2 tablet-2"><div>
        <label style={styleleftspace}>Hostel:</label>
        </div></Cell>
        <Cell is="6 tablet-2 phone-2"><div>
        <RadioButtonGroup className="row" defaultSelected="No" name="Hostel" onTouchTap={this.handleHostelChange} style={{marginLeft:20}}>
          <RadioButton value="Yes" label="Yes" />
          <RadioButton value="No" label="No"/>
        </RadioButtonGroup>
        </div></Cell>
        <Cell is="3 tablet-2 phone-2"><div>
        <TextField hintText="Roll Number" floatingLabelText="Roll Number" style={styleleftspace} underlineShow={true} onChange={this.handleRollChange}/>
        </div></Cell>
        </Row>
        </Grid>
  <Divider />
        <Grid>
        <Row is="start">
        <Cell is="middle 6 tablet-2"><div>
        <TextField hintText="Mobile" style={styleleftspace} floatingLabelText="Mobile" underlineShow={true} onChange={this.handleMobileChange} type="phone"/>
        </div></Cell>
        <Cell is="bottom 5 tablet-2 phone-2"><div>
        <DatePicker
        hintText="Date of Birth"
        value={this.state.controlledDate}
        onChange={this.handleDateChange}
        onDismiss={this.handleDateDismiss}
        />
        </div></Cell>
        </Row>
        </Grid>
        <Grid>
        <Row is="center">
      <Cell is=" 3 tablet-2"><div>
      <RaisedButton label="Register" value="Register" primary={true} onTouchTap={this.validateDetails} />
      </div></Cell>
      </Row>
      </Grid>
      </div>
    </Paper>
    </div>
    )
  }
}

Register.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Register);
