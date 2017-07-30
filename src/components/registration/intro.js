import React,{Component} from 'react';
import '../../styles/student-adda.css'



class Intro extends Component{

  render(){
    return(
        <div className="intro">
        <h2 className="headline">Student-Adda</h2>
        <h3 className="subheading">your virtual classroom</h3>
        <img className="image" src={this.props.propiclink}  alt='profile pciture'/>
        <h4 className="h4"> Welcome {this.props.userName}!! </h4>
        </div>
    )
  }
}


export default Intro;
