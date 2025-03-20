import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ticket-buddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

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
    const { visitDate, tickets, totalPrice } = req.body;
    console.log(`Booking tickets for user ${req.user._id}, visit date: ${visitDate}`);

    // Create new ticket booking
    const newTicket = new Ticket({
      userId: req.user._id,
      visitDate: new Date(visitDate),
      tickets,
      totalPrice,
    });

    await newTicket.save();

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
app.get('/api/admin/exhibitions', authenticateAdmin, async (req, res) => {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });
    res.json({ exhibitions });
  } catch (error) {
    console.error('Get exhibitions error:', error);
    res.status(500).json({ message: 'Error retrieving exhibitions' });
  }
});

// Create exhibition
app.post('/api/admin/exhibitions', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, startDate, endDate, price, imageUrl } = req.body;
    
    const exhibition = new Exhibition({
      name,
      description,
      startDate,
      endDate,
      price,
      imageUrl,
    });
    
    await exhibition.save();
    res.status(201).json({ exhibition });
  } catch (error) {
    console.error('Create exhibition error:', error);
    res.status(500).json({ message: 'Error creating exhibition' });
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
    const exhibitionId = req.params.id;
    
    const exhibition = await Exhibition.findByIdAndDelete(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    
    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    console.error('Delete exhibition error:', error);
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

// Public endpoint to get active exhibitions
app.get('/api/exhibitions', async (req, res) => {
  try {
    // Only return active exhibitions that haven't ended yet
    const currentDate = new Date();
    const exhibitions = await Exhibition.find({
      status: 'active',
      endDate: { $gte: currentDate }
    }).sort({ startDate: 1 });
    
    res.json({ exhibitions });
  } catch (error) {
    console.error('Get public exhibitions error:', error);
    res.status(500).json({ message: 'Error retrieving exhibitions' });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 