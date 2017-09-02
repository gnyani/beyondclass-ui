import React,{Component} from 'react'
import styled from 'styled-components'
import {Tabs, Tab} from 'material-ui/Tabs'
import DefaultQp from './DefaultQp.js'
import OtherQp from './OtherQp.js'
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

class QpLayout extends Component{

  constructor(props) {
     super(props);
     this.state = {
       value: 'CurrentSem',
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
        <Tab label="CurrentSem" value="CurrentSem" icon={<AvNote />}>
          <div>
            <DefaultQp userrole={this.props.userrole} />
          </div>
        </Tab>
        <Tab label="Others" value="Others" icon={<ContentArchive />}>
          <OtherQp  userrole={this.props.userrole}/>
        </Tab>
      </Tabs>
      </div>
      </StayVisible>
    )
  }
}

export default QpLayout;
