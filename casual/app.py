from flask import Flask

app = Flask(__name__)
@app.route("/")
def hello_world():
    return "<center>Hello World! Uooohh Mantaapp</center>"
    if __name__ == "__main__":
        app.run(debug=True,host="research.nualart.cat")
