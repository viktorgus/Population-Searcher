import React from 'react';

class SearchBar extends React.Component {

  state = {
    inputValue: '',
    suggestions: []
  }

  onChange = (e) => {
    this.setState({
      inputValue: e.target.value,

    })
  }

  submit = (e) => {
    e.preventDefault()
    if ((this.state.inputValue.length>0  && this.state.inputValue.trim())) {
      this.props.onSearch(this.state.inputValue)
    }
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <input className="form-control form-control-lg" style={inputStyle} onChange={this.onChange} placeholder={this.props.placeholder}></input>
        <p style={{ color: "red" }}> {this.props.error}</p>
        <button className="btn btn-light fa fa-search" style={buttonStyle}></button>
      </form>
    )
  }
}

const inputStyle = {
  textAlign: 'center',
  width: '200px',
  margin: '2em auto 1em auto'
}

const buttonStyle = {
  borderRadius: "50%",
  height: "auto",
  backgroundColor: "white",
  borderColor: "black"
}
export default SearchBar;
