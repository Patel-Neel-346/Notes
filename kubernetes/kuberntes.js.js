// ============================================
// KUBERNETES ARCHITECTURE SIMULATION
// ============================================

// Base Controller Class - Foundation for all Kubernetes controllers
class BaseController {
  constructor(resource, name) {
    this.resource = resource;
    this.name = name;
    this.spec = {};     // Desired state
    this.status = {};   // Current state
    this.metadata = {
      createdAt: new Date(),
      uid: Math.random().toString(36).substr(2, 9)
    };
    this.isRunning = false;
    this.reconcileInterval = null;
  }

  // Watch for changes in the resource state
  watchState() {
    console.log(`📊 [${this.resource}] ${this.name}: Watching state`);
    return this.status;
  }

  // Core reconciliation logic - the heart of Kubernetes
  reconcile() {
    console.log(`🔄 [${this.resource}] ${this.name}: Starting reconciliation`);
    
    const currentState = this.watchState();
    const desiredState = this.spec;

    // Compare current vs desired state
    if (!this.statesMatch(currentState, desiredState)) {
      console.log(`⚠️  [${this.resource}] ${this.name}: State drift detected`);
      this.takeAction(desiredState);
    } else {
      console.log(`✅ [${this.resource}] ${this.name}: State is correct`);
    }
    
    this.updateStatus();
  }

  statesMatch(current, desired) {
    return JSON.stringify(current) === JSON.stringify(desired);
  }

  takeAction(desiredState) {
    console.log(`🛠️  [${this.resource}] ${this.name}: Taking corrective action`);
    // Default implementation - specific controllers override this
    this.status = { ...desiredState };
  }

  updateStatus() {
    this.status.lastReconciled = new Date();
    console.log(`📝 [${this.resource}] ${this.name}: Status updated`);
  }

  start() {
    this.isRunning = true;
    console.log(`🚀 [${this.resource}] ${this.name}: Controller started`);
    
    // Start reconciliation loop
    this.reconcileInterval = setInterval(() => {
      if (this.isRunning) {
        this.reconcile();
      }
    }, 5000); // Reconcile every 5 seconds
  }

  stop() {
    this.isRunning = false;
    if (this.reconcileInterval) {
      clearInterval(this.reconcileInterval);
    }
    console.log(`🛑 [${this.resource}] ${this.name}: Controller stopped`);
  }
}

// ============================================
// ETCD - Distributed Key-Value Store
// ============================================
class EtcdController extends BaseController {
  constructor(name = 'etcd-main') {
    super('etcd', name);
    this.data = new Map(); // Simulated key-value store
    this.spec = {
      clusterId: 'k8s-cluster-1',
      peers: ['etcd-1', 'etcd-2', 'etcd-3'],
      state: 'leader' // leader, follower, candidate
    };
    this.status = {
      healthy: true,
      members: 3,
      leader: true,
      dataSize: 0
    };
  }

  // Store data (like resource definitions, secrets, etc.)
  put(key, value) {
    this.data.set(key, {
      value: value,
      version: Date.now(),
      createdAt: new Date()
    });
    this.status.dataSize = this.data.size;
    console.log(`💾 [etcd] Stored: ${key}`);
  }

  // Retrieve data
  get(key) {
    const result = this.data.get(key);
    if (result) {
      console.log(`📖 [etcd] Retrieved: ${key}`);
      return result.value;
    }
    return null;
  }

  // List all keys with a prefix (like kubectl get pods)
  list(prefix = '') {
    const results = [];
    for (let [key, data] of this.data) {
      if (key.startsWith(prefix)) {
        results.push({ key, ...data });
      }
    }
    return results;
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    
    // Simulate etcd cluster management
    if (desiredState.state === 'leader' && !this.status.leader) {
      console.log(`👑 [etcd] ${this.name}: Becoming cluster leader`);
      this.status.leader = true;
    }
  }
}

