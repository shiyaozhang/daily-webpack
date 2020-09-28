'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import cake from '../images/cake.png'
import './search.less';
import '../../common';
import {a} from './tree-shaking'
class Search extends React.Component {
  render(){
    debugger;
    return <div className="search-text">
      {a()}Search Text111<img src={cake}/>
      </div>
  }
}

ReactDOM.render(
  <Search/>,
  document.getElementById('root')
);