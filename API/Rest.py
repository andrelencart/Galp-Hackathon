from flask import Flask, request, jsonify
import uuid
from functools import wraps

app = Flask(__name__)