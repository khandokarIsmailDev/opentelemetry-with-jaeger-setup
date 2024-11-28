const express = require('express');

// Import OpenTelemetry API to start spans
const { trace } = require('@opentelemetry/api');

// Initialize tracing (ensure this is imported before other code)
require('./tracing');

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Root route with tracing
app.get('/', (req, res) => {
  const tracer = trace.getTracer('example-tracer'); // Get a named tracer
  const span = tracer.startSpan('/'); // Start a custom span

  span.setAttribute('example-attribute', 'root-request');
  span.addEvent('Root route processing started');

  setTimeout(() => {
    span.addEvent('Root route processing finished');
    span.end(); // End the span
    res.send('Hello, OpenTelemetry and Jaeger!');
  }, 100);
});

// Example GET route with query parameters
app.get('/user', (req, res) => {
  const tracer = trace.getTracer('example-tracer');
  const span = tracer.startSpan('/user');

  span.setAttribute('user.query.name', req.query.name || 'unknown');
  span.addEvent('Received GET request for user');

  setTimeout(() => {
    span.addEvent('Fetched user data');
    span.end();
    res.json({
      message: 'User data retrieved',
      user: { name: req.query.name || 'Anonymous' },
    });
  }, 200);
});

// Example POST route with request body
app.post('/user', (req, res) => {
  const tracer = trace.getTracer('example-tracer');
  const span = tracer.startSpan('/user POST');

  span.setAttribute('user.body', JSON.stringify(req.body));
  span.addEvent('Received POST request to create user');

  setTimeout(() => {
    span.addEvent('User creation processed');
    span.end();
    res.json({
      message: 'User created successfully',
      user: req.body,
    });
  }, 300);
});

// Example GET route with path parameter
app.get('/user/:id', (req, res) => {
  const tracer = trace.getTracer('example-tracer');
  const span = tracer.startSpan(`/user/${req.params.id}`);

  span.setAttribute('user.id', req.params.id);
  span.addEvent('Processing request for user ID');

  setTimeout(() => {
    span.addEvent('Fetched data for user ID');
    span.end();
    res.json({
      message: 'User details retrieved',
      user: { id: req.params.id, name: 'John Doe' },
    });
  }, 150);
});

// Example POST route to simulate data processing
app.post('/process', (req, res) => {
  const tracer = trace.getTracer('example-tracer');
  const span = tracer.startSpan('/process');

  span.setAttribute('process.data', JSON.stringify(req.body));
  span.addEvent('Processing data');

  setTimeout(() => {
    span.addEvent('Data processing completed');
    span.end();
    res.json({
      message: 'Data processed successfully',
      result: req.body,
    });
  }, 500);
});

// Start the server
const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