// ============================================
// API SERVER - Central hub of Kubernetes
// ============================================
class ApiServerController extends BaseController {
  constructor(name = 'kube-apiserver', etcd) {
    super('ApiServer', name);
    this.etcd = etcd;
    this.authenticatedUsers = new Set();
    this.spec = {
      port: 6443,
      securePort: true,
      authenticationEnabled: true
    };
    this.status = {
      healthy: true,
      requestsPerSecond: 0,
      connectedClients: 0
    };
  }

  // Simulate API request handling
  handleRequest(method, resource, data = null) {
    console.log(`🌐 [API Server] ${method} /${resource}`);
    this.status.requestsPerSecond++;
    
    switch (method) {
      case 'GET':
        return this.etcd.list(`/${resource}/`);
      case 'POST':
        const id = Math.random().toString(36).substr(2, 9);
        this.etcd.put(`/${resource}/${id}`, data);
        return { id, ...data };
      case 'PUT':
        this.etcd.put(`/${resource}/${data.id}`, data);
        return data;
      case 'DELETE':
        // In real implementation, this would delete from etcd
        console.log(`🗑️  [API Server] Deleted ${resource}`);
        return { deleted: true };
      default:
        console.log(`❌ [API Server] Unsupported method: ${method}`);
    }
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    console.log(`🔧 [API Server] Configuring on port ${desiredState.port}`);
  }
}

// ============================================
// SCHEDULER - Pod placement decisions
// ============================================
class SchedulerController extends BaseController {
  constructor(name = 'kube-scheduler', apiServer) {
    super('Scheduler', name);
    this.apiServer = apiServer;
    this.nodes = new Map();
    this.spec = {
      schedulingAlgorithm: 'default',
      enablePreemption: true
    };
    this.status = {
      scheduledPods: 0,
      pendingPods: 0
    };
  }

  // Add a node to the scheduling pool
  addNode(node) {
    this.nodes.set(node.name, {
      name: node.name,
      capacity: node.capacity || { cpu: 4, memory: '8Gi', pods: 110 },
      allocatable: node.allocatable || { cpu: 3.5, memory: '7Gi', pods: 110 },
      used: { cpu: 0, memory: '0Gi', pods: 0 }
    });
    console.log(`🖥️  [Scheduler] Added node: ${node.name}`);
  }

  // Schedule a pod to a node
  schedulePod(podSpec) {
    const bestNode = this.findBestNode(podSpec);
    if (bestNode) {
      console.log(`📍 [Scheduler] Scheduled pod ${podSpec.name} to node ${bestNode.name}`);
      
      // Update node resource usage
      bestNode.used.cpu += podSpec.resources?.cpu || 0.1;
      bestNode.used.pods += 1;
      
      this.status.scheduledPods++;
      return bestNode.name;
    } else {
      console.log(`❌ [Scheduler] No suitable node found for pod ${podSpec.name}`);
      this.status.pendingPods++;
      return null;
    }
  }

  findBestNode(podSpec) {
    // Simple scheduling algorithm - find node with most available resources
    let bestNode = null;
    let bestScore = -1;

    for (let node of this.nodes.values()) {
      const availableCpu = node.allocatable.cpu - node.used.cpu;
      const availablePods = node.allocatable.pods - node.used.pods;
      
      if (availableCpu > 0 && availablePods > 0) {
        const score = availableCpu; // Simple scoring
        if (score > bestScore) {
          bestScore = score;
          bestNode = node;
        }
      }
    }
    
    return bestNode;
  }
}

// ============================================
// CONTROLLER MANAGER - Manages all controllers
// ============================================
class ControllerManagerController extends BaseController {
  constructor(name = 'kube-controller-manager', apiServer) {
    super('ControllerManager', name);
    this.apiServer = apiServer;
    this.controllers = new Map();
    this.spec = {
      concurrentSyncs: 5,
      enableLeaderElection: true
    };
    this.status = {
      activeControllers: 0,
      leader: true
    };
  }

