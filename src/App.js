import React from 'react';
import SearchBar from './components/SearchBar';
import SearchPick from './components/SearchPick';
import CircularProgress from '@material-ui/core/CircularProgress'
import './App.css';

const citySearchThreshold = 3000

const views = {
  pickSearchType: "searchPick",
  searchCity: "searchCity",
  searchCountry: "searchCountry",
  pickCountry: "pickCountry",
  displayCity: "displayCity",
  loading: "loading"
}

class App extends React.Component {



  state = {
    view: views.pickSearchType,
    city: {
      name: "",
      population: ""
    }
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
      searchError: ""
    })
  }

  searchCity = (city) => {
    fetch("http://api.geonames.org/searchJSON?name_startsWith=" + city + "&maxRows=5&username=weknowit&orderby=relevance&isNameRequired=true")
      .then(res => res.json())
      .then(result => {
        var resultCount = result.totalResultsCount
        if (resultCount <= citySearchThreshold) {
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
          }else {
            this.setState({
              searchError: "No results",
              view: views.searchCity,
              city: {
                name: "",
                population: ""
              }
            })
          }
        }else {
          this.setState({
            searchError: "Too many results",
            view: views.searchCity,
            city: {
              name: "",
              population: ""
            }
          })
        }
      })
    this.setState({ view: views.loading, searchError: "" })
  }

  searchCountry = (country) => {
    console.log(country)
  }

  renderView = () => {
    switch (this.state.view) {
      case views.pickSearchType:
        return (
          <div>
            <SearchPick title="SEARCH BY CITY" nextView={views.searchCity} pickSearchType={this.pickSearchType}></SearchPick>
            <SearchPick title="SEARCH BY COUNTRY" nextView={views.searchCountry} pickSearchType={this.pickSearchType}></SearchPick>
          </div>
        )

      case views.searchCity:
        return (
          <div>
            <h3>SEARCH BY CITY</h3>
            <SearchBar onSearch={this.searchCity} error= {this.state.searchError} placeholder="Enter a city"></SearchBar>
          </div>
        )

      case views.searchCountry:
        return (
          <div>
            <h2>SEARCH BY COUNTRY</h2>
            <SearchBar onSearch={this.searchCountry} error= {this.state.searchError} placeholder="Enter a country"></SearchBar>
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

      case views.loading:
        return(
          <CircularProgress color="inherit" size={20}></CircularProgress>
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
