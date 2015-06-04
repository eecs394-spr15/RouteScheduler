# Route Scheduler
## Synopsis

Route Scheduler is a web application that gives Feldco managers the ability to automatically generate routes for their employees based on uploaded appointments spreadsheets to generate routes for their employees. 

## Motivation

Feldco has many employees that must travel to multiple customers’ homes on a daily basis. Currently, Feldco managers manually construct these routes for their employees. From what we understand, this is a long and painstaking process. This project is intended to make that process much easier.

## Installation

Mongodb is needed for this project. Installation instructions can be found at: http://docs.mongodb.org/manual/installation/

Node.js can be installed from: https://nodejs.org/download/ 

Once node is installed, run `npm install` from the project directory.

##Running the Application

Run the website locally by running command: `node server.js` from the top level RouteScheduler directory.

In order to deploy to heroku, you must have the heroku toolbelt installed (https://toolbelt.heroku.com) and be added as a collaborator for the app on the heroku website. From the RouteScheduler directory, make sure all your changes are added/committed and run ‘git push heroku master’. The code will now deploy to heroku.

The website  can be viewed  in its deployed version at: https://route-optimizer.herokuapp.com


## API Reference

Google maps API v3, get it at: https://developers.google.com/maps/

## Tests

There currently exists no test suite for the application.

## Contributors

You can download the project at: https://github.com/eecs394-spr15/RouteScheduler.git
