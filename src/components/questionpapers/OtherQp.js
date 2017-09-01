import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import {notify} from 'react-notify-toast';
import {lightBlue300} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import {FileFileDownload,NavigationFullscreen,NavigationArrowBack,NavigationArrowForward} from '../../styledcomponents/SvgIcons.js';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Cell } from 'react-inline-grid';
import '../../styles/student-adda.css';
import Slider from 'react-slick';
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import UnauthorizedPage from '../UnauthorizedPage.js';

var properties = require('../properties.json');

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class OtherQp extends Component{

   constructor(){
     super();
     this.state={
       university: 1,
       college : 1,
       branch : 1,
       year : 0,
       sem : 0,
       subject : 1,
       qpyear : 1,
       response : '',
       isLoaded : '',
       image: [],
       photoIndex: 0,
       currentSlide: 0,
       isOpen: false
     }
     this.validateAndFetch = this.validateAndFetch.bind(this);
     this.image = this.image.bind(this);
     this.next = this.next.bind(this)
     this.previous = this.previous.bind(this)
     this.previousButton = this.previousButton.bind(this);
     this.nextButton = this.nextButton.bind(this);
   }

   validateAndFetch(){
     if(this.state.university === 1 || this.state.college === 1 || this.state.branch === 1 ||
        this.state.year === 0 || this.state.sem === 0 || this.state.subject === 1 || this.state.qpyear === 1)
     {
       notify.show("please fill in all the mandatory fields which are followed by *");
     }
     else{
       this.fetchQp();
     }
   }
   fetchQp(){

     fetch('http://'+properties.getHostName+':8080/user/questionpaperurl/other', {
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
            subject : this.state.subject,
            qpyear : this.state.qpyear
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
            isLoaded : true
          },function(){
            this.image()
          })
        })
   }



   handleChange = (event, index, university) => this.setState({university});
   handleCollegeChange = (event, index, college) => this.setState({college});
   handleBranchChange = (event, index, branch) => this.setState({branch});
   handleYearChange = (event, index, year) => this.setState({year});
   handleSemChange = (event, index, sem) => this.setState({sem});
   handleSubjectChange = (event , index, subject) => this.setState({subject});
   handleQpyearChange = (event, index, qpyear) => this.setState({qpyear});
   image(){
     if(this.state.response){
       var x = []
       var obj = new Image();
         obj.src = this.state.response
         obj.onerror = () => {
           x.push(<p key={new Date()}>Sorry no records found for this subject</p>)
          notify.show("No Records found for this subject","warning")
           this.setState({
             image: x.slice(),
           })
         }

         obj.onload = () => {
           x.push(
             <Cell is="7 tablet-7" key={new Date()}><div>
               <Card
               style={{borderRadius:"1.5em"}}
               >
                 <CardHeader
                   title={this.state.subject}
                   subtitle="Question Paper"
                 />
                 <CardMedia>
                    <img alt="loading" src ={obj.src} className="image" />
                 </CardMedia>
                 <CardActions>
                   <div >
                   <Grid>
                   <Row is="start">
                   <Cell is="stretch 6 tablet-6"><div>
                   <form method="post" action={obj.src+"/download"}>
                   <FlatButton type="submit" label="Download" fullWidth={true} icon={<FileFileDownload color={lightBlue300} />}/>
                   </form>
                   </div></Cell>
                   <Cell is="stretch 6 tablet-6"><div>
                   <FlatButton type="submit" label="Full View" fullWidth={true}  onClick={() => this.setState({ isOpen: true })} icon={<NavigationFullscreen color={lightBlue300} />}/>
                   </div></Cell>
                   </Row>
                   </Grid>
                   </div>
                 </CardActions>
               </Card>
               </div></Cell>
             )
           this.setState({
             image: x.slice(),
           })
                  notify.show("Retrieval successful","success");
         }
      }
   }

   next() {
      this.slider.slickNext()
    }
    previous() {

      this.slider.slickPrev()
    }
   previousButton(){
   var buffer=[];
     if(this.state.currentSlide === 0)
     {
       buffer = [];
     }else{
       buffer.push(<FlatButton key={new Date()} label="Previous" labelStyle={{textTransform: "none"}} icon={<NavigationArrowBack color="white"/>}
                  className="previousButton" onClick={this.previous} />);
     }
     return buffer;
    }
   nextButton(){
    var buffer=[];
   if(this.state.currentSlide === 1)
   {
     buffer.push(  <FlatButton key={new Date()} label="Fetch" value="Fetch" primary={true} labelStyle={{textTransform: "none"}} labelPosition="before" onTouchTap={this.validateAndFetch} className="nextButton" icon={<NavigationArrowForward color="white"/>}/>)
   }
   else{
     buffer.push(  <FlatButton key={new Date()} label="Next" labelStyle={{textTransform: "none"}} labelPosition="before" icon={<NavigationArrowForward color="white"/>}
                 className="nextButton" onClick={this.next} />)
   }
   return buffer;
   }

   render(){

     var settings = {
       dots: true,
       infinite: false,
       arrows: false,
     };

   if(this.props.userrole==="student")
   {
     return(
    <StayVisible
    {...this.props}
   >
   <br /><br />
    <div className="QpSyllabusDefault">
    <Slider ref={c => this.slider = c } {...settings} afterChange={(currentSlide) => {
        this.setState({ currentSlide: currentSlide  })
      }}>
    <div className="QuestionPapers">
       <Grid>
       <Row is="start">
       <Cell is="top 6 tablet-6 phone-6"><div>
        <SelectField
          floatingLabelText="University*"
          value={this.state.university}
          onChange={this.handleChange}
          style={{width:"80%"}}
        >
          <MenuItem value={1} primaryText="Select" />
          <MenuItem value={'OU'} label="OU" primaryText="Osmania University" />
          <MenuItem value={'JNTU'} label="JNTU" primaryText="JNTU" />
        </SelectField>
        </div></Cell>
        <Cell is="6 tablet-6 phone-6"><div>
         <SelectField
         floatingLabelText="College*"
           value={this.state.college}
           onChange={this.handleCollegeChange}
           style={{width:"80%"}}
         >
           <MenuItem value={1} primaryText="Select" />
           <MenuItem value={'VASV'} label="VASV" primaryText="Vasavi College of Engineering" />
           <MenuItem value={'CBIT'} label="CBIT" primaryText="Chaitanya Bharathi Institute of Technology" />
         </SelectField>
         </div></Cell>
         </Row>
         </Grid>
         <Grid>
         <Row>
          <Cell is="6 tablet-6 phone-6"><div>
           <SelectField
            floatingLabelText = "Branch*"
             value={this.state.branch}
             onChange={this.handleBranchChange}
             style={{width:"80%"}}
           >
             <MenuItem value={1} primaryText="Select" />
             <MenuItem value={'CSE'} label="CSE" primaryText="Computer Science and Engineering" />
             <MenuItem value={'ECE'} label="ECE" primaryText="Electricals and Electronics Communication" />
           </SelectField>
           </div></Cell>
           <Cell is="middle 6 tablet-6 phone-6"><div>
            <SelectField
            floatingLabelText="Year *"
              value={this.state.year}
              onChange={this.handleYearChange}
              style={{width:"80%"}}
            >
              <MenuItem value={0} primaryText="Select" />
              <MenuItem value={1} label="1" primaryText="1st Year" />
              <MenuItem value={2} label="2" primaryText="2nd Year" />
              <MenuItem value={3} label="3" primaryText="3rd Year" />
              <MenuItem value={4} label="4" primaryText="4th Year" />
            </SelectField>
            </div></Cell>
            </Row>
            </Grid>
            </div>
            <div className="QuestionPapers">
            <Grid>
            <Row is="start">
              <Cell is="6 tablet-6 phone-6"><div>
              <SelectField
              floatingLabelText="Semester*"
               value={this.state.sem}
               onChange={this.handleSemChange}
               style={{width:"80%"}}
              >
               <MenuItem value={0} primaryText="Select" />
               <MenuItem value={1} label="Sem-1" primaryText="Sem-1" />
               <MenuItem value={2} label="Sem-2" primaryText="Sem-2" />
              </SelectField>
              </div></Cell>
              <Cell is="6 tablet-6 phone-6"><div>
              <SelectField
              floatingLabelText="Subject*"
                value={this.state.subject}
                onChange={this.handleSubjectChange}
                style={{width:"80%"}}
              >
                <MenuItem value={1} primaryText="Select" />
                <MenuItem value={'OS'} label="OS" primaryText="OS" />
                <MenuItem value={'DM'} label="DM" primaryText="DM" />
              </SelectField>
              </div></Cell>
              </Row>
              </Grid>
              <Grid>
               <Row is="start">
               <Cell is="6 tablet-6 phone-6"><div>
               <SelectField
               floatingLabelText="QuestionPaperYear*"
                value={this.state.qpyear}
                onChange={this.handleQpyearChange}
                style={{width:"80%"}}
               >
                <MenuItem value={1} primaryText="Select" />
                <MenuItem value={'2015'} label="2015" primaryText="2015" />
                <MenuItem value={'2016'} label="2016" primaryText="2016" />
               </SelectField>
               </div></Cell>
               </Row>
               </Grid>
              </div>
      </Slider>
      <div className="register" >
      {this.previousButton()}
       {this.nextButton()}
       </div>
      </div>

     <div>

         <br />
         <Grid>
         <Row is="center">
         {this.state.image}
         </Row>
         </Grid>
     </div>
  </StayVisible>
     )
   }
   else{
     return(<UnauthorizedPage />)
   }
}
}

export default  OtherQp;
