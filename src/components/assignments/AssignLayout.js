// import React,{Component} from 'react'
// import styled from 'styled-components'
// import {Tabs, Tab} from 'material-ui/Tabs'
// import AssignList from './AssignList.js'
// import AssignUpload from './AssignUpload.js'
// import {FileFileUpload,ActionViewList} from '../../styledcomponents/SvgIcons.js'
// import {Media} from '../utils/Media'
//
// const StayVisible = styled.div`
//   position: relative;
//   margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
//   transition: margin .1s;
//   ${Media.handheld`
//     margin-left: 0px;
//   `}
// `
//
// class AssignLayout extends Component{
//   constructor(props) {
//      super(props);
//      this.state = {
//        value: 'Upload Assignment',
//      };
//    }
//
//    handleChange = (value) => {
//      this.setState({
//        value: value,
//      });
//    };
//
//   render(){
//     return(
//       <StayVisible
//       {...this.props}>
//       <div>
//       <Tabs
//         value={this.state.value}
//         onChange={this.handleChange}
//       >
//         <Tab label="Upload Assignment" value="Upload Assignment" icon={<FileFileUpload />}>
//           <div>
//             <AssignUpload userrole={this.props.userrole} branch={this.props.branch} />
//           </div>
//         </Tab>
//         <Tab label="View Assignments" value="View Assignments" icon={<ActionViewList />}>
//           <AssignList  userrole={this.props.userrole} branch={this.props.branch} />
//         </Tab>
//       </Tabs>
//       </div>
//       </StayVisible>
//     )
//   }
// }
// export default AssignLayout;
