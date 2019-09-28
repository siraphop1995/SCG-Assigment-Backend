# SCG-Assigment-Backend
###Installing & Running
To install and run simply follow these steps:

1)  Clone this repo

2)  Open your terminal and run `node server.js`

3)  Your server is now available at `http://localhost:3000`

4)  Request GET '/findPlace' API to `http://localhost:3000` to restaurant within 5000m of Bangsue

5)  Request GET '/findXYZ' API to `http://localhost:3000` to find value of x, y and z from static value

6)  Request POST '/findXYZ' API to `http://localhost:3000` to find value of x, y and z from JSON object
//Example JSON Object

{
"items":["x", "5", "9","15", "23", "y", "z", "a", "b","c"]
}

Heroku link: `https://agile-crag-49831.herokuapp.com`


To use wallet-line-bot please use the following command:

1)  Use create command to initialize account with bot

2)  Use add [value] command to add money your balance

3)  Use expense [type] [value] command to indicated amount spend, type refer to type of spending such as 'food'

4)  Use check command to check your account balance and spending

This bot are create with dialogflow so the command does not need to be exact, for instance, you may use 'setup' instead of create to initialize the account

###Example
create
add 50
buy food 50
spend snack 80
check