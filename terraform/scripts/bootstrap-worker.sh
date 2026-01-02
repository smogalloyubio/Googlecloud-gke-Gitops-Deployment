#!/bin/bash
set -euo pipefail

# -------------------------------------------------
# Kubernetes worker bootstrap (Ubuntu 22.04)
# -------------------------------------------------

echo "[INFO] Disabling swap..."
swapoff -a
sed -i '/ swap / s/^/#/' /etc/fstab || true

echo "[INFO] Loading kernel modules..."
cat <<EOF >/etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

echo "[INFO] Applying sysctl params..."
cat <<EOF >/etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sysctl --system

echo "[INFO] Installing prerequisites..."
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# -------------------------------------------------
# Install containerd (Ubuntu repo)
# -------------------------------------------------
echo "[INFO] Installing containerd..."
apt-get install -y containerd

mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Use systemd cgroup driver
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

systemctl restart containerd
systemctl enable containerd

# -------------------------------------------------
# Install kubeadm and kubelet
# -------------------------------------------------
echo "[INFO] Installing kubeadm and kubelet..."

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key \
  | gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] \
https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /" \
  > /etc/apt/sources.list.d/kubernetes.list

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y kubelet kubeadm
apt-mark hold kubelet kubeadm

systemctl enable kubelet

# -------------------------------------------------
# Join Kubernetes cluster
# -------------------------------------------------
echo "[INFO] Waiting for join command..."

# Option 1 (recommended): Join command baked into user_data
# Replace this line with the actual join command from the master:
# kubeadm join <MASTER_IP>:6443 --token <TOKEN> --discovery-token-ca-cert-hash sha256:<HASH>

# Option 2: Pull join command from master via scp (advanced setups)

echo "[INFO] Run the kubeadm join command provided by the master to finish setup."
