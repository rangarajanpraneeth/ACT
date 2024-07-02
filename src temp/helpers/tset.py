from flask import Flask, send_file
import matplotlib.pyplot as plt
from io import BytesIO

app = Flask(__name__)

@app.route('/plot')
def plot():
    # Generate your Matplotlib plot
    plt.plot([1, 2, 3, 4])
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    
    # Save the plot to a BytesIO object
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    
    # Clear the plot for next request
    plt.clf()
    
    # Send the image file
    return send_file(buffer, mimetype='image/png')

if __name__ == '__main__':
    app.run()
