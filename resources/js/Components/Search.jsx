import React, { useState, useEffect } from "react";
import {
    Avatar,
    Dialog,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { Link } from "@inertiajs/react";
import {
    ArrowDownIcon,
    ArrowTurnDownLeftIcon,
    ArrowUpIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";

export default function Search() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [allBlogs, setAllBlogs] = useState([]);

    const fetchAllBlogs = async () => {
        try {
            const response = await fetch(route("blogs.all")); // Ganti dengan route untuk mengambil semua blog
            const data = await response.json();
            setAllBlogs(data);
        } catch (error) {
            console.error("Error fetching all blogs:", error);
        }
    };

    useEffect(() => {
        fetchAllBlogs();
    }, [open]);

    // Buka dan tutup dialog
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setResults([]);
        setQuery("");
        setSelectedIndex(-1);
    };

    // Simpan recent search ke localStorage
    const addRecentSearch = (term) => {
        const updatedSearches = [
            term,
            ...recentSearches.filter((t) => t !== term),
        ].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    // Fungsi fetch data
    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;
        setLoading(true);

        try {
            const response = await fetch(
                route("blogs.search", { query: searchQuery })
            );
            const data = await response.json();
            console.log(data);
            setResults(data);
            addRecentSearch(searchQuery);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load recent search dari localStorage
    useEffect(() => {
        const storedSearches =
            JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(storedSearches);
    }, []);

    // Highlight teks yang sesuai dengan query
    const highlightMatch = (text, searchTerm) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.replace(
            regex,
            `<span class="underline font-bold">$1</span>`
        );
    };

    return (
        <div>
            <IconButton
                variant="text"
                onClick={handleClickOpen}
                className="my-3"
            >
                <MagnifyingGlassIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>

            <Dialog
                open={open}
                handler={handleClose}
                size="lg"
                className="bg-white shadow-lg rounded"
                role="dialog"
                aria-hidden={!open}
            >
                {/* Input Pencarian */}
                <div className="flex justify-between items-center px-4 mt-4">
                    <div className="w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="block w-full bg-gray-200 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 rounded focus:ring-1 p-2"
                            placeholder="Search blog posts..."
                        />
                    </div>
                </div>
                {recentSearches.length > 0 && (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <Typography
                                variant="small"
                                className="text-gray-900/50"
                            >
                                Recent Searches
                            </Typography>
                            <button
                                onClick={() => {
                                    setRecentSearches([]);
                                    localStorage.removeItem("recentSearches");
                                }}
                                className="text-sm text-gray-900/50 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-gray-200 rounded px-3 py-1 text-gray-700"
                                >
                                    <button
                                        onClick={() => {
                                            setQuery(search);
                                            handleSearch(search);
                                        }}
                                        className="hover:underline"
                                    >
                                        {search}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const updatedSearches =
                                                recentSearches.filter(
                                                    (item) => item !== search
                                                );
                                            setRecentSearches(updatedSearches);
                                            localStorage.setItem(
                                                "recentSearches",
                                                JSON.stringify(updatedSearches)
                                            );
                                        }}
                                        className="ml-2 text-gray-900/50"
                                    >
                                        <XMarkIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Hasil Pencarian */}
                <DialogBody className="p-4 max-h-[50vh] overflow-y-auto">
                    {loading && <p className="text-gray-500">Loading...</p>}

                    {!loading &&
                        query.trim() === "" &&
                        allBlogs.length > 0 &&
                        allBlogs.map((result, index) => (
                            <div
                                key={result.id}
                                data-hit-index={index}
                                className={`p-3 rounded hover:bg-gray-900/50 cursor-pointer transition ${
                                    selectedIndex === index
                                        ? "bg-gray-500 text-white"
                                        : "bg-white text-gray-900"
                                }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onMouseLeave={() => setSelectedIndex(-1)}
                            >
                                <Link
                                    href={route("blogs.show", {
                                        id: result.id,
                                    })}
                                    className="flex items-center gap-4"
                                >
                                    <Avatar
                                        variant="rounded"
                                        size="xl"
                                        src={
                                            result.thumbnail_url
                                                ? result.thumbnail_url
                                                : "http://localhost:8000/storage/no-image.png"
                                        }
                                        alt={result.title}
                                    />
                                    <div
                                        className={`flex-1 ${
                                            selectedIndex === index
                                                ? "text-white"
                                                : "text-gray-900 hover:text-gray-200"
                                        }`}
                                    >
                                        <Typography
                                            variant="lead"
                                            className={`text-sm ${
                                                selectedIndex === index
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            #{result.category.name}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            className={`truncate ${
                                                selectedIndex === index
                                                    ? "text-gray-300"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {result.title}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className={`text-xs ${
                                                selectedIndex === index
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {result.writer.name} at{" "}
                                            {format(
                                                new Date(result.created_at),
                                                "EEEE, dd MMMM yyyy HH:mm"
                                            )}
                                        </Typography>
                                    </div>
                                </Link>
                            </div>
                        ))}

                    {!loading &&
                        query.trim() !== "" &&
                        results.length === 0 && (
                            <p className="text-gray-500">No results found.</p>
                        )}
                    {!loading &&
                        query.trim() !== "" &&
                        results?.map((result, index) => (
                            <div
                                key={result.id}
                                data-hit-index={index}
                                className={`p-3 rounded hover:bg-gray-900/50 cursor-pointer transition ${
                                    selectedIndex === index
                                        ? "bg-gray-500 text-white"
                                        : "bg-white text-gray-900"
                                }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onMouseLeave={() => setSelectedIndex(-1)}
                            >
                                <Link
                                    href={route("blogs.show", {
                                        id: result.id,
                                    })}
                                    className="flex items-center gap-4"
                                >
                                    <Avatar
                                        variant="rounded"
                                        size="xl"
                                        src={
                                            result.thumbnail_url
                                                ? result.thumbnail_url
                                                : "http://localhost:8000/storage/no-image.png"
                                        }
                                        alt={result.title}
                                    />
                                    <div
                                        className={`flex-1 ${
                                            selectedIndex === index
                                                ? "text-white"
                                                : "text-gray-900 hover:text-gray-200"
                                        }`}
                                    >
                                        <Typography
                                            variant="lead"
                                            className={`text-sm ${
                                                selectedIndex === index
                                                    ? "text-white"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            #{result.category.name}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            className={`truncate ${
                                                selectedIndex === index
                                                    ? "text-gray-300"
                                                    : "text-gray-900"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: highlightMatch(
                                                    result.title,
                                                    query
                                                ),
                                            }}
                                        ></Typography>
                                        <Typography
                                            variant="small"
                                            className={`text-xs ${
                                                selectedIndex === index
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {result.writer.name} at{" "}
                                            {format(
                                                result.created_at,
                                                "EEEE, dd MMMM yyyy HH:mm"
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className={`text-sm text-black font-normal line-clamp-1 max-w-xl max-h-11 truncate ${
                                                selectedIndex === index
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: result.content,
                                            }}
                                        ></Typography>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </DialogBody>
                {/* Footer */}
                <DialogFooter className="flex justify-between gap-4 border-t py-2 px-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <kbd className="px-2 py-1 bg-gray-200 font-mono text-sm rounded">
                            <ArrowTurnDownLeftIcon
                                strokeWidth={2}
                                className="h-3 w-3"
                            />
                        </kbd>
                        <span className="text-xs">to select</span>
                        <kbd className="px-2 py-1 bg-gray-200 font-mono text-sm rounded">
                            <ArrowDownIcon
                                strokeWidth={2}
                                className="h-3 w-3"
                            />
                        </kbd>
                        <kbd className="px-2 py-1 bg-gray-200 font-mono text-sm rounded">
                            <ArrowUpIcon strokeWidth={2} className="h-3 w-3" />
                        </kbd>
                        <span className="text-xs">to navigate</span>
                        <kbd className="flex px-2 py-1 bg-gray-200 font-mono text-sm rounded">
                            esc
                        </kbd>
                        <span className="text-xs">to close</span>
                    </div>
                    <Typography
                        variant="small"
                        color="gray"
                        className="font-normal text-xs"
                    >
                        Search by{" "}
                        <span className="text-orange-900 text-xs font-extrabold">
                            Laravel Scout
                        </span>
                    </Typography>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
