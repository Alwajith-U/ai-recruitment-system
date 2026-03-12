from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import pdfplumber
import spacy
import re
import os
import csv
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from pymongo import MongoClient
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# -----------------------------
# Load NLP model
# -----------------------------
nlp = spacy.load("en_core_web_sm")


# -----------------------------
# MongoDB Connection
# -----------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["ai_recruitment"]
rankings_collection = db["rankings"]


# -----------------------------
# Global Storage
# -----------------------------
job_description_text = ""
resumes = []


# -----------------------------
# Upload Folder
# -----------------------------
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# -----------------------------
# Skills Database
# -----------------------------
skills_list = [
    "python",
    "java",
    "javascript",
    "react",
    "node",
    "sql",
    "machine learning",
    "html",
    "css",
    "django",
    "flask",
    "mongodb",
    "git",
    "docker",
    "php",
    "c++"
]


# -----------------------------
# Extract Skills
# -----------------------------
def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in skills_list:
        if skill in text:
            found_skills.append(skill.title())

    return found_skills


# -----------------------------
# Extract Experience
# -----------------------------
def extract_experience(text):

    match = re.search(r'(\d+)\+?\s*(years|year)', text.lower())

    if match:
        return match.group(1) + " years"

    return "Fresher"


# -----------------------------
# Clean Candidate Name
# -----------------------------
def clean_name(filename):

    name = filename.split(".")[0]

    name = name.replace("_", " ")
    name = name.replace("-", " ")
    name = name.replace("resume", "")
    name = name.replace("cv", "")
    name = name.replace("profile", "")

    name = name.strip()

    return name.title()


# -----------------------------
# Home Route
# -----------------------------
@app.route("/")
def home():
    return "AI Recruitment Backend Running"


# -----------------------------
# Upload Job Description
# -----------------------------
@app.route("/upload-jd", methods=["POST"])
def upload_jd():

    global job_description_text

    data = request.json

    job_description_text = data.get("job_description", "")

    return jsonify({
        "message": "Job description received"
    })


# -----------------------------
# Upload Resumes
# -----------------------------
@app.route("/upload-resumes", methods=["POST"])
def upload_resumes():

    global resumes
    resumes = []

    files = request.files.getlist("resumes")

    for file in files:

        filepath = os.path.join(UPLOAD_FOLDER, file.filename)

        file.save(filepath)

        with pdfplumber.open(filepath) as pdf:

            text = ""

            for page in pdf.pages:
                text += page.extract_text() or ""

        name = clean_name(file.filename)

        experience = extract_experience(text)

        skills = extract_skills(text)

        resumes.append({
            "filename": file.filename,
            "name": name,
            "filepath": filepath,
            "content": text,
            "experience": experience,
            "skills": skills
        })

    return jsonify({
        "message": "Resumes uploaded successfully",
        "count": len(resumes)
    })


# -----------------------------
# Rank Candidates
# -----------------------------
@app.route("/rank", methods=["GET"])
def rank_resumes():

    global job_description_text, resumes

    if not job_description_text or not resumes:
        return jsonify({"error": "Missing data"}), 400

    documents = [job_description_text] + [r["content"] for r in resumes]

    vectorizer = TfidfVectorizer(stop_words="english")

    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity_scores = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:]
    )[0]

    job_skills = extract_skills(job_description_text)

    ranked_results = []

    for i, score in enumerate(similarity_scores):

        resume = resumes[i]

        resume_skills = resume.get("skills", [])

        # -----------------------------
        # Skill Match Percentage
        # -----------------------------
        matched_skills = len(set(job_skills) & set(resume_skills))

        if len(job_skills) > 0:
            skill_match_percentage = round(
                (matched_skills / len(job_skills)) * 100, 2
            )
        else:
            skill_match_percentage = 0

        ranked_results.append({

            "name": resume.get("name", "Unknown"),

            "score": round(float(score) * 100, 2),

            "experience": resume.get("experience", "Fresher"),

            "skills": resume_skills,

            "skill_match": skill_match_percentage,

            "resume_url": f"https://ai-recruitment-system-sano.onrender.com/resume/{resume['filename']}"
        })

    ranked_results = sorted(
        ranked_results,
        key=lambda x: x["score"],
        reverse=True
    )

    rankings_collection.insert_one({
        "timestamp": datetime.utcnow(),
        "job_description": job_description_text,
        "results": ranked_results
    })

    return jsonify(ranked_results)


