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
    <Route path='/register' component={Register}/>
    <Route path='/dashboard' component={DashboardLayout}/>
    <Route path='/questionpaper' component={DashboardLayout} />
    <Route path='/syllabus' component={DashboardLayout} />
    <Route path='/assignments' component={DashboardLayout} />
    <Route path='/notes' component={DashboardLayout} />
    <Route path='/announcements' component={DashboardLayout} />
    <Route path='/timeline' component={DashboardLayout} />
    <Route path='/coachingcentres' component={DashboardLayout} />
    <Route path='/UserQuestions' component={DashboardLayout} />
    <Route path='/teacher/:class' component={DashboardLayout} />
    <Route path='/teacherstudentspace' component={DashboardLayout} />
    <Route path='/updateprofile' component={DashboardLayout} />
    <Route path='/notifications' component={DashboardLayout} key={new Date().getTime()}/>
  </Switch>
    );
  }
}
export default Router;
