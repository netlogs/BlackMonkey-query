import React from 'react';
import './App.css';
import AddressChecker from './AddressChecker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wukong Token批量领取查询</h1>
        <AddressChecker />
      </header>
      <footer className="App-footer">
        <a href="https://twitter.com/liarpzu" target="_blank" rel="noopener noreferrer">
           在 X 上关注我，随时获得帮助 @liarpzu
        </a>
      </footer>
    </div>
  );
}

export default App;
