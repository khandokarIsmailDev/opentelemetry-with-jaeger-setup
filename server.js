// server.js
const express = require('express');

// Import OpenTelemetry API to start spans
const { trace } = require('@opentelemetry/api');

// Initialize tracing (ensure this is imported before other code)
require('./tracing');

const app = express();

// Root route with tracing
app.get('/', (req, res) => {
  const tracer = trace.getTracer('example-tracer'); // Get a named tracer
  const span = tracer.startSpan('/');   // Start a custom span

  // Add attributes or events to the span
  span.setAttribute('example-attribute', 'value');
  span.addEvent('Processing request');

  // Simulate some work
  setTimeout(() => {
    span.end(); // End the span
    res.send('Hello, OpenTelemetry and Jaeger!');
  }, 100);
});

// Start the server
const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
