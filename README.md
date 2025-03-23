# FareShare Web App

## Project Overview

FareShare is a web application designed to simplify the management of shared expenses among friends, family, or groups. Whether you're planning a trip, hosting a party, or managing household expenses, FareShare helps you keep track of who owes what, making financial interactions transparent and hassle-free. With features like user authentication, group management, expense tracking, and payment integration, FareShare ensures that everyone stays informed and up-to-date.

## Key Features

### User Authentication & Profiles
- Secure authentication using JWT (JSON Web Tokens) to protect user data.
- Users can create and manage their profiles, including their name and email.

### Group Creation & Management
- Create groups for various events or expenses, such as trips or parties.
- Invite members via email to join your group.
- Real-time updates keep all members in sync.

### Adding Expenses
- Add expenses with details like description, amount, and date.
- Categorize expenses (e.g., Food, Travel, Rent, Shopping).
- Split expenses equally or assign custom shares based on who paid what.

### Settlement & Payment Tracking
- Automatic calculations of who owes whom, eliminating manual math.
- Mark payments as settled once completed.
- Maintain a payment tracking history for financial transparency.

### Dashboard
- Central hub displaying expense history and transaction summaries.
- Clear overview of outstanding balances and who owes what.

### Notifications & Reminders
- Email or push notifications for pending payments.
- Friendly reminders to ensure timely settlements.

### Payment Integration
- Integrated with Razorpay for secure payment processing.
- Users can easily click "Pay Now" to settle dues directly through the app.

## Installation Steps

To set up the FareShare web app locally, follow these steps:

### 1. Clone the Repository:
```bash
git clone https://github.com/yourusername/fairshare.git
cd fairshare
```

### 2. Install Dependencies:
Make sure you have Node.js and npm installed. Then run:
```bash
npm install
```

### 3. Set Up Environment Variables:
Create a `.env` file in the root directory and add the necessary environment variables. You can refer to the `.env.example` file for guidance.

### 4. Run the Application:
Start the development server:
```bash
npm start
```

### 5. Access the App:
Open your web browser and navigate to `http://localhost:3000` to access the FareShare web app.

## Key Details

### Technologies Used:
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Payment Gateway:** Razorpay

