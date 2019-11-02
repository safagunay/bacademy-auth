####Borda Academy 2019 Auth Service  
This service was created for the following purposes,  
1- Authenticate mobile app users with their internal company accounts.  
2- Register company users to google firebase on behalf of them to benefit firebase's notification service.  
3- Generate firebase_token for client apps to enable them to access firebase directly.
3- Generate access_token for client apps to authenticate them to other services(coffee,air,temprature,tea,noise services)  
 
####Firebase Admin Sdk  
This project requires a Firebase Admin Sdk. Admin Sdk enables full control over a firebase project like user management,
database management, messaging management.  
In this project via admin sdk, user registration is done if it is not registered before and a custom firebase token is generated  
and returned together with an acess_token to client app. Then the returned custom token is used by client apps to subscribe messaging topics to receive notifications and direclty send messages to topics.  

####JWT  
In this project we also decided to use jwt to generate and verify access_tokens, which was then used to authenticate to other microservices.
The reason behind why we used an extra token (access_token) is simply google firebase requires a connection to itself to verify its tokens. Which meant an extra network overhead for us.
