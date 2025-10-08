# e-Referral System Documentation

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Technology Stack](#technology-stack)
- [Libraries](#libraries)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Code Quality](#code-quality)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

The e-Referral System is a comprehensive digital platform built with Next.js and TypeScript, designed to digitize information on gender-based violence services for women and girls. This system facilitates secure referrals, case management, and service coordination between healthcare providers, social workers, and support organizations to ensure survivors receive appropriate care and support services.

## Features

- **Secure Referral Management** - Digital referral system for gender-based violence cases
- **Flow-based Interface** - Interactive flowchart system for case management and decision support
- **Dashboard Analytics** - Comprehensive analytics and reporting for service providers
- **Authentication & Authorization** - Secure user authentication with role-based access control
- **Case Tracking** - End-to-end tracking of referrals and case progression
- **Multi-role Support** - Interfaces for healthcare providers, social workers, and administrators
- **Data Visualization** - Charts and graphs using Recharts for service metrics
- **Responsive Design** - Mobile-friendly interface built with Tailwind CSS
- **Type Safety** - Full TypeScript implementation for robust development
- **Code Quality Tools** - ESLint, Prettier, and Husky for maintaining code standards

## Getting Started

### Prerequisites

- **Node.js v20.15.0** (Required: This project specifically requires Node.js v20.15.0)
- **npm** (comes with Node.js)
- **Git**

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/dsti-sl/e-referral.git
# or
git clone git@github.com:dsti-sl/e-referral.git
```

2. **Navigate to Project Directory**

```bash
cd e-referral
```

3. **Setup Node.js Version**

```bash
# Using nvm (recommended)
nvm install 20.15.0
nvm use 20.15.0
```

4. **Install Dependencies**

```bash
npm install
```

5. **Start Development Server**

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Environment Setup

Create a `.env.local` file in the root directory based on `.env.example`:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration values
```

Configure your environment variables in the `.env.local` file:

```env
# Database Configuration
DATABASE_URL=your_database_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# API Configuration
API_BASE_URL=your_api_base_url

# Other service configurations
# Add additional environment variables as needed
```

## Technology Stack

- **Frontend Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library
- **Authentication:** NextAuth.js (inferred from project structure)
- **Data Visualization:** Recharts
- **Database:** (Configured via DATABASE_URL)
- **Form Handling:** React Hook Form (likely)
- **State Management:** React Context API
- **Code Quality:** ESLint, Prettier, Husky
- **Development Tools:** VS Code configurations included

## Libraries

### Core Dependencies

- **Next.js** - React framework with App Router
- **React** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript development

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom UI Components** - Reusable component library
- **Recharts** - Data visualization and charting library

### Development & Code Quality

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **TypeScript** - Static type checking

### Authentication & Data

- **NextAuth.js** - Authentication solution (inferred)
- **Database integration** - Via lib/db.ts
- **API utilities** - Custom API layer in lib/api.ts

## Project Structure

```
e-referral/
├── .husky/                     # Git hooks configuration
├── .vscode/                    # VS Code settings and configurations
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── flows/
│   │   │   ├── flowcanvas/
│   │   │   │   ├── layout.tsx  # Flow canvas layout
│   │   │   │   └── page.tsx    # Flow canvas page
│   │   │   ├── layout.tsx      # Flows section layout
│   │   │   └── page.tsx        # Flows main page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── shared/             # Shared/common components
│   │   ├── ui/                 # UI component library
│   │   │   ├── button.tsx      # Button component
│   │   │   ├── card.tsx        # Card component
│   │   │   └── ...             # Other UI components
│   │   └── ...                 # Additional component files
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/
│   │   └── useAuth.tsx         # Authentication hook
│   ├── lib/
│   │   ├── api.ts              # API utilities and functions
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── db.ts               # Database utilities
│   │   └── utils.ts            # General utility functions
│   └── utils/
│       ├── formatDate.ts       # Date formatting utilities
│       └── helpers.ts          # Helper functions
├── .env.example                # Environment variables template
├── .eslintignore              # ESLint ignore patterns
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore patterns
├── .nvmrc                     # Node version specification
├── .prettierrc.json           # Prettier configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Development Workflow

### Code Quality Standards

The project maintains high code quality with:

- **TypeScript** - Static type checking for robust development
- **ESLint** - Code linting with custom rules
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks for quality checks

### Authentication Flow

- Context-based authentication using AuthContext
- Custom useAuth hook for authentication state management
- Protected routes and role-based access control

### Component Architecture

- **UI Components** - Reusable component library in `components/ui/`
- **Shared Components** - Common components across the application
- **Dashboard Components** - Specialized components for dashboard functionality

## Available Scripts

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint checks
npm run lint:fix      # Fix ESLint issues automatically
npm run format        # Format code with Prettier

# Type Checking
npm run type-check    # Run TypeScript type checking
```

## Code Quality

### Pre-commit Hooks

The project uses Husky to run pre-commit checks:

- Code linting with ESLint
- Code formatting with Prettier
- TypeScript type checking
- Additional custom checks as configured

### ESLint Configuration

- Custom ESLint rules for Next.js and TypeScript
- Accessibility checks
- Import/export best practices
- React hooks rules

### Prettier Configuration

- Consistent code formatting across the project
- Automatic formatting on save (VS Code configured)
- Integration with ESLint for conflict resolution

## Troubleshooting

### Common Issues

**Node.js Version Issues**

```bash
Error: "Project requires Node.js v20.15.0"
Solution: Use nvm to switch to the correct version:
nvm install 20.15.0
nvm use 20.15.0
```

**Environment Variables Issues**

- Ensure `.env.local` file exists and contains all required variables
- Check database connection string format
- Verify API endpoints and authentication configuration

**Build Issues**

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

**Authentication Issues**

- Verify NextAuth configuration in environment variables
- Check database connection for session storage
- Ensure NEXTAUTH_SECRET is properly set

**Database Connection Issues**

- Verify DATABASE_URL format and credentials
- Check database server availability
- Test connection independently

**ESLint/Prettier Conflicts**

```bash
# Fix formatting issues
npm run format
npm run lint:fix

# Check for conflicting rules
npx eslint --print-config src/app/page.tsx
```

### Performance Issues

- Monitor bundle size with Next.js analyzer
- Check for unused dependencies
- Optimize images and static assets
- Review database query performance

## Contributing

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Set Up Development Environment**
   ```bash
   nvm use 20.15.0
   npm install
   cp .env.example .env.local
   # Configure environment variables
   ```
4. **Make Your Changes**
   - Follow TypeScript best practices
   - Maintain component reusability
   - Write meaningful commit messages
   - Test across different user roles
5. **Quality Checks**
   ```bash
   npm run type-check
   npm run lint
   npm run format
   npm run build
   ```
6. **Commit Your Changes**
   ```bash
   git commit -m 'Add: your feature description'
   ```
7. **Push to Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Submit a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode practices
- Use proper type definitions for all components
- Maintain consistent naming conventions
- Write comprehensive component documentation
- Test authentication and authorization flows
- Ensure responsive design across devices
- Follow accessibility best practices

## Contact

For questions, feedback, or contributions, please reach out via:

- **Development Team** - Contact the development team
- **Issues** - Create an issue on GitHub for bug reports or feature requests

---

© 2025 DSTI. All rights reserved.
