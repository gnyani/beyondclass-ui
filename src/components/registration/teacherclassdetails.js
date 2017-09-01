import React,{Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid';

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
      <Grid fluid>
      <Row between="xs">
      <Col xs={12} md={8} lg={6}>
      <h4 className="h4">Class Details</h4>
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row between="xs">
      <Col xs={12} md={6} lg={6}>
      <SelectField
        floatingLabelText="University*"
        value={this.props.UniversityValue}
        onChange={this.props.handleUniversityChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
        <MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />
      </SelectField>
      </Col>
      <Col xs={12} md={6} lg={6}>
      <SelectField
        floatingLabelText="College*"
        value={this.props.CollegeValue}
        onChange={this.props.handleCollegeChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College Of Engineering" />
        <MenuItem value={'OU'} label="OU"  primaryText="Osmania University" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row between="xs">
      <Col xs={12} md={6} lg={6}>
      <SelectField
       floatingLabelText="Branch*"
       value={this.props.BranchValue}
       onChange={this.props.handleBranchChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
        <MenuItem value={'ECE'} label="ECE" primaryText="Ellectronics and Communication Engineering" />
      </SelectField>
      </Col>
      <Col xs={12} md={6} lg={6}>
      <SelectField
      floatingLabelText="Select Classes*"
       multiple={true}
       hintText="Select Classses"
       value={this.props.Values}
       onChange={this.props.handleValuesChange}
       selectionRenderer={this.selectionRenderer}

     >
       {this.menuItems(classes)}
     </SelectField>
     </Col>
      </Row>
      </Grid>
      <br />
      <br />
      </div>
    )
  }
}

export default TeacherClassDetails;
