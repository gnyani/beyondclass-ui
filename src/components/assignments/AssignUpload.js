import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {FileFileUpload} from '../../styledcomponents/SvgIcons.js'
import {notify} from 'react-notify-toast';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';
import styled from 'styled-components'
import UnauthorizedPage from '../UnauthorizedPage.js'

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class AssignUpload extends Component{

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
    if(this.state.value === 1 || this.state.file === '')
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
      <StayVisible
      {...this.props}
      >
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
          <p className="paragraph"> Please upload a pdf file </p>
          <br />
          <form className="Position" onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <FlatButton type="submit" label="Upload File" className="uploadbutton" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
      </div>
      <div className="AssignUpload">
      <br />
      <br />
      <div className="Position">
      {$imagePreview}
      </div>
      <br />
      <br />
      </div>
  </StayVisible>
    )
  }
  else{
    return(<UnauthorizedPage />)
  }
}
}
export default AssignUpload;
