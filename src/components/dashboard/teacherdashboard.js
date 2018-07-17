import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import {notify} from 'react-notify-toast';
import DisplayBatches from './DisplayBatches'
import Badge from 'material-ui/Badge';
import People from 'material-ui/svg-icons/social/people.js'

var properties = require('../properties.json');

class TeacherDashboard extends Component{

  constructor(props){
    super(props);
    this.state={
      selected: '',
      addClassDialog: false,
      year: "Select*",
      section: "0",
    }
    this.isActive = this.isActive.bind(this)
  }
  onChangeSelected(value){
    this.setState({
      selected: value
    })
  }

 handleSectionChange = (e, index, value) => {
   this.setState({
     section: value,
   })
 }

  handleYearChange = (e, index, value) => {
    this.setState({
      year : value,
    })
  }

  openDialog = () => {
    this.setState({
      addClassDialog: true,
    })
  }

  isActive(value){
      return (value === this.state.selected)?'Active':'';
  }

  addClass = () => {
    var batch = this.state.year+'-'+this.state.section
    if(this.state.year === "Select*" || this.state.section === "0"){
      notify.show("Please select both start year and section", "warning")
    }else if(this.props.batches.includes(batch)){
      notify.show("You cannot add the same batch", "warning")
    }
    else{
      fetch('http://'+properties.getHostName+':8080/teacher/addclass', {
             method: 'POST',
             headers: {
                   'mode': 'cors',
                   'Content-Type': 'application/json'
               },
           credentials: 'include',
           body: JSON.stringify({
             year: this.state.year,
             section: this.state.section,
           })
         }).then(response => {
           if(response.status === 200){
             notify.show("Batch added successfully","success")
             return response
           }else{
             notify.show("Something went wrong","error")
           }
         }).then(response => {
           if(response.status === 200){
            window.location.reload()
           }
        })
    }
  }

  menuItems(batches) {
    return batches.map((batches,index) => (
    <div key={index}>  <div  className={this.isActive(this.props.batches[index])}>
         <Link to={'/teacher/'+this.props.batches[index]}  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,this.props.batches[index])} >
          <MenuItem
          primaryText={'Class  '+this.props.batches[index]}
          innerDivStyle={{
            paddingTop: "5px",
          }}
          rightIcon={
            <Badge
             badgeContent={this.props.studentCountList[batches]}
             primary={true}
             badgeStyle={{ width: "24px", height: "24px", backgroundColor: '#30b55b'}}
             style={{
               padding: "0px 24px 12px 12px"
             }}
           >
             <People color='#39424d' viewBox="0 0 30 30"/>
           </Badge>}
          onClick={this.props.handleMobileToggle}
          className="drawerFont"
           />
           </Link>
           </div>
      </div>
    ));
  }

  handleClose = () => {
    this.setState({
     addClassDialog: false,
    })
  }

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.addClass}
      />]
    return(
      <div>
        {this.menuItems(this.props.batches)}
        <FlatButton type="button" label="Add Batch" fullWidth={true}
          icon={<Add color="#30b55b"/>} labelStyle={{textTransform: 'none'}}
          className="drawerFont" onClick={this.openDialog}/>
          <Dialog
                title="Select batch to add"
                modal={false}
                actions={actions}
                style={{marginLeft: "25%", width: "50%"}}
                open={this.state.addClassDialog}
                titleStyle={{textAlign:"center",color: "rgb(162,35,142)"}}
                onRequestClose={this.handleClose}
              >
            <DisplayBatches key={this.state.year} year={this.state.year}
              section={this.state.section}
              handleSectionChange={this.handleSectionChange}
              handleYearChange={this.handleYearChange} />
          </Dialog>
      </div>
    )
  }
}
export default TeacherDashboard;
