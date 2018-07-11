import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Grid, Row, Col} from 'react-flexbox-grid'

const years = [
  {text: "Select*", value: 0},
  {text:new Date().getFullYear(), value: 1},
  {text:new Date().getFullYear()-1,value: 2},
  {text:new Date().getFullYear()-2,value: 3},
  {text:new Date().getFullYear()-3,value: 4},
  {text:new Date().getFullYear()-4,value: 5},
]

class DisplayBatches extends Component{

 yearMenuItems = () => {
   return years.map((years) => (
     <MenuItem
       key={years.value}
       value={years.value}
       primaryText={years.text}
     />
   ));
 }
  render(){
    return(
      <div>
      <Grid fluid>
      <Row around="xs">
      <Col xs>
      <SelectField
       floatingLabelText="Start Year"
       value={this.props.year}
       onChange={this.props.handleYearChange}
       style={{textAlign: 'left'}}
       underlineStyle={{borderColor: 'black'}}
       iconStyle={{fill:'black'}}
       autoWidth={true}
       maxHeight={300}
     >
     {this.yearMenuItems()}
      </SelectField>
      </Col>
      <Col xs>
      <SelectField
       floatingLabelText="Section"
       value={this.props.section}
       onChange={this.props.handleSectionChange}
       style={{textAlign: 'left'}}
       underlineStyle={{borderColor: 'black'}}
       iconStyle={{fill:'black'}}
       autoWidth={true}
       maxHeight={300}
     >
          <MenuItem value={0} primaryText="Select*" />
          <MenuItem value="A" primaryText="A" />
          <MenuItem value="B" primaryText="B" />
          <MenuItem value="C" primaryText="C" />
          <MenuItem value="D" primaryText="D" />
      </SelectField>
      </Col>
      </Row>
      </Grid>
      </div>
    )
  }
}

export default DisplayBatches
