import React,{Component} from 'react';
import {Grid,Row,Cell} from 'react-inline-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const classes = [
  {value: "1-A", name: '1-A'},
  {value: "1-B", name: '1-B'},
  {value: "2-A", name: '2-A'},
  {value: "2-B", name: '2-B'},
  {value: "3-A", name: '3-A'},
  {value: "3-B", name: '3-B'},
  {value: "4-A", name: '4-A'},
  {value: "4-B", name: '4-B'},
];

class TeacherClassDetails extends Component{


    selectionRenderer = (values) => {
      switch (values.length) {
        case 0:
          return '';
        case 1:
          return values[0];
        default:
          return `${values.length} classes selected`;
      }
    }

    menuItems(classes) {
      return classes.map((classes) => (
        <MenuItem
          key={classes.value}
          insetChildren={true}
          checked={this.props.Values.indexOf(classes.value) > -1}
          value={classes.value}
          primaryText={classes.name}
        />
      ));
    }


  render(){
    return(
      <div className="classdetails">
      <h4 className="h4">Class Details</h4>
      <Grid>
      <Row is="start">
      <Cell is="top 6 tablet-8 phone-6"><div>
      <SelectField
        floatingLabelText="University*"
        value={this.props.UniversityValue}
        onChange={this.props.handleUniversityChange}
        className="h4"
        style={{width: "50%"}}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
        <MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />
      </SelectField>
      </div></Cell>

      <Cell is="6 tablet-8 phone-8"><div>
      <SelectField
        className="h4"
        floatingLabelText="College*"
        value={this.props.CollegeValue}
        onChange={this.props.handleCollegeChange}
        style={{width:"50%"}}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College Of Engineering" />
        <MenuItem value={'OU'} label="OU"  primaryText="Osmania University" />
      </SelectField>
      </div></Cell>
      </Row>
      </Grid>
      <Grid>
      <Row is="start">
      <Cell is="top 6 tablet-8 phone-8"><div>
      <SelectField
       floatingLabelText="Branch*"
       className="h4"
       value={this.props.BranchValue}
       onChange={this.props.handleBranchChange}
        style={{width:"50%"}}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
        <MenuItem value={'ECE'} label="ECE" primaryText="Ellectronics and Communication Engineering" />
      </SelectField>
      </div></Cell>
      <Cell is="top 6 tablet-8 phone-8"><div>
      <SelectField
      floatingLabelText="Select Classes*"
       multiple={true}
       className="h4"
       hintText="Select Classses"
       value={this.props.Values}
       onChange={this.props.handleValuesChange}
       selectionRenderer={this.selectionRenderer}
       style={{width:"50%"}}
     >
       {this.menuItems(classes)}
     </SelectField>
     </div></Cell>
      </Row>
      </Grid>
      <br /><br /> <br /><br /> <br /><br /> <br /><br />
      </div>
    )
  }
}

export default TeacherClassDetails;
