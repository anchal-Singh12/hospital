// In-Memory Database with Persistence State for Hackathon Demo

class HospitalDatabase {
  constructor() {
    this.departments = [
      { id: 'dept-er', name: 'Emergency Triage', code: 'ER', icon: 'AlertTriangle', avgConsultMins: 10 },
      { id: 'dept-cardio', name: 'Cardiology & Heart', code: 'CARD', icon: 'Heart', avgConsultMins: 15 },
      { id: 'dept-gen', name: 'General Medicine', code: 'GEN', icon: 'Stethoscope', avgConsultMins: 12 },
      { id: 'dept-peds', name: 'Pediatrics', code: 'PED', icon: 'Baby', avgConsultMins: 10 },
      { id: 'dept-ortho', name: 'Orthopedics', code: 'ORTH', icon: 'Activity', avgConsultMins: 15 },
    ];

    this.doctors = [
      { id: 'doc-1', name: 'Dr. Sarah Jenkins', specialization: 'Emergency Physician', departmentId: 'dept-er', status: 'available', roomNo: 'Bay 1', totalServedToday: 14 },
      { id: 'doc-2', name: 'Dr. Rajesh Patel', specialization: 'Senior Cardiologist', departmentId: 'dept-cardio', status: 'in_consultation', roomNo: 'Room 204', totalServedToday: 9 },
      { id: 'doc-3', name: 'Dr. Emily Vance', specialization: 'General Physician', departmentId: 'dept-gen', status: 'available', roomNo: 'Room 102', totalServedToday: 18 },
      { id: 'doc-4', name: 'Dr. Marcus Vance', specialization: 'Pediatric Specialist', departmentId: 'dept-peds', status: 'available', roomNo: 'Room 108', totalServedToday: 11 },
    ];

    this.patients = [
      { id: 'pat-1', name: 'John Doe', age: 45, phone: '+1 555-0192', gender: 'Male', bloodGroup: 'O+' },
      { id: 'pat-2', name: 'Maria Garcia', age: 68, phone: '+1 555-0143', gender: 'Female', bloodGroup: 'A+' },
      { id: 'pat-3', name: 'Liam Smith', age: 4, phone: '+1 555-0881', gender: 'Male', bloodGroup: 'B+' },
      { id: 'pat-4', name: 'Robert Chen', age: 52, phone: '+1 555-0329', gender: 'Male', bloodGroup: 'AB+' },
    ];

    // Pre-seeded initial tokens for instant hackathon demo
    const now = new Date();
    this.tokens = [
      {
        id: 'tok-101',
        tokenNumber: 'ER-001',
        patientId: 'pat-2',
        patientName: 'Maria Garcia',
        patientAge: 68,
        patientPhone: '+1 555-0143',
        departmentId: 'dept-er',
        departmentName: 'Emergency Triage',
        symptoms: 'Chest tightness, severe dizziness',
        painScore: 9,
        severityLevel: 1,
        severityLabel: 'CRITICAL EMERGENCY',
        severityColor: 'red',
        priorityScore: 98,
        aiRecommendation: 'Immediate Triage: Route to Emergency Bay immediately.',
        status: 'waiting', // waiting | in_consultation | completed | cancelled
        assignedDoctorId: 'doc-1',
        assignedDoctorName: 'Dr. Sarah Jenkins',
        roomNo: 'Bay 1',
        isEmergencyBumped: true,
        createdAt: new Date(now.getTime() - 25 * 60000).toISOString(),
        calledAt: null,
        completedAt: null,
      },
      {
        id: 'tok-102',
        tokenNumber: 'CARD-002',
        patientId: 'pat-4',
        patientName: 'Robert Chen',
        patientAge: 52,
        patientPhone: '+1 555-0329',
        departmentId: 'dept-cardio',
        departmentName: 'Cardiology & Heart',
        symptoms: 'High BP reading (165/100), mild palpitations',
        painScore: 6,
        severityLevel: 2,
        severityLabel: 'HIGH URGENCY',
        severityColor: 'amber',
        priorityScore: 78,
        aiRecommendation: 'Fast-Track: Direct to consultation within 15 mins.',
        status: 'in_consultation',
        assignedDoctorId: 'doc-2',
        assignedDoctorName: 'Dr. Rajesh Patel',
        roomNo: 'Room 204',
        isEmergencyBumped: false,
        createdAt: new Date(now.getTime() - 40 * 60000).toISOString(),
        calledAt: new Date(now.getTime() - 8 * 60000).toISOString(),
        completedAt: null,
      },
      {
        id: 'tok-103',
        tokenNumber: 'GEN-003',
        patientId: 'pat-1',
        patientName: 'John Doe',
        patientAge: 45,
        patientPhone: '+1 555-0192',
        departmentId: 'dept-gen',
        departmentName: 'General Medicine',
        symptoms: 'Persistent fever (101.5F) for 3 days, sore throat',
        painScore: 4,
        severityLevel: 3,
        severityLabel: 'STANDARD CARE',
        severityColor: 'teal',
        priorityScore: 52,
        aiRecommendation: 'Standard Queue: Assigned to available general physician.',
        status: 'waiting',
        assignedDoctorId: 'doc-3',
        assignedDoctorName: 'Dr. Emily Vance',
        roomNo: 'Room 102',
        isEmergencyBumped: false,
        createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        calledAt: null,
        completedAt: null,
      },
      {
        id: 'tok-104',
        tokenNumber: 'PED-004',
        patientId: 'pat-3',
        patientName: 'Liam Smith',
        patientAge: 4,
        patientPhone: '+1 555-0881',
        departmentId: 'dept-peds',
        departmentName: 'Pediatrics',
        symptoms: 'Ear pain and mild fever',
        painScore: 5,
        severityLevel: 3,
        severityLabel: 'STANDARD CARE',
        severityColor: 'teal',
        priorityScore: 60,
        aiRecommendation: 'Standard Queue: Pediatric priority applied for child.',
        status: 'waiting',
        assignedDoctorId: 'doc-4',
        assignedDoctorName: 'Dr. Marcus Vance',
        roomNo: 'Room 108',
        isEmergencyBumped: false,
        createdAt: new Date(now.getTime() - 10 * 60000).toISOString(),
        calledAt: null,
        completedAt: null,
      }
    ];

    this.logs = [
      { id: 'log-1', timestamp: new Date(now.getTime() - 25 * 60000).toISOString(), action: 'EMERGENCY_TRIAGE', message: 'Token ER-001 flagged CRITICAL EMERGENCY by AI Triage Engine.' },
      { id: 'log-2', timestamp: new Date(now.getTime() - 8 * 60000).toISOString(), action: 'PATIENT_CALLED', message: 'Token CARD-002 called by Dr. Rajesh Patel (Room 204).' }
    ];
  }

