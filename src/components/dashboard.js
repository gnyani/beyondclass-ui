import React,{Component} from 'react'
import {notify} from 'react-notify-toast';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import '../styles/student-adda.css'

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
          return response.text()
        }).then(response => {
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
        <h2 className="headings">Welcome User {this.state.username} </h2>
      </div>
    </StayVisible>
    )
  }
}
Dashboard.contextTypes = {
    router: PropTypes.object
};
export default withRouter(Dashboard)
