# Bybit Trader Dashboard

A real-time trading dashboard for Bybit, built with React and Node.js. This application allows you to track your balance, open positions, and active orders in a simplified interface.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

*   **Real-time Balance Tracking:** View your total USDT assets instantly.
*   **Open Positions:** Detailed table of your active futures positions including PNL, entry price, mark price, and liquidation price.
*   **Active Orders:** List of your open limit and trigger orders.
*   **Currency Conversion:** Switch between **USD ($)** and **TRY (₺)** to see your portfolio value in your preferred currency.
*   **Language Support:** Fully localized interface in **English** and **Turkish**.
*   **Position Summary:** Aggregate view of your Long and Short exposure with total PNL.

## Tech Stack

*   **Frontend:** React.js
*   **Backend:** Node.js, Express.js
*   **API Integration:** CCXT (CryptoCurrency eXchange Trading Library)

## Installation

### Prerequisites

*   Node.js (v14 or higher)
*   npm or yarn
*   A Bybit account with API keys (Read-only permissions are sufficient for viewing data)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bybit-dashboard.git
cd bybit-dashboard
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on the example:

```bash
cp .env.example .env
```

Open `.env` and add your Bybit API credentials:

```env
BYBIT_API_KEY=your_api_key_here
BYBIT_SECRET=your_api_secret_here
```

Start the server:

```bash
node index.js
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the React application:

```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

## Usage

1.  Ensure both the backend server and frontend client are running.
2.  Open your browser to `http://localhost:3000`.
3.  Use the **$ / ₺** toggle in the top right to switch currencies.
4.  Use the **🇹🇷 / 🇬🇧** flags to switch languages.
5.  Click "Refresh Data" (or "Verileri Güncelle") to fetch the latest data from Bybit.

## Security Note

*   **Never commit your `.env` file to version control.** The `.gitignore` file in the server directory is configured to exclude it.
*   It is recommended to use API keys with **Read-Only** permissions if you only intend to use this dashboard for monitoring.

## License

This project is licensed under the MIT License.
