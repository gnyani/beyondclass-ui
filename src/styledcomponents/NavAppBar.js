import React from 'react';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {Link} from 'react-router-dom';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import BugReport from 'material-ui/svg-icons/action/bug-report'
import CustomAvatar from '../styledcomponents/CustomAvatar.js'
import {Media} from '../components/utils/Media'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

export const NavAppBar = (props) => {
   if(props.userrole === "student")
   {
      return(
      <StayVisible
      {...props}
      >

      <Paper zDepth={2}>
        <Toolbar  style={{
         noGutter: true,
         backgroundColor: '#4d86cf'
       }}
        >
           <ToolbarGroup firstChild={true}>
           <IconButton onClick={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
                 <CustomAvatar viewBox='0 0 30 30'/>
             <ToolbarTitle text="StudentAdda" style={{marginLeft:'0.5Vmax',fontSize:'1.8Vmax',color:'#ffffff'}}/>
           </ToolbarGroup>
           <ToolbarGroup>
           <div style={{position: 'relative',top: '0.4em',left:'1.5em'}}>
           <IconButton  tooltip="Report Issue" containerElement={<Link to="/report/issue" />} >
             <BugReport color="black" />
           </IconButton>
           </div>
           <Badge
            badgeContent={props.notificationsCount}
            secondary={true}
            badgeStyle={{top: '2em', right: '1.5em'}}
           >
           <IconButton tooltip="Notifications" containerElement={<Link to="/notifications" />} >
             <NotificationsIcon />
           </IconButton>
         </Badge>
           <FlatButton  label="Logout" value="logout" style={{position:'relative',right:'15%'}}labelStyle={{color:"#FFFFFF",fontSize:'1.3Vmax'}} onTouchTap={props.logout}/>
           </ToolbarGroup>
         </Toolbar>
      </Paper>
      </StayVisible>
)
}
else{
  return(
  <StayVisible
  {...props}
  >
  <Paper zDepth={2}>
    <Toolbar  style={{
     noGutter: true,
     backgroundColor: '#4d86cf'
   }}>
       <ToolbarGroup firstChild={true}>
       <IconButton onTouchTap={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
             <CustomAvatar viewBox='0 0 30 30'/>
         <ToolbarTitle text="StudentAdda" style={{marginLeft:'0.5Vmax',fontSize:'1.8Vmax',color:'#ffffff'}}/>
       </ToolbarGroup>
       <ToolbarGroup>
       <IconButton  tooltip="Report Issue" containerElement={<Link to="/report/issue" />} >
         <BugReport color="black" />
       </IconButton>
       <FlatButton  label="Logout" value="logout" style={{position:'relative',right:'15%'}} labelStyle={{color:"#FFFFFF",fontSize:'1.3Vmax'}} onTouchTap={props.logout}/>
       </ToolbarGroup>
     </Toolbar>
  </Paper>
  </StayVisible>
  )
}
}
