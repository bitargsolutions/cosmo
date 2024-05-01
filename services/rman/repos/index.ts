abstract class Repository {
	public abstract CreateResource(
		r: Ports.Resource.Middle
	): AsyncResult<Ports.Resource.Middle>;

	public abstract FetchResource(
		id: string
	): AsyncResult<Ports.Resource.Middle>;

	public abstract UpdateResource(
		r: Ports.Resource.Middle
	): AsyncResult<boolean>;

	public abstract CreateAuthEntity(
		e: Ports.AuthEntity.Middle
	): AsyncResult<Ports.AuthEntity.Middle>;

	public abstract FetchAuthEntity(
		id: string
	): AsyncResult<Ports.AuthEntity.Middle>;
}

export default Repository;
