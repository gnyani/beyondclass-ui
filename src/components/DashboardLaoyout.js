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
import {AddImageIcon,ImageCollectionsBookmark,ActionBook,AvLibraryBooks,AvNote,ContentArchive,ActionAssignment,
       FileFileUpload,ActionViewList,ActionSpeakerNotes,AvMovie,ActionTimeline,SocialSchool} from '../styledcomponents/SvgIcons.js'
import AvatarEditor from 'react-avatar-editor';
import Dialog from 'material-ui/Dialog';
import Slider from 'material-ui/Slider';

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
      username : '',
      fullImage: '',
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      imageDialog: false,
      secondSlider:1,
      selected: ''
     }
     this.handleLogout = this.handleLogout.bind(this);
     this.handleDialogclose = this.handleDialogclose.bind(this)
     this._handleImageChange = this._handleImageChange.bind(this)
     this.saveProPictoDB = this.saveProPictoDB.bind(this)
     this.uploadProPic = this.uploadProPic.bind(this)
     this.getProPicUrl = this.getProPicUrl.bind(this)
     this.postTimeline = this.postTimeline.bind(this)
     this.isActive = this.isActive.bind(this)
}

selected(value){
  this.setState({
    selected: value
  })
}

isActive(value){
  console.log((value === this.state.selected)?'Active':'');
  return (value === this.state.selected)?'Active':'';
}

_handleImageChange(e) {
  e.preventDefault();

  let reader = new FileReader();
  let file = e.target.files[0];

  reader.onloadend = () => {
    this.setState({
      file: file,
      imagePreviewUrl: reader.result,
      fullImage:reader.result.split(',').pop(),
      imageDialog : true,
    });
  }

  reader.readAsDataURL(file)
}
saveProPictoDB(){
if (this.editor) {
  const canvas = this.editor.getImage()
  var data = canvas.toDataURL().split(',').pop()
  this.setState({
    filebase64: data,
  },function OnstateChange(){
  this.uploadProPic()
  })
}
}

uploadProPic(){
  fetch('http://localhost:8080/user/update/profilepic', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         file : this.state.filebase64,
      })
     }).then(response => {
       if(response.status === 200)
       {
         notify.show("Avatar Changed successfully","success")
          return response.text();
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       this.setState({
         imagePreviewUrl: '',
         imageDialog: false,
         file: '',
       },function OnstateChange(){
         this.getProPicUrl()
       })
   // posting this change to timeline
      this.postTimeline()
      //  var location = this.props.location
      //  this.context.router.history.push(location)
      //This needs to be fixed reloading the entire page is not a good Idea.
       window.location.reload()
     })
}
postTimeline(){
  fetch('http://localhost:8080/users/timeline/upload', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         file : this.state.fullImage,
         description: "   " ,
         isprofilepicchange: true,
      })
     }).then(response => {
       if(response.status === 200)
       {
          notify.show("profilepic updated successfully")
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     })
}

handleDialogclose(){
  this.setState({
    imageDialog: false,
  })
}

