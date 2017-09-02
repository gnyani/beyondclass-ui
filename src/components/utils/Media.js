import {css} from 'styled-components'

export const Media =  {
  handheld: (...args) => css`
   @media(max-width: 700px){
     ${ css(...args) }
   }
  `
}