# -----------------------------
# Resume Preview
# -----------------------------
@app.route("/resume/<filename>")
def get_resume(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# -----------------------------
# Export CSV
# -----------------------------
@app.route("/export-csv")
def export_csv():

    if rankings_collection.count_documents({}) == 0:
        return jsonify({"error": "No ranking data available"}), 400

    last = rankings_collection.find_one(sort=[("_id", -1)])

    results = last["results"]

    def generate():

        data = []

        header = ["Rank", "Candidate Name", "Score", "Experience", "Skills"]

        data.append(header)

        for i, r in enumerate(results):

            data.append([
                i + 1,
                r["name"],
                r["score"],
                r["experience"],
                ", ".join(r["skills"])
            ])

        for row in data:
            yield ",".join(map(str, row)) + "\n"

    return Response(
        generate(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=ai_candidate_ranking.csv"}
    )

# -----------------------------
# Dashboard Stats
# -----------------------------
@app.route("/dashboard")
def dashboard_stats():

    total_candidates = len(resumes)

    total_jobs = 1 if job_description_text else 0

    total_resumes = len(resumes)

    avg_score = 0

    if rankings_collection.count_documents({}) > 0:

        last = rankings_collection.find_one(sort=[("_id", -1)])

        scores = [r["score"] for r in last["results"]]

        avg_score = round(sum(scores) / len(scores), 2)

    return jsonify({

        "candidates": total_candidates,

        "jobs": total_jobs,

        "resumes": total_resumes,

        "avg_match": avg_score
    })


# -----------------------------
# Hiring Pipeline
# -----------------------------
@app.route("/pipeline")
def pipeline_data():

    if rankings_collection.count_documents({}) == 0:

        return jsonify({

            "uploaded": 0,

            "shortlisted": 0,

            "interview": 0,

            "selected": 0
        })

    last = rankings_collection.find_one(sort=[("_id", -1)])

    results = last["results"]

    uploaded = len(results)

    shortlisted = len([r for r in results if r["score"] >= 50])

    interview = min(2, uploaded)

    selected = 1 if uploaded > 0 else 0

    return jsonify({

        "uploaded": uploaded,

        "shortlisted": shortlisted,

        "interview": interview,

        "selected": selected
    })


# -----------------------------
# Activity Feed
# -----------------------------
@app.route("/activity")
def activity():

    activities = []

    if rankings_collection.count_documents({}) > 0:

        last = rankings_collection.find_one(sort=[("_id",-1)])

        results = last["results"]

        activities.append({
            "text": f"Uploaded {len(results)} resumes",
            "time": "Just now"
        })

        top_candidate = results[0]

        activities.append({
            "text": f"Top match found: {top_candidate['name']} ({top_candidate['score']}%)",
            "time": "Just now"
        })

        activities.append({
            "text": "AI ranking completed",
            "time": "Just now"
        })

    else:

        activities.append({
            "text": "System ready for resume analysis",
            "time": "Just now"
        })

    return jsonify(activities)

# -----------------------------
# Generate Job Description
# -----------------------------
@app.route("/generate-jd", methods=["POST"])
def generate_job_description():

    data = request.json
    title = data.get("title", "")

    if not title:
        return jsonify({"error": "Job title required"}), 400

    prompt = f"""
Write a professional job description for the role: {title}.

Include sections:
1. Job Overview
2. Responsibilities
3. Required Skills
4. Preferred Qualifications
"""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        jd = completion.choices[0].message.content

        # Remove markdown
        jd = jd.replace("**", "")
        jd = jd.replace("*", "")
        jd = jd.replace("###", "")
        jd = jd.strip()

        return jsonify({
            "job_description": jd
        })

    except Exception as e:
        print("Groq Error:", e)
        return jsonify({"error": "AI generation failed"}), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)