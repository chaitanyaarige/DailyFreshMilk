import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "UserContext";
import OrdersListing from "components/Orders/OrdersListing";
import OrderPage from "components/Orders/OrderPage";
import MiniNavbar from "components/common/MiniNavbar";
import { ReactComponent as CartIcon } from "components/svgs/cartIcon.svg";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import { listAgentUsers } from "store/assignUsers";
import { listUsers } from "store/user";
import { listProducts } from "store/products";
import { listDeliveryTypes } from "store/deliveries";
import "./Orders.scss";

export default function Orders() {
  const userInfo = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortNumbers, setSortNumbers] = useState(false);
  const [addexport, exportToggle] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortLocation, setSortLocation] = useState(false);
  const [page, setPage] = useState(1);
  const [sortOrders, setSortOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [spinner, toggleSpinner] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  useEffect(() => {
    toggleSpinner(true);
    listAgentUsers(userInfo.access_token)
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          userInfo.refreshAccessToken();
        }
      });
    listUsers(null, userInfo.access_token)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          userInfo.refreshAccessToken();
        }
      });
    listDeliveryTypes(userInfo.access_token)
      .then((res) => {
        setDeliveryTypes(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          userInfo.refreshAccessToken();
        }
      });
    listProducts(null, userInfo.access_token)
      .then((res) => {
        toggleSpinner(false);
        setProducts(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          userInfo.refreshAccessToken();
        }
      });
  }, [userInfo.access_token]);

  const currentUserSelection = (user) => {
    setCurrentUser(user);
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
  };

  const sortByName = () => {
    if (sortName) {
      setUsers(
        users.sort((a, b) => a.customername.localeCompare(b.customername))
      );
      setSortName(!sortName);
    } else {
      setUsers(
        users.sort((a, b) => b.customername.localeCompare(a.customername))
      );
      setSortName(!sortName);
    }
  };

  const sortByNumber = (e) => {
    if (sortNumbers) {
      setUsers(
        users
          .slice(0)
          .sort((a, b) => parseInt(a.QRNumber) - parseInt(b.QRNumber))
      );
      setSortNumbers(!sortNumbers);
    } else {
      setUsers(
        users
          .slice(0)
          .sort((a, b) => parseInt(b.QRNumber) - parseInt(a.QRNumber))
      );
      setSortNumbers(!sortNumbers);
    }
  };

  const sortByLocation = (e) => {
    if (sortLocation) {
      setUsers(users.sort((a, b) => a.address.localeCompare(b.address)));
      setSortLocation(!sortLocation);
    } else {
      setUsers(users.sort((a, b) => b.address.localeCompare(a.address)));
      setSortLocation(!sortLocation);
    }
  };

  const modifyOrders = useCallback(
    (e, val) => {
      e && e.preventDefault();
      setPage(val);
      const slicedArray = orders.slice((val - 1) * 6, val * 6);
      return setSortOrders(slicedArray);
    },
    [orders]
  );

  useEffect(() => {
    modifyOrders(null, 1);
  }, [orders, modifyOrders]);

  return (
    <div className="Orders__main-container">
      {spinner ? (
        <Spinner />
      ) : (
        <>
          <div className="Orders__main-heading">
            <div className="General-main-heading">
              <CartIcon /> {"  "} My Orders
            </div>
            <div>
              <button
                className="Users__refresh-button"
                onClick={(e) => exportToggle(addexport)}
              >
                {"Export current data"}
              </button>
            </div>
          </div>
          <MiniNavbar
            isVisible={currentUser}
            clearCurrentUser={clearCurrentUser}
            // sortByName={sortByName}
            // sortByNumber={sortByNumber}
            // sortByLocation={sortByLocation}
          ></MiniNavbar>
          {currentUser ? (
            <OrderPage order={currentUser}></OrderPage>
          ) : (
            <div>
              <OrdersListing
                currentUserSelection={currentUserSelection}
                orders={sortOrders}
                users={users}
                deliveryTypes={deliveryTypes}
                products={products}
              ></OrdersListing>
              <div className="Orders__pagination">
                <Stack spacing={2}>
                  <Pagination
                    onChange={(event, val) => modifyOrders(event, val)}
                    variant="outlined"
                    color="primary"
                    boundaryCount={2}
                    count={
                      orders.length % 6 === 0
                        ? orders.length / 6
                        : Math.floor(orders.length / 6) + 1
                    }
                    page={page}
                  />
                </Stack>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
