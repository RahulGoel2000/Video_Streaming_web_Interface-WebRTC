<img src="Capture.PNG" style="max-width:10%;"> 

# Happy Meet 


## How to use: 

### As an User:

1- Firstly, register yourself on the app using the Signup option. Provide correct information as the details are permanent and cannot be changed.

2- Once signed up, you are eligible for logging in using the credentials submitted while registering/ Signing up. 

3- After Logging you will have a choice to either join an ongoing meeting or create a new meeting.

4- After creating a new meeting you will asked to allow mic and video to be able to interact with the others. 

5- Then you will be in the pre-viewing room and you will be asked to click on the green phone to enter the call room.
     

### As Developer:

#### Prerequisites

You have to install [Node.js](https://nodejs.org/en/) in your machine.

#### Installing

1- Firstly, clone the git repository to your local machine or you can download the zip file and extract it.

2- Open the command prompt and navigate to the directory you extracted in the previos step and run the command:
    
```
npm install
 ```

[Nodemon](https://www.npmjs.com/package/nodemon) For automatically restart the server as a dev dependency (optional)

```
npm i --sav-dev nodemon
```

#### Setting Database

For the database I use [mongodb](https://www.mongodb.com/) [Atlas](https://www.mongodb.com/cloud/atlas). But you can use the local also. 

If you don't have any account in [Atlas](https://www.mongodb.com/cloud/atlas). Visit the page and create a free account then get your connection string. More at [Documentation](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).

Use your connection string to replae the one present in .env file.


#### Running the App

If you install nodemon the you can use. (devStart script is already added to the package.json)

```
npm run devStart
```

or

```
node server.js
```


## Built With

- [Node Js](https://nodejs.org/en/) - The Backend
- [Peer JS](https://peerjs.com/) - PeerJS simplifies WebRTC peer-to-peer data, video, and audio calls.
- [SocketIo](https://socket.io/) - For realtime communication
- [NPM](https://www.npmjs.com/) - Dependency Management
- [GIT](https://git-scm.com/) - Used for version control
- [Heroku](https://heroku.com) - Used to Deploy Node.js applications


     
## Features of this WebApp:
- Login/register.
- Create a meeting.
- Room Id of your choice.
- Join a meeting.
- Pre-Viewing before Joining.
- Invite others via mail.
- mute audio.
- stop video.
- chatting during Meet.
- share screen.
- Record Screen.
- Minimizing/ maximizing other video.
- Picture in picture.
- Profile page.

## Live Demo

For deploy the project I use [heroku](https://heroku.com)

[Video Chat]


## Compatibility and other requirements

### Designed for:

- Mainly targetted to work on browsers running on Desktop and laptops. However, can be used in thge browser of your smartphone or tablets as well.
- Works the best on browsers like Chrome and Firefox.


### Some specific points to remember:

- Recording of audio of the meeting and sharing the audio along with screen sharing is tested only for Google Chrome and might not be available on other browsers.
- The feature of "picture in picture" is only tested on Mozilla Firefox and might not work on other browsers.
- You are allowed to have a RoomId of your choice, however letting a Id getting created automatically is more seecured due to its random nature making it unique.


### The web app has been tested on:

- Samsung Galaxy J7 Prime (Android- Chrome)
- Acer Predator Helious 300 (Windows 10- Chrome, Firefox, Edge)
- Realme 2 pro (Android- Chrome)
- Acer Predator Helious 300 (Ubuntu- Chrome)



