Total 4 APIS
**NOTE**
All api are strictly bind with the Origin
All api are implement the Rate-limiter
A user can 10 request per-minutes
I am using the express-rate-limiter (this is working in the fixed-window counter algorithm)


createUser API (By using this you can create the user)
API details 
URL - "http://localhost:5201/api/user/createUser/"
METHOD - POST
HEADERS - {
  Content-Type : "application/Json",
  Origin : "http://localhost:3000"
}
BODY - {
  "userName" : "abinash",
  "email"    : "sample@gmail.com",
  "mobileNumber" : 999999999,
  "password" : "sample@123",
  "profilePic : choose an image
}
email - email is always unique
profilePic - is optional

userLogin API (By using this user can login)
API details
METHOD - POST
HEADERS - {
  Content-Type : "application/Json"
  Origin : "http://localhost:3000"
}
BODY - {
  "email" : "sample@gmail.com",
  "password" : "sample@gmail.com"
}

getUserById API(by using this you get all the user details)
API details
URL - "http://localhost:5201/api/user/getUserById?userId=2"
METHOD - GET
HEADERS - {
  Orign - "http://localhost:3000/",
  Authorization : "TOKEN"
}
QUERY - {
 userId : 1
}

updateProfile API(by using this you get all the user details)
API details
URL - "http://localhost:5201/api/user/updateProfile/"
METHOD - PUT
HEADERS - {
   Content-Type : "application/Json"
   Orign : "http://localhost:3000/"
   Authorization : "TOKEN"
}
