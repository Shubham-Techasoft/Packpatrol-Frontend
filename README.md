# ⚙️ PackPatrol Frontend

Welcome to the **PackPatrol Frontend** — the interface for managing and monitoring AI-powered industrial inspection machines. This guide provides all the necessary information for developers to get the project running locally, understand its architecture, and contribute effectively.

---

## 🧭 Table of Contents
1. [🚀 Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Configuration](#environment-configuration)
2. [🛠️ Tech Stack & Key Libraries](#️-tech-stack--key-libraries)
3. [🏗️ Project Structure](#️-project-structure)
4. [🧩 Core Concepts & Domain Model](#-core-concepts--domain-model)
5. [🔐 Authentication & Authorization](#-authentication--authorization)
6. [📈 State Management](#-state-management)
7. [🌐 API Communication](#-api-communication)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- 🟢 **Node.js**: `v18` or later.
- 🟣 **npm**: Comes bundled with Node.js.
- 🖧 A running instance of the **PackPatrol Backend** service.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd packpatrol-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

### Environment Configuration

The project uses environment variables to configure the backend API URL. This is a more secure and flexible approach than hardcoding the URL.

1.  Create a new file named `.env` in the root of the project.
2.  Add the following line to the `.env` file, replacing the URL with your actual backend server address:
    ```env
    VITE_API_BASE_URL=http://127.0.0.1:8000
    ```
3.  The application code in `src/utils/api.js` is already set up to use this variable.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 🛠️ Tech Stack & Key Libraries

-   **Framework**: React
-   **Build Tool**: Vite
-   **UI Library**: Material-UI (MUI)
-   **Data Fetching**: Axios & native `fetch`
-   **Charting**: Recharts
-   **Date/Time**: Day.js

---

## 🏗️ Project Structure

The project follows a standard React application structure.

```
src/
├── assets/         # Static assets like images and logos
├── components/     # Reusable UI components (e.g., Header, Dialogs)
├── pages/          # Top-level page components for each route
│   ├── sections/   # Components specific to a particular page
│   ├── Home.tsx
│   ├── Dashboard.jsx
│   └── ...
├── utils/          # Utility functions (auth, API configuration)
├── App.jsx         # Main application component with routing
├── main.jsx        # Application entry point
└── MachineSelectionContext.jsx # React Context for global state
```

---

## 🧩 Core Concepts & Domain Model

The application is built around three core entities that model the industrial inspection process:

-   **🖥️ Machine**: Represents the physical hardware performing inspections.
-   **🍪 Variant**: A specific product type to be inspected (e.g., "Chocolate Chip Cookie").
-   **🧠 ML Model**: The AI "brain" trained to identify defects for a particular Variant.

**Relationships:**
-   A **Machine** can inspect multiple **Variants** (Many-to-Many).
-   A **Variant** can have multiple **ML Models** (e.g., different versions), but only one can be active at a time (One-to-Many).

---

## 🔐 Authentication & Authorization

-   **Authentication**: Managed via JWT tokens stored in `localStorage`. The `isAuthenticated()` function in `src/utils/auth.js` checks for a valid token.
-   **Authorization**: The application uses a role-based access control (RBAC) system. Helper functions like `isSuperAdmin()`, `isPrivilegedUser()`, and `isManager()` in `src/utils/auth.js` are used to conditionally render UI elements and protect routes based on the user's designation.

---

## 📈 State Management

-   **Local State**: Most components manage their own state using React's `useState` and `useEffect` hooks.
-   **Global State**: A shared global state for the currently selected machine is managed using React Context.
    -   **`MachineSelectionContext.jsx`**: This file defines the context provider and the `useMachineSelection` hook.
    -   **Usage**: Components like `Dashboard.jsx` and `Home.tsx` use the `useMachineSelection` hook to access and update the `selectedMachineId` across the application, ensuring a consistent experience.

---

## 🌐 API Communication

-   **Base URL**: The backend API URL is configured in `src/utils/api.js` and sourced from the `VITE_API_BASE_URL` environment variable.
-   **Data Fetching**: The application uses a mix of `axios` and the native `fetch` API for making HTTP requests to the backend.
-   **Real-time Updates**: The `Dashboard.jsx` and `Home.tsx` pages use **Server-Sent Events (SSE)** to receive real-time data from the backend, such as live image feeds and machine statistics. The SSE connection includes robust error handling and automatic reconnection logic.
