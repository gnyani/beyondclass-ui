import React,{Component} from 'react'
import styled from 'styled-components'
import {Media} from '../utils/Media'
import TextField from 'material-ui/TextField'
import {Grid,Row,Col} from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import AttachFile from 'material-ui/svg-icons/editor/attach-file'
import FileFileUpload from 'material-ui/svg-icons/file/file-upload'
import {notify} from 'react-notify-toast'

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

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class ReportIssue extends Component{

  constructor(){
    super()
    this.state  = {
      message: '',
      file: '',
      imagePreviewUrl: '',
      filebase64: '',
      buttonDisabled: false,
    }
  }

  handleChange = (event) => {
    this.setState({
      message: event.target.value,
    })
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

  _handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.message.trim() === '')
    {
    notify.show("please add some description about the issue","warning")
    }
    else{
      this.setState({ buttonDisabled: true });
      fetch('http://'+properties.getHostName+':8080/user/report/issue', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             email: this.props.loggedinuser,
             file : this.state.filebase64,
             message: this.state.message,
          })
         }).then(response => {
           if(response.status === 200)
           {
              return response.text();
           }else if(response.status === 302){
             this.context.router.history.push('/')
           }
           else{
             let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
             notify.show("sorry something went wrong","custom",5000,myColor)
           }
         }).then(response => {
           this.setState({
             buttonDisabled  : false,
             imagePreviewUrl: '',
             file: '',
             message: '',
           })
           notify.show("Thank you for reporting the issue","success")
         })
    }
  }

  render(){
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img  alt="loading" src={imagePreviewUrl} className="image"/>);
    }
    return(
      <StayVisible
      {...this.props}
      >
      <div className="report-issue">
      <Grid fluid>
      <Row center = "xs">
      <Col xs>
      <p className="heading"> Hello  {this.props.loggedinuser}</p>
      <br />
      <TextField
      hintText="Description about the issue"
      value = {this.state.message}
      onChange = {this.handleChange.bind(this)}
      multiLine={true}
      rows={1}
      rowsMax={4}
      style={{width:'60%'}}
      />
      </Col>
      </Row>
      <br />
      <Row center="xs">
      <Col xs>
      <FlatButton
      label="Attach a Screen Shot"
      icon={<AttachFile />}
      primary={true}
      style={styles.uploadButton}
      containerElement="label"
      >
      <input type="file" accept="image/*" style={styles.uploadInput} onChange={this._handleImageChange}/>
      </FlatButton>
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <br />
      <form  onSubmit={this._handleSubmit}>
      <FlatButton type="submit" label="Submit"  className="submit" icon={<FileFileUpload color="white"/>} disabled={this.state.buttonDisabled} onClick={this._handleSubmit} />
      </form>
      </Col>
      </Row>
      <Row center="xs">
      <Col xs>
      <br />
      <div>
      {$imagePreview}
      </div>
      </Col>
      </Row>
      </Grid>
      </div>
      </StayVisible>
    )
  }
}

export default ReportIssue
