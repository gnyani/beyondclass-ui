import React,{Component} from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import {Grid,Row,Col} from 'react-flexbox-grid'

class Loading extends Component{
  render(){
  if (this.props.error) {
    return (<Grid>
      <Row center = "xs">
      <p> Please reload the page.. </p>
      </Row>
      </Grid>)
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
      <Row center="xs">
      <p>Loading CodeEditor might take a while.. Please hold on..</p>
      </Row>
      </Grid>
      <br />
      </div>)
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
