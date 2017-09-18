import React,{Component} from 'react';
import StudentClassDetails from './studentclassdetails.js';
import TeacherClassDetails from './teacherclassdetails.js';

class ClassDetails extends Component{

  render(){
    if(this.props.userrole === "student"){
    return(
      <StudentClassDetails UniversityValue={this.props.UniversityValue} CollegeValue={this.props.CollegeValue}
          startYearValue={this.props.startYearValue}  BranchValue={this.props.BranchValue}
          SectionValue={this.props.SectionValue}  handleUniversityChange={this.props.handleUniversityChange}
          handleCollegeChange={this.props.handleCollegeChange} handleYearChange={this.props.handleYearChange}
          handleBranchChange={this.props.handleBranchChange}
          handleSectionChange={this.props.handleSectionChange}/>
    )
  }
  else{
    return(<TeacherClassDetails UniversityValue={this.props.UniversityValue} CollegeValue={this.props.CollegeValue}
          BranchValue={this.props.BranchValue} handleUniversityChange={this.props.handleUniversityChange}
          handleCollegeChange={this.props.handleCollegeChange} handleBranchChange={this.props.handleBranchChange}
          batches={this.props.batches}  handleBatchesChange={this.props.handleBatchesChange}/>)
  }
}
}
export default ClassDetails;
