# Ticket Buddy 🎫

A modern web application for managing event tickets and bookings with a user-friendly interface.

## About the Project

Ticket Buddy is a full-stack application that helps users browse, book, and manage event tickets. Built with modern web technologies, it offers a seamless experience for both event organizers and attendees.

### Features

- 🔐 User authentication and authorization
- 🎫 Ticket browsing and booking
- 💳 Secure payment processing
- 📱 Responsive design for all devices
- 🌙 Dark/Light mode support
- 🌍 Multi-language support
- 📊 User dashboard for managing bookings

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Vite for fast development
  - Tailwind CSS for styling
  - shadcn/ui for beautiful components

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB for database
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for local development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/JasminChaudhary/Ticket_Buddy.git
```

2. Navigate to the project directory
```bash
cd Ticket_Buddy
```

3. Install dependencies
```bash
npm install
```

4. Create a `.env` file in the root directory and add your environment variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Jasmin Chaudhary - [GitHub](https://github.com/JasminChaudhary)

Project Link: [https://github.com/JasminChaudhary/Ticket_Buddy](https://github.com/JasminChaudhary/Ticket_Buddy)

## Deployment on Render

### Backend Deployment

1. **Create a new Web Service**
   - Sign up or log in to [Render](https://render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub/GitLab repository
   - Configure:
     - Name: `ticket-buddy-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server/index.js`

2. **Environment Variables**
   - Add the following under the "Environment" section:
     - `PORT`: `8080` (Render assigned port)
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `FRONTEND_URL`: `https://ticket-buddy.onrender.com`
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASS`: Your email password/app password

3. **Create MongoDB Atlas Database**
   - Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier works)
   - Set up database user with password
   - Whitelist IP access (0.0.0.0/0 for Render)
   - Get connection string and add to Render environment variables

### Frontend Deployment

1. **Create a new Static Site**
   - In Render dashboard, click "New +" again
   - Select "Static Site"
   - Connect your repository
   - Configure:
     - Name: `ticket-buddy`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`

2. **Environment Variables**
   - Add:
     - `VITE_API_URL`: `https://ticket-buddy-api.onrender.com`

3. **Auto Deploy**
   - Render will automatically deploy when you push to your main branch

## Troubleshooting

- If your uploads directory isn't being tracked by Git, ensure the `.gitkeep` file exists in it.
- For email issues, make sure your Gmail account has "Less secure app access" enabled or use app passwords.
- If the frontend can't connect to the backend, check CORS configuration in `server/index.js` and verify the API URL in frontend.
