import React,{Component} from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Grid,Row,Col} from 'react-flexbox-grid'

class Loading extends Component{
  render(){
  if (this.props.error) {
    return (<div>Error!</div>)
  } else if (this.props.timedOut) {
    return (<div>
      <Grid fluid className="RefreshIndicator" key={1}>
      <Row center="xs">
      <Col xs>
        <RefreshIndicator
           size={50}
           left={45}
           top={0}
           loadingColor="#FF9800"
           status="loading"
           className="refresh"
          />
      </Col>
      </Row>
      </Grid>
      <br />
      <p>Taking longer time than expected...</p></div>)
  } else if (this.props.pastDelay) {
    return (<Grid fluid className="RefreshIndicator" key={1}>
    <Row center="xs">
    <Col xs>
      <RefreshIndicator
         size={50}
         left={45}
         top={0}
         loadingColor="#FF9800"
         status="loading"
         className="refresh"
        />
    </Col>
    </Row>
    </Grid>)
  } else {
    return null
  }
 }
}

export default Loading
