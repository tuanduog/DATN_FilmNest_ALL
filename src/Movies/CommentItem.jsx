import React, { useState, useEffect } from "react";
import './CommentItem.css';

function ChildReactionButtons({ child, client }) {
    const [likeCount, setLikeCount] = useState(child.likeCount ?? 0);
    const [dislikeCount, setDislikeCount] = useState(child.dislikeCount ?? 0);
    const [reaction, setReaction] = useState(child.myReaction ?? null);

    // Sync khi WebSocket cập nhật props từ parent
    useEffect(() => { setLikeCount(child.likeCount ?? 0); }, [child.likeCount]);
    useEffect(() => { setDislikeCount(child.dislikeCount ?? 0); }, [child.dislikeCount]);
    useEffect(() => { setReaction(child.myReaction ?? null); }, [child.myReaction]);

    const publishReaction = (type) => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        if (client?.current?.connected) {
            client.current.publish({
                destination: "/app/push-reaction",
                body: JSON.stringify({ commentId: child.commentId, type, userId: user.userId })
            });
        }
    };

    const handleLike = () => {
        if (reaction === "like") { setReaction(null); setLikeCount(c => c - 1); publishReaction("UNLIKE"); }
        else {
            if (reaction === "dislike") setDislikeCount(c => c - 1);
            setReaction("like"); setLikeCount(c => c + 1); publishReaction("LIKE");
        }
    };

    const handleDislike = () => {
        if (reaction === "dislike") { setReaction(null); setDislikeCount(c => c - 1); publishReaction("UNDISLIKE"); }
        else {
            if (reaction === "like") setLikeCount(c => c - 1);
            setReaction("dislike"); setDislikeCount(c => c + 1); publishReaction("DISLIKE");
        }
    };

    return (
        <>
            <button className={`reaction-btn ${reaction === "like" ? "active-like" : ""}`} onClick={handleLike}>
                <i className="fa-regular fa-thumbs-up"></i>
                <span>{likeCount}</span>
            </button>
            <button className={`reaction-btn ${reaction === "dislike" ? "active-dislike" : ""}`} onClick={handleDislike}>
                <i className="fa-regular fa-thumbs-down"></i>
                <span>{dislikeCount}</span>
            </button>
        </>
    );
}

