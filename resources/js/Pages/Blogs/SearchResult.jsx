// resources/js/Pages/Blog/SearchResults.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";

const SearchResults = ({ blogs, query }) => {
    return (
        <div>
            <Head title="Search Results" />
            <h1>Search Results for "{query}"</h1>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog.id}>
                        <h2>{blog.title}</h2>
                        <p>{blog.content}</p>
                        <Link href={`/blogs/${blog.id}`}>Read more</Link>
                    </div>
                ))
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
