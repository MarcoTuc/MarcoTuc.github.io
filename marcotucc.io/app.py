import torch

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/compute_matrix', methods=['POST'])
def compute_matrix():
    data = request.json
    n = data['n']
    
    # Create random NxN tensor
    tensor = torch.rand(n, n)
       
    # Convert to Python list and get max value for visualization scaling
    result_list = tensor.tolist()
    max_val = float(torch.max(tensor))
    
    return jsonify({
        "matrix": result_list,
        "max_val": max_val
    })


if __name__ == '__main__':
    app.run(debug=True)