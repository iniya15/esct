from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import json
from datetime import datetime, date

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MySQL connection setup
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  # Replace with your actual MySQL password
        database="supply_chain"
    )

# ✅ Route to submit a PO with items and user email
@app.route('/submit-po', methods=['POST'])
def submit_po():
    data = request.json
    items = data.get('items', [])
    user_email = data.get('email')

    if not user_email or not items:
        return jsonify({'error': 'Missing user email or items'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO purchase_orders (items, status, user_email)
            VALUES (%s, %s, %s)
        """, (
            json.dumps(items),  # Store items as JSON string
            'Pending',
            user_email
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'PO submitted successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Route to get all pending POs (for manager)
@app.route('/pending-pos', methods=['GET'])
def get_pending_pos():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM purchase_orders WHERE status = 'Pending'")
        rows = cursor.fetchall()

        for row in rows:
            if 'items' in row and row['items']:
                row['items'] = json.loads(row['items'])

            # ✅ Format date fields
            if isinstance(row.get('date'), (date, datetime)):
                row['date'] = row['date'].strftime('%Y-%m-%d')

            if isinstance(row.get('expected_delivery'), (date, datetime)):
                row['expected_delivery'] = row['expected_delivery'].strftime('%Y-%m-%d')

        print("Sending to frontend:", rows)  # 👈 print for debugging
        return jsonify(rows), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Route to update PO status (Approve/Reject)
@app.route('/update-status', methods=['POST'])
def update_status():
    data = request.get_json()
    po_id = data.get("id")
    new_status = data.get("status")

    if not po_id or not new_status:
        return jsonify({'error': 'Missing PO id or status'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE purchase_orders SET status = %s WHERE id = %s", (new_status, po_id))
        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({'message': 'Status updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Route to fetch all POs for a specific user
@app.route('/user-pos', methods=['GET'])
def get_user_pos():
    email = request.args.get("email")
    if not email:
        return jsonify({'error': 'Missing email'}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM purchase_orders WHERE user_email = %s", (email,))
        rows = cursor.fetchall()

        for row in rows:
            if 'items' in row and row['items']:
                row['items'] = json.loads(row['items'])

        cursor.close()
        conn.close()
        return jsonify(rows), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ Route to fetch all APPROVED POs for inventory page
@app.route('/approved-pos', methods=['GET'])
def get_approved_pos():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM purchase_orders WHERE status = 'Approved'")
        rows = cursor.fetchall()

        for row in rows:
            if 'items' in row and row['items']:
                row['items'] = json.loads(row['items'])

        cursor.close()
        conn.close()
        return jsonify(rows), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
