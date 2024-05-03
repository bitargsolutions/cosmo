// import { UntypedHandleCall, ServerUnaryCall } from "@grpc/grpc-js";

import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";

// const GetResource: UntypedHandleCall = (a: ServerUnaryCall<any, any>) => {
// 	console.log(a);
// };

function GetResource(_c: ServerUnaryCall<any, any>, cb: sendUnaryData<any>) {
	cb(null, {
		result: {
			null: { null: true }
		}
	});

	return {
		aos: "hola",
		asdf: "hasd"
	};
}

export default GetResource;
