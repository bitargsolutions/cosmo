import path from "node:path";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";

import GetResource from "./methods/get_resource.js";
import CreateResource from "./methods/create_resource.js";
import ArchiveResource from "./methods/archive_resource.js";

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
		ArchiveResource
	});
	Server.bindAsync(
		"0.0.0.0:50051",
		grpc.ServerCredentials.createInsecure(),
		(_, port) => {
			console.log("using", port);
		}
	);
}

export default startGRPCServer;
