//  React imports
import { useEffect, useContext, useState } from "react";
import UserContext from "UserContext";
import { useNavigate } from "react-router-dom";

// third party imports
import QRCode from "qrcode";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { toPng } from "html-to-image";
import { useQuery } from "react-query";
import { saveAs } from "file-saver";

//  Api calls
import { listUsers } from "store/user";
import { listAgentUsers } from "store/assignUsers";
import { listProducts } from "store/products";
import { listDeliveryTypes } from "store/deliveries";

// components imports
import "../Users.scss";
import { ReactComponent as UserBadge } from "svgs/users.svg";
import AssignSingleUser from "components/Users/_id/AssignSingleUser";
// import Spinner from "components/common/Spinner";
import DailyMilkFreshLogo from "logo.png";
import EditUser from "components/Users/_id/EditUser";

export default function UsersHistory() {
  let userInfo = useContext(UserContext);
  let navigate = useNavigate();
  const [spinner, toggleSpinner] = useState(true);
  const [curr_id, setCurrid] = useState(null);
  let { access_token, refreshAccessToken } = userInfo;

  const [imageUrl, setImageUrl] = useState("");
  const [currUser, setCurrUser] = useState();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [products, setProducts] = useState([]);

  useQuery([3, userInfo.access_token], listUsers, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setCurrUser(data.data.data.find((i) => i.user_id === curr_id));
      setTimeout(() => {
        toggleSpinner(false);
      }, 2000);
    },
    onError: (error) => {
      if (error && error.response && error.response.status === 401) {
        toggleSpinner(true);
        refreshAccessToken();
      }
    },
  });

  useQuery([access_token, null], listAgentUsers, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setCurrentOrder(data.data.data.filter((item) => item.user_id === curr_id));
    },
  });

  useQuery([0, access_token], listProducts, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setProducts(data.data.data);
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        refreshAccessToken();
      }
    },
  });

  useEffect(() => {
    // toggleSpinner(true);
    listDeliveryTypes(access_token)
      .then((res) => {
        setDeliveryTypes(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          refreshAccessToken();
        }
      });
    // toggleSpinner(false);
  }, [access_token, refreshAccessToken]);

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        var opts = {
          errorCorrectionLevel: "H",
          type: "application/octet-stream",
          quality: 1,
          margin: 1,
          color: {
            dark: "#000",
            light: "#FFF",
          },
        };
        setCurrid(window.location.pathname.split("/")[2]);
        const response = await QRCode.toDataURL(curr_id, opts);
        var url = response.replace(/^data:image\/[^;]+/, "data:application/octet-stream");
        setImageUrl(url);
      } catch (error) {
        console.log(error);
      }
    };
    generateQrCode();
  }, [curr_id, access_token, refreshAccessToken]);

  // const downloadQR = (e) => {
  //   htmlToImage.toPng(document.getElementById("my-node")).then(function (dataUrl) {
  //     download(dataUrl, "my-node.png");
  //   });
  // };

  const gotouserhistory = (e) => {
    e.preventDefault();
    navigate(`/users/${curr_id}/history`);
  };

  const orderType = (id) => {
    let nameItem = deliveryTypes.find((item) => item.delivery_type === id);
    return nameItem && nameItem.name;
  };

  const orderProducts = (id) => {
    let nameItem = products.find((item) => item.product_type === id);
    return nameItem && nameItem.name;
  };

  const onCapture = () => {
    toPng(document.getElementById("chaiuserqr")).then(function (dataUrl) {
      saveAs(dataUrl, currUser.name + "qrcode.jpg");
    });
  };

  return (
    <div className="main-container">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <UserBadge /> {"  "} Users
        </div>
        <div>
          <button className="Users__refresh-button" onClick={(e) => gotouserhistory(e)}>
            Show History
          </button>
        </div>
      </div>

      {!spinner ? (
        <>
          <Paper className="AssignUsers__sub" elevation={2}>
            <div style={{ backgroundColor: "white" }} id="chaiuserqr">
              <img className="Users__logo-image" src={DailyMilkFreshLogo} alt="this is logo"></img> <br></br>
              <div>
                {imageUrl ? (
                  <div>
                    <img width="350px" height="350px" src={imageUrl} alt="img" />
                  </div>
                ) : null}
                {currUser && currUser.address}
              </div>
            </div>
            <div className="Users__refresh-button " onClick={onCapture}>
              Customer Unique Scan Code - Download
            </div>{" "}
          </Paper>

          <Paper className="Users__top">
            <h4>Existing Delivery Details:</h4>
            {currentOrder.map((cuser, index) => {
              return (
                <>
                  <hr></hr>
                  <div>Selected Product: {orderProducts(cuser.product_type)} </div>
                  <div>Selected DeliveryType: {orderType(cuser.delivery_type)}</div>
                  <div>Selected Quantity {cuser.quantity}</div>
                </>
              );
            })}
          </Paper>

          <AssignSingleUser currUser={currUser}></AssignSingleUser>
          <EditUser access_token={access_token} currUser={currUser}></EditUser>
        </>
      ) : (
        <div className="Agents__spinners">
          {/* <Spinner /> */}
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton variant="rectangular" animation="wave" width={210} height={118} />
        </div>
      )}
    </div>
  );
}
