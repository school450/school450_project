from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import psycopg2
import os
import jwt
import datetime

app = Flask(__name__)
CORS(app, resources={r"/ideas/*": {"origins": "*"}})

DATABASE_URL = os.environ.get("DATABASE_URL")
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")  # Секретный ключ для токенов
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "12345")  # Пароль админа (убираем его из HTML!)

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ideas (
                id SERIAL PRIMARY KEY,
                idea TEXT NOT NULL
            )
        ''')
        conn.commit()
    except psycopg2.Error as e:
        print(f"Ошибка базы данных при инициализации: {e}")
    finally:
        conn.close()

init_db()

@app.route('/', methods=['GET'])
def home_page():
    return render_template('index.html')

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    password = data.get("password")

    if password != ADMIN_PASSWORD:
        return jsonify({"error": "Неверный пароль"}), 401

    token = jwt.encode(
        {"role": "admin", "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"token": token})

def authenticate(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Нет доступа"}), 403

        try:
            decoded = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            if decoded.get("role") != "admin":
                raise jwt.InvalidTokenError
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Токен истёк"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Недействительный токен"}), 403

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper

@app.route('/ideas', methods=['GET'])
def get_ideas():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, idea FROM ideas')
        ideas = [{"id": row[0], "idea": row[1]} for row in cursor.fetchall()]
        return jsonify(ideas), 200
    except psycopg2.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

@app.route('/ideas', methods=['POST'])
def add_idea():
    data = request.json
    idea = data.get("idea")
    if not idea:
        return jsonify({"error": "Поле 'idea' обязательно"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO ideas (idea) VALUES (%s)', (idea,))
        conn.commit()
        return jsonify({"message": "Идея успешно добавлена"}), 201
    except psycopg2.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

@app.route('/ideas/<int:idea_id>', methods=['DELETE'])
@authenticate
def delete_idea(idea_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ideas WHERE id = %s', (idea_id,))
        conn.commit()
        return jsonify({"message": "Идея успешно удалена"}), 200
    except psycopg2.Error as e:
        return jsonify({"error": f"Ошибка базы данных: {e}"}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
