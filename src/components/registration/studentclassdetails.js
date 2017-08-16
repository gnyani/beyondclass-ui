import React,{Component} from 'react'
import {Grid,Row,Cell} from 'react-inline-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class StudentClassDetails extends Component{
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

      <Cell is="6 tablet-4 phone-8"><div>
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
       floatingLabelText="Year*"
       className="h4"
        value={this.props.YearValue}
        onChange={this.props.handleYearChange}
        style={{width:"50%"}}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
        <MenuItem value={3} primaryText="Three" />
        <MenuItem value={4} primaryText="Four" />
      </SelectField>
      </div></Cell>
      <Cell is="top 6 tablet-8 phone-8"><div>
      <SelectField
        floatingLabelText="Semester*"
        className="h4"
        value={this.props.SemesterValue}
        onChange={this.props.handleSemChange}
        style={{width:"50%"}}
      >
        <MenuItem value={0} primaryText="Select" />
        <MenuItem value={1} primaryText="One" />
        <MenuItem value={2} primaryText="Two" />
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
        floatingLabelText="Section*"
        className="h4"
        value={this.props.SectionValue}
        onChange={this.props.handleSectionChange}
        style={{width:"50%"}}
      >
          <MenuItem value={1} primaryText="Select" />
          <MenuItem value={'A'} primaryText="A" />
          <MenuItem value={'B'} primaryText="B" />
      </SelectField>
      </div></Cell>
      </Row>
      </Grid>
      <br /><br />
      </div>
    )
  }
}

export default StudentClassDetails;
