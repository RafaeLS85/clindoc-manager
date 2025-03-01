# ClinDoc Manager v0.1.0

ClinDoc Manager is a desktop application built with Electron, Vite, TypeScript, and React. It is designed to help manage clinical documents by reading and displaying DOCX files. This initial release (v0.1.0) provides the core functionality to open DOCX files and render their content on screen. Future versions will introduce additional features such as editing, searching, and more advanced document management.

## Features

- **Read DOCX Files:**
  Leverage a DOCX-to-HTML conversion library (e.g., Mammoth.js) to seamlessly convert DOCX files for display.

- **Display Content:**
  The application renders the converted HTML content in a clean, user-friendly interface.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) v14.x or later
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd ClinDoc-Manager

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
