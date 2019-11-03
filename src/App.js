import React from 'react';
import SearchBar from './components/SearchBar';
import SearchPick from './components/SearchPick';
import CityChoice from './components/CityChoice';
import CityDisplayer from './components/CityDisplayer';
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
    country: ""
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
      country: ""
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

  //Search for city via geonames API. 
  searchCity = (city) => {
    fetch("http://api.geonames.org/searchJSON?name_startsWith=" + city + "&maxRows=5&username=weknowit&orderby=relevance&isNameRequired=true")
      .then(res => res.json())
      .then(result => {
        if (result !== null) {
          result = result.geonames
          //filters out all results that are not cities
          result = result.filter(x => (x.fclName).includes("city") && (x.fcodeName !== "populated place"))
           //Sort over population size
           result.sort((a,b)=> a.population>b.population ?  -1 : 1)
          if (result.length > 0) {
            //sets nextview to display city 
            this.setState({
              view: views.displayCity,
              city: {
                name: result[0].name,
                population: result[0].population
              },
              searchError: ""
            })
          } else {
            this.error("no results", views.searchCity)
          }
        } else {
          this.error("no results", views.searchCity)
        }
      })
    this.setState({ view: views.loading, searchError: "" })
  }

  //First gets 2 letter code from rescountries API then searches this code on geonames API for biggest cities within the country
  searchCountry = (country) => {

    //First finds twoletter code from country search necessary for the second API call
    fetch("https://restcountries.eu/rest/v2/name/" + country)
      .then(country => country.json())
      .then(country => {
        if (country.status !== 404) {
          fetch("http://api.geonames.org/searchJSON?country=" + country[0].alpha2Code + "&maxRows=30&username=weknowit&orderby=reference")
            .then(res => res.json())
            .then(result => {
              if (result !== null && result.geonames) {
                result = result.geonames
                //Filters out results that are not cities
                result = result.filter(x => (x.fclName).includes("city") && (x.fcodeName !== "populated place"))
                //Sort over population size
                result.sort((a,b)=> a.population>b.population ?  -1 : 1)
                if (result.length > 0) {
                  //Sets view to display city and sets city to biggest cities of resulting array
                  this.setState({
                    view: views.pickCity,
                    cityOptions: result.slice(0,Math.min(result.length,displayCityAmmount)),
                    searchError: "",
                    country: country[0].name
                  })
                } else {
                  this.error("no results", views.searchCountry)
                }
              } else {
                this.error("no results", views.searchCountry)
              }
            })
        } else {
          this.error("no results for city", views.searchCountry)
        }
      })
    this.setState({ view: views.loading, searchError: "" })
  }

  //sets the city to be displayed and changes view
  setCity = (pickedCity) => {
    this.setState({
      city: pickedCity,
      view: views.displayCity
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
            <CityDisplayer city={ this.state.city }></CityDisplayer>
        )

      case views.pickCity:
        return (
          <div className="container">
            <h3>{this.state.country}</h3>
            <div style={{marginTop:"2.5em"}}>
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
      <div className="App" style={{ marginTop: '5rem' }}>
        <h1 style={headingStyle} onClick={this.resetView}>  CityPop </h1>
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