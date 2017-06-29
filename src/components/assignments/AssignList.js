import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {notify} from 'react-notify-toast';
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import GridUI from 'material-ui/Grid';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { Grid, Row, Cell } from 'react-inline-grid';


const styleSheet = createStyleSheet('AssignList', theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
}));

class AssignList extends Component{

  constructor(){
    super();
    this.state={
      links: [],
      subject: 1,
      buttonDisabled: false,
      isLoaded: false,
      username: '',
      gutter: '16',
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
     fetch('http://localhost:8080/user/assignmentslist', {
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
          }
        }).then(response => {
          console.log("response text is" + response)
          this.setState({
            links : response.slice(),
            buttonDisabled  : false,
            isLoaded : true
          })
          notify.show("file upload successful","success")
          console.log("response sliced is " + response.slice())
          console.log(this.state.links[1])
        })
   }

 }
 handleChange = (event, index, subject) => this.setState({subject});
  render(){

    const classes = this.props.classes;
    const { gutter } = this.state;

   return(
  <div>
     <br  />
     <p style={{marginLeft:'140px'}} > choose subject of assignment </p>
     <Grid>
     <Row is="center">
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
       <RaisedButton type="submit" label="View" style={{marginLeft:'150px'}} disabled={this.state.buttonDisabled} onClick={this.handleSubmit} />
     <br />
     <br />
<Divider />
     <div style={{display:'flex',alignItems: 'flex-start'}}>
     <Grid container className={classes.root}>
             <Grid item xs={12}>
               <Grid container className={classes.demo} justify="center" gutter={Number(gutter)}>
     {this.state.links.map((src, index) => (
          <Grid key={index} item>
           <Card >
             <CardHeader
               title="Uploaded By"
               subtitle={this.state.username}
             />
             <CardMedia>
               <iframe  title="assignments" src={src} />
             </CardMedia>
             <CardTitle title={this.state.subject} subtitle="assignment" />
             <CardActions>
               <RaisedButton label="Download" />
               <RaisedButton label="View" />
             </CardActions>
           </Card>
         </Grid>
    ))}
    </Grid>
     </Grid>
     </Grid>
    </div>

   </div>
   )
  }
}

export default AssignList;
