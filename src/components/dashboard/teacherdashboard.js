import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {LocationCity} from '../../styledcomponents/SvgIcons.js'


class TeacherDashboard extends Component{

  constructor(){
    super();
    this.state={
      selected: '',
    }
    this.isActive = this.isActive.bind(this)
  }
  onChangeSelected(value){
    this.setState({
      selected: value
    })
  }
  isActive(value){
      return (value === this.state.selected)?'Active':'';
  }

  menuItems(classes) {
    return classes.map((classes,index) => (
    <div key={index}>  <div  className={this.isActive(this.props.classes[index])}>
         <Link to={'/teacher/'+this.props.classes[index]}  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,this.props.classes[index])} >
          <MenuItem
          primaryText={'Class  '+this.props.classes[index]}
          leftIcon={<LocationCity color={red500}/>}
          onClick={this.props.handleMobileToggle}
           />
           </Link>
           </div>
      <Divider/>
      </div>
    ));
  }
  render(){
    return(
      <div>{this.menuItems(this.props.classes)}</div>
    )
  }
}
export default TeacherDashboard;
