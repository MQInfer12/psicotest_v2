import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ApiSuccessResponse } from "./ApiResponse";

export type Refetch<T> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<ApiSuccessResponse<T>, Error>>;
