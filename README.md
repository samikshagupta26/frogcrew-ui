# FrogCrew - Crew Management System

A Vue.js frontend application for managing crew members, game schedules, and crew assignments for sports production teams.

## Features

- Authentication with JWT
- Create and manage crew member profiles
- View and manage game schedules
- Submit and track crew availability
- Admin features for crew management, scheduling, and assignments

## Prerequisites

- Node.js (v16+)
- NPM or Yarn
- Backend API running on http://localhost:8080

## Setup and Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to: http://localhost:5173

## Build for Production

```bash
npm run build
```

## Backend API

This frontend application requires a SpringBoot backend API running on http://localhost:8080. Make sure the backend server is up and running before using this application.

## User Roles

The application supports two user roles:

1. **Crew Member**: Can update their profile, view schedules, and submit availability.
2. **Admin**: Has all crew member permissions plus the ability to manage crew members, game schedules, and crew assignments.

## Login Information

For testing purposes, you can use these credentials:

- Admin:

  - Email: admin@frogcrew.com
  - Password: admin123

- Crew Member:
  - Email: crew@frogcrew.com
  - Password: crew123
