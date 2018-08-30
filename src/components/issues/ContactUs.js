import React,{Component} from 'react'
import whatsapp from '../../styles/whatsapp.png'
import {List, ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import {Grid, Row, Col} from 'react-flexbox-grid'

class ContactUs extends Component{
  render(){
    return(
      <Grid fluid className="nogutter">
      <Row around="xs">
      <Col xs={12} sm={12} md={10} lg={8} className="contactus">
      <div>
      <label>
        <h3>Contact Us</h3>
      </label>
      </div>
      </Col>
      <Col xs={12} sm={12} md={10} lg={8} style={{padding:'0px 2px 25px'}}>
      <List style={{padding:'0px !important'}}>
      <ListItem
          className="listPrimaryText"
          disabled={true}
          primaryText="Gnyanendra Nath"
          leftAvatar={<Avatar src={whatsapp} />}
          secondaryText={
          <p style={{fontWeight: 'lighter'}}>
          <span style={{color: "black"}}>8247235676</span><br />
          </p>}
        secondaryTextLines={2}
      />
      <ListItem
          className="listPrimaryText"
          disabled={true}
          primaryText="Prathap Raj"
          leftAvatar={<Avatar src={whatsapp} />}
          secondaryText={
          <p style={{fontWeight: 'lighter'}}>
          <span style={{color: "black"}}>9177914846</span><br />
          </p>}
        secondaryTextLines={2}
      />
      <ListItem
          className="listPrimaryText"
          disabled={true}
          primaryText="Kranthi"
          leftAvatar={<Avatar src={whatsapp} />}
          secondaryText={
          <p style={{fontWeight: 'lighter'}}>
          <span style={{color: "black"}}>9985181797</span><br />
          </p>}
        secondaryTextLines={2}
      />
      <ListItem
          className="listPrimaryText"
          disabled={true}
          primaryText="Vishnu Mahesh"
          leftAvatar={<Avatar src={whatsapp} />}
          secondaryText={
          <p style={{fontWeight: 'lighter'}}>
          <span style={{color: "black"}}>8008970401</span><br />
          </p>}
        secondaryTextLines={2}
      />
      </List>
      </Col>
      </Row>
      </Grid>
    )
  }
}

export default ContactUs
