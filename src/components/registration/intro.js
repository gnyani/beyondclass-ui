import React,{Component} from 'react';
import '../../styles/student-adda.css'
import { Grid, Row, Col } from 'react-flexbox-grid';


class Intro extends Component{

  render(){
    return(
        <div className="intro">
        <Grid fluid>
        <Row middle="xs">
        <Col xs={12} md={12} lg={12}>
        <h2 className="headline">Student-Adda</h2>
        <h3 className="subheading">your virtual classroom</h3>
        <img className="image" src={this.props.propiclink}  alt='profile pciture'/>
        <br />
        <h4 className="h4"> Welcome {this.props.userName}!! </h4>
        </Col>
        </Row>
       </Grid>
       <br />
        </div>
    )
  }
}


export default Intro;
