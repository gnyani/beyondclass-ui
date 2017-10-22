import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {blue500, red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Submissions from 'material-ui/svg-icons/action/assessment'
import {ImageCollectionsBookmark,ActionBook,AvLibraryBooks,
       ActionSpeakerNotes,AvMovie,ActionTimeline,SocialSchool,DeveloperBoard,QuestionAnswer} from '../../styledcomponents/SvgIcons.js'


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
      <div className={this.isActive('submissions')}>
        <Link to='/submissions'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"submissions")} >
          <MenuItem
          primaryText={'Your Submissions'}
          leftIcon={<Submissions color={red500}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link></div>
      <Divider/>
      <div className={this.isActive('announcements')}>
        <Link to='/announcements'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"announcements")} >
          <MenuItem
          primaryText={'AnouncementsBoard'}
          leftIcon={<ActionSpeakerNotes color={blue500}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link></div>
      <Divider/>
      <div className={this.isActive('TeacherStudentSpace')}>
        <Link to='/teacherstudentspace'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"TeacherStudentSpace")} >
          <MenuItem
          primaryText={'TeacherStudentSpace'}
          leftIcon={<DeveloperBoard color={red500}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link></div>
      <Divider/>
      <div className={this.isActive('timeline')}>
          <Link to='/timeline' width={this.props.width}  style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"timeline")}>
            <MenuItem
            primaryText={'Timeline'}
            leftIcon={<ActionTimeline color={blue500}/>}
            onClick={this.props.handleMobileToggle}
            />
          </Link>
          </div>
      <Divider/>
      <div  className={this.isActive('questionpaper')}>
      <Link to='/questionpaper' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"questionpaper")}>
          <MenuItem
          primaryText={'QuestionPaper'}
          leftIcon={<ActionBook color={red500}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
      </div>
      <Divider/>
      <div  className={this.isActive('syllabus')}>
      <Link to='/syllabus' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"syllabus")}>
          <MenuItem primaryText={'Syllabus'}
            leftIcon={<AvLibraryBooks color={blue500} />}
            onClick={this.props.handleMobileToggle}
          />
          </Link>
          </div>
      <Divider/>
      <div  className={this.isActive('notes')}>
      <Link to='/notes' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"notes")}>
              <MenuItem primaryText={'Notes'}
                leftIcon={<ImageCollectionsBookmark color={red500} />}
                onClick={this.props.handleMobileToggle}
              />
        </Link>
      </div>
      <Divider />
  {/*    <div className={this.isActive('entertainment')}>
              <Link to="/entertainment" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"entertainment")}>
                <MenuItem primaryText={'Entertainment'}
                  leftIcon={<AvMovie color={blue500} />}
                  onClick={this.props.handleMobileToggle}
                />
              </Link>
      </div>
      <Divider />*/}
      <div  className={this.isActive('coachingcentres')}>
              <Link to="/coachingcentres" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"coachingcentres")}>
                <MenuItem primaryText={'Coaching-Centres'}
                  leftIcon={<SocialSchool color={blue500} />}
                  onClick={this.props.handleMobileToggle}
                />
              </Link>
          </div>
              <Divider />
            <div className={this.isActive('UserQuestions')}>
            <Link to='/UserQuestions' width={this.props.width} style={{ textDecoration: 'none' }}  onClick={this.onChangeSelected.bind(this,"UserQuestions")} >
                  <MenuItem
                  primaryText={'User Questions'}
                  leftIcon={<QuestionAnswer color={red500}/>}
                  onClick={this.props.handleMobileToggle}
                  />
                </Link></div>
      </div>
    )
  }
}
export default StudentDashboard;
