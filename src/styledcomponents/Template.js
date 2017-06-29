import React from 'react';
import styled from 'styled-components';

export const HeaderStyle = styled.div`

`

export const Container = styled.div`
  display : flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 100%;
  min-height: 80vh;
`

export const Main = (props) => {

   return(
     <Container>
     {props.children}
     </Container>
   )
}
