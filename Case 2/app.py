from flask import Flask, render_template, request
import subprocess

app = Flask("")

# Function to get the content from output.json
def get_output_content():
    try:
        with open('output.json', 'r') as file:
            content = file.read()
        return content
    except Exception as e:
        return f"Error while reading output.json: {str(e)}"

@app.route('/output')
def get_output():
    content = get_output_content()
    return render_template('index.html', message=content)

# Define the Docker Compose build command
docker_compose_build_command = 'docker-compose build'

# Define the Docker Compose up command
docker_compose_up_command = 'docker-compose up -d'

# Define the watch command to run docker stats and append the output to a file
watch_command = 'watch -n 3 \'docker stats --no-stream --format "{{ json . }}" >> output.json\''

# Function to build the emulator containers
def build_emulator():
    try:
        subprocess.call(docker_compose_build_command, shell=True)
        return "Emulator containers built successfully."
    except Exception as e:
        return f"Error while building emulator containers: {str(e)}"

# Function to start the emulator containers
def start_emulator():
    try:
        subprocess.call(docker_compose_up_command, shell=True)
        return "Emulator containers started in the background."
    except Exception as e:
        return f"Error while starting emulator containers: {str(e)}"

# Function to watch emulator resources
def watch_emulator():
    try:
        subprocess.call(watch_command, shell=True)
        return "Resource monitoring started."
    except KeyboardInterrupt:
        return "Resource monitoring terminated by the user."

# Function to stop the emulator containers
def stop_emulator():
    try:
        subprocess.call('docker-compose down', shell=True)
        return "Emulator containers stopped."
    except Exception as e:
        return f"Error while stopping emulator containers: {str(e)}"

@app.route('/', methods=['GET', 'POST'])
def index():
    message = ''
    if request.method == 'POST':
        choice = request.form['choice']
        if choice == '1':
            message = build_emulator()
        elif choice == '2':
            message = start_emulator()
        elif choice == '3':
            message = watch_emulator()
        elif choice == '4':
            message = stop_emulator()
    return render_template('index.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)
