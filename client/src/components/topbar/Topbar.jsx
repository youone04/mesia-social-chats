import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searchbar, setSearchbar] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);

  useEffect(() => {
    // Jika searchbar kosong, tidak perlu fetch
    if (!searchbar) return setDataUsers([]);

    const debounceTimeout = setTimeout(() => {
      fetchUsers();
    }, 500); // Mengatur debounce selama 500ms
    // Bersihkan timeout jika searchbar berubah sebelum timeout selesai
    return () => clearTimeout(debounceTimeout);
  }, [searchbar]);

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await axios.get('/users/search?username=' + searchbar);
      setDataUsers(data.data);
      setLoading(false)

    } catch (error) {
      setLoading(false)

    }
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Lamasocial</span>
        </Link>
      </div>

      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            onChange={(e) => setSearchbar(e.target.value)}
          />
          {
            loading ? <span className="loading" /> : null
          }
        </div>
        {dataUsers.length > 0 && (
          <div className="suggestionsContainer">
            {dataUsers.map((suggestion) => (
              <div className="suggestionItem" key={suggestion._id}>
                <Link style={{textDecoration:'none'}} to={`/profile/${suggestion.username}`} >
                  {suggestion.username}
                </Link>

              </div>

            ))}
          </div>
        )}
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link to="/messenger">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </Link>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
