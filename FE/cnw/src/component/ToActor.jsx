import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ToActor.css";

const ToActor = ({ movieid, seriesid }) => {
    const navigate = useNavigate();
    const [actors, setActors] = useState([]);


    const handleNavigate = (actorId) => {
        navigate(`/user/actor/${actorId}`);
    };
    useEffect(() => {
        const handleFetchActor = async () => {
            if (!movieid && !seriesid) return;
            try {
                let res;
                if (movieid) {
                    res = await fetch(`http://localhost:5000/api/actor/actorby/movie/${movieid}`);
                } else if (seriesid) {
                    res = await fetch(`http://localhost:5000/api/actor/actorby/series/${seriesid}`);
                }
                const data = await res.json();
                setActors(data);
            } catch (error) {
                console.error("Error fetching actor:", error);
            }
        };
        handleFetchActor();
    }, [movieid, seriesid]);

    return (
        <div className="list-actor-detail">
            {actors.length === 0 ? (
                <p>Đang cập nhật diễn viên</p>
            ) : (
                actors.map((actor) => (
                    <div key={actor.IDactor}>
                        <p onClick={() => handleNavigate(actor.IDactor)}>
                            {actor.ActorName}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ToActor;