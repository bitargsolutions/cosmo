import path from "node:path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";

import GetResource from "./methods/get_resource.js";
import CreateResource from "./methods/create_resource.js";
import ArchiveResource from "./methods/archive_resource.js";
import CreateAuthEntity from "./methods/create_auth_entity.js";
import GetAuthEntity from "./methods/get_auth_entity.js";

// -- Open gRPC Server

function startGRPCServer() {
	const PROTO_PATH = path.resolve(
		import.meta.dirname,
		"../../../misc",
		"schema.proto"
	);

	const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	});

	const protoDescriptor = grpc.loadPackageDefinition(
		packageDefinition
	) as any;
	const reflection = new ReflectionService(packageDefinition);

	const Server = new grpc.Server();

	reflection.addToServer(Server);
	Server.addService(protoDescriptor.ResourceManager.service, {
		GetResource,
		CreateResource,
		ArchiveResource,
		CreateAuthEntity,
		GetAuthEntity
	});
	Server.bindAsync(
		"0.0.0.0:50051",
		grpc.ServerCredentials.createInsecure(),
		(_, port) => {
			console.log("Cosmo | gRPC Server open on:", port);
		}
	);
}

export default startGRPCServer;
