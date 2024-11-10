from flask import Flask, render_template, request, jsonify
from app import app

@app.route("/generate", methods=["POST"])
def generate():
    prompt = request.json["text"]
    return jsonify({
        "text": f" {prompt} -- new generated text"
    })