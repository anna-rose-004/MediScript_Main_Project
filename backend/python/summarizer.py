import re

def summarize_to_crt(text):
    """
    Summarize doctor-patient conversation into CRT format.
    CRT = Chief Complaint, Recent History, Tests & Treatment
    """
    t = text.lower()
    
    # Define symptom keywords with proper display names
    symptom_keywords = {
        "fever": "Fever",
        "headache": "Headache",
        "body pain": "Body pain",
        "sore throat": "Sore throat",
        "nausea": "Nausea",
        "vomiting": "Vomiting",
        "diarrhea": "Diarrhea",
        "cough": "Cough",
        "breathing difficulty": "Breathing difficulty",
        "chest pain": "Chest pain",
        "fatigue": "Fatigue",
        "cold": "Cold symptoms"
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
        "diabetes": "Diabetes",
        "asthma": "Asthma",
        "hypertension": "Hypertension",
        "thyroid": "Thyroid disorder",
        "heart": "Cardiac condition",
        "blood pressure": "Hypertension"
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
    common_meds = ["paracetamol", "acetaminophen", "ibuprofen", "aspirin", "antibiotic", "amoxicillin"]
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
        "flu": "Seasonal influenza / Viral infection",
        "viral infection": "Viral infection",
        "bacterial infection": "Bacterial infection",
        "covid": "COVID-19",
        "cold": "Common cold",
        "pneumonia": "Pneumonia",
        "bronchitis": "Bronchitis"
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



# Example usage
if __name__ == "__main__":
    
    text = """
    Doctor: Hello, what brings you in today?
Patient: Doctor, I’ve been having fever and a bad headache for the last three days.
Doctor: Is the fever continuous or does it come and go?
Patient: It comes and goes, mostly worse at night.
Doctor: Do you have any other symptoms like cough, sore throat, or body pain?
Patient: Yes, I have mild body pain and a little bit of sore throat.
Doctor: Any nausea, vomiting, or diarrhea?
Patient: No vomiting or diarrhea, just a slight nausea yesterday.
Doctor: Have you taken any medicines so far?
Patient: I took paracetamol twice a day.
It helps for a few hours.
Doctor: Any history of similar illness in the past?
Patient: I got something similar last year during monsoon.
Doctor: Did you travel anywhere recently or come in contact with anyone sick?
Patient: No travel, but my colleague had a fever last week.
Doctor: Understood.
Are you experiencing any breathing difficulty or chest pain?
Patient: No, none of that.
Doctor: Do you have any chronic illnesses like diabetes, asthma, or hypertension?
Patient: No, I am generally healthy.
Doctor: Good.
I’ll check your temperature and throat.
It looks like a viral infection, possibly seasonal flu.
Patient: Is it serious, doctor?
Doctor: Not at all.
You should be fine with rest and medication.
Patient: Okay, thank you.
Doctor: I’ll prescribe some medicines and advise proper hydration and rest.

    """
    print(summarize_to_crt(text))