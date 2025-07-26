from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# Firebase setup
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# JSON file for storing traffic reports
JSON_FILE = 'traffic_reports.json'

# ----------------------- LOGIN API -----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).stream()
    user_doc = next(query, None)

    if user_doc and user_doc.to_dict().get("password") == password:
        user_data = user_doc.to_dict()
        user_data["uid"] = user_doc.id
        return jsonify({"message": "Login successful", "user": user_data}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# -------------------- TRAFFIC REPORT API --------------------
@app.route('/get-reports', methods=['GET'])
def get_reports():
    try:
        if not os.path.exists(JSON_FILE):
            return jsonify([]), 200  # No data yet, return empty list

        with open(JSON_FILE, 'r') as f:
            all_reports = json.load(f)

        return jsonify(all_reports), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/report-traffic', methods=['POST'])
def report_traffic():
    try:
        data = request.get_json()
        location = data.get('location')
        reporter_name = data.get('name')
        reporter_email = data.get('email')
        cause = data.get('cause', '')
        duration = data.get('duration', '')
        description = data.get('description', '')  # ✅ New field

        if not location or not reporter_name or not reporter_email:
            return jsonify({'error': 'Missing required fields'}), 400

        report_data = {
            'location': location,
            'timestamp': datetime.utcnow().isoformat(),
            'reportedBy': {
                'name': reporter_name,
                'email': reporter_email
            },
            'cause': cause,
            'duration': duration,
            'description': description  # ✅ Add to saved report
        }

        if os.path.exists(JSON_FILE):
            with open(JSON_FILE, 'r') as f:
                all_reports = json.load(f)
        else:
            all_reports = []

        all_reports.append(report_data)

        with open(JSON_FILE, 'w') as f:
            json.dump(all_reports, f, indent=4)

        return jsonify({'message': 'Report submitted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ------------------ RUN FLASK APP ------------------
if __name__ == "__main__":
    app.run(debug=True)
