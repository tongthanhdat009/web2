import Button from 'react-bootstrap/Button';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
function App() {
  return (
    <div className="container">
      <h1>Hello, Bootstrap!</h1>
      <Button variant="primary">Click Me</Button>
      <FontAwesomeIcon icon={faCoffee} size="2x" />
    </div>
  );
}

export default App;
