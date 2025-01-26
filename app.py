from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

# Создание приложения Flask
app = Flask(__name__)

# Настройки CORS
CORS(app, resources={r"/ideas/*": {"origins": "*"}})

# Путь к базе данных
DB_PATH = os.path.join(os.path.dirname(__file__), 'ideas.db')

# Инициализация базы данных
def init_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ideas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idea TEXT NOT NULL
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"Ошибка базы данных при инициализации: {e}")
    finally:
        conn.close()

init_db()

# Эндпоинт для проверки доступности
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Приложение работает!"}), 200

# Эндпоинт для получения всех идей
@app.route('/ideas', methods=['GET'])
def get_ideas():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT id, idea FROM ideas')
        ideas = [{"id": row[0], "idea": row[1]} for row in cursor.fetchall()]
        return jsonify(ideas), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

# Эндпоинт для добавления новой идеи
@app.route('/ideas', methods=['POST'])
def add_idea():
    data = request.json
    idea = data.get("idea")
    if not idea:
        return jsonify({"error": "Поле 'idea' обязательно"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO ideas (idea) VALUES (?)', (idea,))
        conn.commit()
        return jsonify({"message": "Идея успешно добавлена"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

# Эндпоинт для удаления идеи
@app.route('/ideas/<int:idea_id>', methods=['DELETE'])
def delete_idea(idea_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ideas WHERE id = ?', (idea_id,))
        conn.commit()
        return jsonify({"message": "Идея успешно удалена"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

# Точка входа
if __name__ == "__main__":
    # Устанавливаем порт из переменной окружения для Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=False)

