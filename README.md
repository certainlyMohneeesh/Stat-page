# Status Page Application

A modern status page application built with React, Framer Motion, and shadcn/ui components.

## Features

- User Authentication with Google and GitHub OAuth
- Team Management
- Multi-tenant Organization Support
- Service Management (CRUD operations)
- Incident/Maintenance Management
- Real-time Status Updates
- Public Status Page
- Modern UI with Animations

## Tech Stack

- React.js
- TypeScript
- Framer Motion
- shadcn/ui
- Socket.io
- React Query
- React Hook Form
- Zod

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_API_URL=your_api_url
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── lib/           # Utility functions
├── types/         # TypeScript types
├── api/           # API integration
└── store/         # State management
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 