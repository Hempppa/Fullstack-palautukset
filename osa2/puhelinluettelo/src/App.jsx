import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import "./index.css"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    phonebook.getAll().then(data => setPersons(data))
  }, [])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    var includes = false
    var index = 0
    persons.forEach(person =>
      {
        if (person.name === newName) {
          includes = true
          index = person.id
        }
      }
    )
    if (!includes) {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      phonebook.create(newPerson).then(data => {
        setPersons(persons.concat(data))
        setMessage(`added ${newName}`)
      })
    } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      phonebook
        .update(index, newPerson)
        .then(data => {
            setPersons(persons.map(person => person.name !== newName ? person : data))
            setMessage(`Changed ${newName} number to ${newNumber}`)
            setTimeout(() => {setMessage(null)}, 5000)
          })
        .catch(error => {
          setErrorMessage(`Information of ${newName} has already been removed from the server`)
          setTimeout(() => {setErrorMessage(null)}, 5000)
          setPersons(persons.filter(person => person.name !== newName))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNamechange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      var clone = persons.slice()
      phonebook.remove(id)
      var index = 0
      persons.forEach(person =>
          {
            if (person.id === id) {
              clone.splice(index, 1)
              console.log(`removing `, persons[index])
              setMessage(`Deleted ${persons[index].name}`)
            } else {
              console.log(`not removing `, persons[index])
            }
            index = index + 1
          }
        )
      setPersons(clone)
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <ErrorNotification message={errorMessage}/>
      <Filter search={search} handler={handleSearchChange}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} name={newName} nameHandler={handleNamechange} number={newNumber} numberHandler={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/>
    </div>
  )

}

const Filter = ({search, handler}) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handler}/>
    </div>
  )
}

const PersonForm = ({addPerson, name, nameHandler, number, numberHandler}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={name} onChange={nameHandler}/>
      </div>
      <div>
        number: <input value={number} onChange={numberHandler}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({personsToShow, removePerson}) => {
  return (
    personsToShow.map(person => 
      <li key={person.id}>
        {person.name}   {person.number}
        <button onClick={() => removePerson(person.id, person.name)}>delete</button>
      </li>
    )
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

export default App