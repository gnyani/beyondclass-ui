import React,{Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Editor from './Editor'
import DeveloperMode from 'material-ui/svg-icons/device/developer-mode.js'
import BookMark from 'material-ui/svg-icons/action/bookmark.js'
import ListSavedSnippets from './ListSavedSnippets'

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
  ${Media.handheld`
    margin-left: 0px;
  `}
`

class CodeEditor extends Component{
  constructor(){
    super()
    this.state={
      reloadList: 1,
    }
  }

  handleReloadListChange = () =>{
    this.setState({
      reloadList: this.state.reloadList+1,
    })
  }

  render(){
    return(
      <StayVisible
      {...this.props}
      >
      <Tabs
      inkBarStyle={{backgroundColor:"#FFA107"}}
      >
            <Tab label="Editor"
            buttonStyle={{backgroundColor: '#4d86cf'}}
            icon={<DeveloperMode />}
            >
              <div>
               <Editor handleReloadListChange={this.handleReloadListChange} {...this.props}/>
              </div>
            </Tab>
            <Tab label="Snippets"
            buttonStyle={{backgroundColor: '#4d86cf'}}
            icon={<BookMark />}>
              <div>
               <ListSavedSnippets key={this.state.reloadList} {...this.props}/>
              </div>
            </Tab>
      </Tabs>
  </StayVisible>
    )
  }
}

export default CodeEditor
