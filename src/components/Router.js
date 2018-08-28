import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from './Loading'
import '../styles/student-adda.css'

const DashboardLayout = Loadable({
  loader: () => import('./DashboardLaoyout.js'),
  loading: Loading,
  timeout: 10000,
})
const Register = Loadable({
  loader: () => import('./registration/register-temp.js'),
  loading: Loading,
  timeout: 10000,
})
const Banner = Loadable({
  loader: () => import('./Banner'),
  loading: Loading,
  timeout: 10000,
})

class Router extends Component {
  render(){
    return(
  <Switch >
    <Route exact path='/' component={Banner}/>
    <Route exact path='/register' component={Register}/>
    <Route exact path='/dashboard' component={DashboardLayout}/>
    <Route exact path='/questionpaper' component={DashboardLayout} />
    <Route exact path='/syllabus' component={DashboardLayout} />
    <Route exact path='/notes' component={DashboardLayout} />
    <Route exact path='/announcements' component={DashboardLayout} />
    <Route exact path='/timeline' component={DashboardLayout} />
    <Route exact path='/coachingcentres' component={DashboardLayout} />
    <Route exact path='/report/issue' component={DashboardLayout} />
    <Route exact path='/UserQuestions' component={DashboardLayout} />
    <Route exact path='/teacher/:class' component={DashboardLayout} />
    <Route exact path='/teacher/:class/create' component={DashboardLayout} />
    <Route exact path='/teacher/:class/createpa' component={DashboardLayout} />
    <Route exact path='/teacher/:class/createobjectiveassignment' component={DashboardLayout} />
    <Route exact path='/teacher/reports/view/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/create/:class/saved/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/create/:class/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createpa/:class/saved/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createobjectiveassignment/:class/saved/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createobjectiveassignment/:class/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createpa/:class/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/assignment/:assignmentid/evaluate' component={DashboardLayout} />
    <Route exact path='/student/assignments/take/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createpa/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createobjectiveassignment/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/create/edit/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacherstudentspace' component={DashboardLayout} />
    <Route exact path='/updateprofile' component={DashboardLayout} />
    <Route exact path='/submissions' component={DashboardLayout} />
    <Route exact path='/codeeditor' component={DashboardLayout} />
    <Route exact path='/notifications' component={DashboardLayout} key={new Date().getTime()}/>
    <Route exact path='/teachernetwork' component={DashboardLayout} />
  </Switch>
    );
  }
}
export default Router;
