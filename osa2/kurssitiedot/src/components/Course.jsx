const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} /> 
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }

const Header = (props) => {
  return(
    <h2>{props.course}</h2>
  )
}

const Content = (props) => {
  return (
    props.parts.map(part => <Part part={part} key={part.name}/>)
  )
}

const Part = (props) => {
  return(
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Total = (props) => {
  const exercises = props.parts.map(part => part.exercises)
  return(
    <p>
    <b>total of {exercises.reduce((accumulator, currentValue) => accumulator + currentValue)} exercises</b>
    </p>
  )
}

export default Course
