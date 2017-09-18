import React,{Component} from 'react'
import {CSE,ECE,dataSourceConfig} from '../utils/Subjects.js'
import AutoComplete from 'material-ui/AutoComplete'

class SubjectAutoCompleteForNotesAndAssign extends Component{
constructor(){
 super();
  this.state = {
   searchText: '',
 };
 this.getIndex = this.getIndex.bind(this);
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
    return (
      <AutoComplete
       floatingLabelText="Subject"
       hintText="Start Typing Subject Name"
       filter={AutoComplete.fuzzyFilter}
       searchText={this.state.searchText}
       onUpdateInput={this.handleUpdateInput}
       dataSource={CSE}
       maxSearchResults={5}
       dataSourceConfig={dataSourceConfig}
       />
    )
  if(this.props.branch === 'ECE')
  return (
    <AutoComplete
    floatingLabelText="Subject"
     hintText="Start Typing Subject Name"
     filter={AutoComplete.fuzzyFilter}
     dataSource={ECE}
     maxSearchResults={5}
     dataSourceConfig={dataSourceConfig}
     />
  )
  }
}

export default SubjectAutoCompleteForNotesAndAssign;
