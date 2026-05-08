import React, { useState } from "react";

function Up() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "movie_images");
    formData.append("cloud_name", "dctstgdxn");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dctstgdxn/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Cloudinary response:", data);

      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        alert("Không nhận được URL từ Cloudinary");
      }

      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Upload ảnh lên Cloudinary</h4>
      <input type="file" onChange={handleImageUpload} accept="image/*" />

      {uploading && <p>Đang upload ảnh...</p>}

      {imageUrl && (
        <div className="mt-3">
          <p><strong>URL ảnh:</strong></p>
          <input type="text" value={imageUrl} readOnly className="form-control" />
          <img src={imageUrl} alt="Uploaded" style={{ width: "200px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
}

export default Up;
