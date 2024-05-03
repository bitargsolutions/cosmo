export const CREATE_RESOURCE = (s: Ports.Resource.Source): string => `
INSERT INTO Resources (
	id,
	creator_id,
	creation_date
) VALUES (
	"${s.id}",
	"${s.creator_id}",
	"${s.creation_date}"
);
`;

export const FETCH_RESOURCE = (id: string): string => `
SELECT * FROM Resources WHERE id = "${id}" AND archive_date IS NULL;
`;

export const UPDATE_RESOURCE = (s: Ports.Resource.Source): string => {
	const updatedFields: string[] = [];

	for (let [k, v] of Object.entries(s)) {
		if (!v) continue;
		updatedFields.push(`${k} = "${v}"`);
	}

	return `UPDATE Resources SET ${updatedFields.join(",")} WHERE id = "${
		s.id
	}";`;
};

export const CREATE_AUTH_ENTITY = (s: Ports.AuthEntity.Source): string => `
INSERT INTO AuthEntities (
	id,
	crid,
	secret_hash
) VALUES (
	"${s.id}",
	"${s.crid}",
	"${s.secret_hash}"
)
`;

export const FETCH_AUTH_ENTITY = (id: string): string => `
SELECT * FROM AuthEntities WHERE id = "${id}";
`;
