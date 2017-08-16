import React,{Component} from 'react'
import { Grid, Row, Cell } from 'react-inline-grid'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import {notify} from 'react-notify-toast'
import {FileFileUpload,NavigationClose} from '../../styledcomponents/SvgIcons.js'
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import {lightBlue300,redA700} from 'material-ui/styles/colors';
import {FileFileDownload} from '../../styledcomponents/SvgIcons.js'
import Dialog from 'material-ui/Dialog'

var properties = require('../properties.json');

class TeacherAssignmentUpload extends Component{

constructor(){
  super();
  this.state={
    value: 1,
    imagePreviewUrl:'',
    buttonDisabled: false,
    links: [],
    fileNames: [],
    filebase64: '',
    teacherclass: '',
    DialogconfirmDelete: false,
    currentIndex: '',
  }
  this._handleImageChange = this._handleImageChange.bind(this);
  this._handleSubmit = this._handleSubmit.bind(this);
  this.deletePost = this.deletePost.bind(this);
}
handleChange = (event, index, value) => this.setState({value});


_handleSubmit(e) {
  e.preventDefault();
  if(this.state.value === 1)
  {
  notify.show("please select a subject")
  }
  else{
    this.setState({ buttonDisabled: true });
    fetch('http://'+properties.getHostName+':8080/teacher/assignments/upload', {
           method: 'POST',
           headers: {
                 'mode': 'cors',
                 'Content-Type': 'application/json'
             },
         credentials: 'include',
         body: JSON.stringify({
           teacherclass: this.props.class,
           subject: this.state.value,
           file : this.state.filebase64,
        })
       }).then(response => {
         if(response.status === 200)
         {
            return response.text();
         }
         else{
           let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
           notify.show("sorry something went wrong","custom",5000,myColor)
         }
       }).then(response => {
         this.setState({
           response : response,
           buttonDisabled  : false,
           imagePreviewUrl: '',
           file: ''
         },this.getAssignments())
         notify.show("file upload successful","success")
       })
  }
}
componentWillMount(){
  this.getAssignments()
}
deletePostConfirm(i){
  this.setState({
    DialogconfirmDelete: true,
    currentIndex: i,
  })
}
list(buffer){
  for(let i=0; i<this.state.links.length; i++){
    buffer.push( <Cell is="7 tablet-7" key={i}><div>
         <Card
         style={{borderRadius:"2em"}}
         onExpandChange={this.deletePostConfirm.bind(this,i)}
         >
           <CardHeader
             title="Uploaded By"
             subtitle={this.state.links[i].split('-')[5]}
             showExpandableButton={true}
             closeIcon={<NavigationClose color={redA700}/>}
             openIcon={<NavigationClose color={redA700}/>}
           />
           <CardMedia>
             <img  title="assignments" alt="" src={this.state.links[i]} className="iframe"/>
           </CardMedia>
           <CardTitle title={this.state.links[i].split('-')[6]} subtitle="assignment" />
           <CardActions>
             <form method="post" action={this.state.links[i]+"/download"}>
             <FlatButton type="submit" label="Download" style={{width:"80%"}} icon={<FileFileDownload color={lightBlue300} />}/>
             </form>
           </CardActions>
         </Card>
      </div></Cell>
  )
  }
  return buffer;
}
getAssignments(){
  fetch('http://'+properties.getHostName+':8080/teacher/assignmentslist', {
         method: 'POST',
         headers: {
               'mode': 'cors',
               'Content-Type': 'application/json'
           },
       credentials: 'include',
       body: JSON.stringify({
         teacherclass: this.props.class,
      })
     }).then(response => {
       if(response.status === 200)
       {
          return response.json();
       }
       else{
         let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
         notify.show("sorry something went wrong","custom",5000,myColor)
       }
     }).then(response => {
       var newfileNames=[]
       for(let i=0;i<response.length;i++){
         newfileNames.push(response[i].split('/').pop())
       }
       this.setState({
         links : response,
         fileNames: newfileNames,
       })
    })
}
deletePost(){
  fetch('http://'+properties.getHostName+':8080/teacher/assignments/'+this.state.fileNames[this.state.currentIndex]+'/delete',{
    credentials: 'include',
    method: 'GET'
  }).then(response => {
    if(response.status===200)
    return response.text()
  }).then(response =>{
    if(response === "successfully deleted")
    {
     notify.show(response,"success")
     this.getAssignments()
   }
   else{
     notify.show("sorry something went wrong please try again","error")
   }
   })
   this.setState({
     DialogconfirmDelete: false
   })
}

_handleImageChange(e) {
  e.preventDefault();

  let reader = new FileReader();
  let file = e.target.files[0];

  reader.onloadend = () => {
    this.setState({
      file: file,
      imagePreviewUrl: reader.result,
      filebase64: reader.result.split(',').pop()
    });
  }

  reader.readAsDataURL(file)
}
handleClose = () => {
  this.setState({DialogconfirmDelete: false});
};

  render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img  title="preview pdf" src={imagePreviewUrl} alt="" className="imagepreview"/>);
    }
    const actions1 = [
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.deletePost}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ]
   var buffer =[];
    return(
      <div>
      <br /><br />
      <div className="QpSyllabusDefault AssignUpload">
        <Grid>
          <Row is="center">
          <Cell is="6 tablet-6 phone-6"><div>
           <SelectField
             floatingLabelText="Subject*"
             value={this.state.value}
             onChange={this.handleChange}
             style={{width:"80%"}}
           >
             <MenuItem value={1} primaryText="Select" />
             <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
             <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
           </SelectField>
           </div></Cell>
           </Row>
           </Grid>
          <br />
          <form className="Position" onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <FlatButton type="submit" label="Upload File" className="uploadbutton" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
      </div>
      <div className="announcements">
      <br />
      <br />
      <div>
      {$imagePreview}
      </div>
      <br />
      </div>
<Divider />
      <div className="announcements">
        <p className="paragraph"> Your uploads </p>
        <Grid>
        <Row is="center">
         {this.list(buffer)}
        </Row>
        </Grid>
      </div>
      <Dialog
            title="Are you sure you want to delete this post"
            modal={false}
            actions={actions1}
            open={this.state.DialogconfirmDelete}
            autoScrollBodyContent={true}
            titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
            onRequestClose={this.handleClose}
          >
      </Dialog>
      </div>
    )
  }
}

export default TeacherAssignmentUpload;
