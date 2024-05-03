declare global {
	namespace Ports {
		namespace AuthEntity {
			// Driven-side representation. From/to DB
			export interface Source {
				id: string;
				crid: string;
				secret_hash: string;
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				id: string;
				crid: string;
				secretHash: string;
			}

			// Driving-side representation. From/to GraphQL
			interface Presentation {
				id: string;
				crid: string;
				secretHash?: string;
			}
		}
	}
}

export {};
