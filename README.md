# Loop E-Commerce Platform

This repository contains the user-side implementation of **Loop**, an e-commerce platform for peripherals, games, and collectibles. Built with Next.js, it provides a smooth shopping experience with product filtering, cart management, order placement, and a basic admin panel for managing orders.

---

## Tech Stack

### Frontend
- **Next.js** 
- **Tailwind CSS** 
- **Axios** 

### Backend
- **Node.js** 
- **Mongoose** 
- **Next.js API Routes**
  
### Database
- **MongoDB (Atlas)** 

---

## Workflow Overview
1. Frontend (Next.js) sends API requests via Axios  
2. Backend processes requests with Next.js API routes  
3. Mongoose interacts with MongoDB Atlas  
4. Backend returns data  
5. Frontend updates UI

---


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
