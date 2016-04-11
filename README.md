# Realtime Plugin for Micro Job Engine
This is an example for realtime solution for Micro Job Engine.
Actually, this plugin implemented a websocket client to connect to websocket server.

The server was implemented in go, extended from Pinghub ( a project from Automattic ).

# Build
This plugin use npm and nodejs module to compile js, css. So that, you have to install npm first. Then open command line and :
```
npm install
gulp
```

# Usage
To use, just install the plugin as another one. Then contact me to run up my server or do it yourself ( remember to edit server address used by the plugin ).
Now, open any frontend page. Then add new job on another tab. When post saved, you will see a notification on the frontend page.
