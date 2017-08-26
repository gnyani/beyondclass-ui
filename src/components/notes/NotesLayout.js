import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import NotesList from './NotesList.js'
import NotesUpload from './NotesUpload.js'
import {FileFileUpload,ActionViewList} from '../../styledcomponents/SvgIcons.js'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class NotesLayout extends Component{
  constructor(props) {
     super(props);
     this.state = {
       value: 'Upload Notes',
     };
   }

   handleChange = (value) => {
     this.setState({
       value: value,
     });
   };

  render(){
    return(
      <StayVisible
      {...this.props}>
      <div>
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab label="Upload Notes" value="Upload Notes" icon={<FileFileUpload />}>
          <div>
            <NotesUpload userrole={this.props.userrole} />
          </div>
        </Tab>
        <Tab label="View Notes" value="View Notes" icon={<ActionViewList />}>
          <NotesList  userrole={this.props.userrole}/>
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }
}
export default NotesLayout;