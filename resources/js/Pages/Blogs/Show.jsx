import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    BookmarkIcon,
    ChatBubbleLeftIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    ShareIcon,
} from "@heroicons/react/24/solid";
import {
    HandThumbDownIcon as Dislike,
    HandThumbUpIcon as Like,
    BookmarkIcon as Bookmark,
} from "@heroicons/react/24/outline";
import { router, Head, Link, useForm } from "@inertiajs/react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Textarea,
    Avatar,
    Input,
    IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

// Helper Component for Like/Unlike Button
const LikeButton = ({
    liked,
    likes,
    dislikes,
    unliked,
    handleLike,
    handleUnlike,
}) => (
    <div className="flex items-center space-x-4">
        <IconButton variant="text" onClick={handleLike}>
            {liked ? (
                <HandThumbUpIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
                <Like strokeWidth={2} className="h-6 w-6" />
            )}
        </IconButton>
        <span className="text-gray-500">{likes}</span>
        <IconButton variant="text" onClick={handleUnlike}>
            {unliked ? (
                <HandThumbDownIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
                <Dislike strokeWidth={2} className="h-6 w-6" />
            )}
        </IconButton>
        <span className="text-gray-500">{dislikes}</span>
    </div>
);

const BlogShareButton = ({ blog }) => {
    const handleShare = async () => {
        const shareData = {
            title: blog.title,
            text: `Check out this blog: ${blog.title}`,
            url: `${window.location.origin}/blogs/${blog.id}`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Error sharing content:", error);
            }
        } else {
            // Fallback jika Web Share API tidak tersedia
            navigator.clipboard.writeText(shareData.url);
            alert("URL copied to clipboard!");
        }
    };

    return (
        <IconButton variant="text" onClick={handleShare}>
            <ShareIcon className="h-6 w-6" />
        </IconButton>
    );
};

// Helper Component for Comments List
const CommentList = ({ comments, handleReply, openReply, setOpenReply }) => {
    const parentComments = comments.filter(
        (comment) => comment.parent_id === null
    );
    return (
        <div className="p-4 space-y-4 min-h-32 max-h-56 overflow-y-scroll">
            {parentComments.length > 0 ? (
                parentComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        handleReply={handleReply}
                        openReply={openReply}
                        setOpenReply={setOpenReply}
                    />
                ))
            ) : (
                <p className="text-slate-900">Belum ada komentar.</p>
            )}
        </div>
    );
};

