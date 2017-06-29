import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom'
import Header from './header.js';
import Register from './register.js';
import Dashboard from './dashboard.js';
import DefaultQp from './questionpapers/DefaultQp.js'
import AssignUpload from './assignments/AssignUpload.js'
import AssignList from './assignments/AssignList.js'
import DefaultSyllabus from './syllabus/DefaultSyllabus.js'
import OtherSyllabus from './syllabus/OtherSyllabus.js'
import OtherQp from './questionpapers/OtherQp.js'
import {Main} from '../styledcomponents/Template.js'

class Body extends Component {
  render(){
    return(
<Main >
  <Switch>
    <Route exact path='/' component={Header}/>
    <Route path='/register' component={Register}/>
    <Route path='/dashboard' component={Dashboard}/>
    <Route path='/questionpaper/default' component={DefaultQp} />
    <Route path='/questionpaper/other' component={OtherQp} />
    <Route path='/syllabus/default' component={DefaultSyllabus} />
    <Route path='/syllabus/other' component={OtherSyllabus} />
    <Route path='/assignments/upload' component={AssignUpload} />
    <Route path='/assignments/view/list' component={AssignList} />
  </Switch>
</Main>
    );
  }
}
export default Body;
