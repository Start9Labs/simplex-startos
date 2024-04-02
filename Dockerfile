ARG TAG=22.04

FROM ubuntu:${TAG} AS build

### Build stage

# Install curl and git and simplexmq dependencies
RUN apt-get update && apt-get install -y curl git build-essential libgmp3-dev zlib1g-dev llvm-12 llvm-12-dev libnuma-dev libssl-dev

# Specify bootstrap Haskell versions
ENV BOOTSTRAP_HASKELL_GHC_VERSION=9.6.3
ENV BOOTSTRAP_HASKELL_CABAL_VERSION=3.10.1.0

# Install ghcup
RUN curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | BOOTSTRAP_HASKELL_NONINTERACTIVE=1 sh

# Adjust PATH
ENV PATH="/root/.cabal/bin:/root/.ghcup/bin:$PATH"

# Set both as default
RUN ghcup set ghc "${BOOTSTRAP_HASKELL_GHC_VERSION}" && \
    ghcup set cabal "${BOOTSTRAP_HASKELL_CABAL_VERSION}"

COPY ./simplexmq /project
WORKDIR /project

# Compile apps
RUN cabal update
RUN cabal build exe:smp-server
RUN cabal build exe:xftp-server

# Create new path containing all files needed
RUN mkdir /final
WORKDIR /final

# Strip the binaries from debug symbols to reduce size
RUN for app in smp-server xftp-server; do \
    bin=$(find /project/dist-newstyle -name "$app" -type f -executable) && \
    mv "$bin" ./ && \
    strip ./"$app" &&\
    mv /project/scripts/docker/entrypoint-"$app" ./entrypoint; \
done

### Final stage
FROM ubuntu:${TAG}

# Install OpenSSL dependency
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends openssl libnuma-dev tini netcat \
  && rm -rf /var/lib/apt/lists/*

# Copy compiled apps from build stage
COPY --from=build /final /usr/local/bin/

# simplexmq requires using SIGINT to correctly preserve undelivered messages and restore them on restart
STOPSIGNAL SIGINT

ADD ./check-syn-ack.sh /usr/local/bin/check-syn-ack.sh
RUN chmod a+x /usr/local/bin/check-syn-ack.sh

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
