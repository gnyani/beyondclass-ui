import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import {FileFileUpload,AttachFile} from '../../styledcomponents/SvgIcons.js'
import {notify} from 'react-notify-toast'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Divider from 'material-ui/Divider'
import SubjectAutoCompleteForNotesAndAssign from '../utils/SubjectAutoCompleteForNotesAndAssign.js'
import '../../styles/student-adda.css'
import UnauthorizedPage from '../UnauthorizedPage.js'

var properties = require('../properties.json');

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
    border: "0.1vmin solid #4DD0E1",
    borderRadius: '1vmax'
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


class AssignUpload extends Component{

  constructor(props) {
    super(props);
    this.state = {
      subject: 1,
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      buttonDisabled: false,
      response: ''
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleSubjectChange(subjectValue){
    console.log("subject value is" +subjectValue)
    this.setState({
      subject: subjectValue
    })
  }


  _handleSubmit(e) {
    e.preventDefault();
    if(this.state.subject === 1 || this.state.file === '')
    {
    notify.show("please select a subject and choose a file","error")
    }
    else{
      this.setState({ buttonDisabled: true });
      fetch('http://'+properties.getHostName+':8080/user/assignments/upload', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             subject: this.state.subject,
             file : this.state.filebase64,
          })
         }).then(response => {
           if(response.status === 201)
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
           })
           notify.show("file upload successful","success")
         })
    }
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

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<iframe  title="preview pdf "src={imagePreviewUrl} className="iframe"/>);
    }
 if(this.props.userrole==="student")
 {
    return (
      <div>
      <br /><br />
        <Grid fluid className="nogutter">
          <Row center="xs" middle="xs">
          <Col xs={12} sm={12} md={4} lg={3}>
           <SubjectAutoCompleteForNotesAndAssign branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
          <br /> <br />
           </Col>
           <Col xs={12} sm={12} md={4} lg={3}>
           <FlatButton
           label="Choose a PDF file"
           icon={<AttachFile />}
           primary={true}
           style={styles.uploadButton}
           containerElement="label"
           >
           <input type="file" accept="application/pdf" style={styles.uploadInput} onChange={this._handleImageChange}/>
           </FlatButton>
           </Col>
           </Row>
           </Grid>
          <br />
          <Grid fluid className="nogutter">
          <Row center="xs">
          <Col xs={12} sm={12} md={10} lg={8}>
          <form className="Position AssignUpload" onSubmit={this._handleSubmit}>
          <FlatButton type="submit" label="Upload File" className="uploadbutton" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
          <br /><br />
          <Divider />
          </Col>
          </Row>
          </Grid>
      <div className="AssignUpload">
      <br />
      <br />
      <div className="Position">
      {$imagePreview}
      </div>
      <br />
      <br />
      </div>
  </div>
    )
  }
  else{
    return(<UnauthorizedPage />)
  }
}
}
export default AssignUpload;
