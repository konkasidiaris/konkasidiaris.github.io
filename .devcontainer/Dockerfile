FROM golang:1.27.0-trixie

# VARIANT can be either 'hugo' for the standard version or 'hugo_extended' for the extended version.
ARG VARIANT=hugo_extended
# VERSION can be either 'latest' or a specific version number
ARG VERSION=latest

ARG DOCKER_GID
ARG USERNAME=website
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Download Hugo
RUN apt-get update && apt-get install -y ca-certificates openssl git curl docker.io && \
    groupadd --gid $USER_GID $USERNAME && \
    useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME && \
    groupadd -f -g ${DOCKER_GID} docker && \
    usermod -aG docker ${USERNAME} && \
    rm -rf /var/lib/apt/lists/* && \
    case ${VERSION} in \
    latest) \
    export VERSION=$(curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep "tag_name" | awk '{print substr($2, 3, length($2)-4)}') ;;\
    esac && \
    echo ${VERSION} && \
    case $(uname -m) in \
    aarch64) \
    export ARCH=ARM64 ;; \
    *) \
    export ARCH=64bit ;; \
    esac && \
    echo ${ARCH} && \
    wget -O ${VERSION}.tar.gz https://github.com/gohugoio/hugo/releases/download/v${VERSION}/${VARIANT}_${VERSION}_Linux-${ARCH}.tar.gz && \
    tar xf ${VERSION}.tar.gz && \
    mv hugo /usr/bin/hugo

# Download Tailwind CSS standalone CLI
RUN case "$(uname -m)" in \
    x86_64)  TAILWIND_ARCH="x64" ;; \
    aarch64) TAILWIND_ARCH="arm64" ;; \
    *) echo "Unsupported architecture: $(uname -m)" && exit 1 ;; \
    esac && \
    curl -sLO "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-${TAILWIND_ARCH}" && \
    chmod +x "tailwindcss-linux-${TAILWIND_ARCH}" && \
    mv "tailwindcss-linux-${TAILWIND_ARCH}" /usr/bin/tailwindcss

RUN curl -sL https://github.com/Pagefind/pagefind/releases/download/v1.4.0/pagefind_extended-v1.4.0-x86_64-unknown-linux-musl.tar.gz -o pagefind.tar.gz && \
    tar -xzf pagefind.tar.gz && \
    rm pagefind.tar.gz && \
    chmod +x pagefind_extended && \
    mv pagefind_extended /usr/bin/pagefind

# Switch to non-root user
USER ${USERNAME}

EXPOSE 1313
