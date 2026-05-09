import "./actorIterm.css";
import { useNavigate } from "react-router-dom";

const ActorItem = ({ actor }) => {
    const navigate = useNavigate();

    return (
        <div className="actor-item" onClick={() => navigate(`/user/actor/${actor.IDactor}`)}>
            <img 
                src={actor.Photo || "/default-actor.png"} 
                alt={actor.ActorName} 
                onError={(e) => e.target.src = "/default-actor.png"}
            />
            <h3>{actor.ActorName}</h3>
        </div>
    );
};

export default ActorItem;