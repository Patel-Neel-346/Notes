> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=49&selection=3,0,3,69|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.49]]
> > Figure 2.3 shows what the Pod looks like running inside the minikube.

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=51&selection=224,0,228,6|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.51]]
> > Typically, the events section will contain clues as to why a Pod is not in the Running state.
> 
> 

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=54&selection=151,35,177,28|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.54]]
> > This is a subtle but critical difference between a kubectl create versus a kubectl apply. A kubectl create will fail if the resource already exists. The kubectl apply command first detects whether the resource exists and performs a create operation if the object doesn’t exist or an update if it already exists.
> 
> 

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=57&selection=53,24,61,11|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.57]]
> >  a live resource manifest includes all the fields specified in the file plus dozens of new fields such as additional metadata, the status field, and other fields in the resource spec. All these additional fields are populated by the Deployment controller and contain important information about the resource’s running state.

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=57&selection=83,0,97,31|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.57]]
> > kubectl apply merges the manifest from the specified file and the live resource manifest. As a result, the command updates only fields specified in the file, keeping everything else untouched. So if we decide to scale down the deployment and change the replicas field to 1, then kubectl changes only that field in the live resource and saves it back to Kubernetes using an update API.

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=58&selection=51,0,59,30|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.58]]
> > THREE-WAY MERGE A three-way merge is a merge algorithm that automatically analyzes differences between two files while also considering the origin or the common ancestor of both files.
> 
>  Read the above paragraph to learn about three way merge and how kubernetes handles the fields deletion in yaml files

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=58&selection=60,0,65,29|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.58]]
> > Finally, let’s discuss the situations where kubectl apply might not work as expected and should be used carefully.
> 
> Read the full paragraph to understand  why you should not mix both imperative and declarative approaches

> [!PDF|] [[gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress.pdf#page=60&selection=13,0,25,55|gitops-and-kubernetes-continuous-deployment-with-argo-cd-jenkins-x-and-flux-1nbsped-1617297275-9781617297977_compress, p.60]]
> > CONTROLLER DELEGATION BENEFIT With controller delegation, Kubernetes functionality can be easily extended to support new capabilities. For example, services that are not backward-compatible can only be deployed with a blue/ green strategy (not rolling updates). Controller delegation allows a new controller to be rewritten to support blue/green deployment and still leverage the Deployment controller functionality through delegation without reimplementing the Deployment controller’s core functionality.
> 
>  Again go through  the topic to understand controller architecture

