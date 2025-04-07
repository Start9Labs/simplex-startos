#!/usr/bin/env sh

set -e
printf "\n\n [i] Starting SimpleX ...\n\n"
confd="/etc/opt/simplex"
xftp="/etc/opt/simplex-xftp"
logd="/var/opt/simplex"
# Check if smp-server has been initialized
if [ ! -f "$confd/smp-server.ini" ]; then
  # Set a 15 digit server password. See the comments in smp-server.ini for a description of what this does
  export PASS=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 15) 
  # Init certificates and configs
  smp-server init -y -l --password $PASS
else
  export PASS=$(grep -i "^create_password" $confd/smp-server.ini | awk -F ':' '{print $2}' | awk '{$1=$1};1')
fi

# Function to add or update a section in the smp-server.ini config file
add_or_update_section() {
  local file="$1"
  local section="$2"
  local content="$3"

  if grep -q "^\[$section\]" "$file"; then
    # Section exists, update it
    awk -v section="$section" -v content="$content" '
      BEGIN { in_section = 0; printed = 0 }
      /^\[/ { if (in_section && !printed) { print content; printed = 1 }; in_section = 0 }
      /^\['"$section"'\]/ { in_section = 1; print; print content; printed = 1; next }
      { if (!in_section || !printed) print }
      END { if (in_section && !printed) print content }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    echo "$section section updated in $file"
  else
    # Section doesn't exist, add it
    echo "\n[$section]\n$content" >> "$file"
    echo "$section section added to $file"
  fi
}
# Add or update INFORMATION section
add_or_update_section "$confd/smp-server.ini" "INFORMATION" "source_code: https://github.com/simplex-chat/simplexmq"

# Add or update PROXY section
add_or_update_section "$confd/smp-server.ini" "PROXY" "socks_proxy: 172.18.0.1:9050\nsocks_mode: onion"

# Add or update WEB section
add_or_update_section "$confd/smp-server.ini" "WEB" "static_path: /var/opt/simplex/www"

# Add or update TRANSPORT section with correct port
add_or_update_section "$confd/smp-server.ini" "TRANSPORT" "host: <hostnames>\nport: 5223\nlog_tls_errors: off\nwebsockets: off"

# Check if xftp-server has been initialized
if [ ! -f "$xftp/file-server.ini" ]; then
  # Init certificates and configs
  mkdir -p /root/xftp
  xftp-server init -q '10gb' -p /root/xftp/

  else
  echo "All good! - XFTP initialized"
fi

# Backup store log just in case
#
# Uses the UTC (universal) time zone and this
# format: YYYY-mm-dd'T'HH:MM:SS
# year, month, day, letter T, hour, minute, second
#
# This is the ISO 8601 format without the time zone at the end.
#
_file="${logd}/smp-server-store.log"
if [ -f "${_file}" ]; then
  _backup_extension="$(date -u '+%Y-%m-%dT%H:%M:%S')"
  cp -v -p "${_file}" "${_file}.${_backup_extension:-date-failed}"
  unset -v _backup_extension
fi
unset -v _file

TOR_ADDRESS=$(sed -n -e 's/^tor-address: \(.*\)/\1/p' /root/start9/config.yaml)
XFTP_ADDRESS=$(sed -n -e 's/^xftp-address: \(.*\)/\1/p' /root/start9/config.yaml)
SMP_FINGERPRINT=$(cat $confd/fingerprint)
XFTP_FINGERPRINT=$(cat $xftp/fingerprint)

SMP_URL="smp://$SMP_FINGERPRINT:$PASS@$TOR_ADDRESS"
XFTP_URL="xftp://$XFTP_FINGERPRINT@$XFTP_ADDRESS"
mkdir -p /root/start9

cat << EOF > /root/start9/stats.yaml
---
version: 2
data:
  SimpleX SMP Server Address:
    type: string
    value: $SMP_URL
    description: Your SMP Server address, used in client applications.
    copyable: true
    qr: true
    masked: true
  SimpleX XFTP Server Address:
    type: string
    value: $XFTP_URL
    description: Your XFTP Server address, used in client applications.
    copyable: true
    qr: true
    masked: true
EOF

# Run smp-server and xftp-server as background processes
# Set up a trap to catch INT signal for graceful shutdown

_term() {
  echo "Caught INT signal!"
  kill -INT "$smp_process" 2>/dev/null
  kill -INT "$xftp_process" 2>/dev/null
}

smp-server start +RTS -N -RTS &
smp_process=$!

xftp-server start +RTS -N -RTS &
xftp_process=$!

trap _term INT

wait $xftp_process $smp_process
