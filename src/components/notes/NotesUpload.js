import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {notify} from 'react-notify-toast';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {FileFileUpload} from '../../styledcomponents/SvgIcons.js'
import UnauthorizedPage from '../UnauthorizedPage.js'
var properties = require('../properties.json');

class NotesUpload extends Component{

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      file: '',
      filebase64: '',
      imagePreviewUrl: '',
      buttonDisabled: false,
      response: ''
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
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
      fetch('http://'+properties.getHostName+':8080/user/notes/upload', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
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
      <Grid fluid>
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={7}>
    <div>
    <br  />
      <div className="QpSyllabusDefault NotesUpload">
      <Grid fluid>
        <Row around="xs">
        <Col xs={6} sm={6} md={6} lg={6}>
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
           </Col>
           </Row>
           </Grid>
          <p className="paragraph"> Please upload a pdf file </p>
          <form className="Position" onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <FlatButton type="submit" label="Upload File"  className="uploadbutton" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
      </div>
      <div className="NotesUpload">
      <br />
      <br />
      <div className="Position">
      {$imagePreview}
      </div>
      <br />
      <br />
      </div>
  </div>
  </Col>
  </Row>
  </Grid>
    )
  }else{
    return(<UnauthorizedPage />)
  }
}
}
export default NotesUpload;
