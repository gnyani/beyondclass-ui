import React,{Component} from 'react'
import Loadable from 'react-loadable'
import Loading from '../Loading'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Media} from '../utils/Media'
import styled from 'styled-components'
import Editor from './Editor'
import DeveloperMode from 'material-ui/svg-icons/device/developer-mode.js'
import BookMark from 'material-ui/svg-icons/action/bookmark.js'

const ListSavedSnippets = Loadable({
  loader: () => import('./ListSavedSnippets'),
  loading: Loading,
  timeout: 10000,
})

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
      inkBarStyle={{backgroundColor:"#30b55b", height: "0.25em"}}
      >
            <Tab label="Editor"
            buttonStyle={{backgroundColor: '#39424d',  textTransform: "none", fontSize: '1em'}}
            icon={<DeveloperMode />}
            >
              <div>
               <Editor handleReloadListChange={this.handleReloadListChange} {...this.props}/>
              </div>
            </Tab>
            <Tab label="Snippets"
            buttonStyle={{backgroundColor: '#39424d',  textTransform: "none", fontSize: '1em'}}
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
