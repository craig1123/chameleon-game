import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = ({ errorName, onSubmit }) => {
  // store in localStorage
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="login-name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Enter a name"
            id="login-name"
          />
          {errorName && <Form.Text className="text-error">{errorName}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="primary">
          Join
        </Button>
      </Form>
    </div>
  );
};

export default Login;
