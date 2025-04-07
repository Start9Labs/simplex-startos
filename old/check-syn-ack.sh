#!/bin/bash

read DURATION
if [ "$DURATION" -le 10000 ]; then
    exit 60
else
    output=$(nc -zv 127.0.0.1 5223 2>&1)
    
    expected_output="Connection to 127.0.0.1 5223 port [tcp/*] succeeded!"

    if [ "$output" == "$expected_output" ]; then
        exit 0
    else
        echo "The smp-server process does not seem to be responding to connection requests" >&2
        exit 1
    fi
fi