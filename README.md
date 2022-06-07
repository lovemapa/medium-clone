# API for user signup, login , fetch Users and logout


### ENDPOINTS
> http://localhost:3000/user [POST] (Signup)

> http://localhost:3000/user/login [POST] (Login)

> http://localhost:3000/user?name=Pawa&contact=98 [GET] (Get Users)

> http://localhost:3000/user/logout [PATCH] (Logout)




# FOR RUNNING MONGODB in DOCKER

> docker pull mongo:latest


> docker run -d -p 2717:27017 -v docker-mongodb:/data/db --name mongodb mongo:latest


> docker exec -it mongodb bash (If u wish to check mongodb running and execute commands over mongodb shell)
