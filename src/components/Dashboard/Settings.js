import "./Settings.scss";
import { useState, useContext, useEffect } from "react";
import UserContext from "UserContext";
import { editUser } from "store/user";

export default function Settings() {
  const userInfo = useContext(UserContext);
  const [selectedProfile, setSelectedProfile] = useState(true);
  const [user, setUserProfile] = useState({
    name: "",
    email_id: "",
    phone_no: "",
    address: "",
  });

  const toggleProfileSelection = (e) => {
    e.preventDefault();
    setSelectedProfile(!selectedProfile);
  };

  useEffect(() => {
    setUserProfile((prevState) => ({
      ...prevState,
      ...userInfo.userDetails,
    }));
  }, [userInfo]);

  const assignUserProfile = (e, formType) => {
    e.preventDefault();
    e.persist();
    if (selectedProfile) return;
    if (formType === "name") setUserProfile({ ...user, name: e.target.value });
    if (formType === "email")
      setUserProfile({ ...user, email_id: e.target.value });
  };

  const submitUserProfile = (e) => {
    let data = {
      name: user.name,
      email_id: user.email_id,
      access_token: userInfo.access_token,
    };
    editUser(data).then((res) => {
      userInfo.saveuserDetails(res.data);
      alert("Successfully saved");
    });
  };

  return (
    <div className="Settings__main-container">
      <div className="Settings__heading-container">
        <div
          onClick={(e) => toggleProfileSelection(e)}
          className={
            selectedProfile
              ? "Settings__heading-left Settings__heading-left-selected"
              : "Settings__heading-left"
          }
        >
          Profile
        </div>
        <div
          onClick={(e) => toggleProfileSelection(e)}
          className={
            !selectedProfile
              ? "Settings__heading-right Settings__heading-right-selected"
              : "Settings__heading-right"
          }
        >
          Edit Profile
        </div>
      </div>

      <div className="Settings__field-container">
        <label className="Settings__label">Name</label>
        <input
          value={user.name}
          onChange={(e) => assignUserProfile(e, "name")}
          className="Settings__firstname"
          type="text"
          placeholder="Name"
          name="firstName"
        ></input>
      </div>

      <div className="Settings__field-container">
        <label className="Settings__label">Email</label>
        <input
          onChange={(e) => assignUserProfile(e, "email")}
          value={user.email_id}
          type="text"
          className="Settings__firstname"
        ></input>
      </div>

      {selectedProfile && (
        <div>
          <div className="Settings__field-container">
            <label className="Settings__label">Phone</label>
            <input
              readOnly
              value={user.phone_no}
              type="text"
              className="Settings__email"
            ></input>
          </div>

          <div className="Settings__field-container">
            <label className="Settings__label">Address</label>
            <input
              onChange={(e) => assignUserProfile(e, "email")}
              value={user.address || ""}
              type="text"
              className="Settings__firstname"
            ></input>
          </div>
        </div>
      )}

      {!selectedProfile && (
        <div>
          <div className="Settings__field-container">
            <input
              onClick={(e) => submitUserProfile(e)}
              value="Save"
              type="submit"
              className="Settings__submit"
            ></input>
          </div>
        </div>
      )}
    </div>
  );
}
