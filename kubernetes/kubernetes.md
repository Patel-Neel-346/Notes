## Control Plane
![[controll-plane.png]]
#### API Server
- Api server is called the brain of the kubernetes, it does allmost everything
- It is the entry point of the  kubernetes clustser
	- Kubectl
	- K9s
		 All of these communicate through API server to the cluster
- It does the authentication and authorization and then it forwards request to the other control plane components
## Schedular/Kube Schedular
The **scheduler** in Kubernetes is a core control-plane component responsible for **deciding which node runs a newly created pod** that does not yet have a node assigned.

### 🔧 What exactly does the Kubernetes Scheduler do?

When you create a pod, it’s just an object in the API server at first. The scheduler steps in and:
1. **Watches for unscheduled pods** (pods with no node assigned).
2. **Filters available nodes** based on pod requirements:
    - CPU, memory requests
    - Node selectors, taints/tolerations
    - Affinity/anti-affinity rules
3. **Ranks the nodes** (scoring them) based on:
    - Least resource usage
    - Pod spreading
    - Node preferences, etc.
4. **Assigns the pod to the best-fit node** by setting the `.spec.nodeName` field in the pod.
Then the **kubelet** on that node picks up the pod and actually starts the container(s).
#### 📦 Visual Flow:

```text
You: kubectl run --image=nginx nginx-pod
 ↓
API Server creates a Pod (no node assigned yet)
 ↓
Scheduler checks all Ready nodes
 ↓
Filters → Scores → Picks a Node (e.g., agent-1)
 ↓
Pod updated with: spec.nodeName = "agent-1"
 ↓
Kubelet on agent-1 pulls image, runs container
```
#### 🧠 Can I customize or replace it?
Yes! Kubernetes lets you:
- Use a custom scheduler (e.g., for ML workloads or GPU-aware scheduling).
- Run multiple schedulers for different types of pods.
- Configure pod-specific scheduling rules (node affinity, priorities, etc.)