  // Register a controller
  registerController(controller) {
    this.controllers.set(controller.name, controller);
    this.status.activeControllers = this.controllers.size;
    console.log(`🎛️  [Controller Manager] Registered: ${controller.resource}/${controller.name}`);
  }

  // Start all registered controllers
  startAllControllers() {
    console.log(`🚀 [Controller Manager] Starting ${this.controllers.size} controllers`);
    for (let controller of this.controllers.values()) {
      controller.start();
    }
  }

  // Stop all controllers
  stopAllControllers() {
    console.log(`🛑 [Controller Manager] Stopping all controllers`);
    for (let controller of this.controllers.values()) {
      controller.stop();
    }
  }
}

// ============================================
// DEPLOYMENT CONTROLLER
// ============================================
class DeploymentController extends BaseController {
  constructor(deploymentName, replicas = 3, apiServer) {
    super('Deployment', deploymentName);
    this.apiServer = apiServer;
    this.replicaSets = new Map();
    this.spec = {
      replicas: replicas,
      selector: { app: deploymentName },
      template: {
        metadata: { labels: { app: deploymentName } },
        spec: { containers: [{ name: 'app', image: 'nginx:latest' }] }
      },
      strategy: { type: 'RollingUpdate' }
    };
    this.status = {
      availableReplicas: 0,
      readyReplicas: 0,
      updatedReplicas: 0
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    
    // Ensure ReplicaSet exists for this deployment
    const rsName = `${this.name}-${Math.random().toString(36).substr(2, 5)}`;
    if (!this.replicaSets.has(rsName)) {
      const replicaSet = new ReplicaSetController(rsName, desiredState.replicas, this.apiServer);
      this.replicaSets.set(rsName, replicaSet);
      console.log(`📦 [Deployment] Created ReplicaSet: ${rsName}`);
    }
  }

  scale(newReplicas) {
    console.log(`📏 [Deployment] ${this.name}: Scaling to ${newReplicas} replicas`);
    this.spec.replicas = newReplicas;
  }

  rollingUpdate(newImage) {
    console.log(`🔄 [Deployment] ${this.name}: Rolling update to ${newImage}`);
    this.spec.template.spec.containers[0].image = newImage;
  }
}

// ============================================
// REPLICASET CONTROLLER
// ============================================
class ReplicaSetController extends BaseController {
  constructor(replicaSetName, replicas = 3, apiServer) {
    super('ReplicaSet', replicaSetName);
    this.apiServer = apiServer;
    this.pods = new Map();
    this.spec = {
      replicas: replicas,
      selector: { app: replicaSetName }
    };
    this.status = {
      replicas: 0,
      readyReplicas: 0
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    
    const currentPods = this.pods.size;
    const desiredPods = desiredState.replicas;
    
    if (currentPods < desiredPods) {
      // Scale up
      for (let i = currentPods; i < desiredPods; i++) {
        this.createPod(`${this.name}-pod-${i}`);
      }
    } else if (currentPods > desiredPods) {
      // Scale down
      const podsToDelete = Array.from(this.pods.keys()).slice(desiredPods);
      podsToDelete.forEach(podName => this.deletePod(podName));
    }
    
    this.status.replicas = this.pods.size;
  }

  createPod(podName) {
    const pod = new PodController(podName);
    this.pods.set(podName, pod);
    console.log(`🐳 [ReplicaSet] Created pod: ${podName}`);
  }

  deletePod(podName) {
    if (this.pods.has(podName)) {
      this.pods.get(podName).stop();
      this.pods.delete(podName);
      console.log(`🗑️  [ReplicaSet] Deleted pod: ${podName}`);
    }
  }
}

// ============================================
// POD CONTROLLER
// ============================================
class PodController extends BaseController {
  constructor(podName) {
    super('Pod', podName);
    this.containers = [];
    this.spec = {
      containers: [{ name: 'main', image: 'nginx:latest' }],
      restartPolicy: 'Always'
    };
    this.status = {
      phase: 'Pending', // Pending, Running, Succeeded, Failed, Unknown
      containerStatuses: []
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    
    if (this.status.phase === 'Pending') {
      console.log(`🚀 [Pod] ${this.name}: Starting containers`);
      this.status.phase = 'Running';
    }
  }
}

// ============================================
// NODE CONTROLLER
// ============================================
class NodeController extends BaseController {
  constructor(nodeName, nodeType = 'worker') {
    super('Node', nodeName);
    this.nodeType = nodeType;
    this.spec = {
      taints: [],
      capacity: { cpu: 4, memory: '8Gi', pods: 110 }
    };
    this.status = {
      phase: 'Ready', // Ready, NotReady
      conditions: [
        { type: 'Ready', status: 'True' },
        { type: 'DiskPressure', status: 'False' },
        { type: 'MemoryPressure', status: 'False' }
      ],
      nodeInfo: {
        kubeletVersion: 'v1.25.0',
        kubeProxyVersion: 'v1.25.0',
        operatingSystem: 'linux'
      }
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    console.log(`🖥️  [Node] ${this.name}: Node health check passed`);
  }
}

// ============================================
// KUBEPROXY CONTROLLER
// ============================================
class KubeProxyController extends BaseController {
  constructor(nodeName) {
    super('KubeProxy', `kube-proxy-${nodeName}`);
    this.nodeName = nodeName;
    this.spec = {
      mode: 'iptables', // iptables, ipvs
      clusterCIDR: '10.244.0.0/16'
    };
    this.status = {
      healthy: true,
      rulesCount: 0
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    console.log(`🌐 [KubeProxy] ${this.name}: Network rules updated`);
    this.status.rulesCount = Math.floor(Math.random() * 100) + 50;
  }
}

// ============================================
// KUBELET CONTROLLER
// ============================================
class KubeletController extends BaseController {
  constructor(nodeName) {
    super('Kubelet', `kubelet-${nodeName}`);
    this.nodeName = nodeName;
    this.pods = new Map();
    this.spec = {
      podCIDR: '10.244.1.0/24',
      maxPods: 110
    };
    this.status = {
      ready: true,
      runningPods: 0
    };
  }

