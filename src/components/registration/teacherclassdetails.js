import React,{Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid';

const classes = [
  {value: new Date().getFullYear()+"-A", name:"1-A" },
  {value: new Date().getFullYear()+"-B", name:"1-B" },
  {value: new Date().getFullYear()-1+"-A", name:"2-A" },
  {value: new Date().getFullYear()-1+"-B", name:"2-B" },
  {value: new Date().getFullYear()-2+"-A", name:"3-A"},
  {value: new Date().getFullYear()-2+"-B", name:"3-B"},
  {value: new Date().getFullYear()-3+"-A", name:"4-A"},
  {value: new Date().getFullYear()-3+"-B", name:"4-B"},
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
          checked={this.props.batches.indexOf(classes.value) > -1}
          value={classes.value}
          primaryText={classes.name}
        />
      ));
    }


  render(){
    return(
      <div className="classdetails">
      <Grid fluid className="nogutter">
      <Row between="xs">
      <Col xs={12} md={8} lg={6}>
      <h4 className="h4">Class Details</h4>
      </Col>
      </Row>
      </Grid>
      <Grid fluid className="nogutter">
      <Row between="xs">
      <Col xs={11} sm ={11} md={5} lg={5}>
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
      <Col xs={11} sm={11} md={5} lg={5}>
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
      <Grid fluid className="nogutter">
      <Row between="xs">
      <Col xs={11} sm={11} md={5} lg={5}>
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
      <Col xs={11} sm={11} md={5} lg={5}>
      <SelectField
      floatingLabelText="Select Classes*"
       multiple={true}
       hintText="Select Classses"
       value={this.props.batches}
       onChange={this.props.handleBatchesChange}
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
