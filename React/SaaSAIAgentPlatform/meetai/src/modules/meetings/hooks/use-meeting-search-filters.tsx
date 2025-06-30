import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { MeetingStatus } from "../types";
import { DEFAULT_PAGE_SIZE } from "@/constants";


export const useMeetingsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
        agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
};