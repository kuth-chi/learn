import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

export const useMeetingsFilters = () => {

    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE_NUMBER).withOptions({ clearOnDefault: true }),
    });
}