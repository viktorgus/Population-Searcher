import React from 'react';

class CityChoice extends React.Component {


    render() {
        return (
            <button className="btn btn-light rounded-0" onClick={this.props.pickCity.bind(this, this.props.city)} style={btnStyle}>{this.props.title}</button>
        )
    }
}

const btnStyle = {
    borderColor: "black",
    cursor: 'pointer',
    margin: '2rem 0.3rem',
    font: '1.2em Calibri',
    width: '15em',
    height: '5em'
}

export default CityChoice;
