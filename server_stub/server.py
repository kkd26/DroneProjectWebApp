import flask
from flask import request, Response
from camera import Camera

app = flask.Flask(__name__)
app.config["DEBUG"] = True

path = []

def regenerate_path(new_path):
    global path
    path = new_path

@app.route('/api/path', methods=['GET'])
def path_endpoint():
    new_path = request.args.get('path')
    regenerate_path(new_path)
    return "The new path is " + str(path)

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

app.run()