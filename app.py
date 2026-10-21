"""Nexora: a small personal productivity dashboard built with Flask."""

from flask import Flask, jsonify, render_template
import random


app = Flask(__name__)

QUOTES = [
    {"text": "The secret of getting ahead is getting started.", "author": "Mark Twain"},
    {"text": "Small daily improvements are the key to staggering long-term results.", "author": "Unknown"},
    {"text": "It always seems impossible until it is done.", "author": "Nelson Mandela"},
    {"text": "Success is the sum of small efforts, repeated day in and day out.", "author": "Robert Collier"},
    {"text": "Focus on being productive instead of busy.", "author": "Tim Ferriss"},
    {"text": "You do not have to see the whole staircase, just take the first step.", "author": "Martin Luther King Jr."},
]


@app.route("/")
def home():
    """Show the main dashboard."""
    return render_template("index.html")


@app.route("/api/quote")
def random_quote():
    """Return one motivational quote as JSON."""
    return jsonify(random.choice(QUOTES))


if __name__ == "__main__":
    app.run(debug=True)
