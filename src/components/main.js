import React from 'react';
import {Switch,Route} from 'react-router-dom'
import QpLayout from './questionpapers/QpLayout.js'
//import AssignLayout from './assignments/AssignLayout.js'
import NotesLayout from './notes/NotesLayout.js'
import SyllabusLayout from './syllabus/SyllabusLayout.js'
import AnouncementsBoard from './anouncements/AnouncementsBoard.js'
import TimeLine from './timeline/TimeLine.js'
import CoachingCentres from './coachingcentres/CoachingCentres.js'
import QuestionLayout from './user-questions/QuestionLayout.js'
import TeacherComponent from './teacher/TeacherComponent.js'
import TeacherStudentSpace from './teacherstudent/TeacherStudentSpace.js'
import Notifications from './notifications/Notifications.js'
import UpdateProfile from './profile/UpdateProfile.js'
import Reports from './teacher/Reports.js'
import SubmitAssignment from './teacherstudent/SubmitAssignment'
import EvaluateAssignment from './teacher/EvaluateAssignment'
import TheoryAssignment from './teacher/AssignmentContent'
import ProgrammingAssignment from './teacher/ProgrammingAssignment'
import Submissions from './profile/Submissions'
import Editor from './codeeditor/Editor'

export const Body =(props) => {
    return(
<main >
  <Switch>
    <Route exact path='/questionpaper' render={()=>(<QpLayout {...props} />)}/>
    <Route exact path='/syllabus' render={()=>(<SyllabusLayout {...props} />)} />
    <Route exact path='/notes' render={()=>(<NotesLayout {...props} /> )} />
    <Route exact path='/announcements' render={()=>(<AnouncementsBoard {...props}/>)} />
    <Route exact path='/timeline' render={()=>(<TimeLine {...props}/>)} />
    <Route exact path='/coachingcentres' render={() =>(<CoachingCentres {...props} />)} />
    <Route exact path='/UserQuestions' render={() =>(<QuestionLayout {...props} />)} />
    <Route exact path='/teacher/:class' render={({match}) =>(<TeacherComponent {...props} class={match.params.class}/>)} />
    <Route exact path='/teacher/:class/create' render={({match}) =>(< TheoryAssignment {...props} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/:class/createpa' render={({match}) =>(< ProgrammingAssignment {...props} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/reports/view/:assignmentid' render={({match}) =>(<Reports {...props} assignmentid={match.params.assignmentid}/>)} />
    <Route exact path='/teacher/assignment/:submissionid/evaluate' render={({match}) =>(<EvaluateAssignment {...props} submissionid={match.params.submissionid}/>)} />
    <Route exact path='/student/assignments/take/:assignmentid' render={({match}) =>(<SubmitAssignment {...props} assignmentid={match.params.assignmentid}/>)} />
    <Route exact path='/teacherstudentspace' render={() =>(<TeacherStudentSpace {...props} />)} />
    <Route exact path='/updateprofile' render={() =>(<UpdateProfile {...props} />)} />
    <Route exact path='/submissions' render={() => (<Submissions {...props} />)} />
    <Route exact path='/codeeditor' render={() => (<Editor {...props} />)} />
    <Route exact path='/notifications' render={() => (<Notifications {...props} />)} />
  </Switch>
</main>
    );
}
