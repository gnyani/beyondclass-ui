import React, { Component } from 'react';
import {Body} from './main.js'
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {Link} from 'react-router-dom';
import {NavAppBar} from '../styledcomponents/NavAppBar.js'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import {lightBlue100,blue500, red500} from 'material-ui/styles/colors';
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import '../styles/student-adda.css';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import {AddImageIcon,EditIcon,ImageCollectionsBookmark,ActionBook,AvLibraryBooks,AvNote,ContentArchive,ActionAssignment,
       FileFileUpload,ActionViewList,ActionSpeakerNotes,AvMovie,ActionTimeline,SocialSchool} from '../styledcomponents/SvgIcons.js'
//import CustomAvatar from '../styledcomponents/CustomAvatar.js'
const iconStyles = {
  marginRight: 24,
};


class DashboardLaoyout extends Component{

  constructor() {
    super();
    this.state = {
      open : true,
      width : 250,
      propiclink : '',
      username : ''
     }
     this.handleLogout = this.handleLogout.bind(this);
}

handleLogout(){
  fetch('http://localhost:8080/user/logout', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
        //  console.log("response without json is" + response.text())
           return response.text()
        }).then(response => {
          console.log("response is"+response);
          if(response){
            let myColor = { background: '#0E1717', text: "#FFFFFF" };
            notify.show('Logout Successful!','success',3000,myColor);
            this.setState({
              isLoggedIn : 'false',
              isLoaded : 'true'
            })
            this.context.router.history.push('/');
          }
        })
  }

componentWillMount(){

  fetch('http://localhost:8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
        //  console.log("response without json is" + response.text())
          return response.text()
        }).then(response => {
          console.log("response is"+response);
          // let myColor = { background: '#0E1717', text: "#FFFFFF" ,marginTop : '50%',zIndex : '3000'};
          // notify.show("log in successful","custom", 5000, myColor);
          this.setState({
              username: response
          })
        }).catch(response => {
        notify.show("Please login before viewing dashboard");
        this.context.router.history.push('/');
       });

  fetch('http://localhost:8080/user/propic', {
           credentials: 'include',
           method: 'GET'
           }).then(response => {
           console.log("status is" + response.status);
           //  console.log("response without json is" + response.text())
           return response.text()
           }).then(response => {
           console.log("response from server for pro pic is "+response);
           this.setState({
           propiclink : response,
           isLoaded : 'true'
           })
            //    this.state.isLoggedIn = 'true'
           console.log("propiclink from state is " + this.state.propiclink)
           })
}
handleToggle = () => {
  this.setState((prevState,props) =>{
    return {
      open : !prevState.open
    }
  })
}


render(){
  return(
<div>
    <NavAppBar
     toggle = {this.handleToggle}
     width = {this.state.width}
     open = {this.state.open}
     logout = {this.handleLogout}
     />
    <Drawer open={this.state.open} width = {this.state.width}>
    <div className="UserImageContainer">
    <img src={this.state.propiclink}  className="ProfilePic" />
    <IconButton><EditIcon /></IconButton>
    <br />
    <br />
    <FlatButton label="Update Profile" hoverColor ={lightBlue100} fullWidth={true} icon={<AddImageIcon  color={blue500}/>}/>
    <br />
    </div>
<Divider />
  <Link to='/anouncements' width={this.state.width}>
    <MenuItem
    primaryText={'AnouncementsBoard'}
    leftIcon={<ActionSpeakerNotes color={blue500}/>}
    />
  </Link>
<Divider/>
    <Link to='/timeline' width={this.state.width}>
      <MenuItem
      primaryText={'Timeline'}
      leftIcon={<ActionTimeline color={red500}/>}
      />
    </Link>
<Divider/>
    <MenuItem
    primaryText={'QuestionPaper'}
    rightIcon={<ArrowDropRight />}
    leftIcon={<ActionBook color={red500}/>}
    menuItems={[<Link to='/questionpaper/default' width={this.state.width}>
                <MenuItem primaryText="Current Sem" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                />
                </Link>,
                <Link to='/questionpaper/other' width={this.state.width}>
                <MenuItem primaryText="Other Papers" leftIcon={
                  <ContentArchive style={iconStyles} color={blue500}/>
                  }/>
                </Link>
                ]}
     />
<Divider/>
    <MenuItem primaryText={'Syllabus'}
      leftIcon={<AvLibraryBooks color={blue500} />}
      rightIcon={<ArrowDropRight />}
      menuItems={[
                   <Link to='/syllabus/default' width={this.state.width}>
                    <MenuItem primaryText="Current Syllabus" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                    />
                    </Link>,
                    <Link to='/syllabus/other' width={this.state.width}>
                    <MenuItem primaryText="Other Syllabus" leftIcon={
                      <ContentArchive style={iconStyles} color={blue500}/>
                      }/>
                    </Link>
                  ]}
    />
<Divider/>
        <MenuItem primaryText={'Assignments'}
          leftIcon={<ActionAssignment color={red500} />}
          rightIcon={<ArrowDropRight />}
          menuItems={[
                       <Link to='/assignments/upload' width={this.state.width}>
                        <MenuItem primaryText="Upload Assign" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                        />
                        </Link>,
                        <Link to='/assignments/view/list' width={this.state.width}>
                        <MenuItem primaryText="View Assign" leftIcon={
                          <ActionViewList style={iconStyles} color={blue500}/>
                          }/>
                        </Link>
                      ]}
        />
<Divider/>
        <MenuItem primaryText={'Notes'}
          leftIcon={<ImageCollectionsBookmark color={blue500} />}
          rightIcon={<ArrowDropRight />}
          menuItems={[
                       <Link to='/notes/upload' width={this.state.width}>
                        <MenuItem primaryText="Upload Notes" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                        />
                        </Link>,
                        <Link to='/notes/view/list' width={this.state.width}>
                        <MenuItem primaryText="View Notes" leftIcon={
                          <ActionViewList style={iconStyles} color={blue500}/>
                          }/>
                        </Link>
                      ]}
        />
<Divider />
        <Link to="/entertainment" width={this.state.width} >
          <MenuItem primaryText={'Entertainment'}
            leftIcon={<AvMovie color={blue500} />}
          />
        </Link>

<Divider />
        <Link to="/coachingcentres" width={this.state.width} >
          <MenuItem primaryText={'Coaching-Centres'}
            leftIcon={<SocialSchool color={red500} />}
          />
        </Link>
</Drawer>
<Body
toggle = {this.handleToggle}
width = {this.state.width}
open = {this.state.open}
/>
</div>
   )
}
}
DashboardLaoyout.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DashboardLaoyout);
