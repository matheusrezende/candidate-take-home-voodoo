# Candidate Takehome Exercise

This is a simple backend engineer take-home test to help assess candidate skills and practices. We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment. This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete. Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.

We value your time, and you should too. If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish.

The theory portions of this test are more open-ended. It is up to you how much time you spend addressing these questions. We recommend spending less than 1 hour.

For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments. We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview

This project is a simple game database and consists of 2 components.

The first component is a VueJS UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from an SQLite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase. However, this type of stack is in regular use at Voodoo.

# Project Setup

You will need to have Node.js, NPM, and git installed locally. You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`. Then run `git add .` to add all of the relevant files. Then `git commit` to complete the repo setup. You will send us this repo as your final product.

Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments

Pretend for a moment that you have been hired to work at Voodoo. You have grabbed your first tickets to work on an internal game database application.

#### FEATURE A: Add Search to Game Database

The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform. The front end team has already created UI for these features and all that remains is for the API to implement the expected interface. The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string. If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps

Add a populate button that calls a new route `/api/games/populate`. This route should populate your database with the top 100 games in the App Store and Google Play Store.
To do this, our data team have put in place 2 files at your disposal in an S3 bucket in JSON format:

- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json
- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json

# Theory Assignments

You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:

We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready?
Please elaborate an action plan.

To make the project production-ready, we need to address the following missing pieces:

- CI/CD Flow: Implement a robust CI/CD (Continuous Integration/Continuous Deployment) pipeline to automate the testing, building, and deployment processes. This will ensure that changes are thoroughly tested and deployed reliably to production.

- Logs/Monitoring: Set up a comprehensive logging and monitoring system to track the application's performance and detect potential issues. Use tools like centralized logging services like Splunk or Datadog. Configure alerts and notifications to proactively identify and address any anomalies or errors.

- Data Validation: Implement validation checks for the data before saving it to the database. Ensure that all required fields, such as "platform" "version" "bundleId" are present and valid. This validation step will help maintain data integrity and prevent inconsistent or erroneous entries.

- Error Handling and HTTP Codes: Improve the error handling mechanism throughout the application. Provide meaningful error messages and appropriate HTTP status codes (e.g., 400 Bad Request, 500 Internal Server Error) to facilitate troubleshooting and enhance the user experience.

- Test Improvements: Enhance the test suite by adding more comprehensive and robust test cases. Include unit tests, integration tests, and end-to-end tests to cover various aspects of the application's functionality.

- Frontend Feedback: Enhance the frontend user experience by providing better feedback to users. This could include visual indicators for successful actions, error messages displayed in a user-friendly manner, and real-time updates to improve responsiveness.

- Authentication: Implement a secure authentication mechanism to prevent unauthorized access to the application. Depending on if the application is planned to be used internally basic authentication would be enough, although if used by external users, a more robust authentication system would have to be put in place to prevent access to the application's resources (e.g., oauth2, jwt, session management).

- OpenAPI schema: By including the OpenAPI schema and Swagger file in the project, we provide a standardized and well-documented API interface, improving communication and integration with other services or clients consuming your API.

Action Plan:

1. Set up and configure a CI/CD pipeline to automate the testing, building, and deployment processes.
2. Integrate a logging and monitoring system to track application performance and detect issues with tools such as Winston and Prometheus for metrics.
3. Implement data validation checks before saving data to the database. Tools like `joi` could be used here to easily facilitate the process of checking for those.
4. Improve error handling mechanisms and ensure correct HTTP status codes are returned.
5. Enhance the test suite by adding more comprehensive and robust test cases.
6. Implement frontend improvements to provide better feedback to users.
7. Implement a secure authentication mechanism to restrict unauthorized access.
8. Provide an OpenAPI schema to help consumers to utilize and visualize the resources provided.

#### Question 2:

Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.

Answer:

Scenario 1: The file is delivered with the same name and path in the s3 bucket.

- The file can be consumed the way it is currently on the endpoint
- Provide a AWS cloud function that will receive a `new object created event` when the file is created in the bucket, and from there call the `/api/games/populate` endpoint.

Scenario 2: The file is delivered with a different name and path.

- The endpoint would have to be altered in order to consume the files from a URL provided in the parameters of the request.
- Provide a AWS cloud function that will receive a `new object created event` when the file is created in the bucket, and from there call the `/api/games/populate` endpoint with the url of the file in the request body.

```JS
POST /api/games/populate
{
    "fileUrl": "path to file"
}
```

A second option that would fit both scenarios is to run a cronjob that will check if there are new files on the bucket and request the `/api/games/populate` same as described above, but this is less reliable if we want to have the changes done instantly.

#### Question 3:

Both the current database schema and the files dropped in the S3 bucket are not optimal.
Can you find ways to improve them?

Answer:

Schema:

- Limit the length of fields.
- Use enums for the platform (ios/android).
- Make storeId unique and non-nullable to check for duplicates.

Files:

- The file should be flattened by default
- No empty elements should be there
