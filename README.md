# ExpensePro

ExpensePro is a premium, state-of-the-art financial dashboard designed for modern personal finance management. It combines a sleek, minimalist aesthetic with powerful features like real-time currency conversion and categorical budgeting.

## Features

-   **Intelligent Dashboard**: At-a-glance view of your total balance, monthly savings, and spending breakdown.
-   **Real-time Currency Conversion**: Seamlessly switch between global currencies (USD, EUR, GBP, INR, etc.) with live rates.
-   **Categorical Budgeting**: Set monthly limits for different categories (Food, Travel, Shopping, etc.) and track your progress with visual progress bars.
-   **Advanced Transaction Logging**: 
    -   Paginated history for clean viewing.
    -   Month-wise chronological grouping.
    -   Quick add for both **Expenses** and **Income**.
    -   Secure deletion flow with confirmation modals.
-   **Fully Responsive**: A tailored mobile experience with a dynamic bottom navigation bar that adapts to your current view.
-   **Premium UI/UX**: Built with a "less is more" philosophy, featuring smooth spring-based animations, glassmorphism headers, and high-contrast typography.

## How it's Made (Tech Stack)

The application is built using a modern, performant frontend stack:

-   **React (Vite)**: For a lightning-fast development experience and optimized production builds.
-   **TypeScript**: Ensuring type safety and robust code across the state management and services.
-   **Tailwind CSS**: For the custom, premium design system and responsive layouts.
-   **Framer Motion**: Powering all the smooth transitions, modal entries, and list layout animations.
-   **Recharts**: Providing the interactive spending breakdown and balance history visualizations.
-   **Lucide React**: A consistent, high-quality icon set used throughout the interface.

## API Integration

ExpensePro uses the **[Frankfurter API](https://www.frankfurter.app/)** to provide real-time currency exchange rates.

-   **Where**: 
    -   `src/contexts/CurrencyContext.tsx`: Initializing live rates globally when the app loads.
    -   `src/components/CurrencyConverter.tsx`: Fetching the latest rates on-demand when the user clicks the "Refresh" button.
-   **Purpose**: To ensure that converted amounts in the dashboard, transaction logs, and the converter widget are always accurate based on current market data.

## How to Run the App

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/)

### Steps to Run

1.  **Clone the repository** (if applicable) or navigate to the project directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  **Open the App**:
    The app will typically be available at `http://localhost:5173`.

### Production Build

To create an optimized production bundle:
```bash
npm run build
```
The output will be in the `dist/` directory.

---
Built with care by the Rohit Bej.
