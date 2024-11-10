from flask import Flask, render_template, request, jsonify
import torch
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compute_matrix', methods=['POST'])
def compute_matrix():
    data = request.json
    n = data['n']
    
    # Create random NxN tensor
    # tensor = torch.rand(n, n)
    
    # Compute matrix exponential
    # result = torch.matrix_exp(tensor)

    result = torch.eye(n)
    
    # Convert to Python list and get max value for visualization scaling
    result_list = result.tolist()
    max_val = float(torch.max(result))
    
    return jsonify({
        "matrix": result_list,
        "max_val": max_val
    })

@app.route("/generate", methods=["POST"])
def generate():
    prompt = request.json["text"]
    return jsonify({
        "text": f" {prompt} -- new generated text"
    })

if __name__ == '__main__':
    app.run(debug=True)