import React from 'react';

class CityChoice extends React.Component {


    render() {
        return (
            <div className="row" style={{marginLeft: "auto", marginRight: "auto",
            
            width: '15em',
            height: '5em'}} > 
            <button className=" col-sm btn btn-light rounded-0" onClick={this.props.pickCity.bind(this, this.props.city)} style={btnStyle}>{this.props.title}</button>
            </div>
        )
    }
}

const btnStyle = {
    borderColor: "black",
    cursor: 'pointer',
    font: '1.2em Calibri',
}

export default CityChoice;
