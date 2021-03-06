import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton'
import {notify} from 'react-notify-toast';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {FileFileUpload,AttachFile} from '../../../styledcomponents/SvgIcons.js'
import UnauthorizedPage from '../../UnauthorizedPage.js'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import SubjectAutoComplete from '../../utils/SubjectAutoComplete.js'
import CircularProgress from 'material-ui/CircularProgress'
import ListHandouts from './ListHandouts.js'

var properties = require('../../properties.json');

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
    border: "0.1vmin solid #30b55b",
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

class ShareHandouts extends Component{

  constructor(props) {
    super(props);
    this.state = {
      subject: 1,
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      buttonDisabled: false,
      response: '',
      comment: '',
      uploadStarted: false,
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
  }

  handleSubjectChange(subjectValue){
    this.setState({
      subject: subjectValue
    })
  }

handleCommentChange = (event) => {
  this.setState({
    comment: event.target.value,
  })
}


  _handleSubmit(e) {
    e.preventDefault();
    if(this.state.subject === 1 || this.state.file === '' || this.state.comment.trim() === '')
    {
    notify.show("please select a subject, add a comment and choose a file","warning")
    }
    else{
      this.setState({ buttonDisabled: true,uploadStarted: true });
      fetch('http://'+properties.getHostName+':8080/teacher/handouts/upload', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             batch: this.props.class,
             branch: this.props.branch,
             subject: this.state.subject,
             file : this.state.filebase64,
             comment: this.state.comment,
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
             batch: '',
             branch: '',
             subject: '',
             file: '',
             comment: '',
             uploadStarted: false,
           })
           notify.show("file upload successful","success")
         }).catch(response => {
         notify.show("Please login before uploading notes","error");
         this.context.router.history.push('/');
        });
    }
  }

  _handleImageChange = (e) => {
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

  showProgress = () => {
    var buffer =[]
    if(this.state.uploadStarted)
    {
      buffer.push(  <Grid fluid>
                    <Row center ="xs" middle="xs">
                    <Col xs>
                     <CircularProgress />
                     </Col>
                     <Col xs>
                     <h4>Loading ...</h4>
                     </Col>
                     </Row>
                      </Grid>)

    }

  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<iframe  title="preview pdf "src={imagePreviewUrl} className="iframe"/>);
    }
    if(this.props.userrole==="teacher")
    {
    return (
    <div>
    <br  /> <br />
      <Grid fluid>
        <Row center="xs" middle="xs">
        <Col xs={12} sm={12} md={4} lg={3}>
         <SubjectAutoComplete type="notes" branch={this.props.branch} handleSubjectChange={this.handleSubjectChange} />
        <br /><br />
        </Col>
        <Col xs={12} sm={12} md={4} lg={3}>
        <FlatButton
        label="Choose a PDF file"
        icon={<AttachFile />}
        containerElement="label"
        labelStyle={{textTransform: 'none'}}
        style={styles.uploadButton}
        >
        <input type="file" accept="application/pdf" style={styles.uploadInput} onChange={this._handleImageChange}/>
        </FlatButton>
        <br />
        </Col>
        </Row>
        </Grid>
        <br />
         <Grid fluid className="nogutter">
         <Row center="xs">
         <Col xs={12} sm={12} md={10} lg={8}>
         <TextField
         hintText="Add Comments to this Notes"
         value = {this.state.comment}
         onChange = {this.handleCommentChange}
         multiLine={true}
         rows={1}
         rowsMax={4}
         style={{width: '70%'}}
         />
         </Col>
         </Row>
         </Grid>
         <br />
         {this.showProgress()}
          <Grid fluid className="nogutter NotesUpload">
          <Row around="xs">
          <Col xs={12} sm={12} md={10} lg={8}>
          <form className="Position" onSubmit={this._handleSubmit}>
          <FlatButton type="submit" label="Upload File" labelStyle={{textTransform: 'none'}}
            style={{verticalAlign: 'middle',border: "0.05em solid #30b55b",color: "#30b55b",borderRadius: '1vmax'}}
             className="uploadbutton" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
          <br /><br />
          <Divider />
          </Col>
          </Row>
          </Grid>


      <div className="NotesUpload">
      <br />
      <div className="Position">
      {$imagePreview}
      </div>
      <br />
      </div>
      <div>
        <ListHandouts batch={this.props.class} userrole={this.props.userrole}/>
      </div>
  </div>
    )
  }else{
    return(<UnauthorizedPage />)
  }
}
}
ShareHandouts.contextTypes = {
    router: PropTypes.object
};
export default withRouter(ShareHandouts)
