### Pod
- **Pod** is the smallest possible unit in kubernetes
- A **Pod** can hold multiple containers
### Worker Node
- A worker node is a virtual machine somewhere with a certain amount of cpu and memory.
- A worker node can run multiple **Pod** runs inside a worker node.
- There is a another tool inside worker node called proxy which is used by kubernetes to controll and balance the network traffic of the pods on that worker node.
![[Pasted image 20240702212506.png]]
![[closer_look_worker_node.png]]
 
### Master Node
- All these worker nodes are managed by master node which handles the task of scalling up and down of the worker nodes
- And all these things forms together a cluster
![[Pasted image 20240702213241.png]]
![[closer_look_master_node.png]]
#### What we have to do and what kuberenetes does for us
![[Screenshot 2024-09-03 06:26:43.png]]
#### Summary
![[core_components.png]]
