from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()


class Task(db.Model):
    task_id = db.Column(db.String, primary_key=True)
    identity_id = db.Column(db.String(255), db.ForeignKey('profile.identity_id'))
    task_status = db.Column(db.String)
    task_create_time = db.Column(db.TIMESTAMP, default=func.now())
