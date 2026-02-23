#!/usr/bin/env bash
set -euo pipefail

PGDATA="${PGDATA:-/var/lib/postgresql/data}"

PRIMARY_HOST="${PRIMARY_HOST:-postgres_master}"
PRIMARY_PORT="${PRIMARY_PORT:-5432}"

REPL_USER="${REPLICATION_USER:-repl}"
REPL_PASSWORD="${REPLICATION_PASSWORD:-replpass}"

SLOT_NAME="${SLOT_NAME:-standby1}"

echo "==> Standby bootstrap script started"
mkdir -p "$PGDATA"
chown -R postgres:postgres "$PGDATA"
chmod 700 "$PGDATA"

# wait primary ready
echo "==> Waiting for primary ${PRIMARY_HOST}:${PRIMARY_PORT} ..."
until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" >/dev/null 2>&1; do
  sleep 2
done

# If no PG_VERSION, clone from primary
if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "==> PGDATA empty. Cloning from primary using pg_basebackup..."
  rm -rf "$PGDATA"/*

  export PGPASSWORD="$REPL_PASSWORD"

  # run as postgres user (important!)
  gosu postgres pg_basebackup \
    -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" \
    -D "$PGDATA" \
    -U "$REPL_USER" \
    -Fp -Xs -P -R \
    -C -S "$SLOT_NAME"

  echo "==> Basebackup done."
else
  echo "==> PGDATA already initialized. Skipping basebackup."
fi

echo "==> Starting postgres as standby..."
exec gosu postgres postgres \
  -c "config_file=/etc/postgresql/postgresql.conf" \
  -c "hba_file=/etc/postgresql/pg_hba.conf"
