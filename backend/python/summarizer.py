import re

def summarize_to_crt(text):
    """
    Summarize doctor-patient conversation into CRT format.
    CRT = Chief Complaint, Recent History, Tests & Treatment
    """
    t = text.lower()
    
    # Define symptom keywords with proper display names
    symptom_keywords = {
    # Constitutional
    "fever": "Fever",
    "chills": "Chills",
    "rigors": "Rigors",
    "fatigue": "Fatigue",
    "weakness": "Generalized weakness",
    "weight loss": "Weight loss",
    "loss of appetite": "Loss of appetite",
    "night sweats": "Night sweats",

    # Pain-related
    "headache": "Headache",
    "body pain": "Body pain",
    "muscle pain": "Myalgia",
    "joint pain": "Arthralgia",
    "back pain": "Back pain",
    "abdominal pain": "Abdominal pain",
    "chest pain": "Chest pain",
    "epigastric pain": "Epigastric pain",

    # Respiratory
    "cough": "Cough",
    "dry cough": "Dry cough",
    "productive cough": "Productive cough",
    "shortness of breath": "Shortness of breath",
    "breathing difficulty": "Breathing difficulty",
    "wheezing": "Wheezing",
    "chest tightness": "Chest tightness",
    "hemoptysis": "Coughing blood",
    "runny nose": "Rhinorrhea",
    "nasal congestion": "Nasal congestion",
    "sore throat": "Sore throat",
    "hoarseness": "Hoarseness of voice",

    # Cardiovascular
    "palpitations": "Palpitations",
    "dizziness": "Dizziness",
    "syncope": "Syncope",
    "leg swelling": "Pedal edema",
    "orthopnea": "Orthopnea",
    "paroxysmal nocturnal dyspnea": "PND",

    # Gastrointestinal
    "nausea": "Nausea",
    "vomiting": "Vomiting",
    "diarrhea": "Diarrhea",
    "constipation": "Constipation",
    "bloating": "Abdominal bloating",
    "heartburn": "Heartburn",
    "acid reflux": "Acid reflux",
    "blood in stool": "Hematochezia",
    "black stools": "Melena",
    "jaundice": "Jaundice",

    # Neurological
    "seizure": "Seizure",
    "loss of consciousness": "Loss of consciousness",
    "confusion": "Confusion",
    "memory loss": "Memory impairment",
    "tingling": "Paresthesia",
    "numbness": "Numbness",
    "slurred speech": "Slurred speech",
    "weakness on one side": "Focal neurological deficit",

    # Genitourinary
    "burning urination": "Dysuria",
    "increased urination": "Frequency of urination",
    "urgency": "Urinary urgency",
    "blood in urine": "Hematuria",
    "flank pain": "Flank pain",
    "reduced urine output": "Oliguria",

    # Endocrine / Metabolic
    "increased thirst": "Polydipsia",
    "increased hunger": "Polyphagia",
    "frequent urination": "Polyuria",
    "heat intolerance": "Heat intolerance",
    "cold intolerance": "Cold intolerance",

    # Dermatological
    "rash": "Skin rash",
    "itching": "Pruritus",
    "skin lesions": "Skin lesions",
    "ulcers": "Ulcers",
    "discoloration": "Skin discoloration",

    # Psychiatric
    "anxiety": "Anxiety",
    "depression": "Depressive symptoms",
    "sleep disturbance": "Sleep disturbance",
    "irritability": "Irritability"
    }
   
    symptoms_present = []
    symptoms_absent = []
    
    # Extract symptoms with better negation handling
    for key, display_name in symptom_keywords.items():
        if key in t:
            # Check for explicit negation patterns
            negation_patterns = [
                f"no {key}",
                f"not {key}",
                f"don't have {key}",
                f"didn't have {key}",
                f"without {key}",
                f"absence of {key}",
            ]
            
            is_negated = any(pattern in t for pattern in negation_patterns)
            
            if is_negated:
                symptoms_absent.append(display_name)
            else:
                symptoms_present.append(display_name)
    
    # Extract Chief Complaint (first mentioned symptom)
    chief_complaint = "Not specified"
    for symptom in symptoms_present:
        chief_complaint = symptom
        break
    if not symptoms_present:
        # Try to find any complaint pattern
        cc_match = re.search(r"patient:\s*([^.!?](?:fever|pain|ache|cold|cough|headache|trouble)[^.!?])", t)
        if cc_match:
            chief_complaint = cc_match.group(1).strip()
    
    # Extract Past Medical History
    chronic_conditions = {
        "diabetes": "Diabetes mellitus",
        "hypertension": "Hypertension",
        "blood pressure": "Hypertension",
        "asthma": "Bronchial asthma",
        "copd": "Chronic obstructive pulmonary disease",
        "heart disease": "Ischemic heart disease",
        "coronary artery disease": "Coronary artery disease",
        "heart failure": "Heart failure",
        "stroke": "Cerebrovascular disease",
        "thyroid": "Thyroid disorder",
        "kidney disease": "Chronic kidney disease",
        "liver disease": "Chronic liver disease",
        "epilepsy": "Epilepsy",
        "tuberculosis": "Tuberculosis",
        "cancer": "Malignancy",
        "arthritis": "Arthritis",
        "autoimmune": "Autoimmune disorder",
        "hiv": "HIV infection"
    }

    
    pmh = []
    for condition_key, condition_name in chronic_conditions.items():
        if condition_key in t:
            # Check for negation
            if not any(neg in t for neg in [f"no {condition_key}", f"don't have {condition_key}", f"without {condition_key}"]):
                pmh.append(condition_name)
    
    if not pmh:
        pmh = ["None reported"]
    
    # Extract medication
    medications = []
    common_meds = [
        # Analgesics / Antipyretics
        "paracetamol", "acetaminophen", "ibuprofen", "diclofenac", "aspirin",

        # Antibiotics
        "amoxicillin", "azithromycin", "ceftriaxone", "ciprofloxacin",
        "doxycycline", "metronidazole",

        # Respiratory
        "salbutamol", "budesonide", "montelukast",

        # GI
        "pantoprazole", "omeprazole", "ranitidine", "ondansetron",

        # Cardiovascular
        "amlodipine", "atenolol", "metoprolol", "losartan",

        # Endocrine
        "insulin", "metformin", "levothyroxine",

        # Others
        "steroids", "antihistamine", "antipyretic"
    ]

    for med in common_meds:
        if med in t:
            medications.append(med.capitalize())
    
    medication_str = ", ".join(medications) if medications else "Not mentioned"
    
    # Extract exposure history
    exposure = "None reported"
    if any(word in t for word in ["colleague", "sick", "contact", "travel", "exposed"]):
        if "colleague" in t and "sick" in t:
            exposure = "Contact with sick colleague"
        elif "travel" in t:
            exposure = "Recent travel"
        elif any(word in t for word in ["contact", "exposed"]):
            exposure = "Exposure to sick person"
    
    # Extract fever pattern if mentioned
    fever_pattern = "Not specified"
    if "continuous" in t or "constant" in t:
        fever_pattern = "Continuous"
    elif "comes and goes" in t or "intermittent" in t or "off and on" in t:
        fever_pattern = "Intermittent"
    
    # Extract Doctor's Assessment/Impression
    impression = "Likely viral infection"
    assessment_keywords = {
        "viral infection": "Viral infection",
        "flu": "Influenza-like illness",
        "bacterial infection": "Bacterial infection",
        "covid": "COVID-19",
        "common cold": "Upper respiratory tract infection",
        "pneumonia": "Pneumonia",
        "bronchitis": "Acute bronchitis",
        "uti": "Urinary tract infection",
        "gastritis": "Gastritis",
        "gastroenteritis": "Acute gastroenteritis",
        "hypertension": "Uncontrolled hypertension",
        "diabetes": "Poor glycemic control",
        "asthma exacerbation": "Asthma exacerbation",
        "copd exacerbation": "COPD exacerbation",
        "sepsis": "Sepsis (rule out)",
        "dehydration": "Dehydration"
    }

    
    for keyword, disease in assessment_keywords.items():
        if keyword in t:
            impression = disease
            break
    
    # Extract recommended plan
    plan_items = []
    plan_keywords = {
        "rest": "Rest and adequate sleep",
        "hydration": "Maintain hydration",
        "medicine": "Medications as prescribed",
        "antibiotic": "Antibiotic course",
        "follow-up": "Follow-up consultation if symptoms persist"
    }
    
    for keyword, plan in plan_keywords.items():
        if keyword in t:
            plan_items.append(plan)
    
    if not plan_items:
        plan_items = ["Rest, hydration, and symptomatic management"]
    
    # Build CRT Summary
    summary = f"""
{'='*50}
               CRT SUMMARY
{'='*50}

1. CHIEF COMPLAINT (CC):
   {chief_complaint}

2. HISTORY OF PRESENT ILLNESS (HPI):
   - Symptoms Present: {', '.join(symptoms_present) if symptoms_present else 'None reported'}
   - Symptoms Absent: {', '.join(symptoms_absent) if symptoms_absent else 'None reported'}
   - Fever Pattern: {fever_pattern}
   - Medications Taken: {medication_str}
   - Exposure History: {exposure}

3. PAST MEDICAL HISTORY (PMH):
   - {', '.join(pmh)}

4. REVIEW OF SYSTEMS (ROS):
   - Positive Findings: {', '.join(symptoms_present) if symptoms_present else 'None'}
   - Negative Findings: {', '.join(symptoms_absent) if symptoms_absent else 'None'}

5. ASSESSMENT:
   - Clinical Impression: {impression}

6. PLAN & RECOMMENDATIONS:
   {chr(10).join(f'   • {item}' for item in plan_items)}

{'='*50}
"""
    
    return summary
