'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import cake from './images/cake.png'
import './search.less';
class Search extends React.Component {
  render(){
    return <div className="search-text">
      Search Text111<img src={cake}/>
      </div>
  }
}

ReactDOM.render(
  <Search/>,
  document.getElementById('root')
);