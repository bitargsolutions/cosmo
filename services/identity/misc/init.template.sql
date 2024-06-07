-- ==== GENERAL ==== --

/*
GID significa: Global ID.
Debajo de la declaración del GID de cada entidad, se especifica cual es su formato.
Este GID también se encarga de juntar los atributos más importante de la entidad en un texto.

---

Se puede ver también que hay partes del script que hay cosas como: #<texto>#.
Estas cadenas serán sustituidas por variables de entorno en el proceso de "setup".

Ej: MODE=production ... access_manager_#MODE# -> access_manager_production.
    [env var]           [init.template.sql]      [init.sql]
*/

CREATE DATABASE IF NOT EXISTS access_manager_#MODE#;
USE access_manager_#MODE#;

-- ==== STATE ==== --

/*
Casi todas las entidades tienen un State.
Este representa el estado en el que está actualmente.

Se encarga de registrar:
 - CreatorGID           : ¿Quién creó la entidad?
 - CreatorDate          : ¿Cuando la creo?
 - LastModificationDate : ¿Cuando fue la última modificación?
                          Si es NULL, significa que, desde su creación, nunca fue modificada.

Las entidades también pueden ser archivadas.
La archivación es una alternativa a la eliminación permanente. Para mantener
cierta coherencia y datos legacy, tomamos la decisión de archivar/deshabilitar
las entidades.

Entonces, State también se encarga de registrar:
 - ArchiverGID   : ¿Quién archivó la entidad?
 - ArchivingDate : ¿Cuando la archivó?
*/

CREATE TABLE State (
	StateID AUTO_INCREMENT PRIMARY KEY NOT NULL,

	CreatorGID VARCHAR(70) NOT NULL, -- Identities.IdentityGID
	CreationDate DATETIME NOT NULL,

	ArchiverGID VARCHAR(70), -- Identities.IdentityGID
	ArchivingDate DATETIME,

	LastModificationDate DATETIME
);

DELIMITER $$

CREATE FUNCTION CreateState(
	CreatorGID VARCHAR(70)
) RETURNS INT
BEGIN
	DECLARE last_id INT;

	INSERT INTO State (
		CreatorGID,
		CreationDate
	) VALUES (
		
	);

	SET last_id = (SELECT max(StateID) FROM State);

	RETURN last_id;
END; $$

DELIMITER ;

-- ==== IDENTITIES ==== --

/*
Una Identidad es una entidad que tiene credenciales.
Estas credenciales se pueden pensar como:
 - Username : IdentityID
 - Password : SecretKey

Más adelante se define lo que son las acciones y los permisos, pero por ahora, se puede pensar que:
 - Las Identidades pueden realizar acciones sobre determinados Recursos.
 - Los Recursos representan entidades de este y otros servicios.
 - Para saber si una Identidad puede realizar una Acción sobre un determinado Recurso,
   existen los Permisos.
   Los Permisos relacionan a las Identidades, las Acciones y los Recursos. En la sección de Permisos
   se explican los detalles.

Las Identidades están relacionadas con un Estado único. Esto significa que las Identidades pueden
ser Creadas, Modificadas y Archivadas.
*/

CREATE TABLE Identities (
	StateID INTEGER NOT NULL UNIQUE,
	CONSTRAINT Fk_StateID FOREIGN KEY (StateID) REFERENCES State(StateID),

	IdentityGID VARCHAR(70) PRIMARY KEY NOT NULL,
	-- Formato: cosmo:access_manager:identity:<IdentityID>

	IdentityID VARCHAR(40) UNIQUE NOT NULL,
	-- Idealmente debería ser un hash de RIPEMD-160, el cual es
	-- siempre de 40 caracteres

	SecretKey VARCHAR(128) NOT NULL
	-- Idealmente debería ser un hash de SHA-512, el cual es
	-- siempre de 128 caracteres
);

/*
Las Identidades deben ser creadas por otras Identidades.
Entonces, necesitamos una entidad raíz que no tenga padre, y de la cual
todas las demás entidades hereden.

Esta entidad la nombro como DIOS (GOD), ya que es la creadora de las demás.
También tiene permisos especiales (básicamente puede hacer cualquier cosa,
sin necesidad de permisos explícitos), pero lo detallo más adelante.
*/

INSERT INTO State (
	CreatorGID, CreationDate
) VALUES (
	"cosmo:access_manager:identity:god",
	NOW()
);

INSERT INTO Identities (
	StateID, IdentityGID, IdentityID, SecretKey
) VALUES (
	(SELECT max(StateID) FROM State),
	"cosmo:access_manager:identity:god",
	"god",
	"#SECRET_KEY#"
);

-- ==== SERVICES ==== --

