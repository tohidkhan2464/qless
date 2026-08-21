import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Department from '../models/Department';
import Service from '../models/Service';
import Queue from '../models/Queue';
import QueueEntry from '../models/QueueEntry';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretqless';

// --- AUTH API ---
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, enrollmentNumber, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, enrollmentNumber, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/auth/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// --- DEPARTMENTS & SERVICES API ---
router.get('/departments', async (req, res) => {
  const depts = await Department.find({ isActive: true });
  res.json(depts);
});

router.post('/departments', authenticate, requireRole(['ADMIN']), async (req, res) => {
  const dept = new Department(req.body);
  await dept.save();
  res.json(dept);
});

router.get('/services', async (req, res) => {
  const services = await Service.find({ isActive: true }).populate('departmentId');
  res.json(services);
});

router.post('/services', authenticate, requireRole(['ADMIN']), async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.json(service);
});

// --- QUEUE API ---
router.get('/queues', async (req, res) => {
  const queues = await Queue.find({ status: 'ACTIVE' }).populate('serviceId');
  res.json(queues);
});

router.post('/queues', authenticate, requireRole(['STAFF', 'ADMIN']), async (req, res) => {
  const { serviceId } = req.body;
  const existing = await Queue.findOne({ serviceId, status: 'ACTIVE' });
  if (existing) {
    return res.status(400).json({ message: 'Active queue already exists for this service' });
  }
  const queue = new Queue({ serviceId });
  await queue.save();
  res.json(queue);
});

// Join queue
router.post('/queues/:id/join', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue || queue.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Queue is not active' });
    }
    const existingEntry = await QueueEntry.findOne({ queueId: queue._id, studentId: req.user.id, status: { $in: ['WAITING', 'NOTIFIED', 'SERVING'] } });
    if (existingEntry) {
      return res.status(400).json({ message: 'You are already in this queue' });
    }
    
    queue.lastTokenNumber += 1;
    await queue.save();
    
    const countAhead = await QueueEntry.countDocuments({ queueId: queue._id, status: { $in: ['WAITING', 'NOTIFIED'] } });
    
    const entry = new QueueEntry({
      queueId: queue._id,
      studentId: req.user.id,
      tokenNumber: queue.lastTokenNumber,
      position: countAhead + 1,
      requestDescription: req.body.requestDescription
    });
    await entry.save();
    
    const io = req.app.get('io');
    if (io) io.emit(`queue_update_${queue._id}`);
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get queue status (for dashboard)
router.get('/queues/:id/status', async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id).populate('serviceId');
    if (!queue) return res.status(404).json({ message: 'Queue not found' });
    const waiting = await QueueEntry.find({ queueId: queue._id, status: { $in: ['WAITING', 'NOTIFIED'] } }).sort({ position: 1 });
    const serving = await QueueEntry.findOne({ queueId: queue._id, status: 'SERVING' });
    res.json({ queue, waiting, serving });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Serve next token
router.post('/queues/:id/serve', authenticate, requireRole(['STAFF', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });
    
    // Complete the currently serving token if there is one
    const currentServing = await QueueEntry.findOne({ queueId: queue._id, status: 'SERVING' });
    if (currentServing) {
      currentServing.status = 'COMPLETED';
      currentServing.completedAt = new Date();
      await currentServing.save();
    }

    // Find next waiting
    const nextEntry = await QueueEntry.findOne({ queueId: queue._id, status: { $in: ['WAITING', 'NOTIFIED'] } }).sort({ position: 1 });
    if (nextEntry) {
      nextEntry.status = 'SERVING';
      nextEntry.servingAt = new Date();
      await nextEntry.save();
      
      queue.currentTokenNumber = nextEntry.tokenNumber;
      await queue.save();

      // Emit socket event for this specific entry
      const io = req.app.get('io');
      if (io) {
        io.emit(`queue_update_${queue._id}`);
        io.emit(`your_turn_${nextEntry.studentId}`, nextEntry);
      }
      return res.json({ message: 'Serving next token', entry: nextEntry });
    }
    
    queue.currentTokenNumber = 0;
    await queue.save();
    
    const io = req.app.get('io');
    if (io) io.emit(`queue_update_${queue._id}`);
    
    res.json({ message: 'No one is waiting in the queue' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Complete specific entry
router.post('/queue-entries/:id/complete', authenticate, requireRole(['STAFF', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    
    entry.status = 'COMPLETED';
    entry.completedAt = new Date();
    await entry.save();
    
    const io = req.app.get('io');
    if (io) io.emit(`queue_update_${entry.queueId}`);
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Skip specific entry
router.post('/queue-entries/:id/skip', authenticate, requireRole(['STAFF', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const entry = await QueueEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    
    entry.status = 'SKIPPED';
    await entry.save();
    
    const io = req.app.get('io');
    if (io) io.emit(`queue_update_${entry.queueId}`);
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
