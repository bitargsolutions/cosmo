import createResource from "./create_resource";
import archiveResource from "./archive_resource";
import fetchResource from "./fetch_resource";

import createAuthEntity from "./create_auth_entity";

export const Query = {
	fetchResource
};

export const Mutation = {
	createResource,
	archiveResource,
	createAuthEntity
};
