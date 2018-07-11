import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {red500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {LocationCity} from '../../styledcomponents/SvgIcons.js'
import Badge from 'material-ui/Badge';
import People from 'material-ui/svg-icons/social/people.js'


class TeacherDashboard extends Component{

  constructor(props){

    super(props);
    this.state={
      selected: '',
    }
    console.log(props.studentCountList)
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
  render(){
    return(
      <div>{this.menuItems(this.props.batches)}</div>
    )
  }
}
export default TeacherDashboard;
