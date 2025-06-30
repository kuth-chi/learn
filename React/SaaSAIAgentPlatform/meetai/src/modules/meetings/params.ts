import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { parseAsString, parseAsInteger, createLoader, parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "./types";

export const filterSearchParams = {
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE_NUMBER).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

};

export const loadSearchParams = createLoader(filterSearchParams);