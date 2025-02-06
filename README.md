# Loop - E-commerce Platform

## Introduction
**Loop** is an e-commerce platform specializing in peripherals, games, and collectibles. It enables users to browse, filter, and purchase products, with authentication, cart management, and order placement. Orders are stored in the database without payment processing.

## Features
### **User Authentication**
- Sign up, log in, log out, password reset, and account updates.

### **Product Browsing & Filtering**
- Categories: **Peripherals, Games, Collectibles**.
- Search by name/keyword, filter by price, category, and reviews.

### **Shopping Cart & Orders**
- Add, modify, and persist cart contents.
- Checkout with shipping details.
- View order history and leave reviews.

## **Technical Overview**
- **MongoDB** – NoSQL database.
- **Next.js** – Frontend framework.
- **Axios** – API requests.
- **Node.js** – Backend logic.
- **Mongoose** – ODM for MongoDB.
- **Tailwind CSS** – Styling.
- **Vercel** – Hosting.

## **Setup & Deployment**
### **Clone & Install**
```bash
git clone https://github.com/yourusername/loop-ecommerce.git
cd loop-ecommerce
npm install
```

### **Run Development Server**
```bash
npm run dev
```

### **Environment Variables**
Create a `.env.local` file:
```
MONGODB_URI=your_mongodb_connection
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

### **Deploy to Vercel**
```bash
vercel deploy
```


