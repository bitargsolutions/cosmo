import { createSchema, createYoga } from "graphql-yoga";
import { Logger } from "@cosmo/core";

import { Query, Mutation } from "./resolvers";

import Resource from "./entities/resource";
import AuthEntity from "./entities/auth_entity";

import MariaDBRepository from "./repos/mariadb";

// -- Initialize entities

const repo = new MariaDBRepository();

Logger.Initialize();
Resource.Initialize(repo);
AuthEntity.Initialize(repo);

const schemaFile = Bun.file("./schema.gql");
const schema = await schemaFile.text();

const yoga = createYoga({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query,
			Mutation
		}
	}),
	context: async ({ request }) => {
		const authEntityId = request.headers.get("cosmo-entity-id");
		const authEntitySecret = request.headers.get("cosmo-entity-secret");

		if (
			!authEntityId ||
			!authEntitySecret ||
			!authEntityId.startsWith(AuthEntity.PrefixId)
		)
			return;

		const fetchResult = await AuthEntity.Fetch(authEntityId);
		if (!fetchResult.IsOk) return;

		const entity = fetchResult.Unwrap();
		if (!entity) return;

		if (authEntitySecret !== entity.secretHash) return;

		return { entity };
	}
});

const server = Bun.serve({
	port: 3000,
	fetch: yoga
});

console.info("Server running on 3000");
