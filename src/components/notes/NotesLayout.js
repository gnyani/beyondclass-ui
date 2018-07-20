import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import NotesList from './NotesList.js'
import NotesUpload from './NotesUpload.js'
import {FileFileUpload,ActionViewList} from '../../styledcomponents/SvgIcons.js'
import {Media} from '../utils/Media'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
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
        inkBarStyle={{backgroundColor:"#30b55b", height: "0.25em"}}
      >
        <Tab label="Upload Notes" value="Upload Notes"  buttonStyle={{backgroundColor: '#39424d', textTransform: "none", fontSize: '1em'}} icon={<FileFileUpload />}>
          <div>
            <NotesUpload userrole={this.props.userrole} branch={this.props.branch} />
          </div>
        </Tab>
        <Tab label="View Notes" value="View Notes" buttonStyle={{backgroundColor: '#39424d', textTransform: "none", fontSize: '1em'}} icon={<ActionViewList />}>
          <NotesList  loggedinuser={this.props.loggedinuser} userrole={this.props.userrole} branch={this.props.branch} />
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }
}
export default NotesLayout;