  // Getters
  getDepartments() { return this.departments; }
  getDoctors() { return this.doctors; }
  getPatients() { return this.patients; }
  getTokens() { return this.tokens; }
  getLogs() { return this.logs; }

  // Doctor CRUD
  addDoctor(doctorData) {
    const newDoc = {
      id: `doc-${Date.now()}`,
      status: 'available',
      totalServedToday: 0,
      ...doctorData
    };
    this.doctors.push(newDoc);
    return newDoc;
  }

  // Patient Register
  addPatient(patientData) {
    const newPat = {
      id: `pat-${Date.now()}`,
      ...patientData
    };
    this.patients.push(newPat);
    return newPat;
  }

  // Token Generation
  addToken(tokenData) {
    const dept = this.departments.find(d => d.id === tokenData.departmentId);
    const countInDept = this.tokens.filter(t => t.departmentId === tokenData.departmentId).length + 1;
    const tokenCode = dept ? dept.code : 'TQ';
    const tokenNumber = `${tokenCode}-${String(countInDept).padStart(3, '0')}`;

    // Auto assign available doctor in dept
    const doctor = this.doctors.find(d => d.departmentId === tokenData.departmentId) || this.doctors[0];

    const newToken = {
      id: `tok-${Date.now()}`,
      tokenNumber,
      status: 'waiting',
      assignedDoctorId: doctor ? doctor.id : null,
      assignedDoctorName: doctor ? doctor.name : 'Duty Doctor',
      roomNo: doctor ? doctor.roomNo : 'Triage Room',
      isEmergencyBumped: tokenData.severityLevel === 1,
      createdAt: new Date().toISOString(),
      calledAt: null,
      completedAt: null,
      ...tokenData
    };

    this.tokens.push(newToken);
    
    // Add log
    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'TOKEN_CREATED',
      message: `New Token ${tokenNumber} issued for ${newToken.patientName} (${newToken.severityLabel})`
    });

    return newToken;
  }

  // Update Token Status
  updateTokenStatus(tokenId, status, doctorId = null) {
    const token = this.tokens.find(t => t.id === tokenId);
    if (!token) return null;

    token.status = status;
    const nowStr = new Date().toISOString();

    if (status === 'in_consultation') {
      token.calledAt = nowStr;
      if (doctorId) {
        const doc = this.doctors.find(d => d.id === doctorId);
        if (doc) {
          token.assignedDoctorId = doc.id;
          token.assignedDoctorName = doc.name;
          token.roomNo = doc.roomNo;
          doc.status = 'in_consultation';
        }
      }
      this.logs.unshift({
        id: `log-${Date.now()}`,
        timestamp: nowStr,
        action: 'PATIENT_CALLED',
        message: `Token ${token.tokenNumber} (${token.patientName}) called to ${token.roomNo}`
      });
    } else if (status === 'completed') {
      token.completedAt = nowStr;
      if (token.assignedDoctorId) {
        const doc = this.doctors.find(d => d.id === token.assignedDoctorId);
        if (doc) {
          doc.status = 'available';
          doc.totalServedToday += 1;
        }
      }
      this.logs.unshift({
        id: `log-${Date.now()}`,
        timestamp: nowStr,
        action: 'VISIT_COMPLETED',
        message: `Token ${token.tokenNumber} consultation completed by ${token.assignedDoctorName}`
      });
    }

    return token;
  }

  // Emergency Override
  emergencyOverride(tokenId) {
    const token = this.tokens.find(t => t.id === tokenId);
    if (!token) return null;

    token.severityLevel = 1;
    token.severityLabel = 'CRITICAL EMERGENCY';
    token.severityColor = 'red';
    token.priorityScore = 100;
    token.isEmergencyBumped = true;

    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'EMERGENCY_OVERRIDE',
      message: `ALERT: Token ${token.tokenNumber} (${token.patientName}) escalated to MAX PRIORITY EMERGENCY!`
    });

    return token;
  }
}

export const db = new HospitalDatabase();
