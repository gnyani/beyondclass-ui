import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import {notify} from 'react-notify-toast';
import DisplayBatches from './DisplayBatches'
import {List, ListItem} from 'material-ui/List'
import LibraryBooks from 'material-ui/svg-icons/av/library-books.js'
import Public from 'material-ui/svg-icons/social/public.js'
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

  getColor = (view) => {
    var buffer
    if(view === "Active" )
     buffer = '#30b55b'

    return buffer
  }

  menuItems(batches) {
  var buffer = []
    for(var index=0; index < this.props.batches.length; index++){
      buffer.push(
           <Link to={'/teacher/'+this.props.batches[index]}  key={index}
             width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,this.props.batches[index])} >
            <MenuItem
            className={this.isActive(this.props.batches[index])}
            primaryText={'Class  '+this.props.batches[index]}
            innerDivStyle={{
              paddingTop: "5px",
            }}
            rightIcon={
              <Badge
               badgeContent={this.props.studentCountList[this.props.batches[index]]}
               primary={true}
               badgeStyle={{ width: "24px", height: "24px", backgroundColor: '#30b55b'}}
               style={{
                 padding: "0px 24px 12px 12px"
               }}
             >
               <People color={this.getColor(this.isActive(this.props.batches[index]))} viewBox="0 0 30 30"/>
             </Badge>}
            onClick={this.props.handleMobileToggle}
             />
             </Link>
      )
    }
    buffer.push(<MenuItem  primaryText="Add Batch" key={this.props.batches.length + 1} fullWidth={true}
              leftIcon={<Add />} className="drawerFont" onClick={this.openDialog}/>)
    return buffer;
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
        <Link to={'/teachernetwork'} style={{ textDecoration: 'none' }}>
          <MenuItem  primaryText={<p style={{height:'0.7em'}}>TeacherNetwork <sup style={{color: '#30b55b'}}>BETA</sup></p>}
            className={this.isActive('network')}
            onClick={this.onChangeSelected.bind(this,'network')}
            leftIcon={<Public color={this.getColor(this.isActive('network'))}/>}   />
        </Link>
        <List >
          <ListItem
              primaryText="Batches"
              className={this.isActive('batches')}
              leftIcon={<LibraryBooks color={this.getColor(this.isActive('batches'))}/>}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              onClick={this.onChangeSelected.bind(this,'batches')}
              nestedItems={this.menuItems(this.props.batches)}
            />
        </List>
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
