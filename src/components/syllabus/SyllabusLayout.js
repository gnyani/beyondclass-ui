import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import DefaultSyllabus from './DefaultSyllabus.js'
import OtherSyllabus from './OtherSyllabus.js'
import {ContentArchive,AvNote} from '../../styledcomponents/SvgIcons.js';
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
       value: 'Current Syllabus',
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
        <Tab label="Current Syllabus" value="Current Syllabus" icon={<AvNote />}>
          <div>
            <DefaultSyllabus userrole={this.props.userrole} />
          </div>
        </Tab>
        <Tab label="Others" value="Others" icon={<ContentArchive />}>
          <OtherSyllabus  userrole={this.props.userrole}/>
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }
}
export default SyllabusLayout;
