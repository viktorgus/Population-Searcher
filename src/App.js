import React from 'react';
import SearchBar from './components/SearchBar';
import SearchPick from './components/SearchPick';
import CityChoice from './components/CityChoice';
import CircularProgress from '@material-ui/core/CircularProgress'
import './App.css';

const displayCityAmmount = 3;

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


  pickSearchType = (nextView) => {
    this.setState({ view: nextView, searchError: "" })
  }

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

  searchCity = (city) => {
    fetch("http://api.geonames.org/searchJSON?name_startsWith=" + city + "&maxRows=5&username=weknowit&orderby=relevance&isNameRequired=true")
      .then(res => res.json())
      .then(result => {
        if (result !== null) {
          result = result.geonames
          result = result.filter(x => (x.fclName).includes("city") && (x.fcodeName !== "populated place"))
          if (result.length > 0) {
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

  searchCountry = (country) => {

    fetch("https://restcountries.eu/rest/v2/name/" + country)
      .then(country => country.json())
      .then(country => {
        if (country.status !== 404) {
          fetch("http://api.geonames.org/searchJSON?country=" + country[0].alpha2Code + "&maxRows=30&username=weknowit&orderby=reference")
            .then(res => res.json())
            .then(result => {
              if (result !== null && result.geonames) {
                result = result.geonames
                result = result.filter(x => (x.fclName).includes("city") && (x.fcodeName !== "populated place"))
                result.sort((a,b)=> a.population>b.population ?  -1 : 1)
                console.log(result)
                if (result.length > 0) {
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

  setCity = (pickedCity) => {
    this.setState({
      city: pickedCity,
      view: views.displayCity
    })
  }

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
            <h2>SEARCH BY COUNTRY</h2>
            <SearchBar onSearch={this.searchCountry} error={this.state.searchError} placeholder="Enter a country"></SearchBar>
          </div>
        )

      case views.displayCity:
        return (
          <div>
            <h2>{this.state.city.name}</h2>
            <h4>Population: </h4>
            <p>{this.state.city.population}</p>
          </div>
        )

      case views.pickCity:
        return (
          <div className="container">
            <h2>{this.state.country}</h2>
            {this.state.cityOptions.map(city => <CityChoice className="row" pickCity={this.setCity} city={city} title={city.name} > </CityChoice>)}
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
  margin: '0.5em'
}



export default App;
