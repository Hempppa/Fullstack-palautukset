import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const increaseGood = () => {setGood(good + 1)}
  const increaseNeutral = () => {setNeutral(neutral + 1)}
  const increaseBad = () => {setBad(bad + 1)}

  return (
    <div>
      <Feedback increaseGood={increaseGood} increaseNeutral={increaseNeutral} increaseBad={increaseBad}/>
      <Statistic good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

const Feedback = ({increaseGood, increaseNeutral, increaseBad}) => {
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => increaseGood()} text="good" />
      <Button handleClick={() => increaseNeutral()} text="neutral" />
      <Button handleClick={() => increaseBad()} text="bad" />
    </div>
  )
}

const Statistic = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  if (total > 0) {
    return (
      <div>
        <h1>statistic</h1>
        <table>
          <Statisticline text="good" value={good}/>
          <Statisticline text="neutral" value={neutral}/>
          <Statisticline text="bad" value={bad}/>
          <Statisticline text="all" value={total}/>
          <Statisticline text="average" value={(good-bad)/total}/>
          <Statisticline text="positive" value={String(good/total*100) + " %"}/>
        </table>
      </div>
    )
  } else {
    return (
      <div>
        <h1>statistic</h1>
        No feedback given
      </div>
    )
  }
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Statisticline = ({text, value}) => {
  return (
    <>
      <tr>
        <td>
          {text}
        </td>
        <td>
          {value}
        </td>
      </tr>
    </>
  )
}

export default App