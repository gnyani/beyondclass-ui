import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom'
import Banner from './Banner.js';
import DashboardLayout from './DashboardLaoyout.js'
import Register from './registration/register.js';
import '../styles/student-adda.css'

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
    <Route exact path='/teacher/reports/view/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/create/:class/saved/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/createpa/:class/saved/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacher/assignment/:assignmentid/evaluate' component={DashboardLayout} />
    <Route exact path='/student/assignments/take/:assignmentid' component={DashboardLayout} />
    <Route exact path='/teacherstudentspace' component={DashboardLayout} />
    <Route exact path='/updateprofile' component={DashboardLayout} />
    <Route exact path='/submissions' component={DashboardLayout} />
    <Route exact path='/codeeditor' component={DashboardLayout} />
    <Route exact path='/notifications' component={DashboardLayout} key={new Date().getTime()}/>
  </Switch>
    );
  }
}
export default Router;
