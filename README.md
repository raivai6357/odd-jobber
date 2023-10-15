# ODD JOBBER API

## Local Environment Setup

### Clone the repo

```bash
git clone https://github.com/mrmezan06/odd-jobber.git
```

### Install dependencies

```bash
npm install
```

### Create a .env file in the root directory

```bash
PORT = 5000
MONGO_URI = mongodb://127.0.0.1:27017
DB_NAME = JOBBER
NODE_ENV = development
JWT_EXPIRE = 7d
JWT_SECRET = c65d7e8ccf6ebd18d26f1b4566e889e2
```
### Setup the database

* Download and install MongoDB Community Server from [here](https://www.mongodb.com/try/download/community)
* Download MongoDB Compass from [here](https://www.mongodb.com/try/download/compass)
* Open MongoDB Compass and connect to the server. Server address should be `mongodb://127.0.0.1:27017`  then connect on compass

### Run the app on local environment

```bash
npm start
```

### Test the API Points using POSTMAN

```bash
Base URL: http://localhost:5000/api/v1
Register URL: http://localhost:5000/api/v1/users/register
Sample Data: {
    "phone": "01704212392",
    "role": "user"
}
Login URL: http://localhost:5000/api/v1/users/login
Sample Data: {
    "phone": "01704212392",
    "password": "123456"
}
Update / Set Password URL: http://localhost:5000/api/v1/users/updatePassword
Sample Data: {
    "phone": "01704212392",
    "password": "123456"
}
Update Profile Data URL: http://localhost:5000/api/v1/users/updateProfile
Sample Data: {
    "phone": "01704212392",
    "name": "Shakib Auntor",
    "email": "shakib@gmail.com",
    "address": "Main Gate, KUET, Khulna",
    "location": {
        "lat": 88.6,
        "lng": 105.5
    }
}
```