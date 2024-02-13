import { useState, useEffect } from 'react'
import connection from './services/connection'

const App = () => {
  const [countries, setCountries] = useState([])
  const [singleMatch, setSingleMatch] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    var temp = []
    connection.getAll().then(data => {
      temp = data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
      if (temp.length > 10) {
        setSingleMatch(true)
        setCountries("Too many matches, specify another filter")
      } else if (temp.length > 1) {
        setSingleMatch(false)
        setCountries(temp)
      } else if (temp.length === 1) {
        connection.getOne(temp[0].name.common).then(data => {
          console.log("getOne result: ", data)
          setCountries(data)
          setSingleMatch(true)
        })
      } else {
        setSingleMatch(true)
        setCountries("No matches, specify another filter")
      }
    })
  }, [search])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const countryButton = (name) => {
    setSearch(name)
  }

  return (
    <div>
      <Filter search={search} handler={handleSearchChange}/>
      <Country country={countries} singleMatch={singleMatch}/>
      <Countries countries={countries} singleMatch={singleMatch} countryButton={countryButton}/>
    </div>
  )
}

const Filter = ({search, handler}) => {
  return (
    <div>
      find countries<input value={search} onChange={handler}/>
    </div>
  )
}

const Countries = ({countries, singleMatch, countryButton}) => {
  console.log("Countries to display: ", countries, !singleMatch)
  if (singleMatch) {
    return null
  }
  return (
    <div>
      {countries.map(country => 
      <div key={country.name.common}>
        {country.name.common} <button onClick={() => countryButton(country.name.common)}>show</button>
      </div>)}
    </div>
  )
}

const Country = ({country, singleMatch}) => {
  console.log("Country to display: ", country, singleMatch)
  if (!singleMatch) {
    return null
  }
  if (typeof(country) === "string") {
    return (
      <div>
        {country}
      </div>
    )
  } else {
    return (
      <div>
        <h1>{country.name.common}</h1>
        {"capital " + country.capital} <br></br>
        {"area " + country.area}
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map(language => <li>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name.common + " flag"}/>
      </div>
    )
  }
}

export default App