import React from 'react';
import {Switch,Route} from 'react-router-dom'
import Banner from './Banner.js';
import Register from './register.js';
import Dashboard from './dashboard.js';
import DefaultQp from './questionpapers/DefaultQp.js'
import AssignUpload from './assignments/AssignUpload.js'
import AssignList from './assignments/AssignList.js'
import NotesUpload from './notes/NotesUpload.js'
import NotesList from './notes/NotesList.js'
import DefaultSyllabus from './syllabus/DefaultSyllabus.js'
import AnouncementsBoard from './anouncements/AnouncementsBoard.js'
import OtherSyllabus from './syllabus/OtherSyllabus.js'
import OtherQp from './questionpapers/OtherQp.js'
import TimeLine from './timeline/TimeLine.js'

export const Body =(props) => {
   console.log("from body" + props.width)
    return(
<main >
  <Switch>
    <Route exact path='/' render={()=>(<Banner {...props}/>)} />
    <Route path='/register' render={()=>(<Register {...props}/>)}/>
    <Route path='/dashboard' render={() =>(<Dashboard {...props}/>)}/>
    <Route path='/questionpaper/default' render={()=>(<DefaultQp {...props} />)}/>
    <Route path='/questionpaper/other' render={()=>(<OtherQp {...props} />)}/>
    <Route path='/syllabus/default' render={()=>(<DefaultSyllabus {...props} />)} />
    <Route path='/syllabus/other' render={()=>(<OtherSyllabus {...props} />)} />
    <Route path='/assignments/upload' render={()=>(<AssignUpload {...props} /> )} />
    <Route path='/assignments/view/list' render={()=>(<AssignList {...props} /> )} />
    <Route path='/notes/upload' render={()=>(<NotesUpload {...props} /> )} />
    <Route path='/notes/view/list' render={()=>(<NotesList {...props} /> )} />
    <Route path='/anouncements' render={()=>(<AnouncementsBoard {...props}/>)} />
    <Route path='/timeline' render={()=>(<TimeLine {...props}/>)} />
  </Switch>
</main>
    );
}
