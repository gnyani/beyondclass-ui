import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom'
import Header from './header.js';
import DashboardLayout from './DashboardLaoyout.js'
import {HeaderStyle} from '../styledcomponents/Template'
class HeaderComponent extends Component {
  render(){
    return(
<HeaderStyle>
  <Switch>
    <Route exact path='/' component={Header}/>
    <Route path='/register' component={Header}/>
    <Route path='/dashboard' component={DashboardLayout}/>
    <Route path='/questionpaper/default' component={DashboardLayout} />
    <Route path='/questionpaper/other' component={DashboardLayout} />
    <Route path='/syllabus/default' component={DashboardLayout} />
    <Route path='/syllabus/other' component={DashboardLayout} />
    <Route path='/assignments/upload' component={DashboardLayout} />
    <Route path='/assignments/view/list' component={DashboardLayout} />
  </Switch>
</HeaderStyle>
    );
  }
}
export default HeaderComponent;
