import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import Submissions from 'material-ui/svg-icons/action/assessment'
import Code from 'material-ui/svg-icons/action/code'
import School from 'material-ui/svg-icons/social/school.js'
import {ImageCollectionsBookmark,ActionBook,AvLibraryBooks,
       ActionSpeakerNotes,AvMovie,ActionTimeline,SocialSchool,QuestionAnswer} from '../../styledcomponents/SvgIcons.js'


class StudentDashboard extends Component{

constructor(){
  super();
  this.state={
    selected: 'announcements',
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

getColor = (view) => {
  var buffer
  if(view === "Active" )
   buffer = '#30b55b'

  return buffer
}
  render(){
    return(
      <div>
        <Link to='/submissions'  width={this.props.width} style={{ textDecoration: 'none'}} onClick={this.onChangeSelected.bind(this,"submissions")} >
          <MenuItem
          className={this.isActive('submissions')}
          primaryText={'Submissions'}
          leftIcon={<Submissions color={this.getColor(this.isActive('submissions'))}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
        <Link to='/announcements'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"announcements")} >
          <MenuItem
          className={this.isActive('announcements')}
          primaryText={'Announcements'}
          leftIcon={<ActionSpeakerNotes color={this.getColor(this.isActive('announcements'))}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
        <Link to='/teacherstudentspace'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"TeacherStudentSpace")} >
          <MenuItem
          className={this.isActive('TeacherStudentSpace')}
          primaryText={'Academics'}
          leftIcon={<School color={this.getColor(this.isActive('TeacherStudentSpace'))}/>}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
          <Link to='/timeline' width={this.props.width}  style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"timeline")}>
            <MenuItem
            className={this.isActive('timeline')}
            primaryText={'Timeline'}
            leftIcon={<ActionTimeline color={this.getColor(this.isActive('timeline'))}/>}
            onClick={this.props.handleMobileToggle}
            />
          </Link>
      <Link to='/questionpaper' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"questionpaper")}>
          <MenuItem
          primaryText={'QuestionPaper'}
          leftIcon={<ActionBook color={this.getColor(this.isActive('questionpaper'))}/>}
          className={this.isActive('questionpaper')}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
      <Link to='/syllabus' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"syllabus")}>
          <MenuItem primaryText={'Syllabus'}
            leftIcon={<AvLibraryBooks  color={this.getColor(this.isActive('syllabus'))}/>}
            className={this.isActive('syllabus')}
            onClick={this.props.handleMobileToggle}
          />
          </Link>
      <Link to='/notes' width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"notes")}>
              <MenuItem primaryText={'Share Notes'}
                leftIcon={<ImageCollectionsBookmark  color={this.getColor(this.isActive('notes'))}/>}
                onClick={this.props.handleMobileToggle}
                className={this.isActive('notes')}
              />
        </Link>
        <Link to='/codeeditor'  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"codeeditor")} >
          <MenuItem
          primaryText={'Code Editor'}
          leftIcon={<Code color={this.getColor(this.isActive('codeeditor'))}/>}
          className={this.isActive('codeeditor')}
          onClick={this.props.handleMobileToggle}
          />
        </Link>
        {/*
                <Link to="/entertainment" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"entertainment")}>
                      <MenuItem primaryText={'Entertainment'}
                        leftIcon={<AvMovie color={blue500} />}
                        onClick={this.props.handleMobileToggle}
                        className={this.isActive('entertainment')}
                      />
                    </Link>
            <Divider />
              <Link to="/coachingcentres" width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,"coachingcentres")}>
                <MenuItem primaryText={'Coaching-Centres'}
                  leftIcon={<SocialSchool color={red500} />}
                  onClick={this.props.handleMobileToggle}
                  className={this.isActive('coachingcentres')}
                />
              </Link>
            <Link to='/UserQuestions' width={this.props.width} style={{ textDecoration: 'none' }}  onClick={this.onChangeSelected.bind(this,"Forum")} >
                  <MenuItem
                  primaryText={'Forum'}
                  leftIcon={<QuestionAnswer color={blue500}/>}
                  onClick={this.props.handleMobileToggle}
                  className={this.isActive('Forum')}
                  />
                </Link>*/}

      </div>
    )
  }
}
export default StudentDashboard;
