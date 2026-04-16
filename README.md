# Full-Stack Event Management Platform (A project in progress)🎫

[Live Demo]([https://your-vercel-link.vercel.app]) | [Backend API](https://backend-production-7285.up.railway.app/)

A web application designed to manage, discover, and organize events. The platform features three user levels (Public, Owner, and Admin), allowing business owners to create events and users to search by category or location.


## 🚀 Key Features

- Multi-Role Access: Built a secure system with three access levels (Public, Owner, and Admin) using JWT authentication.

- Dynamic Event Discovery: Implemented a filtering system by category and location that stays synced with the URL SearchParams for easy sharing.

- Owner Dashboard: A private space for business owners to manage their listings (Create, Edit, Delete) with support for image uploads.

- Optimized Navigation: Centralized event data in the main App component to allow for instant transitions between the dashboard and event details.

- **Role-Based Access Control (RBAC):**
  - **Public:** Browse and filter events without an account.
  - **Owners:** Private dashboard to create, edit (with image upload), and delete their own events.
  - **Admin:** Global management of the platform ecosystem.

<img width="1920" height="1080" alt="Screenshot 2026-04-16 at 4 05 12 PM" src="https://github.com/user-attachments/assets/3413cb90-cce2-4e3e-9d4b-005f3ee0df0b" />
<img width="1920" height="1080" alt="Screenshot 2026-04-16 at 4 05 34 PM" src="https://github.com/user-attachments/assets/083c16af-c68c-40ad-ba54-e7ce6b30d92a" />
<img width="1920" height="1080" alt="Screenshot 2026-04-16 at 4 05 39 PM" src="https://github.com/user-attachments/assets/c62a9832-8eea-43b8-a738-294191dda29a" />

## 🛠️ Tech Stack

**Frontend:**
- **React 18** & **TypeScript** (for type-safe development).
- **Tailwind CSS** (for responsive, modern UI).
- **React Router Dom** (SPA navigation).
- **Axios** (custom instance for API communication).

**Backend:**
- **Node.js** & **Express**.
- **MongoDB** & **Mongoose** (ODM).
- **Multer** (for handling image uploads).
- **JWT** (JSON Web Tokens for secure session management).

** Tools:**
- **Vercel** (Frontend Deployment).
- **Render** (Backend Hosting).
- **Vitest** & **React Testing Library** (Unit and Integration testing).

## ⚙️ How to Run Locally

1. **Clone:** `git clone https://github.com/your-username/event-board.git`
2. **Frontend:** `cd frontend` -> `npm install` -> `npm run dev`
3. **Backend:** `cd backend` -> `npm install` -> `npm run dev` (Needs a `.env` with `MONGO_URI` and `JWT_SECRET`).

_____________________________________________________________________________

🌱 Lessons Learned

The "Lifting State Up" Moment: I originally had each page fetching its own data, which felt slow. Moving the state to App.tsx taught me how to manage data flow more efficiently so the app feels like a single, fluid experience.

The Timezone Puzzle: Managing dates between a MongoDB backend (UTC) and a frontend date picker was challenging. It taught me a lot about how JavaScript handles time and how to keep data consistent for all users.

TypeScript in Practice: Transitioning the project to TypeScript helped me catch several bugs before they even reached the browser, especially when passing data through props to the EventCard components.