function CommentItem({ cmt, handleCmt, messSub, setMessSub, messWtag, setMesWtag, client }) {
    const [showSubInput, setShowSubInput] = useState(false);
    const [showSubInput1, setShowSubInput1] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [taggedUser, setTaggedUser] = useState("");
    const [taggedId, setTaggedId] = useState("");
    const [likeCount, setLikeCount] = useState(cmt.likeCount ?? 0);
    const [dislikeCount, setDislikeCount] = useState(cmt.dislikeCount ?? 0);
    const [reaction, setReaction] = useState(cmt.myReaction ?? null);

    // Sync khi WebSocket cập nhật props từ parent
    useEffect(() => { setLikeCount(cmt.likeCount ?? 0); }, [cmt.likeCount]);
    useEffect(() => { setDislikeCount(cmt.dislikeCount ?? 0); }, [cmt.dislikeCount]);
    useEffect(() => { setReaction(cmt.myReaction ?? null); }, [cmt.myReaction]);

    /* ─── Helpers ─── */
    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const s = Math.floor(diff / 1000);
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (s < 60) return `${s} giây trước`;
        if (m < 60) return `${m} phút trước`;
        if (h < 24) return `${h} giờ trước`;
        return `${d} ngày trước`;
    };

    const getInitials = (name = "") => name.charAt(0) || "?";

    const toBlue = (content) => {
        if (!cmt.children?.length) return <>{content}</>;
        for (const c of cmt.children) {
            const tag = "@" + c.userName;
            if (content.includes(tag)) {
                const rest = content.replace(tag, "");
                return <span><span className="comment-tag">{tag}</span>{rest}</span>;
            }
        }
        return <>{content}</>;
    };

    /* ─── Reactions ─── */
    const publishReaction = (type) => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        if (client?.current?.connected) {
            client.current.publish({
                destination: "/app/push-reaction",
                body: JSON.stringify({ commentId: cmt.commentId, type, userId: user.userId })
            });
        }
    };

    const handleLike = () => {
        if (reaction === "like") { setReaction(null); setLikeCount(c => c - 1); publishReaction("UNLIKE"); }
        else {
            if (reaction === "dislike") setDislikeCount(c => c - 1);
            setReaction("like"); setLikeCount(c => c + 1); publishReaction("LIKE");
        }
    };

    const handleDislike = () => {
        if (reaction === "dislike") { setReaction(null); setDislikeCount(c => c - 1); publishReaction("UNDISLIKE"); }
        else {
            if (reaction === "like") setLikeCount(c => c - 1);
            setReaction("dislike"); setDislikeCount(c => c + 1); publishReaction("DISLIKE");
        }
    };

    /* ─── Reply toggles ─── */
    const toggleSubInput = () => setShowSubInput(v => !v);

    const toggleSubInput1 = (userName, commentId) => {
        if (showSubInput1) {
            setShowSubInput1(false);
        } else {
            setShowSubInput1(true);
            setMesWtag(`@${userName} `);
            setTaggedUser(userName);
            setTaggedId(commentId);
        }
    };

    const toggleReply = () => {
        setShowReply(v => !v);
        setShowSubInput1(false);
    };

    /* ─── Render ─── */
    return (
        <div className="comment-item">
            {/* Avatar */}
            <div className="comment-avatar">{getInitials(cmt.userName)}</div>

            {/* Main bubble */}
            <div style={{ flex: 1 }}>
                <div className="comment-bubble">
                    {/* Header */}
                    <div className="comment-header">
                        <span className="comment-username">{cmt.userName}</span>
                        <span className="comment-time">{timeAgo(cmt.createdAt)}</span>
                    </div>

                    {/* Content */}
                    <p className="comment-content">{cmt.content}</p>

                    {/* Actions */}
                    <div className="comment-actions">
                        <button
                            className={`reaction-btn ${reaction === "like" ? "active-like" : ""}`}
                            onClick={handleLike}
                        >
                            <i className="fa-regular fa-thumbs-up"></i>
                            <span>{likeCount}</span>
                        </button>

                        <button
                            className={`reaction-btn ${reaction === "dislike" ? "active-dislike" : ""}`}
                            onClick={handleDislike}
                        >
                            <i className="fa-regular fa-thumbs-down"></i>
                            <span>{dislikeCount}</span>
                        </button>

                        <div className="reaction-divider"></div>

                        <button className="rep" onClick={toggleSubInput}>
                            <i className="fas fa-reply fa-xs"></i>
                            Phản hồi
                        </button>
                    </div>
                </div>

                {/* ── Level-1 reply input ── */}
                {showSubInput && (
                    <div className="reply-input-box">
                        <textarea
                            rows="2"
                            placeholder="Viết phản hồi của bạn..."
                            value={messSub}
                            onChange={(e) => setMessSub(e.target.value)}
                        />
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn-send" onClick={() => { handleCmt(1, cmt.commentId); setShowSubInput(false); }}>
                                <i className="fas fa-paper-plane" style={{ fontSize: 12 }}></i>
                                Gửi
                            </button>
                        </div>
                    </div>
                )}

                {/* ── View replies button ── */}
                {cmt.children?.length > 0 && (
                    <button className="view-replies-btn" onClick={toggleReply}>
                        <i className={`fa-solid ${showReply ? "fa-caret-up" : "fa-caret-down"}`}></i>
                        {showReply ? "Ẩn" : "Xem"} {cmt.children.length} phản hồi
                    </button>
                )}

                {/* ── Reply thread ── */}
                {showReply && (
                    <div className="reply-thread">
                        {cmt.children.map((child) => (
                            <div className="reply-item" key={child.commentId}>
                                <div className="comment-avatar-sm">{getInitials(child.userName)}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="comment-bubble-sm">
                                        <div className="comment-header">
                                            <span className="comment-username">{child.userName}</span>
                                            <span className="comment-time">{timeAgo(child.createdAt)}</span>
                                        </div>
                                        <p className="comment-content">{toBlue(child.content)}</p>

                                        {/* Child actions */}
                                        <div className="comment-actions">
                                            <ChildReactionButtons child={child} client={client} />
                                            <div className="reaction-divider"></div>
                                            <button className="rep" onClick={() => toggleSubInput1(child.userName, child.commentId)}>
                                                <i className="fas fa-reply fa-xs"></i>
                                                Phản hồi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* ── Level-2 reply input ── */}
                        {showSubInput1 && (
                            <div className="reply-input-box">
                                <textarea
                                    rows="2"
                                    placeholder={`Phản hồi @${taggedUser}...`}
                                    value={messWtag}
                                    onChange={(e) => setMesWtag(e.target.value)}
                                />
                                <div className="d-flex justify-content-end mt-2">
                                    <button className="btn-send" onClick={() => { handleCmt(2, taggedId); setShowSubInput1(false); }}>
                                        <i className="fas fa-paper-plane" style={{ fontSize: 12 }}></i>
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentItem;