import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

export const filterSearchParams = {
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE_NUMBER).withOptions({ clearOnDefault: true }),

};

export const loadSearchParams = createLoader(filterSearchParams);