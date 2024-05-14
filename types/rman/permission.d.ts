declare global {
	namespace Ports {
		namespace Permission {
			namespace Source {
				interface MariaDB {
					crid: string;
					resource_id: string;
					auth_entity_id: string;
					permission: string;
				}
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				resourceId: string;
				authEntityId: string;
				permission: string;
				resource: Ports.Resource.Middle;
			}

			// Driving-side representation. From/to gRPC
			namespace Presentation {
				// Must be equal to schema.proto
				interface gRPC {
					resource_id: string;
					auth_entity_id: string;
					permission: string;
					resource: Ports.Resource.Presentation.gRPC;
				}
			}
		}
	}
}

export {};
