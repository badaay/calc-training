import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import Display from '../Display/Display'
import TerbilangDisplay from '../Display/Terbilang' 
import Pad from '../Pad/Pad'
import { Digit, Operator } from '../../lib/types'
import "../../style.css"
import Button from '../Button/Button'
import Terbilang from 'terbilang-ts'

const StyledApp = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue" ,Arial ,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  width: 100%;
  max-width: 500px;
`
interface LoginState {
  password: string;
  email: string;
  isLoading: boolean;
  error: string;
  isLoggedIn: boolean;
  token: string;
}

type LoginAction =
  | { type: "login" | "success" | "error" | "logout" }
  | { type: "field"; fieldName: string; payload: string };

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case "field": {
      return {
        ...state,
        [action.fieldName]: action.payload
      };
    }
    case "login": {
      return {
        ...state,
        error: "",
        isLoading: true
      };
    }
    case "success": {
      return { ...state, error: "", isLoading: false, isLoggedIn: true };
    }
    case "error": {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        email: "",
        password: "",
        error: "Incorrect email or password!"
      };
    }
    case "logout": {
      return {
        ...state,
        isLoggedIn: false
      };
    }
    default:
      return state;
  }
};

const initialState: LoginState = {
  password: "",
  email: "",
  isLoading: false,
  error: "",
  isLoggedIn: false,
  token: ""
};
export const App: FunctionComponent = () => {
  // Calculator's states
  const [result, setResult] = useState<number>(0)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true)
  const [pendingOperator, setPendingOperator] = useState<Operator>()
  const [display, setDisplay] = useState<string>('0')
  const [terbilangDisplay, setTerbilangDisplay] = useState<string>("")

  const [state, dispatch] = React.useReducer(loginReducer, initialState);
  const { email, password, isLoading, error, isLoggedIn} = state;
  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "login" });
    const url:string = 'http://localhost:3000/login'
    try {
      const res = await fetch( url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }).catch(result => {
        const data = result.body;
        console.log(data);
        // if(data.success){
          localStorage.setItem('token', data.data.token);
        // }

      });

      dispatch({ type: "success" });
    } catch (error) {
      dispatch({ type: "error" });
    }
  };

  const onLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "logout" });
    const url:string = 'http://localhost:3000/logout'
    try {
      const res = await fetch( url, {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer '+localStorage.getItem('token'), 
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ email, password })
      }).catch(result => {
        const data = result.body;
      });
    } catch (error) {
      dispatch({ type: "error" });
    }
  };

  const calculate = (rightOperand: number, pendingOperator: Operator): boolean => {
    let newResult = result

    switch (pendingOperator) {
      case '+':
        newResult += rightOperand
        break
      case '-':
        newResult -= rightOperand
        break
      case '×':
        newResult *= rightOperand
        break
      case '÷':
        if (rightOperand === 0) {
          return false
        }

        newResult /= rightOperand
    }

    setResult(newResult)
    setDisplay(newResult.toString().toString().slice(0, 12))

    return true
  }

  // Pad buttons handlers
  const onDigitButtonClick = (digit: Digit) => {
    let newDisplay = display

    if ((display === '0' && digit === 0) || display.length > 12) {
      return
    }

    if (waitingForOperand) {
      newDisplay = ''
      setWaitingForOperand(false)
    }

    if (display !== '0') {
      newDisplay = newDisplay + digit.toString()
    } else {
      newDisplay = digit.toString()
    }

    setDisplay(newDisplay)
  }

  const onPointButtonClick = () => {
    let newDisplay = display

    if (waitingForOperand) {
      newDisplay = '0'
    }

    if (newDisplay.indexOf('.') === -1) {
      newDisplay = newDisplay + '.'
    }

    setDisplay(newDisplay)
    setWaitingForOperand(false)
  }

  const onOperatorButtonClick = (operator: Operator) => {
    const operand = Number(display)

    if (typeof pendingOperator !== 'undefined' && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return
      }
    } else {
      setResult(operand)
    }

    setPendingOperator(operator)
    setWaitingForOperand(true)
  }

  const onChangeSignButtonClick = () => {
    const value = Number(display)

    if (value > 0) {
      setDisplay('-' + display)
    } else if (value < 0) {
      setDisplay(display.slice(1))
    }
  }

  const onEqualButtonClick = () => {
    const operand = Number(display)

    if (typeof pendingOperator !== 'undefined' && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return
      }

      setPendingOperator(undefined)
    } else {
      setDisplay(operand.toString())
      setTerbilangDisplay(Terbilang(operand))
    }

    setResult(operand)
    setWaitingForOperand(true)
  }

  const onAllClearButtonClick = () => {
    setResult(0)
    setPendingOperator(undefined)
    setDisplay('0')
    setWaitingForOperand(true)
  }

  const onClearEntryButtonClick = () => {
    setDisplay('0')
    setWaitingForOperand(true)
  }

  return (
    <div className="App">
      <div className="login-container">
        {isLoggedIn ? (
          <>
            <form className="form" onSubmit={onLogout}>
              <p>{`Hello ${email}`}</p>
              <Button type="submit">
                Log out
              </Button>
            </form>
            
              <StyledApp>
                <TerbilangDisplay value={terbilangDisplay} />
              </StyledApp>
              <StyledApp>
                <Display value={display} expression={typeof pendingOperator !== 'undefined' ? `${result}${pendingOperator}${waitingForOperand ? '' : display}` : ''} />
                <Pad
                  onDigitButtonClick={onDigitButtonClick}
                  onPointButtonClick={onPointButtonClick}
                  onOperatorButtonClick={onOperatorButtonClick}
                  onChangeSignButtonClick={onChangeSignButtonClick}
                  onEqualButtonClick={onEqualButtonClick}
                  onAllClearButtonClick={onAllClearButtonClick}
                  onClearEntryButtonClick={onClearEntryButtonClick}
                />
              </StyledApp>
          </>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            {error && <p className="error">{error}</p>}
            <p> PLease Login!</p>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "email",
                  payload: e.currentTarget.value
                })
              }
            />
            <input
              type="password"
              placeholder="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  fieldName: "password",
                  payload: e.currentTarget.value
                })
              }
            />
            <button type="submit" className="submit" disabled={isLoading}>
              {isLoading ? "Loggin in....." : "Login In"}
            </button>
          </form>
        )}
      </div>
    </div>

  )
}

export default App