import React from 'react';

class SearchPick extends React.Component {


  render() {
    return(
    <button className="btn btn-light border border-primary rounded-0" onClick={this.props.pickSearchType.bind(this,this.props.nextView)} style={btnStyle}>{ this.props.title }</button>
  )}
}

const btnStyle = {
    cursor: 'pointer',
    margin: '2rem 0.3rem',
    font : '1.2em Calibri',
    width: '15em',
    height: '5em'
  }

export default SearchPick;
