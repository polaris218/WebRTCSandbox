# SandboxUiA2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.5.

You need to pre-install [Angular CLI] by Running `npm install -g @angular/cli` and 
  install nodemon by running `npm install -g nodemon`;

To run this project successfully, 

1. Clone the two other repositories from gitlab
  - `git clone https://git.braingines.com/UI/webui-dev-r2' using 'alex' branch, init submodules
  - `git clone https://git.braingines.com/GPUAUDIO/protobuf-demo' using 'master' branch)

2. Run Protobuf-Demo server using protobuf-demo - cloned folder
  - Run 'npm install' to install the packages necessary to run this server
  - Run 'npm start' to start server that powers left and right panels of Sandbox with test data generated

3. Run audio stream server using sandbox-ui - cloned folder
  - In main folder (project folder) run 'cd server' to move to the audio server folder. We will work with this folder furtherly.
  - Run 'npm install' to install the packages necessary to run the audio stream server. Run 'npm run build'.
  - Run 'npm start' to start the audio stream server. It should up the 3679-port assigned server

4. Test Sandbox
  - Open browser and Navigate to `http://localhost:4200/ and press play button to listen music, you can use knobs by rotating them after initiating any product in center of the screen (push plus button to add any product)



