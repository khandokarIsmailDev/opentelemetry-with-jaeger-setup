const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Set the log level (optional, for debugging)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Configure the Jaeger Exporter
const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

// Define the service name and other resource attributes
const resource = new Resource({
  'service.name': 'nodejs-ismail-service', // Service name
  'service.version': '1.0.0',           // Optional: version
  'deployment.environment': 'development', // Optional: environment
});


// Configure the OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  resource, // Use the defined resource
  instrumentations: [
    new HttpInstrumentation(), // Automatically instrument HTTP requests
  ],
});

// Start the SDK
sdk.start()

// Ensure the SDK is shut down properly on process exit
process.on('SIGTERM', () => {
  sdk.shutdown().then(() => console.log('Tracing terminated'));
});
