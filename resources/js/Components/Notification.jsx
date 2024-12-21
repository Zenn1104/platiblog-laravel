import { XMarkIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

export default function Notification({ data, closeNotif }) {
    const [timeoutId, setTimeoutId] = useState(null);
    const duration = 5000;

    useEffect(() => {
        console.log("blog: ", data);
        // Clear any existing timeout before setting a new one
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            closeNotif(); // Hanya panggil fungsi tanpa parameter
        }, duration);

        setTimeoutId(newTimeoutId);

        // Cleanup the timeout when the component unmounts or dependencies change
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [duration, closeNotif]); // Tambahkan closeNotif sebagai dependency

    const handleMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    const handleMouseLeave = () => {
        const newTimeoutId = setTimeout(() => {
            closeNotif(); // Hanya panggil fungsi tanpa parameter
        }, duration);

        setTimeoutId(newTimeoutId);
    };

    return (
        <Card
            className="w-[430px] border border-cyan-200 px-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CardBody className="text-slate-900 pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start gap-1">
                        <Typography
                            variant="h5"
                            className="font-semibold leading-none"
                        >
                            A new Notification!
                        </Typography>
                    </div>
                    <IconButton
                        onClick={closeNotif} // Perbaiki onClick handler
                        aria-label="Close"
                        variant="text"
                        size="sm"
                    >
                        <XMarkIcon className="h-4 w-4 opacity-30 hover:opacity-50" />
                    </IconButton>
                </div>
                <br />
                <div>
                    <Typography variant="small" className="font-normal">
                        {data.notification.blog.title}
                    </Typography>
                    <Typography variant="small" className="font-normal">
                        {data.notification.message}
                    </Typography>
                </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    variant="gradient"
                    color="teal"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <Typography variant="small" className="font-normal ml-2">
                        See
                    </Typography>
                </Button>
                <Button
                    variant="outlined"
                    size="sm"
                    color="red"
                    onClick={closeNotif}
                >
                    Dismiss
                </Button>
            </CardFooter>
        </Card>
    );
}
