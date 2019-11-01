import React from 'react';



function formatNumber(number) {
    return (number).toLocaleString('en').replace(/,/g," ")
    
} 
class CityDisplayer extends React.Component {

    render() {
        return (
            <div>
            <h3>{this.props.city.name}</h3>
            <div style = {cityBlockStyle}>
            <h5>Population: </h5>
            <p style={populationStyle}>{formatNumber(this.props.city.population)}</p>
            </div>
            </div>
            )
    }
}

const cityBlockStyle = {
    borderStyle: "solid",
    borderColor: "black",
    marginTop: "2em",
    width: "40%",
    marginLeft: "auto",
    marginRight: "auto"
}

const populationStyle = {
    fontSize:"3em",
    fontFamily: "arial"
}

export default CityDisplayer;
