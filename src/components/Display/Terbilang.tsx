import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

interface TerbilangProps {
  value: string
}

const StyleScreen = styled.div`
  font-size: 1em;
  min-height: 1.4em;
  display: flex;
  align-items: center;
  justify-content: flex-end;  
  overflow: hidden;
`

const StyledDisplay = styled.div`
  background-color: #393939;
  color: #fff;
  padding: 1.5em 1em;
`

export const Screen: FunctionComponent<TerbilangProps> = ({ value}) => {
  return (
    <StyledDisplay>
      <StyleScreen>
        {value}
      </StyleScreen>
    </StyledDisplay>
  )
}

export default Screen