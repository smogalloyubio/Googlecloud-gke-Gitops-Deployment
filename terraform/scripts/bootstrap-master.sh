#!/bin/bash
set -euo pipefail

# -------------------------------------------------
# Kubernetes master bootstrap (Ubuntu 22.04)
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
# Install containerd (Ubuntu repo – stable)
# -------------------------------------------------
echo "[INFO] Installing containerd..."
apt-get install -y containerd

mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Use systemd cgroup driver (REQUIRED)
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

systemctl restart containerd
systemctl enable containerd

# -------------------------------------------------
# Install Kubernetes components
# -------------------------------------------------
echo "[INFO] Installing kubeadm, kubelet, kubectl..."

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key \
  | gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] \
https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /" \
  > /etc/apt/sources.list.d/kubernetes.list

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

systemctl enable kubelet

# -------------------------------------------------
# Initialize Kubernetes control plane
# -------------------------------------------------
echo "[INFO] Initializing Kubernetes cluster..."

API_ADDR=$(hostname -I | awk '{print $1}')

kubeadm init \
  --pod-network-cidr=192.168.0.0/16 \
  --apiserver-advertise-address=${API_ADDR} \
  --ignore-preflight-errors=Swap

# -------------------------------------------------
# Configure kubectl for root
# -------------------------------------------------
export KUBECONFIG=/etc/kubernetes/admin.conf

# -------------------------------------------------
# Install Calico CNI
# -------------------------------------------------
echo "[INFO] Installing Calico CNI..."
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml

# -------------------------------------------------
# Save worker join command
# -------------------------------------------------
kubeadm token create --print-join-command > /root/join_command.sh
chmod +x /root/join_command.sh

echo "[SUCCESS] Kubernetes master setup complete!"
echo "[INFO] Worker join command saved at /root/join_command.sh"
