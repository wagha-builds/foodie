# <img src="public/logo.svg" alt="Foodie Logo" width="45" height="45" align="top" /> Foodie

Foodie is a modern, feature-rich food delivery web application built with **Next.js 15 (App Router)**. It provides a seamless experience for browsing restaurants, managing a cart, and tracking orders in real-time.

**Live Demo:** [https://foodie-three-sigma.vercel.app](https://foodie-three-sigma.vercel.app)

## ✨ Key Features

* **Restaurant Discovery:** Browse a variety of restaurants with filtering by cuisine, rating, price, and delivery time.
* **Smart Search:** Real-time search for dishes and restaurants.
* **Interactive Menu:** Dynamic menu categorization with veg/non-veg toggles and customizable items.
* **Cart & Checkout:** Full shopping cart functionality with coupon application and secure checkout simulation.
* **Live Order Tracking:** Simulated real-time order status updates (Accepted → Preparing → Out for Delivery) with a live map view.
* **AI Assistant:** Integrated **Foodie AI** (powered by Google Gemini) to answer queries about food, calories, and diet.
* **Dark Mode:** Fully responsive UI with toggleable light and dark themes.
* **Authentication:** Supports Google Sign-In (via Firebase) and Demo Login.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
* **State Management:** React Context & TanStack Query
* **Maps:** MapLibre GL
* **AI:** Google Generative AI (Gemini)
* **Storage:** In-memory mock database (simulating a real backend for demonstration purposes).

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v18.17.0 or higher)
* **npm**, **yarn**, **pnpm**, or **bun**

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Anexus5919/foodie.git](https://github.com/Anexus5919/foodie.git)
    cd foodie
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory. You will need keys for Firebase (auth) and Google AI (chatbot) for full functionality.
    
    ```env
    # Google AI (Required for Chatbot)
    GOOGLE_API_KEY=your_gemini_api_key

    # Firebase (Required for Google Auth)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    *(Note: If Firebase keys are missing, the app will default to a "Demo Mode" for login).*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Note on Data Persistence

This project currently uses an **in-memory storage simulation** (`lib/storage.ts`) to demonstrate functionality without requiring a complex backend setup. This means:
* User accounts, orders, and cart items will reset if the application redeploys or the server restarts.
* The order tracking simulation runs automatically on the client/server state during the session.
