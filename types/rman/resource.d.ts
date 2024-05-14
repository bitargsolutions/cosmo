declare global {
	namespace Ports {
		namespace Resource {
			// Driven-side representation. From/to DB
			namespace Source {
				// Must be equal to init.sql
				interface MariaDB {
					id: string;
					creator_id: string;
					creation_date: string;
					archive_date?: string;
					archiver_id?: string;
				}
			}

			// The agreement between the two
			// This is the one we'll use inside the service
			interface Middle {
				id: string;
				creatorId: string;
				creationDate: Date;
				archiveDate?: Date;
				archiverId?: string;
			}

			// Driving-side representation. From/to gRPC
			namespace Presentation {
				// Must be equal to schema.proto
				interface gRPC {
					id: string;
					creator_id: string;
					creation_date: string;
					archiver_id?: string;
					archive_date?: string;
				}
			}
		}
	}
}
export {};
