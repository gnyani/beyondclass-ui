import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import {blue500, red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {ImageCollectionsBookmark,ActionBook,AvLibraryBooks,AvNote,ContentArchive,ActionAssignment,
       FileFileUpload,ActionViewList,ActionSpeakerNotes,AvMovie,ActionTimeline,SocialSchool,DeveloperBoard} from '../../styledcomponents/SvgIcons.js'

 const iconStyles = {
         marginRight: 24,
       };

class StudentDashboard extends Component{

constructor(){
  super();
  this.state={
    selected: '',
  }
  this.isActive = this.isActive.bind(this)
}
onChangeSelected(value){
  this.setState({
    selected: value
  })
}
isActive(value){
    return (value === this.state.selected)?'Active':'';
}
  render(){
    return(
      <div>
      <div className={this.isActive('announcements')}>
        <Link to='/announcements'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"announcements")} >
          <MenuItem
          primaryText={'AnouncementsBoard'}
          leftIcon={<ActionSpeakerNotes color={blue500}/>}
          />
        </Link></div>
      <Divider/>
      <div className={this.isActive('TeacherStudentSpace')}>
        <Link to='/teacherstudentspace'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"TeacherStudentSpace")} >
          <MenuItem
          primaryText={'TeacherStudentSpace'}
          leftIcon={<DeveloperBoard color={red500}/>}
          />
        </Link></div>
      <Divider/>
      <div className={this.isActive('timeline')}>
          <Link to='/timeline' width={this.props.width}  style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"timeline")}>
            <MenuItem
            primaryText={'Timeline'}
            leftIcon={<ActionTimeline color={blue500}/>}
            />
          </Link>
          </div>
      <Divider/>
      <div  className={this.isActive('questionpaper')}>
          <MenuItem
          primaryText={'QuestionPaper'}
          rightIcon={<ArrowDropRight />}
          leftIcon={<ActionBook color={red500}/>}
          menuItems={[<Link to='/questionpaper/default' width={this.props.width} onClick={this.onChangeSelected.bind(this,"questionpaper")}>
                      <MenuItem primaryText="Current Sem" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                      />
                      </Link>,
                      <Link to='/questionpaper/other' width={this.props.width} onClick={this.onChangeSelected.bind(this,"questionpaper")}>
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
                         <Link to='/syllabus/default' width={this.props.width} onClick={this.onChangeSelected.bind(this,"syllabus")}>
                          <MenuItem primaryText="Current Syllabus" leftIcon={<AvNote style={iconStyles} color={red500}/>}
                          />
                          </Link>,
                          <Link to='/syllabus/other' width={this.props.width} onClick={this.onChangeSelected.bind(this,"syllabus")}>
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
                             <Link to='/assignments/upload' width={this.props.width} onClick={this.onChangeSelected.bind(this,"assignments")}>
                              <MenuItem primaryText="Upload Assign" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                              />
                              </Link>,
                              <Link to='/assignments/view/list' width={this.props.width} onClick={this.onChangeSelected.bind(this,"assignments")}>
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
                             <Link to='/notes/upload' width={this.props.width} onClick={this.onChangeSelected.bind(this,"notes")}>
                              <MenuItem primaryText="Upload Notes" leftIcon={<FileFileUpload style={iconStyles} color={red500}/>}
                              />
                              </Link>,
                              <Link to='/notes/view/list' width={this.props.width} onClick={this.onChangeSelected.bind(this,"notes")}>
                              <MenuItem primaryText="View Notes" leftIcon={
                                <ActionViewList style={iconStyles} color={blue500}/>
                                }/>
                              </Link>
                            ]}
              />
      </div>
      <Divider />
      <div className={this.isActive('entertainment')}>
              <Link to="/entertainment" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"entertainment")}>
                <MenuItem primaryText={'Entertainment'}
                  leftIcon={<AvMovie color={blue500} />}
                />
              </Link>
      </div>
      <Divider />
      <div  className={this.isActive('coachingcentres')}>
              <Link to="/coachingcentres" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"coachingcentres")}>
                <MenuItem primaryText={'Coaching-Centres'}
                  leftIcon={<SocialSchool color={red500} />}
                />
              </Link>
          </div>
              <Divider />
            <div className={this.isActive('UserQuestions')}>    <Link to='/UserQuestions' width={this.props.width} onClick={this.onChangeSelected.bind(this,"UserQuestions")} >
                  <MenuItem
                  primaryText={'User Questions'}
                  leftIcon={<ActionSpeakerNotes color={blue500}/>}
                  />
                </Link></div>
      </div>
    )
  }
}
export default StudentDashboard;
