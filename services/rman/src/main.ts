import path from "node:path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";

import { Logger } from "@cosmo/core";

import Resource from "./entities/resource.js";
import AuthEntity from "./entities/auth_entity.js";

import MariaDBRepository from "./repos/mariadb/index.js";
import GetResource from "./methods/create_resource.js";

// -- Initialize entities

const repo = new MariaDBRepository();

Logger.Initialize();
Resource.Initialize(repo);
AuthEntity.Initialize(repo);

// -- Open gRPC Server

const PROTO_PATH = path.resolve(import.meta.dirname, "..", "schema.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const reflection = new ReflectionService(packageDefinition);

const Server = new grpc.Server();

reflection.addToServer(Server);
Server.addService(protoDescriptor.ResourceManager.service, {
	GetResource
});
Server.bindAsync(
	"host.docker.internal:50051",
	grpc.ServerCredentials.createInsecure(),
	(_, port) => {
		console.log("using", port);
	}
);