/*
Los Servicios sirven para ordenar los Recursos y las Acciones.
Además, eventualmente nos permitirá saber de donde proviene cada Recurso o Acción.

También es necesario para que las Acciones de distinto Servicio tengan el mismo ID de Acción.
(Detallado en la parte de Acciones)

Los Servicios tienen un Estado asociado, significa que pueden ser
Creados, Modificados y Archivados.
Este proceso ABM de Servicios está detallado en la documentación oficial de Access Manager, ya que
es extenso y para hacerlo se deben considerar varios factores, además de cumplir con las prácticas de
seguridad recomendadas.
*/

CREATE TABLE Services (
	StateID INTEGER NOT NULL UNIQUE,
	CONSTRAINT Fk_StateID FOREIGN KEY (StateID) REFERENCES State(StateID),

	ServiceGID VARCHAR(80) PRIMARY KEY NOT NULL,
	-- Format: cosmo:access_manager:service:<ServiceSlug>

	ServiceSlug VARCHAR(50) NOT NULL UNIQUE
);

/*
Los Servicios pueden ser creados por Identidades.
Estas Identidades son controladas desde el backend y solamente
pueden tener un servicio asociado.

Ej:
Si quisieramos crear un servicio de analíticas, tendriamos que
dar de alta una identidad que tenga los permisos necesarios
para crea el Servicio "analytics".
Luego, desde el backend vamos a controlar que esta Identidad
solo tenga un servicio asociado.

Esta Identidad especial la nombro Super Entidad.
Cada servicio de Cosmo tiene una Super Entidad asociada. Esta es
la encargada de administrar el servicio y cuenta con todos los permisos de dicho Servicio,
así como también el permiso de Modificar y Archivar el Servicio.

Solamente la Identidad que creó el servicio puede Modificarlo o Archivarlo.

En el caso del Access Manager, no es necesario crear una Super Entidad, porque ya tenemos
la entidad DIOS.
*/

INSERT INTO State (
	CreatorGID, CreationDate
) VALUES (
	"cosmo:access_manager:identity:god",
	NOW()
);

INSERT INTO Services (
	StateID, ServiceGID, ServiceSlug
) VALUES (
	(SELECT max(StateID) FROM State),
	"cosmo:access_manager:service:access_manager",
	"access_manager"
);

-- ==== RESOURCES ==== --

CREATE TABLE Resources (
	StateID INTEGER NOT NULL UNIQUE,
	CONSTRAINT Fk_StateID FOREIGN KEY (StateID) REFERENCES State(StateID),

	ResourceGID VARCHAR(146) PRIMARY KEY NOT NULL,
	-- Format: cosmo:<ServiceSlug>:<ResourceType>:<ResourceID>

	ServiceSlug VARCHAR(50) NOT NULL,
	CONSTRAINT Fk_ServiceSlug FOREIGN KEY (ServiceSlug) REFERENCES Services(ServiceSlug),

	ResourceType VARCHAR(50) NOT NULL,
	ResourceID VARCHAR(40) NOT NULL,

	UNIQUE KEY Uk_Resource (ServiceSlug, ResourceType, ResourceID)
);


-- ==== ACTIONS ==== --

CREATE TABLE Actions (
	StateID INTEGER NOT NULL UNIQUE,
	CONSTRAINT Fk_StateID FOREIGN KEY (StateID) REFERENCES State(StateID),

	ActionID VARCHAR(100) NOT NULL PRIMARY KEY,
	-- Format: <ServiceSlug>:<ActionSlug>

	ServiceSlug VARCHAR(50) NOT NULL,
	CONSTRAINT Fk_ServiceSlug FOREIGN KEY (ServiceSlug) REFERENCES Services(ServiceSlug),

	ActionSlug VARCHAR(50) NOT NULL,
	UNIQUE KEY Uk_ServiceAction (ServiceSlug, ActionSlug)
);

-- ==== PERMISSIONS ==== --

CREATE TABLE Permissions (
	StateID INTEGER NOT NULL UNIQUE,
	CONSTRAINT Fk_StateID FOREIGN KEY (StateID) REFERENCES State(StateID),

	Effect ENUM("Allow", "Deny") NOT NULL,

	IdentityGID VARCHAR(70) NOT NULL,
	CONSTRAINT Fk_IdentityGID FOREIGN KEY (IdentityGID) REFERENCES Identites(IdentityGID),

	ActionID VARCHAR(100) NOT NULL,
	CONSTRAINT Fk_ActionID FOREIGN KEY (ActionID) REFERENCES Actions(ActionID),

	ResourceGID VARCHAR(146) NOT NULL,
	CONSTRAINT Fk_ResourceGID FOREIGN KEY (ResourceGID) REFERENCES Resources(ResourceGID),

	UNIQUE KEY Uk_ResourceAction (ResourceGID, ActionID)

	-- It can be readed as:
	-- The Identity can/can't perform the Action on the Resource
	--              <Effect>
);

