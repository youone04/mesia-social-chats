
import Topbar from "../../components/topbar/Topbar";
import "./messenger.css";
export default function Messenger() {
    return(
        <>
        <Topbar/>
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    box
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatWrapperOnline">
                    online
                </div>
            </div>
        </div>
        </>
    )
}