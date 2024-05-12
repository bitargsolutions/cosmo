CREATE DATABASE IF NOT EXISTS rman_dev;
USE rman_dev;

CREATE TABLE Resources (
	id VARCHAR(100) PRIMARY KEY NOT NULL,

	creator_id VARCHAR(100) NOT NULL, -- Auth Entity
	creation_date DATETIME NOT NULL,

	archiver_id VARCHAR(100), -- Auth Entity
	archive_date DATETIME
);

/*
Although creator_id and archiver_id references the AuthEntities.id,
the constraint is not defined. This is on purpose, to avoid a cross
relation between Resources and AuthEntities.

Also, the creator_id and archiver_id are only made for log. In the
near future, Cosmo should implement a centralized log of some kind.
*/

CREATE TABLE AuthEntities (
	id VARCHAR(63) PRIMARY KEY NOT NULL,
	crid VARCHAR(100) UNIQUE NOT NULL,
	secret_hash VARCHAR(128) NOT NULL,

	CONSTRAINT fk_crid FOREIGN KEY (crid) REFERENCES Resources(id)
);

/*
CRID stands for: Cosmo Resource ID.
*/

CREATE TABLE Permissions (
	crid VARCHAR(100) NOT NULL,
	resource_id VARCHAR(100) NOT NULL,
	auth_entity_id VARCHAR(100) NOT NULL,
	permission VARCHAR(100) NOT NULL,

	CONSTRAINT fk_resource_id FOREIGN KEY (resource_id) REFERENCES Resources(id),
	CONSTRAINT fk_auth_entity_id FOREIGN KEY (auth_entity_id) REFERENCES AuthEntities(id)
);

/*
For every Auth Entity, there must be a Resource.

It's necessary to create:

-- Global Service Resource
This resource references the service itself. It's handy to apply
some permissions to AuthEntities.

-- Super Entity
The Super Entity can execute any action and has all the permissions (super permission).
Must be used carefully and in very specific cases.
*/

INSERT INTO Resources (
	id, creator_id, creation_date
) VALUES (
	"cosmo:rman:service:rman",
	"cosmo:rman:auth_entity:super",
	NOW()
), (
	"cosmo:rman:auth_entity:super",
	"cosmo:rman:auth_entity:super",
	NOW()
), (
	"cosmo:rman:permission:super",
	"cosmo:rman:auth_entity:super",
	NOW()
);

INSERT INTO AuthEntities (
	id, crid, secret_hash
) VALUES (
	"cosmo:rman:auth_entity:super",
	"cosmo:rman:auth_entity:super",
	"<super_hash>"
);

INSERT INTO Permissions (
	crid,
	resource_id,
	auth_entity_id,
	permission
) VALUES (
	"cosmo:rman:permission:super",
	"cosmo:rman:service:rman",
	"cosmo:rman:auth_entity:super",
	"cosmo:rman:permission:super"
);
