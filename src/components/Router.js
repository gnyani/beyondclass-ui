import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom'
import Banner from './Banner.js';
import DashboardLayout from './DashboardLaoyout.js'
import Register from './registration/register.js'
class Router extends Component {
  render(){
    return(
  <Switch >
    <Route exact path='/' component={Banner}/>
    <Route path='/register' component={Register}/>
    <Route path='/dashboard' component={DashboardLayout}/>
    <Route path='/questionpaper/default' component={DashboardLayout} />
    <Route path='/questionpaper/other' component={DashboardLayout} />
    <Route path='/syllabus/default' component={DashboardLayout} />
    <Route path='/syllabus/other' component={DashboardLayout} />
    <Route path='/assignments/upload' component={DashboardLayout} />
    <Route path='/assignments/view/list' component={DashboardLayout} />
    <Route path='/notes/upload' component={DashboardLayout} />
    <Route path='/notes/view/list' component={DashboardLayout} />
    <Route path='/anouncements' component={DashboardLayout} />
    <Route path='/timeline' component={DashboardLayout} />
    <Route path='/coachingcentres' component={DashboardLayout} />
  </Switch>
    );
  }
}
export default Router;
