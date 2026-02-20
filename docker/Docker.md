## Dockerfile
`Dockerfile`
```Dockerfile
FROM node 
# this command will first try to use cache if this image locally exists and if it not then it will download it from the docker hub
WORKDIR /app
# this will tell the docker where to run all the terminal commands if we not specify the work dir then it will run all the commands into the home directory. 
# make sure this command is specified before the copy and other command
COPY . . 
# the first `.` indicates from where to copy files in this case it will copy the whole folder where the docker file is located and the second `.` indicates where to paste the file inside docker in this case it will paste them in the app directory
# if we specify workdir already then we don't have to specify the target path where the files will be pasted, like '/app or /user'
RUN npm install
EXPOSE 3001
CMD ["node", "server.js"]
# why i haven't used  the `Run` command and i used the `CMD` because i want to run this command when the container is build not the time when the image is constructed
```
- Building an image from the docker file 
  `docker run build .`
- Spinning a container from a image
  `docker run some_image_id`
  if we want to map the conatiner port from the local machine port then we have to specify the port when running command 
  `docker run -p 3000:3001 some_iamge_id `
  here i am mapping my system 3000 with the ports 3001 
  
**To get all the stopped containers `docker ps -a`**
**To get all the running containers `docker ps`**

### Difference between start and run command
- Both the commands are used to start a container 
- *run* command block the terminal and *start* comand doesn't 
- *start* command uses detached mode by default so terminal doesn't blocked by docker
- *run* command uses attached mode by default so the terminal is blocked by docker by default 
***why to modes attached and detached*** 
Because when we run the container sometimes we need the print statements and output of the container on that time we use attached mode.
However we can still change the default behavior of run commnd by using extra flag to change its default behavior `-d` and same for the start `-a` 
##### Command and flags
`docker attach <container name or id>` to get attached to a container.

`logs` to fetch the logs of the container but it will not block the terminal(won't put in attached mod).

`logs -f` to attache to the container after printing logs.

`-t` to get the new terminal from container it can also be used with conmbination of `-i` interactive command. 

`rm` to delete container except running container, we have to first stop it.

`images` to get list of all images.

`rmi <image name>` to delete image except an image which is currenly in use by a container.

`image prune` to remove all unused images.
`--rm` flag after run command to delete container whenever we stop it.

`inspect` command to inspect an image.

`docker cp <from destination> <to destination>` to copy folder or files between running or stoped containers.

`--name` ot assign a name to a contianer.For images we can also assign name with tag, _tag can be used for versioning for that specific image_(`docker build -t name:tag .`)

### Volumes and BindMounts
The data inside containers are removed when they are deleated(*not stopped*).
Volumes are used to store the data from a container.
There are two types of volumes 
- Named Volumes
- anonymous Volumes
#### Named Volumes
If it's the first time you are using this named volume then docker will create it for you.
And if its second time and volume already exist then docker will pick the files from the existing volume.
Volumes are managed by the docker itself.
We cannot specify a named volume inside a docker file we have to specify it in the cmd when running a container

```shell
docker run -v volume-name:/path/in/container IMAGE_ID
```

#### BindMounts
Bindmounts are used to map the container with the local folder.
Its command is same as volumes but the difference is we just have to specify the path to the folder not the name. 

```shell
docker run -v /path/on/our/machine:path/in/container IMAGE_ID
```

#### Anonymouse Volumes
Coming to Anonymous Volumes they are just like Named Volumes and Bind Mounts except you do not specify a name or a path on your file system.
They are also different in the regard that they get removed automatically when the container is removed unlike Named Volumes and Bind Mounts.
We can specify it in the docker file or we can specify it when running a container.

```dockerFile
VOLUME ['app/logs']
```

```shell
docker run -v /path/in/container IMAGE_ID
```

---
### Networking in Docker
Docker has the first class support to make request to the www or the domains which are hosted in the internet. 

We have to use **docker.internal.host** command in the place of localhost when we want to make request to the url which is present locally *not in a container*
eg.`http://host.docker.internal:5173/dashboard`

When we want to make request to the url which is present in a another docker container then we have to specify the IP address of it.
When we inspect a docker container we will see lots of configurations `docker container inspect mongodb`. 
In the `NetworkSettings` we will see a key called `IPAddress` which will tell us a IP add of the docker container, and using this IP(172.17.0.2) we can connect to a running docker container from another docker container. 
eg.`mongodg://172.17.0.2:27017/test-db`
#### Creating a network for docker
We can create a new docker netowrk using
```bash
docker network create test-net
```

Now that we have a network we can assigned it to a conatiner when starting it.
![[creating-network.png]]
Now we have to just specify the name of the container instead of IP of the container. 
eg.`mongodg://mongo-test-container:27017/test-db`

### Docker compose
```yml
version: "3.8"
services: 
	mongo:
		image: "mongo"
	backend:
		build: "./backend" # if we want to first build the image then run the contianer
		build:
			context: "./backend"
			dockerfile: "Dockerfile-dev" # if we have with the different name
			args :  # syntax if we want to provide arguments while running the container
				arg: 3 
```