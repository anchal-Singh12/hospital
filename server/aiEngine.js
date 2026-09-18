// AI Triage & Queue Wait Time Engine

export const SEVERITY_LEVELS = {
  CRITICAL: { level: 1, label: 'CRITICAL EMERGENCY', color: 'red', baseScore: 95 },
  URGENT: { level: 2, label: 'HIGH URGENCY', color: 'amber', baseScore: 75 },
  STANDARD: { level: 3, label: 'STANDARD CARE', color: 'teal', baseScore: 50 },
  MINOR: { level: 4, label: 'MINOR / ROUTINE', color: 'emerald', baseScore: 25 },
};

const HIGH_RISK_SYMPTOMS = [
  'chest pain', 'shortness of breath', 'severe bleeding', 'unconscious',
  'stroke symptoms', 'severe head injury', 'cardiac', 'anaphylaxis', 'choking'
];

const MODERATE_RISK_SYMPTOMS = [
  'high fever', 'persistent vomiting', 'fracture', 'deep cut',
  'severe abdominal pain', 'asthma flare up', 'dizziness', 'dislocation'
];

/**
 * AI Symptom & Triage Evaluator
 */
export function evaluateTriage(data) {
  const { symptoms = '', painScore = 1, age = 30, highRiskVitals = false } = data;
  const symptomLower = symptoms.toLowerCase();
  
  let severity = SEVERITY_LEVELS.STANDARD;
  let detectedFlags = [];

  // Check high risk matches
  const hasHighRisk = HIGH_RISK_SYMPTOMS.some(sym => symptomLower.includes(sym));
  const hasModerateRisk = MODERATE_RISK_SYMPTOMS.some(sym => symptomLower.includes(sym));

  if (hasHighRisk || painScore >= 9 || highRiskVitals) {
    severity = SEVERITY_LEVELS.CRITICAL;
    if (hasHighRisk) detectedFlags.push('High-Risk Symptom Detected');
    if (painScore >= 9) detectedFlags.push('Severe Pain Rating (9-10)');
    if (highRiskVitals) detectedFlags.push('Critical Vitals Triggered');
  } else if (hasModerateRisk || painScore >= 7) {
    severity = SEVERITY_LEVELS.URGENT;
    if (hasModerateRisk) detectedFlags.push('Moderate Medical Alert');
    if (painScore >= 7) detectedFlags.push('Elevated Pain Level');
  } else if (painScore <= 3 && !hasModerateRisk) {
    severity = SEVERITY_LEVELS.MINOR;
  }

  // Calculate Priority Score (1-100 scale)
  let priorityScore = severity.baseScore;

  // Pain modifier (+1 to +5)
  priorityScore += Math.floor(painScore / 2);

  // Vulnerable Age Modifier (Infants < 3 or Seniors > 65 get +8)
  if (age <= 3 || age >= 65) {
    priorityScore += 8;
    detectedFlags.push(age <= 3 ? 'Pediatric Priority (<3 yrs)' : 'Senior Priority (65+ yrs)');
  }

  // Cap priority score to 100 max
  priorityScore = Math.min(100, Math.max(10, priorityScore));

  // AI Recommendation summary
  let aiRecommendation = '';
  if (severity.level === 1) {
    aiRecommendation = 'Immediate Triage: Route to Emergency Bay immediately. Doctor alert sent.';
  } else if (severity.level === 2) {
    aiRecommendation = 'Fast-Track: High priority queue placement. Direct to consultation within 15 mins.';
  } else if (severity.level === 3) {
    aiRecommendation = 'Standard Queue: Normal registration. Assigned to available general physician.';
  } else {
    aiRecommendation = 'Routine Care: Low acuity. Standard wait list.';
  }

  return {
    severityLevel: severity.level,
    severityLabel: severity.label,
    severityColor: severity.color,
    priorityScore,
    detectedFlags,
    aiRecommendation
  };
}

/**
 * Calculates dynamic estimated wait time in minutes for a specific token
 */
export function calculateEstimatedWaitTime(token, allTokens, activeDoctorsCount = 2, avgConsultTimeMinutes = 12) {
  if (token.status === 'in_consultation') return 0;
  if (token.status === 'completed' || token.status === 'cancelled') return 0;

  // Filter queue items that are ahead of this token
  // Higher priority tokens come first, followed by earlier creation time for equal priority
  const higherPriorityAhead = allTokens.filter(t => {
    if (t.status !== 'waiting') return false;
    if (t.id === token.id) return false;
    if (t.departmentId !== token.departmentId) return false;

    if (t.priorityScore > token.priorityScore) return true;
    if (t.priorityScore === token.priorityScore) {
      return new Date(t.createdAt).getTime() < new Date(token.createdAt).getTime();
    }
    return false;
  });

  const countAhead = higherPriorityAhead.length;
  const effectiveDoctors = Math.max(1, activeDoctorsCount);
  
  // Calculate wait time estimate
  const estimatedWait = Math.round((countAhead * avgConsultTimeMinutes) / effectiveDoctors);

  return {
    countAhead,
    estimatedWaitMinutes: Math.max(2, estimatedWait),
  };
}
