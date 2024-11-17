from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('ideas.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Эндпоинт для получения всех идей
@app.route('/ideas', methods=['GET'])
def get_ideas():
    conn = sqlite3.connect('ideas.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, idea FROM ideas')
    ideas = [{"id": row[0], "idea": row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(ideas)

# Эндпоинт для добавления новой идеи
@app.route('/ideas', methods=['POST'])
def add_idea():
    data = request.json
    idea = data.get("idea")
    if not idea:
        return jsonify({"error": "Idea is required"}), 400

    conn = sqlite3.connect('ideas.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO ideas (idea) VALUES (?)', (idea,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Idea added successfully"}), 201

# Эндпоинт для удаления идеи
@app.route('/ideas/<int:idea_id>', methods=['DELETE'])
def delete_idea(idea_id):
    conn = sqlite3.connect('ideas.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM ideas WHERE id = ?', (idea_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Idea deleted successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
