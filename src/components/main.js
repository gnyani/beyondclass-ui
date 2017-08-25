import React from 'react';
import {Switch,Route} from 'react-router-dom'
import Banner from './Banner.js';
import Dashboard from './dashboard.js';
import QpLayout from './questionpapers/QpLayout.js'
import AssignLayout from './assignments/AssignLayout.js'
import NotesLayout from './notes/NotesLayout.js'
import SyllabusLayout from './syllabus/SyllabusLayout.js'
import AnouncementsBoard from './anouncements/AnouncementsBoard.js'
import TimeLine from './timeline/TimeLine.js'
import CoachingCentres from './coachingcentres/CoachingCentres.js'
import UserQuestions from './user-questions/TimeLine.js'
import TeacherComponent from './teacher/TeacherComponent.js'
import TeacherStudentSpace from './teacherstudent/TeacherStudentSpace.js'
import Notifications from './notifications/Notifications.js'
import UpdateProfile from './profile/UpdateProfile.js'

export const Body =(props) => {
    return(
<main >
  <Switch>
    <Route path='/dashboard' render={() =>(<Dashboard {...props}/>)}/>
    <Route path='/questionpaper' render={()=>(<QpLayout {...props} />)}/>
    <Route path='/syllabus' render={()=>(<SyllabusLayout {...props} />)} />
    <Route path='/assignments' render={()=>(<AssignLayout {...props} /> )} />
    <Route path='/notes' render={()=>(<NotesLayout {...props} /> )} />
    <Route path='/announcements' render={()=>(<AnouncementsBoard {...props}/>)} />
    <Route path='/timeline' render={()=>(<TimeLine {...props}/>)} />
    <Route path='/coachingcentres' render={() =>(<CoachingCentres {...props} />)} />
    <Route path='/UserQuestions' render={() =>(<UserQuestions {...props} />)} />
    <Route path='/teacher/:class' render={({match}) =>(<TeacherComponent {...props} class={match.params.class}/>)} />
    <Route path='/teacherstudentspace' render={() =>(<TeacherStudentSpace {...props} />)} />
    <Route path='/updateprofile' render={() =>(<UpdateProfile {...props} />)} />
    <Route path='/notifications' render={() => (<Notifications {...props} />)} />
  </Switch>
</main>
    );
}