// Comment Item with Replies
const CommentItem = ({ comment, handleReply }) => {
    const [openReplies, setOpenReplies] = useState(false);

    const toggleReplies = () => setOpenReplies(!openReplies);

    return (
        <div className="comment flex items-start space-x-4 border-b pb-4">
            <Avatar
                src={comment.user?.avatar_url || "/storage/no-image.png"}
                alt={comment.user?.name || "Anonymous"}
                className="w-10 h-10"
            />
            <div>
                <p className="text-sm text-slate-900">
                    <strong>{comment.user?.name || "Anonymous"}</strong>
                </p>
                <p className="text-slate-900 text-sm">{comment.content}</p>
                <div className="flex gap-2">
                    <button
                        className="text-blue-500 text-xs"
                        onClick={() => handleReply(comment.id)}
                    >
                        Balas
                    </button>
                    {comment.replies?.length > 0 && (
                        <button
                            className="text-blue-500 text-xs"
                            onClick={toggleReplies}
                        >
                            {openReplies
                                ? "Sembunyikan Balasan"
                                : "Lihat Balasan"}
                        </button>
                    )}
                </div>
                {openReplies && (
                    <div className="pl-6 space-y-4 mt-4">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                handleReply={handleReply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Show({ auth, blog, is_saved }) {
    const [comments, setComments] = useState(blog.comments || []);
    const [openReply, setOpenReply] = useState(false);
    const [liked, setLiked] = useState(false);
    const [unliked, setUnliked] = useState(false);
    const { data, setData, post, reset } = useForm({
        content: "",
        parent_id: null,
    });
    const [likes, setLikes] = useState(0);
    const [unlikes, setUnlikes] = useState(0);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await fetch(
                    route("likes.index", { blog: blog.id }),
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch likes data.");
                }

                const { likes_count, unlikes_count, user_liked, user_unliked } =
                    await response.json();
                setLikes(likes_count);
                setUnlikes(unlikes_count);
                setLiked(user_liked);
                setUnliked(user_unliked);
            } catch (error) {
                console.error("Error fetching likes data:", error);
            }
        };

        fetchLikes();
    }, [blog.id]);

    const handleLike = () => {
        router.post(
            route("blogs.like", blog.id),
            {},
            {
                onSuccess: () => {
                    setLiked(true);
                    setLikes((prevLikes) => prevLikes + 1);
                },
            }
        );
    };

    const handleUnlike = () => {
        router.post(
            route("blogs.unlike", blog.id),
            {},
            {
                onSuccess: () => {
                    setUnlikes((prevLikes) => prevLikes - 1);
                },
            }
        );
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        post(route("comments.store", blog.id), {
            onSuccess: () => {
                reset();
                setData("content", "");
                setData("parent_id", null);
            },
        });
    };

    const handleReply = (parentId) => setData("parent_id", parentId);

    useEffect(() => {
        const channel = window.Echo.channel(`blog.${blog.id}`);

        channel.listen("CommentAdded", (event) => {
            setComments((prev) => [event.comment, ...prev]);
        });

        channel.listen("CommentAdded", (event) => {
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === event.reply.parent_id
                        ? {
                              ...comment,
                              replies: [
                                  event.reply,
                                  ...(comment.replies || []),
                              ],
                          }
                        : comment
                )
            );
        });

        return () => {
            channel.stopListening("CommentAdded");
            channel.stopListening("ReplyAdded");
            window.Echo.leaveChannel(`blog.${blog.id}`);
        };
    }, [blog.id]);

    const handleSave = () => {
        router.post(
            route("collections.store"),
            { blog_id: blog.id },
            {
                onSuccess: () => alert("Blog added to collection!"),
            }
        );
    };

    const handleUnsave = () => {
        router.delete(
            route("collections.destroy", blog.id),
            {},
            {
                onSuccess: () => alert("Blog removed from collection!"),
            }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="mx-auto w-full h-full">
                <Head title={blog.title} />

                <Card className="h-full" shadow={false}>
                    <CardBody className="mt-8">
                        <Typography
                            variant="h2"
                            className="text-gray-800 font-bold mb-4"
                        >
                            {blog.title}
                        </Typography>
                        <Typography variant="h6" className="font-normal mb-2">
                            By:{" "}
                            <span className="font-bold">
                                {blog.writer.name}
                            </span>{" "}
                            in{" "}
                            <span className="uppercase font-bold">
                                {blog.category.name}
                            </span>
                        </Typography>
                        <Typography
                            variant="small"
                            className="text-gray-500 mb-6"
                        >
                            {new Date(blog.created_at).toLocaleDateString(
                                "en-GB"
                            )}
                        </Typography>
                        <img
                            src={blog.thumbnail_url || "/storage/no-image.png"}
                            alt={blog.title}
                            className="mt-6 h-96 w-full object-cover object-center"
                        />
                        <div
                            className="prose whitespace-pre-wrap text-base font-normal"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                        <div className="p-4">
                            <div className="border border-gray-700 rounded-lg bg-white">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <LikeButton
                                        liked={liked}
                                        likes={likes}
                                        dislikes={unlikes}
                                        unliked={unliked}
                                        handleLike={handleLike}
                                        handleUnlike={handleUnlike}
                                    />
                                    <div className="flex items-center space-x-4">
                                        <BlogShareButton blog={blog} />
                                        <IconButton
                                            variant="text"
                                            onClick={
                                                is_saved
                                                    ? handleUnsave
                                                    : handleSave
                                            }
                                            className="flex items-center"
                                        >
                                            {is_saved ? (
                                                <BookmarkIcon className="h-6 w-6" />
                                            ) : (
                                                <Bookmark className="h-6 w-6 " />
                                            )}
                                        </IconButton>
                                        <div className="relative">
                                            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
                                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2">
                                                {comments.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <CommentList
                                    comments={comments}
                                    handleReply={handleReply}
                                    openReply={openReply}
                                    setOpenReply={setOpenReply}
                                />
                                <form
                                    onSubmit={handleCommentSubmit}
                                    className="flex flex-col p-4 border-t gap-2"
                                >
                                    {data.parent_id && (
                                        <div className="text-sm text-blue-500">
                                            Membalas komentar{" "}
                                            <button
                                                onClick={() =>
                                                    setData("parent_id", null)
                                                }
                                                className="text-red-500 underline"
                                            >
                                                Batalkan
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            src={
                                                auth.user.avatar_url ||
                                                "/storage/no-image.png"
                                            }
                                            alt="User Avatar"
                                            className="w-10 h-10"
                                        />
                                        <Input
                                            type="text"
                                            placeholder={
                                                data.parent_id
                                                    ? "Tambahkan balasan..."
                                                    : "Tambahkan komentar..."
                                            }
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    "content",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            variant="gradient"
                                        >
                                            Kirim
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
