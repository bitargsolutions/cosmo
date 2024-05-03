declare global {
	namespace Ports {
		namespace Resource {
			// Driven-side representation. From/to DB
			export interface Source {
				id: string;
				creator_id: string;
				creation_date: string;
				modification_date?: string;
				archive_date?: string;
				archiver_id?: string;
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				id: string;
				creatorId: string;
				creationDate: Date;
				modificationDate?: Date;
				archiveDate?: Date;
				archiverId?: string;
			}

			// Driving-side representation. From/to GraphQL
			interface Presentation {
				id: string;
				creatorId: string;
				creationDate: string;
				modificationDate?: string;
				archiveDate?: string;
				archiverId?: string;
			}
		}
	}
}
export {};
