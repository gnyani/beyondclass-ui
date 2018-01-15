import React,{Component} from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid';


class StudentClassDetails extends Component{
  render(){
    return(
      <div className="classdetails">
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={11} sm={11} md={11} lg={11}>
      <h4 className="h4">Class Details</h4>
      </Col></Row>
      </Grid>
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
        floatingLabelText="University*"
        value={this.props.UniversityValue}
        onChange={this.props.handleUniversityChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
        {/*<MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />*/}
      </SelectField>
      </Col>
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
        floatingLabelText="College*"
        value={this.props.CollegeValue}
        onChange={this.props.handleCollegeChange}
      >
        <MenuItem value={1} primaryText="Select" />
        <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College Of Engineering" />
      {/* <MenuItem value={'OU'} label="OU"  primaryText="Osmania University" />*/}
      </SelectField>
     </Col>
      </Row>
      </Grid>
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
       floatingLabelText="StartYear*"
        value={this.props.startYearValue}
        onChange={this.props.handleYearChange}
      >
        {/*<MenuItem value={new Date().getFullYear()} primaryText={new Date().getFullYear()} />
        <MenuItem value={new Date().getFullYear()-1} primaryText={new Date().getFullYear()-1} />*/}
        <MenuItem value={new Date().getFullYear()-2} primaryText={new Date().getFullYear()-2} />
        {/*<MenuItem value={new Date().getFullYear()-3} primaryText={new Date().getFullYear()-3} />*/}
      </SelectField>
      </Col>
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
       floatingLabelText="Branch*"
        value={this.props.BranchValue}
        onChange={this.props.handleBranchChange}
      >
            <MenuItem value={1} primaryText="Select" />
            <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
            {/*<MenuItem value={'ECE'} label="ECE" primaryText="Ellectronics and Communication Engineering" />*/}
      </SelectField>
      </Col>
      </Row>
      </Grid>
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
        floatingLabelText="Section*"
        value={this.props.SectionValue}
        onChange={this.props.handleSectionChange}
      >
          <MenuItem value={1} primaryText="Select" />
         <MenuItem value={'A'} primaryText="A" />
          {/*<MenuItem value={'B'} primaryText="B" />*/}
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
