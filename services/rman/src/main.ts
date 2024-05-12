import { Logger } from "@cosmo/core";

import Resource from "./entities/resource.js";
import AuthEntity from "./entities/auth_entity.js";

import MariaDBRepository from "./repos/mariadb/index.js";
import startGRPCServer from "./exposes/grpc/index.js";

// -- Initialize entities

const repo = new MariaDBRepository();

Logger.Initialize();
Resource.Initialize(repo);
AuthEntity.Initialize(repo);

startGRPCServer();
