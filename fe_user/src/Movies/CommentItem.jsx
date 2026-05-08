import React from "react";
import { useState } from "react";
import './CommentItem.css';

function CommentItem ({ cmt, handleCmt, messSub, setMessSub, messWtag, setMesWtag}) {
    const [showSubInput, setShowSubInput] = useState(false);
    const [showSubInput1, setShowSubInput1] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [userName, setUserName] = useState("");
    const [id, setId] = useState("");
    const [likeCount, setLikeCount] = useState(2);
    const [dislikeCount, setDislikeCount] = useState(1);
    const [reaction, setReaction] = useState(null);

    const oldDate = new Date(cmt.createdAt);
    
    const timeAgo = (oldDate) => {
        const now = new Date();
        const diffMs = now - oldDate;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours   = Math.floor(diffMs / (1000 * 60 * 60));
        const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if(seconds < 60) return `${seconds} giây trước`;
        if(minutes < 60) return `${minutes} phút trước`;
        if(hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    }

    const timePass = timeAgo(oldDate);

    const handleSubInput = () => {
        if(showSubInput){
            setShowSubInput(false);
        } else {
            setShowSubInput(true);
        }
    }
    const handleSubInput1 = (userName) => {
        if(showSubInput1){
            setShowSubInput1(false);
        } else {
            setShowSubInput1(true);
            setMesWtag(`@${userName} `);
            setUserName(userName);
            setId(cmt.commentId);
        }
    }

    const handleReply = () => {
        if(showReply){
            setShowReply(false);
        } else {
            setShowReply(true);
            setShowSubInput1(false);
        }
    }
    const toBlue = (content) => {
        if (!cmt.children || cmt.children.length === 0) return <>{content}</>;

        for(let c of cmt.children) { // for each ko tra ve return ma chay het moi tra
            const tag = "@" + c.userName;
            if (content.includes(tag)) {
                const newContent = content.replace(tag, "");
                return (
                    <span>
                        <span style={{ color: '#0d6efd' }}>{tag}</span>
                        <span>{newContent}</span>
                    </span>
                );
            }
        };
        return <>{content}</>;
    };

    const handleLike = () => {
    if (reaction === "like") {
        setReaction(null);
        setLikeCount(likeCount - 1);
    } else {
        if (reaction === "dislike") setDislikeCount(dislikeCount - 1);
        setReaction("like");
        setLikeCount(likeCount + 1);
    }
};

const handleDislike = () => {
    if (reaction === "dislike") {
        setReaction(null);
        setDislikeCount(dislikeCount - 1);
    } else {
        if (reaction === "like") setLikeCount(likeCount - 1);
        setReaction("dislike");
        setDislikeCount(dislikeCount + 1);
    }
};

    return (
        <div className="mt-4">
            <div className="row d-flex justify-content-center ps-5 pe-5">
                <div className="col-12">
                    <div className="card">
                    <div className="card-body p-4">

                        <div className="row">
                        <div className="col">
                            <div className="d-flex flex-start">
                            <img className="rounded-circle shadow-1-strong me-3"
                                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp" alt="avatar" width="65"
                                height="65" />
                            <div className="flex-grow-1 flex-shrink-1">
                                <div style={{border: '1px solid #e0e0e0', padding: '10px', borderRadius: '8px', paddingLeft: '17px'}}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="mb-1" style={{fontWeight: 'inherit'}}>
                                    {cmt.userName} <span className="small" style={{fontWeight: 'normal', fontSize: '12px'}}>- {timePass}</span>
                                    </p>
                                </div>
                                <p className="small mb-0">
                                    {cmt.content}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <a className="link-muted me-2" style={{textDecoration: 'none', fontSize: '14px', color: reaction === "like" ? "#0d6efd" : ""}} 
                                        ><i className="fa-regular fa-s fa-thumbs-up cl" onClick={() => handleLike(cmt.commentId)}></i>{likeCount}</a>
                                        <a className="link-muted ps-2" style={{textDecoration: 'none', fontSize: '14px', color: reaction === "dislike" ? "#0d6efd" : ""}}
                                        ><i className="fa-regular fa-thumbs-down cl" onClick={() => handleDislike(cmt.commentId)}></i>{dislikeCount}</a>
                                    </div>
                                    <a className='rep' style={{paddingRight: '7px'}} onClick={handleSubInput}><i className="fas fa-reply fa-xs"></i><span className="small"> Phản hồi</span></a>
                                </div>
                                </div>

                                { showSubInput && (
                                    <div className="mt-3" >
                                    <form>
                                        <div className="mb-2">
                                        <textarea
                                            className="form-control ps-3 pt-2"
                                            rows="2"
                                            placeholder="Viết phản hồi của bạn..."
                                            value={messSub}
                                            onChange={(e) => setMessSub(e.target.value)}
                                            style={{
                                            fontSize: "14px",
                                            resize: "none",
                                            borderRadius: "6px",
                                            backgroundColor: "#fdfdfd",
                                            }}
                                        ></textarea>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleCmt(1, cmt.commentId)}>
                                            <i className="fas fa-paper-plane me-1" style={{fontSize: '12px'}}></i> 
                                            Gửi phản hồi
                                        </button>
                                        </div>
                                    </form>
                                    </div>
                                )}

                                {cmt.children && cmt.children.length > 0 && (
                                    <div style={{paddingTop: "8px" }}>
                                        <p style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "14px", color: "#555" }}
                                        onClick={handleReply}>
                                            <div className='showRep' style={{color: '#0d6efd'}}>
                                                <i className={`fa-solid ${showReply ? "fa-caret-up" : "fa-caret-down"}`}></i>
                                                <span>{cmt.children.length} bình luận phản hồi</span>
                                            </div>
                                        </p>
                                    </div>
                                )}

                                {showReply && (
                                    <div>
                                        {cmt.children.map((child) => (
                                            <div className="d-flex flex-start mt-4" key={child.commentId}>
                                                <a className="me-3" href="">
                                                    <img className="rounded-circle shadow-1-strong"
                                                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(11).webp" alt="avatar"
                                                    width="65" height="65" />
                                                </a>
                                                <div className="flex-grow-1 flex-shrink-1">
                                                    <div style={{border: '1px solid #e0e0e0', padding: '10px', borderRadius: '8px', paddingLeft: '17px'}}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="mb-1">
                                                        {child.userName} <span className="small">- {timeAgo(new Date(child.createdAt))}</span>
                                                        </p>
                                                    </div>
                                                    <p className="small mb-0">
                                                        {toBlue(child.content)}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <a className="link-muted me-2" style={{textDecoration: 'none', fontSize: '14px'}}>
                                                            <i className="fa-regular fa-thumbs-up cl"></i>5</a>
                                                        <a className="link-muted ps-2" style={{textDecoration: 'none', fontSize: '14px'}}>
                                                            <i className="fa-regular fa-thumbs-down cl"></i>3</a>
                                                    </div>
                                                    <a className='rep' style={{paddingRight: '7px'}} onClick={() => handleSubInput1(child.userName)}><i className="fas fa-reply fa-xs"></i><span className="small"> Phản hồi</span></a>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        { showSubInput1 && (
                                        <div className="mt-3" >
                                        <form className='ms-4 ps-2'>
                                            <div className="mb-2 ms-5">
                                                <textarea
                                                        className="form-control ps-3 pt-2"
                                                        rows="2"
                                                        placeholder="Viết phản hồi của bạn... (Thêm @ tag tên)"
                                                        value={messWtag}
                                                        onChange={(e) => setMesWtag(e.target.value)}
                                                        style={{
                                                        fontSize: "14px",
                                                        resize: "none",
                                                        borderRadius: "6px",
                                                        backgroundColor: "#fdfdfd",
                                                        }}
                                                    ></textarea>
                                            
                                            </div>
                                            <div className="d-flex justify-content-end">
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => handleCmt(2, id)}>
                                                <i className="fas fa-paper-plane me-1" style={{fontSize: '12px'}}></i> 
                                                Gửi phản hồi
                                            </button>
                                            </div>
                                        </form>
                                        </div>
                                        )}
                                    </div>
                                    )}   
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentItem;