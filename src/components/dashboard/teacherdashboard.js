import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Add from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import DisplayBatches from './DisplayBatches'
import {LocationCity} from '../../styledcomponents/SvgIcons.js'
import Badge from 'material-ui/Badge';
import People from 'material-ui/svg-icons/social/people.js'


class TeacherDashboard extends Component{

  constructor(props){

    super(props);
    this.state={
      selected: '',
      addClassDialog: false,
      year: 0,
      section: 0,
    }
    console.log(props.studentCountList)
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

  menuItems(batches) {
    return batches.map((batches,index) => (
    <div key={index}>  <div  className={this.isActive(this.props.batches[index])}>
         <Link to={'/teacher/'+this.props.batches[index]}  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,this.props.batches[index])} >
          <MenuItem
          primaryText={'\n'+ 'Class  '+this.props.batches[index]}
          innerDivStyle={{
            paddingTop: "5px",
          }}
          rightIcon={
            <Badge
             badgeContent={this.props.studentCountList[batches]}
             primary={true}
             badgeStyle={{ width: "24px", height: "24px"}}
             style={{
               padding: "0px 24px 12px 12px"
             }}
           >
             <People color={"white"} viewBox={0,0,50,50}/>
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
        <FlatButton type="button" label="Add Batch" fullWidth={true}  icon={<Add color={"white"}/>}
          className="drawerFont" onClick={this.openDialog}/>
          <Dialog
                title="Select batch to add"
                modal={false}
                actions={actions}
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
