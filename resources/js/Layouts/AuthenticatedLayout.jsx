import { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "@/Components/Notification";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { url } = usePage(); // Mendapatkan URL atau route saat ini

    const hiddenFooterRoutes = [
        "/blogs/create",
        "/blogs/edit/**",
        "/admin/users/create",
        "/profile",
        "/writer/join",
        "/admin/categories/create",
        "/admin/categories/edit/**",
    ];

    const shouldHideFooter = hiddenFooterRoutes.includes(url);

    useEffect(() => {
        const blogChannel = window.Echo.channel("blogs");

        const handleNotification = (type, notification) => {
            setNotifications((prev) => [
                ...prev,
                { notification: notification },
            ]);
        };

        // Cek apakah user memiliki peran yang dikirim dari backend
        const userRole = user.roles[0].name;

        blogChannel.listen("CommentPosted", (notification) => {
            handleNotification(notification.type, notification);
        });

        if (userRole === "writer") {
            blogChannel
                .listen("BlogApproved", (notification) => {
                    handleNotification(notification.type, notification);
                })
                .listen("BlogRejected", (notification) => {
                    handleNotification(notification.type, notification);
                });
        }

        if (userRole === "reader") {
            blogChannel.listen("BlogApproved", (notification) => {
                handleNotification(notification.type, notification);
            });
        }

        if (userRole === "admin") {
            blogChannel
                .listen("NewBlogRequest", (notification) => {
                    handleNotification(notification.type, notification);
                })
                .listen("NewWriterRequest", (notification) => {
                    handleNotification(notification.type, notification);
                });
        }

        // Cleanup the listeners when component unmounts
        return () => {
            blogChannel.stopListening("BlogApproved");
            blogChannel.stopListening("BlogRejected");
            blogChannel.stopListening("CommentPosted");
            blogChannel.stopListening("NewBlogRequest");
            blogChannel.stopListening("NewWriterRequest");
        };
    }, []);

    const handleCloseNotif = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    const variants = {
        hidden: {
            opacity: 0,
            x: "100%",
        },
        visible: {
            opacity: 1,
            x: 0,
        },
        exit: {
            opacity: 0,
            x: "100%",
        },
    };

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const handleOpen = () => setOpenModal(!openModal);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <ul className="fixed right-6 top-6 z-20 flex flex-col gap-2">
                <AnimatePresence>
                    {notifications.map((notif, index) => (
                        <motion.li
                            key={index} // Ensure unique key for each notification
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                        >
                            {/* Render the Notification component */}
                            <Notification
                                data={notif}
                                closeNotif={() => handleCloseNotif(index)}
                            />
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>

            <Navbar
                openDrawer={openDrawer}
                closeDrawer={closeDrawer}
                handleOpen={handleOpen}
                setShowingNavigationDropdown={setShowingNavigationDropdown}
                showingNavigationDropdown={showingNavigationDropdown}
                open={open}
                user={user}
            />

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            {!shouldHideFooter && <Footer />}
        </div>
    );
}
