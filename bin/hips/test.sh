#!/bin/bash

./bin/helium-vote.ts create-proposal \
  -n "Test Vote: Top IOT Sensor Solutions" \
  --proposalUri "https://gist.githubusercontent.com/hiptron/9a017901a42c91bdb7e38a8ff9544600/raw/5dfe487568d0817d3e1e992c2c498d670639ebe2/Test%2520Vote:%2520Top%2520IOT%2520Sensor%2520Solutions.md" \
  -u "https://solana-rpc.web.helium.io?session-key=Pluto" \
  --orgName Helium \
  --choices "Tracking devices or people" \
  --choices "Location Temp/Humidity" \
  --choices "Location CO2/Air Quality" \
  --choices "Movement/Presence detection" \
  --choices "Soil quality/environment" \
  --multisig FftLLJWbQQhRDv72ihR4Q7259VdPa4AZ3zxJcsB3wjE9 \
  --maxChoicesPerVoter 3