  takeAction(desiredState) {
    super.takeAction(desiredState);
    console.log(`🤖 [Kubelet] ${this.name}: Managing pods on node`);
    this.status.runningPods = this.pods.size;
  }

  runPod(pod) {
    this.pods.set(pod.name, pod);
    console.log(`🐳 [Kubelet] Running pod ${pod.name} on node ${this.nodeName}`);
  }
}

// ============================================
// KUBERNETES CLUSTER - Master orchestrator
// ============================================
class KubernetesCluster {
  constructor(clusterName = 'k8s-cluster') {
    this.clusterName = clusterName;
    console.log(`🏗️  Initializing Kubernetes cluster: ${clusterName}`);
    
    // Initialize core components in correct order
    this.etcd = new EtcdController();
    this.apiServer = new ApiServerController('kube-apiserver', this.etcd);
    this.scheduler = new SchedulerController('kube-scheduler', this.apiServer);
    this.controllerManager = new ControllerManagerController('kube-controller-manager', this.apiServer);
    
    // Store cluster state
    this.nodes = new Map();
    this.deployments = new Map();
    
    this.initializeCluster();
  }

  initializeCluster() {
    console.log(`🚀 Starting Kubernetes cluster components...`);
    
    // Start master components
    this.etcd.start();
    this.apiServer.start();
    this.scheduler.start();
    this.controllerManager.start();
    
    console.log(`✅ Kubernetes cluster ${this.clusterName} is ready!`);
  }

