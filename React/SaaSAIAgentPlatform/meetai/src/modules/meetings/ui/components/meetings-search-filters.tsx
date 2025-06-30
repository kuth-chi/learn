import { Input } from "@/components/ui/input";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { useMeetingsFilters } from "../../hooks/use-meeting-search-filters";


export const MeetingsSearchFilters = () => {
    const [ filters, setFilters ] = useMeetingsFilters();
    const isAnyFilterModified = !!filters.search;

    const onClearFilter = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: DEFAULT_PAGE_NUMBER,
        });
    };
    

    return (
        <div className="relative">
            <Input 
                className="h-9 bg-white w-[200px] pl-7 pr-7"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            {isAnyFilterModified && (
                <XCircleIcon
                    onClick={onClearFilter}
                    className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                />
            )}
        </div>
    );
}