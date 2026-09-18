import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { db } from './db.js';
import { evaluateTriage, calculateEstimatedWaitTime } from './aiEngine.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Helper to calculate wait times for all waiting tokens
function getFormattedTokensWithWaitTimes() {
  const tokens = db.getTokens();
  const doctors = db.getDoctors();
  const activeDocs = doctors.filter(d => d.status !== 'offline').length;

  return tokens.map(t => {
    const waitInfo = calculateEstimatedWaitTime(t, tokens, activeDocs);
    return {
      ...t,
      countAhead: waitInfo.countAhead,
      estimatedWaitMinutes: waitInfo.estimatedWaitMinutes,
    };
  });
}

// Helper to build aggregate status response
function getFullQueueState() {
  const tokens = getFormattedTokensWithWaitTimes();
  return {
    tokens,
    doctors: db.getDoctors(),
    departments: db.getDepartments(),
    patients: db.getPatients(),
    logs: db.getLogs(),
    stats: {
      totalTokensToday: tokens.length,
      waitingCount: tokens.filter(t => t.status === 'waiting').length,
      inConsultationCount: tokens.filter(t => t.status === 'in_consultation').length,
      completedCount: tokens.filter(t => t.status === 'completed').length,
      emergencyCount: tokens.filter(t => t.severityLevel === 1 && t.status !== 'completed').length,
      avgWaitMinutes: Math.round(tokens.reduce((acc, t) => acc + (t.estimatedWaitMinutes || 0), 0) / (tokens.length || 1))
    }
  };
}

// Socket.IO connections
io.on('connection', (socket) => {
  console.log('Client connected to HealthQueue AI socket:', socket.id);
  
  // Send current state immediately on connection
  socket.emit('queue:state', getFullQueueState());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast helper
function broadcastUpdate(eventType = 'queue:updated', extraData = {}) {
  const state = getFullQueueState();
  io.emit('queue:state', state);
  io.emit(eventType, extraData);
}

// REST API ROUTES

// 1. Get full queue status
app.get('/api/queue-status', (req, res) => {
  res.json(getFullQueueState());
});

// 2. AI Triage Evaluator (Preview without saving)
app.post('/api/triage/assess', (req, res) => {
  const result = evaluateTriage(req.body);
  res.json(result);
});

// 3. Register Patient
app.post('/api/patients/register', (req, res) => {
  try {
    const patient = db.addPatient(req.body);
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Register Doctor
app.post('/api/doctors/register', (req, res) => {
  try {
    const doctor = db.addDoctor(req.body);
    broadcastUpdate('doctor:added', { doctor });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Generate Digital Token with AI Triage
app.post('/api/tokens/generate', (req, res) => {
  try {
    const { patientName, patientAge, patientPhone, departmentId, symptoms, painScore, highRiskVitals } = req.body;
    
    // Perform AI triage evaluation
    const triage = evaluateTriage({ symptoms, painScore, age: patientAge, highRiskVitals });
    
    const token = db.addToken({
      patientName,
      patientAge: Number(patientAge) || 30,
      patientPhone: patientPhone || '',
      departmentId: departmentId || 'dept-gen',
      symptoms: symptoms || 'General Checkup',
      painScore: Number(painScore) || 1,
      severityLevel: triage.severityLevel,
      severityLabel: triage.severityLabel,
      severityColor: triage.severityColor,
      priorityScore: triage.priorityScore,
      aiRecommendation: triage.aiRecommendation,
    });

    broadcastUpdate('token:created', { token });

    if (triage.severityLevel === 1) {
      broadcastUpdate('emergency:alert', { token, message: `EMERGENCY ALERT: Critical triage score for ${token.patientName} (${token.tokenNumber})` });
    }

    res.json({ success: true, token, triage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Update Token Status (Call patient, start consult, complete, cancel)
app.post('/api/tokens/update-status', (req, res) => {
  try {
    const { tokenId, status, doctorId } = req.body;
    const token = db.updateTokenStatus(tokenId, status, doctorId);
    
    if (!token) return res.status(404).json({ error: 'Token not found' });

    if (status === 'in_consultation') {
      broadcastUpdate('patient:called', { token, audioChime: true });
    } else {
      broadcastUpdate('token:updated', { token });
    }

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Emergency Priority Override (Bump token to front)
app.post('/api/emergency/override', (req, res) => {
  try {
    const { tokenId } = req.body;
    const token = db.emergencyOverride(tokenId);

    if (!token) return res.status(404).json({ error: 'Token not found' });

    broadcastUpdate('emergency:alert', { 
      token, 
      message: `PRIORITY ESCALATION: Token ${token.tokenNumber} (${token.patientName}) moved to #1 Emergency Priority!` 
    });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🏥 HealthQueue AI Backend running at http://localhost:${PORT}`);
});
