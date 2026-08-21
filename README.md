# Qless - Queue Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)

**Qless** is a comprehensive queue management system designed for seamless customer service operations. It allows organizations to manage customer queues efficiently, provide real-time updates, and analyze service performance.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started--setup-instructions)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

## Features

### For Customers
- **Join Queue**: Get a queue number and wait for service
- **Real-time Updates**: Track your position in the queue
- **Service Notifications**: Get notified when it's your turn
- **SMS Notifications**: Receive alerts via SMS

### For Staff
- **Dashboard**: Overview of queue statistics
- **Call Next Customer**: Manage current queue
- **Service Management**: Add/edit/delete services
- **User Management**: Manage staff accounts
- **Reports**: Generate service reports
- **Notifications**: Receive real-time alerts

### Admin Features
- **All Staff Features**
- **System Configuration**: Manage business hours and settings
- **Queue Management**: Pause, resume, or clear queues
- **Role Management**: Control staff access levels
- **Billing Management**: Track service usage and billing

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: React Context API, Zustand
- **Forms**: React Hook Form, Zod
- **HTTP Client**: Axios, TanStack Query
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ORM/ODM**: Mongoose
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **SMS Integration**: Twilio (planned)
- **Real-time**: Socket.io

### Tools
- **Build Tool**: Next.js Build System
- **Package Manager**: npm, yarn, or pnpm
- **Version Control**: Git
- **Hosting**: Vercel (Frontend), Render/AWS (Backend)

## Project Structure

```
qless/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── admin/        # Admin section
│   ├── staff/        # Staff section
│   └── customer/     # Customer section
├── components/       # Reusable UI components
├── lib/              # Utility functions and helpers
├── models/           # Mongoose models
├── routes/           # API route handlers
├── services/         # Business logic and external services
├── middleware/       # Express middleware
├── public/           # Static assets
├── .env.example      # Environment variable template
└── package.json      # Project dependencies and scripts
```

## Getting Started / Setup Instructions

Follow these steps to set up and run the project on your local machine after cloning:

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory by copying the provided example:
   ```bash
   cp env.example .env
   ```
   Make sure to configure the `MONGODB_URI` to point to your MongoDB instance and adjust the `PORT` if necessary.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) (or the port your server runs on) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
