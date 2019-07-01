# SandboxUiA2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.5.

You need to pre-install [Angular CLI] by Running `npm install -g @angular/cli` and 
  install nodemon by running `npm install -g nodemon`;

To run this project successfully, 
1. Clone the two other repositories from gitlab. 
  - `git clone https://git.braingines.com/UI/webui-dev-r2' and follow instructions in read.md file in that repository.
  - `git clone https://git.braingines.com/GPUAUDIO/protobuf-demo' and follow instructions in read.md file in that repository.

2. Run audio stream server
  - Run 'cd server' to move to the audio server folder.
  - Run 'npm install' to install the packages necessary to run the audio stream server
  - Run 'npm start' to start the audio stream server.
    (Navigate to `http://localhost:3000/` to ensure if the server works. If the audio player work, close the tab)

3. Run sandbox-ui
  - Back in the sandbox-ui folder, run 'npm install' to install necessary packages
  - Run 'npm start' to make our sandbox-ui run
  - Open browser and Naviage to `http://localhost:4200/` and press play button to listen music



