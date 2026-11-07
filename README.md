# Homework -Web Frontend Developer

- Started 08:26
- Using WebRTC ( want to learn what and how to set this up )
- Used some time to select setup and getting up and running when its been a while since I used any build tools.  
- Started the task around 9:00 for real.

## Requirements
`node.js@22+` locally on your machine

## Run
`npm install`\
`npm run dev`\
`npm run test`

## Architecture option
- Chose to use vite build back with SSR when this included server and frontend with typescript support
- I know the Node.js, express.js and React stack. So this was a solid choice for me
- Chose to use plain .css when this will show more knowledge about hos to use plain css instead of a visual style.
- This will create more time to create the application, but show more of my skills.
- Used WebRTC with `node-datachannel`. I never used this before but wanted to learn and see how it worked.
- Added global types into `./types` folder to use in frontend and backend
- React is in `./src` and API in `./api`
- Api could be split into more files, but not really needed for this project
- Decided to create components by manually. Next time I would Claude to this for me, when it was time consuming.

## Notes that should be fixed
- Participants object should use redis or similar to keep state. 
- Messages should be saved in DB to not loose data
- Events sends all the messages on new message. We should only send the latest message to all users to save bandwith
- 

## Testing
I'm using vitest to test all functions for adding participants and messages.  
Testing the WebRTC logic can be tricky when we need to mock server and express sessions.
We create a Participants class that handles users  
We create a Messages class to handle messages and storage logic (Then we can easily change data storage setup)  

## Tasks

- [x] Created an SSR project with vite build tools.  
- [x] Changed to user TS for server
- [x] Created types setup
- [x] Created backend with WebRTC using Claude code to learn what to use and how it works
- [x] Created frontend connection with RTCPeerConnection to connect, send and fetch data.
- [x] Add option to disconnect
- [x] Add option to edit message
- [x] Add option to delete message
- [x] Refactor backend for separation of concern
- - [x] Participants
- - [x] Messages
- [x] Create automated tests for backend logic
- [x] Create styles from design
- - [x] Paper
- - [x] Tabs
- - [x] Participants
- - [x] Chat Message
- - [x] Chat box
- [x] Create participants list
- [x] Create chat
- [x] Create context to keep the state in one place
- [x] Connect actions with chat
- - [x] Send messages with send to server
- - [x] Get messages from server
- [ ] Handle joined event as message
- [ ] Handle left event as message
- [ ] Improve som visuals in chat
