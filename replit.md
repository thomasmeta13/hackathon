# HTW Earn Hub - Gamified Task Platform

## Overview

HTW Earn Hub is a gamified task management platform designed for Honolulu Tech Week (HTW) 2025. The platform connects organizers, event hosts, and community members through AI-assisted task creation and completion. It features a comprehensive gamification system with XP points, badges, leaderboards, and skill tracking to incentivize community participation in event planning and execution.

The application enables organizers to create and distribute tasks using AI assistance, while community members (taskers) can claim and complete these tasks through guided AI interactions. The platform supports various task types including marketing content, video creation, coding, design, and event planning activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in a Vite-powered single-page application
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Design System**: Custom theme supporting both light and dark modes with HTW-specific branding
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Component Strategy**: Modular component architecture with reusable UI components for tasks, user profiles, leaderboards, and analytics

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints with Express middleware for authentication and request handling
- **Session Management**: Express sessions with PostgreSQL storage for user authentication
- **Error Handling**: Centralized error handling with structured error responses

### Database Design
- **Core Entities**: Users, Tasks, Organizations, UserTaskHistory, and Sessions
- **User System**: Role-based access (organizer vs tasker) with XP tracking, skills, and badges
- **Task System**: Comprehensive task lifecycle with categories, types, status tracking, and AI output storage
- **Gamification**: XP points, badge collection, and completion tracking for community engagement

### Authentication & Authorization
- **Authentication Provider**: Replit Auth integration with OpenID Connect
- **Session Strategy**: Server-side sessions stored in PostgreSQL with secure cookies
- **Role Management**: Role-based navigation and feature access (organizer vs tasker views)
- **Security**: HTTPS enforcement, secure session cookies, and CSRF protection

### Data Flow Patterns
- **Task Creation**: AI-assisted task generation with iterative refinement capabilities
- **Task Completion**: Guided AI interactions for task execution with progress tracking
- **Real-time Updates**: Query invalidation and refetching for live data synchronization
- **Optimistic Updates**: Client-side state updates with server confirmation for responsive UX

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL with Neon serverless hosting
- **Session Store**: PostgreSQL-based session storage using connect-pg-simple
- **Development Platform**: Replit with integrated authentication and deployment

### AI Integration
- **Primary AI Service**: OpenAI API for natural language processing and content generation
- **Fallback Strategy**: Rule-based task generation system for API failures
- **AI Features**: Task creation assistance, completion guidance, and content generation

### UI & Styling
- **Component Library**: Radix UI primitives for accessibility and behavior
- **Styling Framework**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Typography**: Inter (UI) and JetBrains Mono (code) font families

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across client, server, and shared schemas
- **Package Management**: npm with lockfile for dependency consistency
- **Code Quality**: ESBuild for server bundling and PostCSS for CSS processing

### Monitoring & Analytics
- **Query Monitoring**: TanStack Query DevTools for debugging data fetching
- **Error Tracking**: Built-in error boundaries and centralized error handling
- **Performance**: Vite's built-in performance monitoring and hot module replacement