# Interscience Planning App
The Interscience planning app is an application that we made as a final assignment for our study to become Java developer.  <br/>
The application helps to automate the planning for the manufacturing and testing of lab analyzing equipment.

## Installation Instructions

### Backend Instructions

when the backend is build, follow the following instructions. <br/>

- Port 8080 needs to be free, this is the port the backend runs on <br/>
- The backend runs on a postgresql database <br/>
- Java 21 or newer needs to be installed <br/>

#### Configure the env.properties
Configure the env.properties file with the correct values. Below is an explenation of each value: <br/>

DB_URL : url of the postgres-database <br/>
DB_NAME : name of the postgres-database <br/>
DB_USER : postgresql username <br/>
DB_PASSWORD : postgresql password <br/>
CORS : frontend url <br/>

SPRING_MAIL_HOST : smpt mailhost (for example smtp.gmail.com for gmail) <br/>
SPRING_MAIL_PORT : mailhost port  <br/>
MAIL_USERNAME : mail username (for example when the mailadres is "abc@gmail.com" this wil be "abc") <br/>
MAIL_PASSWORD : mail password (depending on the mail provider there is a possibility that this needs to be an app-password, this is for example the case with gmail) <br/>
MAIL_FROM : full email adress (with the example of "abc@gmail.com" this will be "abc@gmail.com") <br/>


### Frontend Instructions

The frontend is build with yarn

#### Instructions for  deployment on a Windows IIS Server
https://letsreact.org/deploy-react-application-on-iis-server/#:~:text=Setting%20up%20IIS%20Server <br/>
https://stackoverflow.com/questions/63365558/how-can-i-host-react-app-in-iis-web-server
