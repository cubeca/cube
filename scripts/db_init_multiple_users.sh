#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

for service_name in cloudflare content identity profile
do
	# Prefix with "cube_"
	db_id=cube_$service_name

	# This is only for local development, so we set all these to the same value, including the password.
	db_name=$db_id
	db_user=$db_id
	db_pass=$db_id

	# See https://www.postgresql.org/docs/15/sql-createuser.html
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
		CREATE ROLE $db_user WITH LOGIN PASSWORD '$db_pass';
		CREATE DATABASE $db_name;
		GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;
	EOSQL
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<-EOSQL
		GRANT ALL PRIVILEGES ON SCHEMA public TO $db_user;
	EOSQL
done
