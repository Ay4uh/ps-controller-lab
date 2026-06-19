# Controller Lab

A modular web-based tool for testing and calibrating PlayStation and Xbox controllers.

## Build Process

This project uses Gulp and Rollup for building and optimizing the application.

### Available Scripts

- `npm run build` - Build the application for development
- `npm run build:prod` - Build the application for production (with minification and hashing)
- `npm run clean` - Remove the dist and temporary directories
- `npm run dev` - Start file watching for development
- `npm run watch` - Same as dev (for compatibility)
- `npm run serve` - Start a static HTTP server serving the dist directory
- `npm run serve:https` - Start an HTTPS static HTTP server
- `npm run start` - Build and serve the application
- `npm run dev:serve` - Build, then concurrently start watching and serving
- `npm run dev:full` - Build, then concurrently start watching, and serving (with process killing on change)
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run format` - Run Prettier to format code
- `npm run test` - Run Jest unit tests

### Development Workflow

1. For active development: `npm run dev:serve`
2. This will:
   - Build the application initially
   - Start watching files for changes
   - Start a web server serving the built application
   - When files change, the application will be rebuilt and the browser can be refreshed

### Production Build

To create a production-optimized build:
- `npm run build:prod`

This will:
- Clean the dist directory
- Bundle and minify JavaScript with Rollup
- Minify HTML
- Generate hashed filenames for cache busting
- Output everything to the dist directory

### Code Quality

- ESLint is configured to catch common JavaScript issues
- Prettier is configured for consistent code formatting
- Run `npm run lint` to check for issues
- Run `npm run format` to automatically fix formatting issues

## Project Structure

```
controller-lab/
├── js/
│   ├── main.js              # Application entry point
│   ├── controller-manager.js # Manages controller instances
│   ├── storage.js           # Local storage wrapper
│   ├── utils.js             # Utility functions
│   ├── translations.js      # Simple translation utility
│   └── controllers/         # Controller-specific implementations
│       ├── base-controller.js     # Base class for all controllers
│       ├── controller-factory.js  # Factory for creating controller instances
│       ├── ds4-controller.js      # DualShock 4 implementation
│       ├── ds5-controller.js      # DualSense implementation
│       ├── ds5-edge-controller.js # DualSense Edge implementation
│       └── xbox-controller.js     # Xbox controller implementation
├── index.html               # Main HTML file
├── package.json             # NPM package configuration
├── gulpfile.js              # Gulp build tasks
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── jest.config.js           # Jest testing configuration
└── babel.config.js          # Babel configuration for Jest
```