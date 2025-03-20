import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Configure mongoose
mongoose.connect('mongodb://localhost:27017/ticket-buddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // Note: In production, use environment variables for these values
    user: 'chaudharyjasmin645@gmail.com', // Replace with your email
    pass: 'zcsf lmfr perd ltcl', // Replace with your app password
  },
});

// Email sending utility function
const sendTicketEmail = async (email, ticketData) => {
  try {
    const { _id, visitDate, tickets, totalPrice } = ticketData;
    
    // Format tickets for display in email
    const ticketList = tickets.map(ticket => 
      `${ticket.name} x ${ticket.quantity}: $${(ticket.price * ticket.quantity).toFixed(2)}`
    ).join('\n- ');
    
    // Format the visit date
    const formattedDate = new Date(visitDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create the email content
    const mailOptions = {
      from: 'your-email@gmail.com', // Replace with your email
      to: email,
      subject: 'Your Ticket Buddy Museum Tickets',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #4a5568; text-align: center;">Ticket Buddy Museum</h1>
          <div style="background-color: #f7fafc; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0;">Booking Confirmation</h2>
            <p style="color: #4a5568;">Thank you for booking with Ticket Buddy Museum. Your tickets are confirmed!</p>
            <p style="color: #4a5568;"><strong>Booking ID:</strong> ${_id}</p>
            <p style="color: #4a5568;"><strong>Visit Date:</strong> ${formattedDate}</p>
          </div>
          
          <h3 style="color: #2d3748;">Your Tickets:</h3>
          <ul style="color: #4a5568;">
            <li>- ${ticketList}</li>
          </ul>
          
          <div style="background-color: #ebf8ff; border-radius: 5px; padding: 15px; margin-top: 20px;">
            <p style="color: #2b6cb0; margin: 0;"><strong>Total Paid:</strong> $${totalPrice.toFixed(2)}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <h3 style="color: #2d3748;">Important Information:</h3>
            <ul style="color: #4a5568;">
              <li>Please arrive at least 15 minutes before your intended entry time.</li>
              <li>Present this email (printed or on your phone) at the entrance.</li>
              <li>Opening hours: Tuesday-Friday 10:00-18:00, Weekends 09:00-20:00, Public Holidays 10:00-16:00</li>
              <li>Last admission is 1 hour before closing.</li>
            </ul>
          </div>
          
          <p style="color: #718096; text-align: center; margin-top: 30px;">
            If you have any questions, please contact us at support@ticketbuddy.example.com
          </p>
        </div>
      `
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Ticket email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending ticket email:', error);
    return false;
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 60,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  tickets: [
    {
      ticketId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      isExhibition: {
        type: Boolean,
        default: false,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Exhibition Schema
const exhibitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Exhibition = mongoose.model('Exhibition', exhibitionSchema);

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth header missing or invalid format');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not found with ID from token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Authentication successful
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired', expired: true });
      }
      
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ message: 'Server error during admin authentication' });
  }
};

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Allow setting role during signup, default to 'user'
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret', // Replace with a secure secret key
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret', // Replace with a secure secret key
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Book tickets endpoint
app.post('/api/tickets', authenticate, async (req, res) => {
  try {
    const { visitDate, tickets, totalPrice, email } = req.body;
    console.log(`Booking tickets for user ${req.user._id}, visit date: ${visitDate}`);

    // Validate that exhibition tickets are available on the selected date
    const visitDateObj = new Date(visitDate);
    // Reset time to compare only the date
    visitDateObj.setHours(0, 0, 0, 0);

    // Check each exhibition ticket
    const exhibitionTickets = tickets.filter(ticket => ticket.isExhibition);
    for (const ticket of exhibitionTickets) {
      // Find the exhibition in the database
      const exhibition = await Exhibition.findById(ticket.ticketId);
      if (!exhibition) {
        return res.status(404).json({ 
          message: `Exhibition not found: ${ticket.name}` 
        });
      }

      // Check if the exhibition is active
      if (exhibition.status !== 'active') {
        return res.status(400).json({ 
          message: `Exhibition is not active: ${ticket.name}` 
        });
      }

      // Check if visit date is within exhibition dates
      const startDate = new Date(exhibition.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(exhibition.endDate);
      endDate.setHours(23, 59, 59, 999);

      if (visitDateObj < startDate || visitDateObj > endDate) {
        return res.status(400).json({ 
          message: `Exhibition "${ticket.name}" is not available on the selected date. Available from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.` 
        });
      }
    }

    // Create new ticket booking
    const newTicket = new Ticket({
      userId: req.user._id,
      visitDate: new Date(visitDate),
      tickets,
      totalPrice,
      email // Save the email in the ticket document
    });

    await newTicket.save();

    // Send confirmation email if email is provided
    if (email) {
      await sendTicketEmail(email, newTicket);
    }

    res.status(201).json({
      message: 'Tickets booked successfully',
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Ticket booking error:', error);
    res.status(500).json({ message: 'Error booking tickets' });
  }
});

// Get user tickets endpoint
app.get('/api/tickets', authenticate, async (req, res) => {
  try {
    console.log(`Fetching tickets for user ${req.user._id}`);
    const tickets = await Ticket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(`Found ${tickets.length} tickets`);

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Error retrieving tickets' });
  }
});

// Cancel ticket endpoint
app.put('/api/tickets/:id/cancel', authenticate, async (req, res) => {
  try {
    const ticketId = req.params.id;
    console.log(`Cancelling ticket ${ticketId} for user ${req.user._id}`);
    
    // Find ticket and check if it belongs to the user
    const ticket = await Ticket.findOne({ _id: ticketId, userId: req.user._id });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found or not authorized' });
    }
    
    // Check if the ticket is already cancelled
    if (ticket.status === 'cancelled') {
      return res.status(400).json({ message: 'Ticket is already cancelled' });
    }
    
    // Check if the visit date is in the past
    const now = new Date();
    const visitDate = new Date(ticket.visitDate);
    if (visitDate < now) {
      return res.status(400).json({ message: 'Cannot cancel a past visit' });
    }
    
    // Update the ticket status to cancelled
    ticket.status = 'cancelled';
    await ticket.save();
    
    res.json({ 
      message: 'Ticket cancelled successfully',
      ticket 
    });
  } catch (error) {
    console.error('Cancel ticket error:', error);
    res.status(500).json({ message: 'Error cancelling ticket' });
  }
});

// Admin Routes
// Get all users
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent deleting the last admin
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get all exhibitions
app.get('/api/exhibitions', async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({})
      .sort({ startDate: 1 })
      .select('-__v');
    res.json({ exhibitions });
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ message: 'Error fetching exhibitions' });
  }
});

// Get all exhibitions for admin
app.get('/api/admin/exhibitions', authenticateAdmin, async (req, res) => {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });
    res.json({ exhibitions });
  } catch (error) {
    console.error('Get exhibitions error:', error);
    res.status(500).json({ message: 'Error retrieving exhibitions' });
  }
});

// Create exhibition endpoint
app.post('/api/admin/exhibitions', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, startDate, endDate, price, status, imageUrl } = req.body;
    
    console.log('Creating exhibition with data:', { name, description, startDate, endDate, price, status, imageUrl });
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const exhibition = new Exhibition({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price: Number(price),
      imageUrl: imageUrl.trim(),
      status: status || 'active'
    });

    await exhibition.save();
    console.log('Exhibition created successfully:', exhibition);
    
    res.status(201).json({ 
      message: 'Exhibition created successfully',
      exhibition 
    });
  } catch (error) {
    console.error('Error creating exhibition:', error);
    res.status(500).json({ message: error.message || 'Error creating exhibition' });
  }
});

// Update exhibition
app.put('/api/admin/exhibitions/:id', authenticateAdmin, async (req, res) => {
  try {
    const exhibitionId = req.params.id;
    const updates = req.body;
    
    const exhibition = await Exhibition.findByIdAndUpdate(
      exhibitionId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    
    res.json({ exhibition });
  } catch (error) {
    console.error('Update exhibition error:', error);
    res.status(500).json({ message: 'Error updating exhibition' });
  }
});

// Delete exhibition
app.delete('/api/admin/exhibitions/:id', authenticateAdmin, async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Delete the image file if it exists
    if (exhibition.imageUrl) {
      const imagePath = path.join(__dirname, exhibition.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Exhibition.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    res.status(500).json({ message: 'Error deleting exhibition' });
  }
});

// Get all transactions
app.get('/api/admin/transactions', authenticateAdmin, async (req, res) => {
  try {
    const transactions = await Ticket.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    const formattedTransactions = transactions.map(t => ({
      _id: t._id,
      userId: t.userId?._id || 'Unknown User',
      userName: t.userId?.name || 'Deleted User',
      visitDate: t.visitDate,
      tickets: t.tickets,
      totalPrice: t.totalPrice,
      status: t.status,
      createdAt: t.createdAt,
    }));
    
    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
});

// Get analytics
app.get('/api/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTransactions,
      activeExhibitions,
      recentTransactions,
      popularExhibitions
    ] = await Promise.all([
      User.countDocuments(),
      Ticket.countDocuments(),
      Exhibition.countDocuments({ status: 'active' }),
      Ticket.find()
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Ticket.aggregate([
        { $unwind: '$tickets' },
        { $match: { 'tickets.isExhibition': true } },
        {
          $group: {
            _id: '$tickets.ticketId',
            name: { $first: '$tickets.name' },
            ticketCount: { $sum: '$tickets.quantity' },
            revenue: { $sum: { $multiply: ['$tickets.price', '$tickets.quantity'] } }
          }
        },
        { $sort: { ticketCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    const totalRevenue = await Ticket.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeExhibitions,
      recentTransactions: recentTransactions.map(t => ({
        _id: t._id,
        userId: t.userId?._id || 'Unknown User',
        userName: t.userId?.name || 'Deleted User',
        visitDate: t.visitDate,
        tickets: t.tickets,
        totalPrice: t.totalPrice,
        status: t.status,
        createdAt: t.createdAt,
      })),
      popularExhibitions
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error retrieving analytics' });
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the URL for the uploaded file
    const imageUrl = `/uploads/${path.basename(req.file.path)}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

const PORT = process.env.PORT || 3000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is in use, trying port ${PORT + 1}`);
      app.listen(PORT + 1, () => {
        console.log(`Server running on port ${PORT + 1}`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${PORT + 1} is also in use, trying port ${PORT + 2}`);
          app.listen(PORT + 2, () => {
            console.log(`Server running on port ${PORT + 2}`);
          });
        }
      });
    }
  });
};

startServer(); 