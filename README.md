Docker:

    Inside BasicExpressWebApp and PSQL folders run:

    docker build -t basicwebapp:v1 .
    docker build -t psql:v1 .

    docker volume create my-psql-vol
    docker network create my-net

    docker run --name basicwebapp -p 3000:3000 -d --network my-net basicwebapp:v1
    docker run --name psql -p 5432:5432 -d --network my-net -v my-psql-vol:/var/lib/postgresql/data psql:v1

Docker Compose:

    docker-compose up
    docker-compose down

K8S:

    Install: 
    minikube: https://minikube.sigs.k8s.io/docs/start/
    kubectl: https://kubernetes.io/docs/tasks/tools/install-kubectl/
    https://www.virtualbox.org/wiki/Linux_Downloads (if default docker driver doesnt work)

    kubectl apply -f deployment.yaml
    kubectl get pod

    eval $(minikube docker-env)
    docker build -t basicwebapp:v1 .
    docker build -t psql:v1 .

    minikube service basicwebapp-service --url
    minikube service psql-service --url


Terraform:

https://www.terraform.io/downloads

https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret

Azure:


1) sudo apt install azure-cli
2) az login
3) az ad sp create-for-rbac -n "api://terraformapp" --role="Contributor" --scopes="/subscriptions/43996779-fd4d-4b53-869f-40086f8f4281"
4) az login --service-principal -u CLIENT_ID -p CLIENT_SECRET --tenant TENANT_ID
5) az vm list-sizes --location westus