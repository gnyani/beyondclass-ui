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
         backgroundColor: '#00BCD4'
       }}
        >
           <ToolbarGroup firstChild={true}>
           <IconButton onClick={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
                 <CustomAvatar />
             <ToolbarTitle text="StudentAdda" style={{marginLeft:"0.3em",color:'#ffffff'}}/>
           </ToolbarGroup>
           <ToolbarGroup>
           <Badge
            badgeContent={props.notificationsCount}
            secondary={true}
            badgeStyle={{top: 18, right: 12}}
           >
           <IconButton tooltip="Notifications" containerElement={<Link to="/notifications" />} >
             <NotificationsIcon />
           </IconButton>
         </Badge>
           <FlatButton  label="Logout" value="logout" style={{color:"#FFFFFF"}} onTouchTap={props.logout}/>
           </ToolbarGroup>
         </Toolbar>
      </Paper>
      </StayVisible>)
}
else{
  return(
  <StayVisible
  {...props}
  >
  <Paper zDepth={2}>
    <Toolbar  style={{
     noGutter: true,
     backgroundColor: '#00BCD4'
   }}
   primary={true}>
       <ToolbarGroup firstChild={true}>
       <IconButton onTouchTap={props.toggle}> <NavigationMenu color="#ffffff" /> </IconButton>
             <CustomAvatar />
         <ToolbarTitle text="StudentAdda" style={{marginLeft:"0.3em",color:'#ffffff'}}/>
       </ToolbarGroup>
       <ToolbarGroup>
       <FlatButton  label="Logout" value="logout" style={{color:"#FFFFFF"}} onTouchTap={props.logout}/>
       </ToolbarGroup>
     </Toolbar>
  </Paper>
  </StayVisible>
  )
}
}
