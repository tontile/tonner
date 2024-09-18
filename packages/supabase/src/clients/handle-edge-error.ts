import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

export default async function handleEdgeFunctionError(
  error: FunctionsHttpError | FunctionsRelayError | FunctionsFetchError,
) {
  if (error instanceof FunctionsHttpError) {
    const errorMessage = await error.context.json();
    return {
      message: errorMessage.error
        ? errorMessage.error
        : JSON.stringify(errorMessage),
    };
  }
  if (error instanceof FunctionsRelayError) {
    return {
      message: error.message,
    };
  }
  if (error instanceof FunctionsFetchError) {
    return {
      message: error.message,
    };
  }
}