handleLogout(){
  fetch('http://localhost:8080/user/logout', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
           return response.text()
        }).then(response => {
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

getProPicUrl(){
  fetch('http://localhost:8080/user/propic', {
           credentials: 'include',
           method: 'GET'
           }).then(response => {
           return response.text()
           }).then(response => {
           this.setState({
           propiclink : response,
           isLoaded : 'true'
         })
      })
}

componentWillMount(){

  fetch('http://localhost:8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          return response.text()
        }).then(response => {
          this.setState({
              username: response
          })
        }).catch(response => {
        notify.show("Please login before viewing dashboard");
        this.context.router.history.push('/');
       });
     this.getProPicUrl()
}
handleToggle = () => {
  this.setState((prevState,props) =>{
    return {
      open : !prevState.open
    }
  })
}
handleSecondSlider = (event, value) => {
  this.setState({secondSlider: value});
};

setEditorRef = (editor) => this.editor = editor

render(){
  const actions = [
    <FlatButton
      label="Save"
      primary={true}
      onTouchTap={this.saveProPictoDB}
    />,
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleDialogclose}
    />]
  return(
<div>
    <NavAppBar
     toggle = {this.handleToggle}
     width = {this.state.width}
     open = {this.state.open}
     logout = {this.handleLogout}
     />
    <Drawer open={this.state.open} width = {this.state.width}>
    <div className="image-upload UserImageContainer">
    <label htmlFor="file-input">
      <img src={this.state.propiclink}  alt="loading" className="ProfilePic"/>
    </label>
    <input type="file" id="file-input" onChange={this._handleImageChange}/>
   </div>
    <br />
    <br />
    <FlatButton label="Update Profile" hoverColor ={lightBlue100} fullWidth={true} icon={<AddImageIcon  color={blue500}/>}/>
    <br />
<Divider />
<div className={this.isActive('announcements')}>
  <Link to='/anouncements'  width={this.state.width} style={{ textDecoration: 'none' }} onClick={this.selected.bind(this,"announcements")} >
    <MenuItem
    primaryText={'AnouncementsBoard'}
    leftIcon={<ActionSpeakerNotes color={blue500}/>}
    />
  </Link></div>
<Divider/>
<div className={this.isActive('timeline')}>
    <Link to='/timeline' width={this.state.width}  style={{ textDecoration: 'none' }} onClick={this.selected.bind(this,"timeline")}>
      <MenuItem
      primaryText={'Timeline'}
      leftIcon={<ActionTimeline color={red500}/>}
      />
    </Link>
    </div>
<Divider/>
<div  className={this.isActive('questionpaper')}>
    <MenuItem
    primaryText={'QuestionPaper'}
    rightIcon={<ArrowDropRight />}
    leftIcon={<ActionBook color={red500}/>}
    menuItems={[<Link to='/questionpaper/default' width={this.state.width} onClick={this.selected.bind(this,"questionpaper")}>
                <MenuItem primaryText="Current Sem" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                />
                </Link>,
                <Link to='/questionpaper/other' width={this.state.width} onClick={this.selected.bind(this,"questionpaper")}>
                <MenuItem primaryText="Other Papers" leftIcon={
                  <ContentArchive style={iconStyles} color={blue500}/>
                  }/>
                </Link>
                ]}
     />
     </div>
<Divider/>
<div  className={this.isActive('syllabus')}>
    <MenuItem primaryText={'Syllabus'}
      leftIcon={<AvLibraryBooks color={blue500} />}
      rightIcon={<ArrowDropRight />}
      menuItems={[
                   <Link to='/syllabus/default' width={this.state.width} onClick={this.selected.bind(this,"syllabus")}>
                    <MenuItem primaryText="Current Syllabus" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                    />
                    </Link>,
                    <Link to='/syllabus/other' width={this.state.width} onClick={this.selected.bind(this,"syllabus")}>
                    <MenuItem primaryText="Other Syllabus" leftIcon={
                      <ContentArchive style={iconStyles} color={blue500}/>
                      }/>
                    </Link>
                  ]}
    />
    </div>
<Divider/>
<div  className={this.isActive('assignments')}>
        <MenuItem primaryText={'Assignments'}
          leftIcon={<ActionAssignment color={red500} />}
          rightIcon={<ArrowDropRight />}
          menuItems={[
                       <Link to='/assignments/upload' width={this.state.width} onClick={this.selected.bind(this,"assignments")}>
                        <MenuItem primaryText="Upload Assign" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                        />
                        </Link>,
                        <Link to='/assignments/view/list' width={this.state.width} onClick={this.selected.bind(this,"assignments")}>
                        <MenuItem primaryText="View Assign" leftIcon={
                          <ActionViewList style={iconStyles} color={blue500}/>
                          }/>
                        </Link>
                      ]}
        />
        </div>
<Divider/>
<div  className={this.isActive('notes')}>
        <MenuItem primaryText={'Notes'}
          leftIcon={<ImageCollectionsBookmark color={blue500} />}
          rightIcon={<ArrowDropRight />}
          menuItems={[
                       <Link to='/notes/upload' width={this.state.width} onClick={this.selected.bind(this,"notes")}>
                        <MenuItem primaryText="Upload Notes" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                        />
                        </Link>,
                        <Link to='/notes/view/list' width={this.state.width} onClick={this.selected.bind(this,"notes")}>
                        <MenuItem primaryText="View Notes" leftIcon={
                          <ActionViewList style={iconStyles} color={blue500}/>
                          }/>
                        </Link>
                      ]}
        />
</div>
<Divider />
<div className={this.isActive('entertainment')}>
        <Link to="/entertainment" width={this.state.width} style={{ textDecoration: 'none' }} onClick={this.selected.bind(this,"entertainment")}>
          <MenuItem primaryText={'Entertainment'}
            leftIcon={<AvMovie color={blue500} />}
          />
        </Link>
</div>
<Divider />
<div  className={this.isActive('coachingcentres')}>
        <Link to="/coachingcentres" width={this.state.width} style={{ textDecoration: 'none' }} onClick={this.selected.bind(this,"coachingcentres")}>
          <MenuItem primaryText={'Coaching-Centres'}
            leftIcon={<SocialSchool color={red500} />}
          />
        </Link>
    </div>
        <Divider />
      <div className={this.isActive('UserQuestions')}>    <Link to='/UserQuestions' width={this.state.width} onClick={this.selected.bind(this,"UserQuestions")} >
            <MenuItem
            primaryText={'User Questions'}
            leftIcon={<ActionSpeakerNotes color={blue500}/>}
            />
          </Link></div>
</Drawer>
<Dialog
      title="Change Your Avatar"
      modal={false}
      actions={actions}
      open={this.state.imageDialog}
      autoScrollBodyContent={true}
      titleStyle={{textAlign:'center'}}
      onRequestClose={this.handleDialogclose}
    >
    <Slider
        min={1}
        max={3}
        step={0.01}
        value={this.state.secondSlider}
        sliderStyle={{marginLeft:'20%',width:'60%'}}
        onChange={this.handleSecondSlider}
      />
    <AvatarEditor
       image={this.state.imagePreviewUrl}
       ref={this.setEditorRef}
       width={450}
       height={370}
       border={[30,30]}
       style={{marginLeft:'13%'}}
       borderRadius={500}
       color={[255, 255, 255, 0.6]} // RGBA
       scale={this.state.secondSlider}
     />
     <br /> <br />

</Dialog>
<Body
toggle = {this.handleToggle}
width = {this.state.width}
open = {this.state.open}
loggedinuser = {this.state.username}
/>
</div>
   )
}
}
DashboardLaoyout.contextTypes = {
    router: PropTypes.object
};

export default withRouter(DashboardLaoyout);
