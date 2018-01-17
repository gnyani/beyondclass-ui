import React,{Component} from 'react';
import '../../styles/student-adda.css'
import { Grid, Row, Col } from 'react-flexbox-grid';


class Intro extends Component{

  render(){
    return(
        <div className="intro">
        <Grid fluid className="nogutter">
        <Row middle="xs">
        <Col xs={11} sm={11} md={11} lg={11}>
        <h2 className="headline">Beyond Class</h2>
        <h3 className="subheading">your virtual classroom</h3>
        <br />
        <img className="image" src={this.props.propiclink}  alt=''/>
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
