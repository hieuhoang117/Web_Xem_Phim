import "./actorIterm.css";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";

const ActorItem = ({ actor }) => {
    const navigate = useNavigate();

    return (
        <div className="actor-item" onClick={() => navigate(`/user/actor/${actor.IDactor}`)}>
            <img 
                src={actor.Photo || logo} 
                alt={actor.ActorName} 
                onError={(e) => e.target.src = logo}
            />
            <h3>{actor.ActorName}</h3>
        </div>
    );
};

export default ActorItem;