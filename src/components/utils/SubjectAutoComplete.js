import React,{Component} from 'react'
import {CSE,ECE,ECESyllabus,CSESyllabus,IT,ITSyllabus,dataSourceConfig} from '../utils/Subjects.js'
import AutoComplete from 'material-ui/AutoComplete'
import TextField from 'material-ui/TextField'

class SubjectAutoComplete extends Component{
constructor(){
 super();
  this.state = {
   searchText: '',
 };
 this.getIndex = this.getIndex.bind(this);
}

componentDidMount(){
  if(typeof this.props.searchText !== "undefined")
  {
  this.setState({
    searchText: this.props.searchText
  })
}
}

 handleUpdateInput = (searchText,dataSource) => {
   let index = this.getIndex(searchText,dataSource,"subjectKey")
   this.setState({
     searchText: searchText,
   });
   if(index !== -1)
   this.props.handleSubjectChange(dataSource[index].valueKey)

 };

getIndex(value, arr, prop) {
     for(var i = 0; i < arr.length; i++) {
         if(arr[i][prop] === value) {
             return i;
         }
     }
     return -1; //to handle the case where the value doesn't exist
 }

  render(){
    if(this.props.branch === 'CSE')
    {
      if(this.props.type === 'questionpaper')
      return (
      <AutoComplete
       floatingLabelText="Start Typing Subject Name"
       filter={AutoComplete.fuzzyFilter}
       searchText={this.state.searchText}
       onUpdateInput={this.handleUpdateInput}
       dataSource={CSE}
       maxSearchResults={5}
       dataSourceConfig={dataSourceConfig}
       />)
    else {
      return (
      <AutoComplete
       floatingLabelText="Start Typing Subject Name"
       filter={AutoComplete.fuzzyFilter}
       searchText={this.state.searchText}
       onUpdateInput={this.handleUpdateInput}
       dataSource={CSESyllabus}
       maxSearchResults={5}
       dataSourceConfig={dataSourceConfig}
       />
    )
    }
  }
  if(this.props.branch === 'IT')
  {
    if(this.props.type === 'questionpaper')
    return (
    <AutoComplete
     floatingLabelText="Start Typing Subject Name"
     filter={AutoComplete.fuzzyFilter}
     searchText={this.state.searchText}
     onUpdateInput={this.handleUpdateInput}
     dataSource={IT}
     maxSearchResults={5}
     dataSourceConfig={dataSourceConfig}
     />)
  else {
    return (
    <AutoComplete
     floatingLabelText="Start Typing Subject Name"
     filter={AutoComplete.fuzzyFilter}
     searchText={this.state.searchText}
     onUpdateInput={this.handleUpdateInput}
     dataSource={ITSyllabus}
     maxSearchResults={5}
     dataSourceConfig={dataSourceConfig}
     />
  )
  }
}
  if(this.props.branch === 'ECE')
  {
  if(this.props.type === 'questionpaper')
  return (
    <AutoComplete
     floatingLabelText="Start Typing Subject Name"
     filter={AutoComplete.fuzzyFilter}
     dataSource={ECE}
     searchText={this.state.searchText}
     onUpdateInput={this.handleUpdateInput}
     maxSearchResults={5}
     dataSourceConfig={dataSourceConfig}
     />
  )
  else {
    return (
    <AutoComplete
     floatingLabelText="Start Typing Subject Name"
     filter={AutoComplete.fuzzyFilter}
     searchText={this.state.searchText}
     onUpdateInput={this.handleUpdateInput}
     dataSource={ECESyllabus}
     maxSearchResults={5}
     dataSourceConfig={dataSourceConfig}
     />
  )
  }
}
  else{
    return(
    <TextField hintText="Please select a branch" disabled={true} />
  )
  }
  }
}

export default SubjectAutoComplete;
