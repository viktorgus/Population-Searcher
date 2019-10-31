import React from 'react';
import SearchBar from './components/SearchBar';
import SearchPick from './components/SearchPick';
import './App.css';


const views = {
  pickSearchType: "searchPick",
  searchCity: "searchCity",
  searchCountry: "searchCountry"
}

class App extends React.Component {



	state = {
    view: views.pickSearchType
	};


  pickSearchType = (nextView) => {
  this.setState({ view : nextView })
  }

  resetView = () =>{
    this.setState({ view: views.pickSearchType})
  }

  searchCity = (city) =>{
    console.log(city)
  }

  searchCountry = (country) => {
    console.log(country)
  }

  renderView = () => {
      switch(this.state.view) {
       case views.pickSearchType:
         return (
          <div>
         <SearchPick title="SEARCH BY CITY" nextView={views.searchCity} pickSearchType = {this.pickSearchType }></SearchPick>
         <SearchPick title="SEARCH BY COUNTRY" nextView={views.searchCountry} pickSearchType = {this.pickSearchType }></SearchPick>
         </div>
         )

        case views.searchCity:
          return (
            <div>
              <h3>SEARCH BY CITY</h3>
              <SearchBar onSearch = {this.searchCity} placeholder="Enter a city"></SearchBar>
            </div>
          )

          case views.searchCountry:
              return (
                <div>
                  <h2>SEARCH BY COUNTRY</h2>
                  <SearchBar onSearch = {this.searchCountry} placeholder="Enter a country"></SearchBar>
                </div>
              )
      default: 
        return
     }
  }


  render() {
    return(
    <div className="App" style={{ marginTop : '5rem'}}>
     <h1 style={ headingStyle } onClick = {this.resetView}>  CityPop </h1>
      { this.renderView() }
    </div>
  )}
}

const headingStyle = {
  textDecoration: 'none',
  textColor: 'black',
  cursor: 'pointer',
  size: 'auto'
}



export default App;
