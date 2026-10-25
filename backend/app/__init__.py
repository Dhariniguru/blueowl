from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, migrate, cors


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    from app.routes import auth, assessment, lessons, progress, achievements, voice, ai_chat, user_progress, report, pronunciation
    app.register_blueprint(auth.bp)
    app.register_blueprint(assessment.bp)
    app.register_blueprint(lessons.bp)
    app.register_blueprint(progress.bp)
    app.register_blueprint(achievements.bp)
    app.register_blueprint(voice.bp)
    app.register_blueprint(ai_chat.bp)
    app.register_blueprint(user_progress.bp)
    app.register_blueprint(report.bp)
    app.register_blueprint(pronunciation.bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "neolearn-api"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
