import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {notify} from 'react-notify-toast';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';
import styled from 'styled-components'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class OtherSyllabus extends Component{

   constructor(){
     super();
     this.state={
       university: 1,
       college : 1,
       branch : 1,
       year : 0,
       sem : 0,
       subject : 1,
       response : '',
       isLoaded : ''
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
   }

   validateAndFetch(){
     console.log("value of sub is" + this.state.value)
     if(this.state.university === 1 || this.state.college === 1 || this.state.branch === 1 ||
        this.state.year === 0 || this.state.sem === 0 || this.state.subject === 1)
     {
       console.log("inside if")
       notify.show("please fill in all the mandatory fields which are followed by *");
     }
     else{
       console.log("in else")
       this.fetchSyllabus();
       notify.show("Retrieval successful","success");
     }
   }
   fetchSyllabus(){

     fetch('http://localhost:8080/user/syllabusurl/other', {
            method: 'POST',
            headers: {
                  'mode': 'cors',
                  'Content-Type': 'application/json'
              },
         credentials: 'include',
          body: JSON.stringify({
            university: this.state.university,
            college : this.state.college,
            branch : this.state.branch,
            year : this.state.year,
            sem : this.state.sem,
            subject : this.state.subject
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
            isLoaded : true
          })
          console.log(this.state.response)
        })
   }



   handleChange = (event, index, university) => this.setState({university});
   handleCollegeChange = (event, index, college) => this.setState({college});
   handleBranchChange = (event, index, branch) => this.setState({branch});
   handleYearChange = (event, index, year) => this.setState({year});
   handleSemChange = (event, index, sem) => this.setState({sem});
   handleSubjectChange = (event , index, subject) => this.setState({subject});

   render(){
     return(
    <StayVisible
    {...this.props}
    >
      <div className="Syllabus">
        <div >
        <br />
        <br />
        <br />
       <Paper zDepth={2} className="paper"  >
        <br />
        <h4 className="h4"> Select a subject </h4>
       <Grid>
       <Row is="start">
       <Cell is="middle 4 tablet-2 phone-2"><div>
        <DropDownMenu
          value={this.state.university}
          onChange={this.handleChange}
          autoWidth={true}
        >
          <MenuItem value={1} primaryText="University*" />
          <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
          <MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />
        </DropDownMenu>
        </div></Cell>
        <Cell is="3 tablet-2 phone-2"><div>
         <DropDownMenu
           value={this.state.college}
           onChange={this.handleCollegeChange}
           autoWidth={true}
         >
           <MenuItem value={1} primaryText="College*" />
           <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College of Engineering" />
           <MenuItem value={'CBIT'} label="CBIT" primaryText="Chaitanya Bharathi Institute of Technology" />
         </DropDownMenu>
         </div></Cell>
         <Cell is="4 tablet-2 phone-2"><div>
          <DropDownMenu
            value={this.state.branch}
            onChange={this.handleBranchChange}
            autoWidth={true}
          >
            <MenuItem value={1} primaryText="Branch*" />
            <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
            <MenuItem value={'ECE'} label="ECE" primaryText="Electricals and Electronics Communication" />
          </DropDownMenu>
          </div></Cell>
        </Row>
        </Grid>
<Divider />
      <Grid>
      <Row is="start">
      <Cell is="middle 4 tablet-2 phone-2"><div>
       <DropDownMenu
         value={this.state.year}
         onChange={this.handleYearChange}
         autoWidth={true}
       >
         <MenuItem value={0} primaryText="Year*" />
         <MenuItem value={1} label="1" primaryText="1st Year" />
         <MenuItem value={2} label="2" primaryText="2nd Year" />
         <MenuItem value={3} label="3" primaryText="3rd Year" />
         <MenuItem value={4} label="4" primaryText="4th Year" />
       </DropDownMenu>
       </div></Cell>

      <Cell is="3 tablet-2 phone-2"><div>
      <DropDownMenu
       value={this.state.sem}
       onChange={this.handleSemChange}
       autoWidth={true}
      >
       <MenuItem value={0} primaryText="Semester*" />
       <MenuItem value={1} label="Sem-1" primaryText="Sem-1" />
       <MenuItem value={2} label="Sem-2" primaryText="Sem-2" />
      </DropDownMenu>
      </div></Cell>
      <Cell is="4 tablet-2 phone-2"><div>
      <DropDownMenu
        value={this.state.subject}
        onChange={this.handleSubjectChange}
        autoWidth={true}
      >
        <MenuItem value={1} primaryText="Subject*" />
        <MenuItem value={'DS'} label="DS" primaryText="DS" />
        <MenuItem value={'OS'} label="OS" primaryText="OS" />
        <MenuItem value={'DM'} label="DM" primaryText="DM" />
      </DropDownMenu>
      </div></Cell>
      </Row>
      </Grid>
<Divider />
        <RaisedButton label="Fetch" value="Fetch" primary={true} onTouchTap={this.validateAndFetch} className="button" />
        <br />

        </Paper>
        </div>
         <br /> <br /> <br /> <br />
     <iframe src = {this.state.response} title="pdf syllabus" className="iframe" ></iframe>
     </div>
     </StayVisible>
     )
   }

}

export default  OtherSyllabus;
