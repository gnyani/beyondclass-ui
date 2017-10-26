import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
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

  menuItems(batches) {
    return batches.map((batches,index) => (
    <div key={index}>  <div  className={this.isActive(this.props.batches[index])}>
         <Link to={'/teacher/'+this.props.batches[index]}  width={this.props.width} style={{ textDecoration: 'none' }} onClick={this.onChangeSelected.bind(this,this.props.batches[index])} >
          <MenuItem
          primaryText={'Class  '+this.props.batches[index]}
          leftIcon={<LocationCity color={red500}/>}
          onClick={this.props.handleMobileToggle}
          className="drawerFont"
           />
           </Link>
           </div>
      </div>
    ));
  }
  render(){
    return(
      <div>{this.menuItems(this.props.batches)}</div>
    )
  }
}
export default TeacherDashboard;
