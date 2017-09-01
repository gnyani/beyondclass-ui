import React,{Component} from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid';

class StudentClassDetails extends Component{
  render(){
    return(
      <div className="classdetails">
      <Grid fluid>
      <Row between="xs">
      <Col xs={12} md={6} lg={6}>
      <h4 className="h4">Class Details</h4>
      </Col></Row>
      </Grid>
      <Grid fluid>
      <Row around="xs">
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
      <Row around="xs">
      <Col xs={12} md={6} lg={6}>
      <SelectField
       floatingLabelText="Year*"
        value={this.props.YearValue}
        onChange={this.props.handleYearChange}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
        <MenuItem value={3} primaryText="Three" />
        <MenuItem value={4} primaryText="Four" />
      </SelectField>
      </Col>
      <Col xs={12} md={6} lg={6}>
      <SelectField
        floatingLabelText="Semester*"
        value={this.props.SemesterValue}
        onChange={this.props.handleSemChange}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      <Grid fluid>
      <Row around="xs">
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
        floatingLabelText="Section*"
        value={this.props.SectionValue}
        onChange={this.props.handleSectionChange}
      >
          <MenuItem value={1} primaryText="Select" />
          <MenuItem value={'A'} primaryText="A" />
          <MenuItem value={'B'} primaryText="B" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      <br /><br />
      </div>
    )
  }
}

export default StudentClassDetails;
