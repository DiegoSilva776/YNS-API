# YNS - API

YNS is a web service used to send notifications and store information about users from an app.

# Step by step to deploy the API to a Docker container on Heroku!

  - > Login on Heroku and on Heroku Container Registry
```
    heroku login
    heroku container:login
```
  - > If it is necessary, create an app on Heroku
```
    heroku apps:create yns-api
```    
  - > If it is necessary, create a Docker file to encapsulate the application
 
The folder structure will be
```
    .. app/
    .. Dockerfile
```
Contents of the Dockerfile
```
    FROM node:latest
    RUN mkdir -p /usr/src/app
    WORKDIR /usr/src/app
    COPY ./app/package.json /usr/src/app
    RUN npm install
    COPY ./app /usr/src/app
    RUN npm start
    CMD ["node", "index.js"]
```

  - > Test the image locally
    - username: Your username on Docker, for instance: 
    diegosilva776
    - v.v.v: The version of the app, for instance: 
    0.0.1
    - yns_api_image_id: the Id generated by Docker after the image build command, for instance: 
    ec99d389126d
```
    docker image build -t <username>/yns_api:<v.v.v> .
    docker run -d -p 3001:3001 <yns_api_image_id> .
    docker container ls
```
   - > Get the url of the running container and make a few requests on Postman, or create a task to test the container

   - > Deploy the image once it has successfully been executed locally
```
    heroku container:push web
    heroku container:release web
```
