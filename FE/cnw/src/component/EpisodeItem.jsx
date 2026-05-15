import "./EpisodeItem.css";
import logo from "../logo.png";

const EpisodeItem = ({ ep, onClick }) => {
  return (
    <div className="episode-item" onClick={onClick}>
      
   
      <div className="episode-thumb">
        <img
          src={ep.ThumbnailURL || ep.poster || logo}
          alt={ep.EpisodeName}
        />
      </div>

      {/* Nội dung */}
      <div className="episode-info">
        <h4>
          Tập {ep.EpisodeNumber}: {ep.EpisodeName}
        </h4>

        <p>{ep.EpisodeDescription || "Không có mô tả"}</p>

        <div className="episode-meta">
          <span>{ep.Duration} phút</span><br />
          <span>
            {ep.ReleaseDate
              ? new Date(ep.ReleaseDate).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>

    </div>
  );
};

export default EpisodeItem;