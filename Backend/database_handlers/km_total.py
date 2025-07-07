from flask import Flask, session, redirect, Blueprint, request, jsonify
from flask import Flask, session, redirect, Blueprint, request, jsonify
from sqlalchemy import func

def get_total_km_people():
    total = db.session.query(
        func.sum(RunningLogs.km * RunningLogs.people_count)
    ).scalar()
    return total