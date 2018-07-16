import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import DefaultSyllabus from './DefaultSyllabus.js'
import {ContentArchive} from '../../styledcomponents/SvgIcons.js';
import {Media} from '../utils/Media'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class SyllabusLayout extends Component{
  constructor(props) {
     super(props);
     this.state = {
       value: 'Syllabus Archive',
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
        <Tab label="Syllabus Archive" value="Syllabus Archive" style={{backgroundColor: '#39424d', textTransform: "none", fontSize:"1em"}}
         buttonStyle={{cursor: "default"}} disableTouchRipple={true} icon={<ContentArchive />}>
          <div>
            <DefaultSyllabus userrole={this.props.userrole} />
          </div>
        </Tab>
      </Tabs>
      </div>

      </StayVisible>
    )
  }
}
export default SyllabusLayout;
