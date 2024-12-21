import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { Button, IconButton } from "@material-tailwind/react";
import React from "react";

const Paginate = ({ currentPage, totalPages, onPageChange }) => {
    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="flex justify-center mt-4 gap-4 mb-6">
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prevPage}
                disabled={currentPage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => (
                    <IconButton
                        key={index + 1}
                        variant={currentPage === index + 1 ? "filled" : "text"}
                        color="gray"
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </IconButton>
                ))}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={nextPage}
                disabled={currentPage === totalPages}
            >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" /> Next
            </Button>
        </div>
    );
};

export default Paginate;
