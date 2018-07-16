import React from 'react';
import styled from 'styled-components';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications-none';
import Lock from 'material-ui/svg-icons/action/lock-outline.js'
import {Link} from 'react-router-dom';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import {BugOutline} from './SvgIcons.js'
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
         backgroundColor: '#39424d',
         height: '68px',
       }}
        >
           <ToolbarGroup firstChild={true}>
           <IconButton onClick={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
                 <CustomAvatar viewBox='0 0 30 30'/>
             <ToolbarTitle text="Beyond Class" style={{marginLeft:'0.5Vmax',fontSize:'1.8Vmax', fontWeight: 'light',color:'#fbfbfb'}}/>
           </ToolbarGroup>
           <ToolbarGroup>
           <div style={{position: 'relative',top: '0.4em',left:'1.5em'}}>
           <IconButton  tooltip="Report Issue" containerElement={<Link to="/report/issue" />} >
             <BugOutline  color="white"/>
           </IconButton>
           </div>
           <Badge
            badgeContent={props.notificationsCount}
            secondary={true}
            badgeStyle={{top: '2em', right: '1.5em'}}
           >
           <IconButton tooltip="Notifications" containerElement={<Link to="/notifications" />} >
             <NotificationsIcon  color="white"/>
           </IconButton>
         </Badge>
         <div style={{position: 'relative',top: '0.4em', right: '1.5em'}}>
           <IconButton  tooltip="Logout"  onTouchTap={props.logout}>
            <Lock color="white" />
           </IconButton>
          </div>
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
     backgroundColor: '#39424d',
     height: '68px',
   }}>
       <ToolbarGroup firstChild={true}>
       <IconButton onTouchTap={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
             <CustomAvatar viewBox='0 0 30 30'/>
         <ToolbarTitle text="Beyond Class" style={{marginLeft:'0.5Vmax',fontSize:'1.8Vmax',color:'#ffffff'}}/>
       </ToolbarGroup>
       <ToolbarGroup>
       <IconButton  tooltip="Report Issue" containerElement={<Link to="/report/issue" />} >
         <BugOutline color="black" />
       </IconButton>
       <div style={{position: 'relative', right: '1.5em'}}>
         <IconButton  tooltip="Logout"  onTouchTap={props.logout}>
          <Lock color="white" />
         </IconButton>
        </div>
       </ToolbarGroup>
     </Toolbar>
  </Paper>
  </StayVisible>
  )
}
}
