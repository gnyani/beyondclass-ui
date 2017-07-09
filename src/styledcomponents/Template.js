import React from 'react';
import styled from 'styled-components';

export const HeaderStyle = styled.div`

`

// export const Container = styled.div`
//   display : flex;
//   flex-direction: column;
//   align-items: center;
//   margin: auto;
//   width: 100%;
//   min-height: 80vh;
// `

const StayVisible = styled.div`
  position: relative;
  margin-left: ${(props) => (props.open) ? `${props.width}px` : 'none'};
  transition: margin .1s;
`

export const Main = (props) => {
console.log("value"+props.width)
   return(
     <StayVisible
     {...props}>
     {props.children}
     </StayVisible>
   )
}
