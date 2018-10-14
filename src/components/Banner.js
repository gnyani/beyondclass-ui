import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';


var properties = require('./properties.json')

class Banner extends Component {

  constructor() {
    super();
     this.loginToolbar = this.loginToolbar.bind(this);
  }

componentDidMount(){
  fetch('http://'+properties.getHostName+':8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          if(response.status === 200){
            if(this.props.userrole === 'student')
            this.context.router.history.push('/announcements');
          }
          else if(response.status === 404)
          this.context.router.history.push('/register');
        })
}


loginToolbar(){
  var loginUrl = 'http://'+properties.getHostName+':8080/google/login'
  return(<div className="backgroundHome">
      <Grid fluid >
        <Row center="xs" >
              <Grid fluid className="signUpForm">
                <Row center="xs">
                    <Col xs>
                    <h1 className="text">BeyondClass</h1>
                    <p>Your virtual class room</p>
                    </Col>
                </Row>
                <br /><br />
                <Row>
                    <Col xs>
                <form action= {loginUrl}>
                  <FlatButton type="submit" label="SignIn to Workspace"
                    labelStyle={{fontWeight: "600"}}
                    className="signupButton"/> <br /><br />
                </form>
                </Col>
            </Row>
              </Grid>
        </Row>
      </Grid>
      </div>
  )
}

render() {
  return(
    <div>
    {this.loginToolbar()}
    </div>
  )
}
}

Banner.contextTypes = {
    router: PropTypes.object
};

export default withRouter(Banner);
