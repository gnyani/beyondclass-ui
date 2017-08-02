import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import { Grid, Row, Cell } from 'react-inline-grid';
import styled from 'styled-components'
var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`


class AssignList extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      subject: 1,
      buttonDisabled: false,
      isLoaded: false,
      username: '',
      usermsg: '',
      loadedsubject: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 handleSubmit(){

   if(this.state.subject === 1)
   {
   notify.show("please select a subject")
   }
   else{
     this.setState({ buttonDisabled: true });
     fetch('http://'+properties.getHostName+':8080/user/assignmentslist', {
            method: 'POST',
            headers: {
                  'mode': 'cors',
                  'Content-Type': 'application/json'
              },
          credentials: 'include',
          body: JSON.stringify({
            subject: this.state.subject
         })
        }).then(response => {
          if(response.status === 200)
          {
             return response.json();
          }
          else{
            let myColor = { background: '#0E1717', text: "#FFFFFF",zDepth:'20'};
            notify.show("sorry something went wrong","custom",5000,myColor)
            this.setState({
              usermsg : 'sorry something went wrong',
              isLoaded: true
            })
          }
        }).then(response => {
          this.setState({
            links : response.slice(),
            buttonDisabled  : false,
            isLoaded : true,
            loadedsubject : this.state.subject,
          })
          if(this.state.links.length===0)
          this.setState({
            usermsg : 'No files for this subject were found',
            isLoaded: true
          })
          notify.show("file upload successful","success")
        })
   }

 }
 handleChange = (event, index, subject) => this.setState({subject});
  render(){

   return(
<StayVisible
{...this.props}
>
  <div style={{textAlign:'center',marginLeft:'18%',width:'60%'}}>
     <br  />
     <p > choose subject of assignment </p>
     <Grid>
     <Row is="start">
     <Cell is="middle 4 tablet-2"><div>
     <label>  Subject: </label>
     </div></Cell>
     <Cell is="3 tablet-2 phone-2"><div>
      <DropDownMenu
        value={this.state.subject}
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
       <RaisedButton type="submit" label="View"  disabled={this.state.buttonDisabled} onClick={this.handleSubmit} />
     <br />
     <br />
<Divider />
     <div>
     <Grid>
     <Row is="start">
     {this.state.links.map((src, index) => (
       <Cell is="6 tablet-2"><div>
           <Card >
             <CardHeader
               title="Uploaded By"
               subtitle={src.split('-').pop()}
             />
             <CardMedia>
               <iframe  title="assignments" src={src} />
             </CardMedia>
             <CardTitle title={this.state.loadedsubject} subtitle="assignment" />
             <CardActions>
               <div style={{display:'flex'}}>
               <form method="post" action={src+"/download"}>
               <RaisedButton type="submit" label="Download" />
               </form>
               <form method="post" action={src}>
               <RaisedButton type="submit" label="View" style={{marginLeft:'120%'}}/>
               </form>
               </div>
             </CardActions>
           </Card>
        </div></Cell>
    ))}
    </Row>
    </Grid>
    {this.state.usermsg}
    </div>
   </div>
  </StayVisible>
   )
  }
}
export default AssignList;
