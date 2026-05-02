# AluminiumPro B2B Platform

A production-grade, full-stack B2B e-commerce platform designed specifically for wholesale aluminium profile suppliers.

## Overview
AluminiumPro handles complex B2B logic such as multi-unit pricing (Weight vs Length), strict 18% GST application, and bulk enquiry workflows. It features a robust administration dashboard to manage products, inventory, and fulfillment lifecycles.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Payments**: Razorpay

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env` and fill in your actual credentials.
```bash
cp .env.example .env
```
*Note: You must have a running PostgreSQL database. You can use Neon, Supabase, or Render for a quick cloud database.*

### 3. Database Setup
Push the Prisma schema to your database to create the required tables.
```bash
npx prisma db push
```

### 4. Seed Database (Optional but Recommended)
Populate your fresh database with an Admin user, a Test user, and a catalogue of sample aluminium products.
```bash
npm run prisma:seed
```
*Note: This will create an admin account with `admin@aluminiumpro.in` and password `admin123`.*

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features
1. **Dynamic B2B Price Calculator**: Allows buyers to calculate exact prices based on required lengths (feet) or weights (kg), with real-time GST computation.
2. **Secure Razorpay Checkout**: Fully integrated payment gateway with server-side signature verification to prevent tampering.
3. **Admin Dashboard**: A protected `/admin` route for managing the entire catalogue, viewing incoming orders, and updating fulfillment statuses.
4. **Order Tracking**: Interactive timeline for B2B customers to track their bulk shipments in real-time.

## License
Private / Proprietary
