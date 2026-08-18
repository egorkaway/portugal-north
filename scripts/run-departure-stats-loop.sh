#!/bin/bash
# Wait a random 3–5 hours of *awake* time, then sample CP departures.
# macOS freezes `sleep` while the machine is asleep, so intervals only
# count when the computer is active. Loaded by launchd as
# ~/Library/LaunchAgents/com.verystays.stats-departures.plist
set -u

ROOT="/Users/egor/Dev/portugal-north"
NODE="/opt/homebrew/opt/node@20/bin/node"
export PATH="/opt/homebrew/opt/node@20/bin:/usr/bin:/bin:/usr/sbin"

LOG="${HOME}/Library/Logs/verystays-stats-departures.log"
MIN_WAIT=10800
MAX_WAIT=18000

log() {
  echo "$(date +%Y-%m-%dT%H:%M:%S%z) $*" >>"$LOG"
}

random_wait() {
  local span=$((MAX_WAIT - MIN_WAIT + 1))
  local secs=$((MIN_WAIT + RANDOM % span))
  log "waiting ${secs}s (~$((secs / 60)) min) of awake time"
  sleep "$secs"
}

mkdir -p "$(dirname "$LOG")"
cd "$ROOT" || {
  log "failed to cd to $ROOT"
  exit 1
}

log "loop started (pid $$)"

while true; do
  random_wait
  log "starting collect-departure-stats.mjs --delay 500"
  "$NODE" --import tsx "$ROOT/scripts/collect-departure-stats.mjs" --delay 500 >>"$LOG" 2>&1
  status=$?
  log "finished with exit ${status}"
done