  // Add a worker node to the cluster
  addNode(nodeName) {
    const node = new NodeController(nodeName);
    const kubelet = new KubeletController(nodeName);
    const kubeProxy = new KubeProxyController(nodeName);
    
    this.nodes.set(nodeName, { node, kubelet, kubeProxy });
    this.scheduler.addNode(node);
    
    // Register node components with controller manager
    this.controllerManager.registerController(node);
    this.controllerManager.registerController(kubelet);
    this.controllerManager.registerController(kubeProxy);
    
    // Start node components
    node.start();
    kubelet.start();
    kubeProxy.start();
    
    console.log(`🖥️  Node ${nodeName} added to cluster`);
  }

  // Deploy an application
  deploy(appName, replicas = 3) {
    const deployment = new DeploymentController(appName, replicas, this.apiServer);
    this.deployments.set(appName, deployment);
    
    // Register with controller manager
    this.controllerManager.registerController(deployment);
    deployment.start();
    
    console.log(`🚀 Deployed ${appName} with ${replicas} replicas`);
    return deployment;
  }

  // Scale a deployment
  scale(appName, replicas) {
    const deployment = this.deployments.get(appName);
    if (deployment) {
      deployment.scale(replicas);
      console.log(`📏 Scaled ${appName} to ${replicas} replicas`);
    }
  }

  // Get cluster status
  getStatus() {
    return {
      cluster: this.clusterName,
      nodes: this.nodes.size,
      deployments: this.deployments.size,
      etcdHealthy: this.etcd.status.healthy,
      apiServerHealthy: this.apiServer.status.healthy
    };
  }

  // Shutdown cluster
  shutdown() {
    console.log(`🛑 Shutting down cluster ${this.clusterName}...`);
    
    // Stop all deployments
    for (let deployment of this.deployments.values()) {
      deployment.stop();
    }
    
    // Stop all nodes
    for (let { node, kubelet, kubeProxy } of this.nodes.values()) {
      node.stop();
      kubelet.stop();
      kubeProxy.stop();
    }
    
    // Stop master components
    this.controllerManager.stopAllControllers();
    this.controllerManager.stop();
    this.scheduler.stop();
    this.apiServer.stop();
    this.etcd.stop();
    
    console.log(`✅ Cluster ${this.clusterName} shutdown complete`);
  }
}

// ============================================
// DEMO: Running the Complete Kubernetes Cluster
// ============================================

console.log(`
🎯 KUBERNETES ARCHITECTURE SIMULATION
=====================================
This simulation demonstrates:
- Master components (API Server, etcd, Scheduler, Controller Manager)
- Node components (Kubelet, KubeProxy)
- Controllers (Deployment, ReplicaSet, Pod, Node)
- Reconciliation loops and state management
- Complete cluster lifecycle
`);

// Create and start the cluster
const cluster = new KubernetesCluster('production-cluster');

// Add worker nodes
cluster.addNode('worker-1');
cluster.addNode('worker-2');
cluster.addNode('worker-3');

// Deploy applications
cluster.deploy('frontend-app', 3);
cluster.deploy('backend-api', 2);

// Show initial status
console.log('\n📊 Initial Cluster Status:', cluster.getStatus());

// Simulate operations after 10 seconds
setTimeout(() => {
  console.log('\n🔄 Performing cluster operations...');
  
  // Scale applications
  cluster.scale('frontend-app', 5);
  cluster.scale('backend-api', 4);
  
  // Show updated status
  console.log('\n📊 Updated Cluster Status:', cluster.getStatus());
}, 10000);

// Shutdown after 30 seconds
setTimeout(() => {
  cluster.shutdown();
}, 30000);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    KubernetesCluster,
    BaseController,
    EtcdController,
    ApiServerController,
    SchedulerController,
    ControllerManagerController,
    DeploymentController,
    ReplicaSetController,
    PodController,
    NodeController,
    KubeProxyController,
    KubeletController
  };
}