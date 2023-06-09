import { React, useEffect, useState } from "react";
import "./PlaylistSongs.scss";
import { BsFillTriangleFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { SongsList } from "../SongsList/SongsList";

import {
  useFetchPlaylistInfoQuery,
  useFetchAlbumInfoQuery,
  useFetchUserPlaylistsQuery,
  usePlayClickedSongMutation,
  useSavePlaylistMutation,
  useSaveAlbumMutation,
  useGetCurrentUserQuery,
  useCheckUserFollowPlaylistQuery,
  useRemovePlaylistMutation,
  useRemoveAlbumMutation,
  useCheckUserFollowAlbumQuery,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { changeId, changePlay } from "../../store";
import { useLocation } from "react-router-dom";
import { playlistAlbumRefetch } from "../LeftSidebar/LeftSidebar";

const PlaylistSongs = ({ token, devices }) => {
  const [id, setId] = useState("");
  const [fetchInfoData, setFetchInfoData] = useState();
  const [isActive, setIsActive] = useState();

  const dispatch = useDispatch();
  const location = useLocation();

  const [playSong] = usePlayClickedSongMutation();

  useEffect(() => {
    const playlistId = location.pathname.split("/")[2];
    setId(playlistId);
  }, [location]);

  const href = location.pathname.split("/")[1];

  const { data, isFetching, error, refetch } = useFetchPlaylistInfoQuery({
    token,
    id,
  });

  const {
    data: data2 = data,
    isFetching: isFetching2 = isFetching,
    error: error2 = error,
  } = useFetchAlbumInfoQuery({ token, id });

  const { data: data3 = data } = useGetCurrentUserQuery(token);

  const playlistId = data?.id;
  const userId = data3?.id;
  const albumId = data2?.id;

  const { data: data4 = data } = useCheckUserFollowPlaylistQuery({
    token,
    playlistId,
    userId,
  });

  const { data: data5 = data } = useCheckUserFollowAlbumQuery({
    token,
    albumId,
  });

  const { data: userPlaylists = data } = useFetchUserPlaylistsQuery(token);

  console.log({ essssa: userPlaylists });

  useEffect(() => {
    if (href === "playlist" && data) {
      setFetchInfoData(data);
    } else if (href === "album" && data2) {
      setFetchInfoData(data2);
    }

    if (href === "playlist") {
      setIsActive(data4?.toString());
    } else if (href === "album") {
      setIsActive(data5?.toString());
    }
  }, [data, data2, data4, data5]);

  const player_id = useSelector((state) => {
    return state.uri.id;
  });

  const play_status = useSelector((state) => {
    return state.uri.play;
  });

  const playlistOrAlbumId =
    href === "playlist" ? data?.id : href === "album" ? data2?.id : "";

  const handlePlayMusic = () => {
    const uri =
      href === "playlist"
        ? data?.tracks?.items?.map((item) => item.track.uri)
        : href === "album"
        ? data2?.tracks?.items?.map((item) => item.uri)
        : "";
    if (!player_id && !play_status) {
      dispatch(changeId(uri));
      dispatch(changePlay(true));
    } else if (play_status) {
      playSong({ uri, token });
    }
  };

  const [savePlaylist] = useSavePlaylistMutation();
  const [saveAlbum, saveAlbumResults] = useSaveAlbumMutation();
  const [removePlaylist] = useRemovePlaylistMutation();
  const [removeAlbum] = useRemoveAlbumMutation();

  const handleSavePlaylistOrAlbum = async () => {
    const el = document.getElementById("likebtn");
    if (href === "playlist" && isActive?.toString() === "false") {
      await savePlaylist({ token, playlistOrAlbumId });

      el.classList.add("active");
      setIsActive("true");
    } else if (href === "playlist" && isActive?.toString() === "true") {
      await removePlaylist({ token, playlistOrAlbumId });

      el.classList.remove("active");
      setIsActive("false");
    } else if (href === "album" && isActive?.toString() === "false") {
      await saveAlbum({ token, playlistOrAlbumId });

      console.log(saveAlbumResults);
      el.classList.add("active");
      setIsActive("true");
    } else if (href === "album" && isActive?.toString() === "true") {
      await removeAlbum({ token, playlistOrAlbumId });

      el.classList.remove("active");
      setIsActive("false");
    }
    playlistAlbumRefetch();
  };

  if (
    (isFetching && href === "playlist") ||
    (isFetching2 && href === "album")
  ) {
    return <div>Ładowanie</div>;
  } else if (fetchInfoData) {
    return (
      <div className="playlist-songs">
        <div className="playlist-songs__container">
          <div className="playlist-songs__header">
            <div className="playlist-songs__img">
              {href === "playlist"
                ? data?.images[0] && (
                    <img src={data?.images[0]?.url} alt={data?.id} />
                  )
                : href === "album"
                ? data2?.images[0] && (
                    <img src={data2?.images[0]?.url} alt={data2?.id} />
                  )
                : ""}

              {data?.images?.length === 0 && href === "playlist" && (
                <img src={data3?.images[0]?.url} alt={data3?.id} />
              )}
            </div>
            <div className="playlist-songs__text">
              <h3>Playlista</h3>
              <h1>{fetchInfoData.name}</h1>
              <div className="playlist-songs__text-bottom">
                {fetchInfoData.description}
              </div>
            </div>
          </div>
          <div className="playlist-songs__buttons">
            <button onClick={handlePlayMusic}>
              <div className="playlist-songs__btn-first">
                <BsFillTriangleFill
                  size={20}
                  style={{ bottom: "2px", position: "relative" }}
                />
              </div>
            </button>
            <button onClick={handleSavePlaylistOrAlbum}>
              <div
                id="likebtn"
                className={`playlist-songs__btn-second ${
                  isActive?.toString() === "true" ? "active" : ""
                }`}
              >
                <AiOutlineHeart size={40} />
              </div>
            </button>
            <div className="playlist-songs__btn-third">
              <BiDotsHorizontalRounded size={40} />
            </div>
          </div>
          <SongsList
            data={href === "playlist" ? data : data2}
            refetch={href === "playlist" ? refetch : ""}
            isFetching={href === "playlist" ? isFetching : isFetching2}
            error={href === "playlist" ? error : error2}
            albumInfo={fetchInfoData}
            token={token}
          />
        </div>
      </div>
    );
  }
};

export { PlaylistSongs };
