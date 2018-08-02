import React from 'react';
import Loadable from 'react-loadable';
import Loading from './Loading';
import {Switch,Route} from 'react-router-dom'
import TeacherStudentSpace from './teacherstudent/TeacherStudentSpace.js'
import SubmitAssignment from './teacherstudent/SubmitAssignment'

const TeacherNetwork = Loadable({
  loader: () => import('./teachernetwork/TeacherNetwork.js'),
  loading: Loading,
  timeout: 10000,
})
const QpLayout = Loadable({
  loader: () => import('./questionpapers/QpLayout.js'),
  loading: Loading,
  timeout: 10000,
})
const NotesLayout = Loadable({
  loader: () => import('./notes/NotesLayout.js'),
  loading: Loading,
  timeout: 10000,
})
const SyllabusLayout = Loadable({
  loader: () => import('./syllabus/SyllabusLayout.js'),
  loading: Loading,
  timeout: 10000,
})
const AnouncementsBoard = Loadable({
  loader: () => import('./anouncements/AnouncementsBoard.js'),
  loading: Loading,
  timeout: 10000,
})
const TimeLine = Loadable({
  loader: () => import('./timeline/TimeLine.js'),
  loading: Loading,
  timeout: 10000,
})
const CoachingCentres = Loadable({
  loader: () => import('./coachingcentres/CoachingCentres.js'),
  loading: Loading,
  timeout: 10000,
})
const QuestionLayout = Loadable({
  loader: () => import('./user-questions/QuestionLayout.js'),
  loading: Loading,
  timeout: 10000,
})
const TeacherComponent = Loadable({
  loader: () => import('./teacher/TeacherComponent.js'),
  loading: Loading,
  timeout: 10000,
})
const Notifications = Loadable({
  loader: () => import('./notifications/Notifications.js'),
  loading: Loading,
  timeout: 10000,
})
const UpdateProfile = Loadable({
  loader: () => import('./profile/UpdateProfile.js'),
  loading: Loading,
  timeout: 10000,
})
const Reports = Loadable({
  loader: () => import('./teacher/Reports.js'),
  loading: Loading,
  timeout: 10000,
})
const EvaluateAssignment = Loadable({
  loader: () => import('./teacher/EvaluateAssignment'),
  loading: Loading,
  timeout: 10000,
})
const TheoryAssignment = Loadable({
  loader: () => import('./teacher/AssignmentContent'),
  loading: Loading,
  timeout: 10000,
})
const ViewTheoryAssignment = Loadable({
  loader: () => import('./teachernetwork/viewquestionset/ViewTheoryAssignment.js'),
  loading: Loading,
  timeout: 10000,
})
const EditTheoryAssignment = Loadable({
  loader: () => import('./teacher/editassignment/EditTheoryAssignment'),
  loading: Loading,
  timeout: 10000,
})
const ViewProgrammingAssignment = Loadable({
  loader: () => import('./teachernetwork/viewquestionset/ViewProgrammingAssignment.js'),
  loading: Loading,
  timeout: 10000,
})
const EditProgrammingAssignment = Loadable({
  loader: () => import('./teacher/editassignment/EditProgrammingAssignment'),
  loading: Loading,
  timeout: 10000,
})
const ViewObjectiveAssignment = Loadable({
  loader: () => import('./teachernetwork/viewquestionset/ViewObjectiveAssignment'),
  loading: Loading,
  timeout: 10000,
})
const EditObjectiveAssignment = Loadable({
  loader: () => import('./teacher/editassignment/EditObjectiveAssignment'),
  loading: Loading,
  timeout: 10000,
})
const ProgrammingAssignment = Loadable({
  loader: () => import('./teacher/ProgrammingAssignment'),
  loading: Loading,
  timeout: 10000,
})
const ObjectiveAssignment = Loadable({
  loader: () => import('./teacher/ObjectiveAssignment'),
  loading: Loading,
  timeout: 10000,
})
const Submissions = Loadable({
  loader: () => import('./profile/Submissions'),
  loading: Loading,
  timeout: 10000,
})
const ReportIssue = Loadable({
  loader: () => import('./issues/report-issue'),
  loading: Loading,
  timeout: 10000,
})

const CodeEditor = Loadable({
  loader: () => import('./codeeditor/CodeEditor'),
  loading: Loading,
  timeout: 10000,
})

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
    <Route exact path='/report/issue' render={() =>(<ReportIssue {...props} />)} />
    <Route exact path='/UserQuestions' render={() =>(<QuestionLayout {...props} />)} />
    <Route exact path='/teacher/:class' render={({match}) =>(<TeacherComponent {...props} class={match.params.class}/>)} />
    <Route exact path='/teacher/:class/create' render={({match}) =>(< TheoryAssignment {...props} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/:class/createpa' render={({match}) =>(< ProgrammingAssignment {...props} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/:class/createobjectiveassignment' render={({match}) =>(< ObjectiveAssignment {...props} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/reports/view/:assignmentid' render={({match}) =>(<Reports {...props} assignmentid={match.params.assignmentid}/>)} />
    <Route exact path='/teacher/assignment/:submissionid/evaluate' render={({match}) =>(<EvaluateAssignment {...props} submissionid={match.params.submissionid}/>)} />
    <Route exact path='/student/assignments/take/:assignmentid' render={({match}) =>(<SubmitAssignment {...props} assignmentid={match.params.assignmentid}/>)} />
    <Route exact path='/teacher/create/:class/saved/:assignmentid' render={({match}) =>(<TheoryAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/create/:class/edit/:assignmentid' render={({match}) =>(<EditTheoryAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/createpa/:class/saved/:assignmentid' render={({match}) =>(<ProgrammingAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/createobjectiveassignment/:class/saved/:assignmentid' render={({match}) =>(<ObjectiveAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/createobjectiveassignment/:class/edit/:assignmentid' render={({match}) =>(<EditObjectiveAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/createpa/:class/edit/:assignmentid' render={({match}) =>(<EditProgrammingAssignment {...props} assignmentid={match.params.assignmentid} class={match.params.class} email={match.params.email} />)} />
    <Route exact path='/teacher/create/edit/:assignmentid' render={({match}) =>(<ViewTheoryAssignment {...props} assignmentid={match.params.assignmentid} email={match.params.email} />)} />
    <Route exact path='/teacher/createpa/edit/:assignmentid' render={({match}) =>(<ViewProgrammingAssignment {...props} assignmentid={match.params.assignmentid} email={match.params.email} />)} />
    <Route exact path='/teacher/createobjectiveassignment/edit/:assignmentid' render={({match}) =>(<ViewObjectiveAssignment {...props} assignmentid={match.params.assignmentid}  email={match.params.email} />)} />
    <Route exact path='/teacherstudentspace' render={() =>(<TeacherStudentSpace {...props} />)} />
    <Route exact path='/updateprofile' render={() =>(<UpdateProfile {...props} />)} />
    <Route exact path='/submissions' render={() => (<Submissions {...props} />)} />
    <Route exact path='/codeeditor' render={() => (<CodeEditor {...props} />)} />
    <Route exact path='/teachernetwork' render={()=>(<TeacherNetwork {...props} />)} />
    <Route exact path='/notifications' render={() => (<Notifications {...props} />)} />
  </Switch>
</main>
    );
}
