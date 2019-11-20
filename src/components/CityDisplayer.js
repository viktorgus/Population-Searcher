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
            <h4>Population: </h4>
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
    width: "200px",
    marginLeft: "auto",
    marginRight: "auto"
}

const populationStyle = {
    fontSize:"2em",
    fontFamily: "arial"
}

export default CityDisplayer;
