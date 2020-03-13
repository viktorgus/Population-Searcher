import React from 'react';
import SearchBar from './components/SearchBar';
import SearchPick from './components/SearchPick';
import CityChoice from './components/CityChoice';
import CityDisplayer from './components/CityDisplayer';
import MapContainer from './components/MapContainer';
import CircularProgress from '@material-ui/core/CircularProgress'


import './App.css';

//Sets ammount of city to choose from when country is picked
const displayCityAmmount = 3;

//Enums for representing state of App
const views = {
  pickSearchType: "searchPick",
  searchCity: "searchCity",
  searchCountry: "searchCountry",
  pickCity: "pickCity",
  displayCity: "displayCity",
  loading: "loading"
}


class App extends React.Component {

  state = {
    view: views.pickSearchType,
    city: {
      name: "",
      population: ""
    },
    cityOptions: [],
    country: "",
    position: []
  };

  //Helpfunction to change view when a searchtype is chosen
  pickSearchType = (nextView) => {
    this.setState({ view: nextView, searchError: "" })
  }

  //Returns to initial page and resets App, used when clicking on CityPop header
  resetView = () => {
    this.setState({
      view: views.pickSearchType,
      city: {
        name: "",
        population: ""
      },
      searchError: "",
      cityOptions: [],
      country: "",
      position: []
    })
  }

  //Sets an errormsg after a faulty search and changes view to nextView
  error = (msg, nextView) => {
    this.setState({
      searchError: msg,
      view: nextView,
      cityOptions: [],
      country: "",
      city: {
        name: "",
        population: ""
      }
    })
  }

  //sets state to display city after a valid search has been made and found for a city
  setDisplayCityState = (newcity) => {
    console.log(newcity[0])
    this.setState({
      view: views.displayCity,
      city: {
        name: newcity[0].name,
        population: newcity[0].population
      },
      searchError: "",
      position: [newcity[0].lat,newcity[0].lng]

    })
  }

  
  //sets state to display a choice city after a search has been made and found for a country
  setChooseCityState = (cities, country) => {
    this.setState({
      view: views.pickCity,
      cityOptions: cities.slice(0, Math.min(cities.length, displayCityAmmount)),
      searchError: "",
      country: country[0].name
    })
  }

  //Used to fetch, filter and sort cities from api geonames if error, returns to prevState. 
  //if successfull uses nextState (method that sets next state depending on result)
  //Country is passed if nextState needs to know country.
  searchCitiesAndSetState = (queryurl, nextState, prevState, country = null) => {
    fetch("http://api.geonames.org/searchJSON?" + queryurl)
      .then(result => {
        //Checks if ok http response
        if(result.ok){
          //converts API response to json format
        result.json().then(result=> {
          
        if (result !== null) {
          result = result.geonames
          //filters out all results that are not cities
          result = result.filter(x => (x.fclName).includes("city") && (x.fcodeName !== "populated place"))
          //Sort over population size
          result.sort((a, b) => a.population > b.population ? -1 : 1)
          if (result.length > 0) {
            //sets next view as the specified nextState. Needs result and country for displaying city and/or countryn
            nextState(result,country)
          } else {
            //if results are found but no results are cities
            this.error("no results", prevState)
          }
          
        } else {
          //if no results are found by geonames
          this.error("no results", prevState)
        }           
      })} else {
        //if api fetch call generates a http error
        this.error("faulty query", prevState)
      }
      })
  }

  //Search for city via geonames API. 
  searchCity = (city) => {
    var queryurl = "name_startsWith=" + city + "&maxRows=5&username=weknowit&orderby=relevance&isNameRequired=true"
    this.searchCitiesAndSetState(queryurl, this.setDisplayCityState, views.searchCity)
    this.setState({ view: views.loading, searchError: "" })
  }

  //First gets 2 letter code from rescountries API then searches this code on geonames API for biggest cities within the country
  searchCountry = (country) => {

    //First finds twoletter code from country search necessary for the second API call
    fetch("https://restcountries.eu/rest/v2/name/" + country)
      .then(country => country.json())
      .then(country => {
        if (country.status !== 404) {
          var queryurl = "country=" + country[0].alpha2Code + "&maxRows=30&username=weknowit&orderby=reference"
          this.searchCitiesAndSetState(queryurl, this.setChooseCityState, views.searchCountry, country)
        } else {
          //displays error if no country is found
          this.error("no results for city", views.searchCountry)
        }
      })
    this.setState({ view: views.loading, searchError: "" })
  }

  //sets the city to be displayed and changes view
  setCity = (pickedCity) => {
    this.setState({
      city: pickedCity,
      view: views.displayCity,
      searchError: "",
      position: [pickedCity.lat,pickedCity.lng]

    })
  }

  //Main Render Function. Changes components based on state.view
  renderView = () => {

    switch (this.state.view) {
      case views.pickSearchType:
        return (
          <div className="container">
            <SearchPick className="col" title="SEARCH BY CITY" nextView={views.searchCity} pickSearchType={this.pickSearchType}></SearchPick>
            <SearchPick className="col" title="SEARCH BY COUNTRY" nextView={views.searchCountry} pickSearchType={this.pickSearchType}></SearchPick>
          </div>
        )

      case views.searchCity:
        return (
          <div>
            <h3>SEARCH BY CITY</h3>
            <SearchBar onSearch={this.searchCity} error={this.state.searchError} placeholder="Enter a city"></SearchBar>
          </div>
        )

      case views.searchCountry:
        return (
          <div>
            <h3>SEARCH BY COUNTRY</h3>
            <SearchBar onSearch={this.searchCountry} error={this.state.searchError} placeholder="Enter a country"></SearchBar>
          </div>
        )

      case views.displayCity:
        return (
          <div>
          <CityDisplayer city={this.state.city}></CityDisplayer>

          <MapContainer position={this.state.position}> </MapContainer>

          </div>
        )

      case views.pickCity:
        return (
          <div className="container">
            <h3>{this.state.country}</h3>
            <div style={{ marginTop: "2.5em" }}>
              {this.state.cityOptions.map(city => <CityChoice pickCity={this.setCity} city={city} title={city.name}></CityChoice>)}
            </div>
          </div>
        )

      case views.loading:
        return (
          <CircularProgress color="inherit" size={50}></CircularProgress>
        )
      default:
        return
    }
  }


  render() {
    return (
      <div className="App" style={{ marginTop: '3rem' }}>
        <h1 style={headingStyle} onClick={this.resetView}>  Population Searcher </h1>
        {this.renderView()}
      </div>
    )
  }
}

const headingStyle = {
  textDecoration: 'none',
  textColor: 'black',
  cursor: 'pointer',
  size: 'auto',
  margin: '0.7em'
}



export default App;