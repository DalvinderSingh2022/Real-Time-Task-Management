import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useSearch = (initialData, query, filter) => {
    const [search, setSearch] = useSearchParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!initialData) return;

        setData(initialData.filter(item =>
            (!filter || (!search.has(filter) || item[filter] === search.get(filter))) &&
            (!query || item[query].toLowerCase().replaceAll(" ", '').includes(search.get('q') || ''))
        ));
    }, [initialData, filter, query, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSearch(prevParams => {
            value ? prevParams.set(name, value) : prevParams.delete(name);
            return prevParams
        });
    };

    return [handleChange, data]
}

export default useSearch;