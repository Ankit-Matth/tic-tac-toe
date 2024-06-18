import React, { useState } from 'react';
import Offline from './components/GameModes/Offline/Offline';
import Online from './components/GameModes/Online/Online';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);

  const homePage = () => {
    setMode(null);
  };

  const renderComponent = () => {
    switch (mode) {
      case 'online':
        return <Online homePage={homePage} />;
      case 'offline':
        return <Offline homePage={homePage} />;
      default:
        return (
          <div className="button-container">
            <div className="inner">
              <button className="btns" onClick={() => setMode('online')}>Play Online</button>
              <button className="btns" onClick={() => setMode('offline')}>Play Offline</button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderComponent()}
    </>
  );
}

export default App;
