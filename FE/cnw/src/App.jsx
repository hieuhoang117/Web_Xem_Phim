import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from "./component/banner1";
import AdminPage from "./AdminPage";
import AMMmovie from "./component/AM_movie";
import "antd/dist/reset.css";
import AMUser from "./component/AM_User";
import AMReport from "./component/AM_report";
import AMMseries from "./component/AM_series";
import UserPage from "./MainUser";
import MovieSlide from "./component/US_slide";
import MovieDetail from "./component/Movie_detail";
import Menumain from "./component/Menu_main";
import MoviePlay from "./component/MoviePlay";
import SeriesDetail from "./component/Series_Detail";
import EpisodePlay from "./component/EpisodePlay";
import Menuseries from "./component/Menu_series";
import Menumocie from "./component/Menu_movie";
import AMnotifix from "./component/AM_notifi";
import MovieGenre from "./component/Movie_genre";
import SeriesGenre from "./component/Series_genre";
import NewAndHot from "./component/Menu_NewAndHot";
import Watched from "./component/Menu_Watched";
import Finding from "./component/Main_finding";
import SignUp from "./component/Sigh_up";
import InfoUser from "./InfoUser";
import USinfo from "./component/US_info";
import PrivateRoute from "./component/PrivateRoute";
import USContract from "./component/US_contract";
import Security from "./component/US_security";
import ResetPass from "./component/ResetPass";
import WatchTogether from "./component/US_WatchTogether";
import Watchtogetherplay from "./component/US_WatchTogetherPlay";
import Actorinfo from "./component/Actor_info";
import Actor from "./component/AM_actor";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Banner />} />
        <Route path="/Forgot" element={<ResetPass />} />

        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }>
          <Route path="users" element={<AMUser />} />
          <Route path="movies" element={<AMMmovie />} />
          <Route path="reports" element={<AMReport />} />
          <Route path="series" element={<AMMseries />} />
          <Route path="notifix" element={<AMnotifix />} />
          <Route path="actor" element={<Actor />} />
        </Route>

        <Route path="/user" element={
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        }>
          <Route path="menu_main" element={<Menumain />} />
          <Route path="slide" element={<MovieSlide />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="movie/:id/play" element={<MoviePlay />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="watch/:id" element={<EpisodePlay />} />
          <Route path="menu_series" element={<Menuseries />} />
          <Route path="menu_movie" element={<Menumocie />} />
          <Route path="movie_genre/:Category" element={<MovieGenre />} />
          <Route path="series_genre/:Category" element={<SeriesGenre />} />
          <Route path="new_and_hot" element={<NewAndHot />} />
          <Route path="watched" element={<Watched />} />
          <Route path="finding/:searchInput" element={<Finding />} />
          <Route path="watch_together" element={<WatchTogether />} />
          <Route path="watch_together/play/:id/:SessionID" element={<Watchtogetherplay />} />
          <Route path="actor/:id" element={<Actorinfo />} />
        </Route>


        <Route path="/info" element={
          <PrivateRoute>
            <InfoUser />
          </PrivateRoute>
        }>
          <Route path="info" element={<USinfo />} />
          <Route path="contract" element={<USContract />} />
          <Route path="security" element={<Security />} />
        </Route>

        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;