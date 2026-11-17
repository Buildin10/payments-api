# payments-api Runbook

## Service overview

Payment authorization and payment status API for Buildin10.

## First response

1. Open the service in Backstage and confirm the owning team.
2. Check the Kubernetes tab for the active pods and recent events.
3. Check the deployment and ReplicaSet in the `buildin10` namespace.
4. Review the latest GitOps commit before changing the workload.

## Health checks

```bash
kubectl -n buildin10 get pods -l app.kubernetes.io/name=payments-api -o wide
kubectl -n buildin10 logs deploy/payments-api --tail=100
kubectl -n buildin10 get events --sort-by=.lastTimestamp
kubectl -n buildin10 port-forward svc/payments-api 8080:8080
curl -fsS http://127.0.0.1:8080/healthz
```

## Common failure: CrashLoopBackOff

1. Inspect `kubectl describe pod` and container logs.
2. Compare the live workload with the GitOps manifest.
3. Identify the commit that introduced the configuration change.
4. Revert the bad GitOps commit through a reviewed change.
5. Confirm the Argo CD application is Synced and Healthy.

## Recovery validation

- Deployment has the expected replica count.
- Pods are `Ready`.
- `/healthz` and `/readyz` return HTTP 200.
- Argo CD reports `Synced` and `Healthy`.
