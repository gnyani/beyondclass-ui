import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';
import styled from 'styled-components'

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
    // TODO: do something with -> this.state.file
    console.log("filebase64" + this.state.filebase64)
    if(this.state.value === 1)
    {
    notify.show("please select a subject")
    }
    else{
      console.log("file is" + this.state.file)
      this.setState({ buttonDisabled: true });
      fetch('http://localhost:8080/user/assignments/upload', {
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
           console.log("response text is" + response)
           this.setState({
             response : response,
             buttonDisabled  : false,
             imagePreviewUrl: '',
             file: ''
           })
           notify.show("file upload successful","success")
           console.log(this.state.response)
         })
    }
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      console.log("inside reader load end")
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

    return (
      <StayVisible
      {...this.props}
      >
      <div className="AssignUpload">
          <br  />
          <p > choose subject of assignment </p>
          <Grid>
          <Row is="center">
          <Cell is="middle 4 tablet-2"><div>
          <label>  Subject: </label>
          </div></Cell>
          <Cell is="3 tablet-2 phone-2"><div>
           <DropDownMenu
             value={this.state.value}
             onChange={this.handleChange}
             autoWidth={true}
           >
             <MenuItem value={1} primaryText="Select*" />
             <MenuItem value={'OS'} label="OS" primaryText="Operating Systems" />
             <MenuItem value={'DM'} label="DM" primaryText="Data Mining" />
           </DropDownMenu>
           </div></Cell>
           </Row>
           </Grid>
<Divider />
          <br />
          <p > Please upload a pdf file </p>
          <br />
          <form onSubmit={this._handleSubmit}>
          <input type="file" onChange={this._handleImageChange} />
          <RaisedButton type="submit" label="Upload File"  disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
          </form>
          <div className="AssignUpload">
          <br />
          <br />
          {$imagePreview}
          </div>
      </div>
  </StayVisible>
    )
  }

}
export default AssignUpload;
