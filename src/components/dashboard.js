import React,{Component} from 'react'
// import Drawer from 'material-ui/Drawer';
// import MenuItem from 'material-ui/MenuItem';
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

class Dashboard extends Component{

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      drawerwidth: props.width
    };
    this.getUser = this.getUser.bind(this);
  }

componentWillMount(){
  this.getUser()
}

getUser(){
  fetch('http://localhost:8080/user/loggedin', {
           credentials: 'include',
           method: 'GET'
        }).then(response => {
          console.log("status is" + response.status);
        //  console.log("response without json is" + response.text())
          return response.text()
        }).then(response => {
          console.log("response is"+response);
          // let myColor = { background: '#0E1717', text: "#FFFFFF" ,marginTop : '50%',zIndex : '3000'};
          // notify.show("log in successful","custom", 5000, myColor);
          this.setState({
              username: response
          })
        }).catch(response => {
        notify.show("Please login before viewing dashboard");
        this.context.router.history.push('/');
       });
}

  render(){
    return(
    <StayVisible
    {...this.props}
    >
      <div >
        <h2>Welcome User {this.state.username} </h2>
      </div>
    </StayVisible>
    )
  }
}
Dashboard.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Dashboard)
