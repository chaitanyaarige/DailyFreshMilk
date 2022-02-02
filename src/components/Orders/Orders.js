import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "UserContext";
import OrdersListing from "components/Orders/OrdersListing";
import OrdersCancel from "components/Orders/OrdersCancel";
import MiniNavbar from "components/common/MiniNavbar";
import { ReactComponent as CartIcon } from "svgs/cartIcon.svg";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import { listAgentUsers } from "store/assignUsers";
import { listUsers } from "store/user";
import { listProducts } from "store/products";
import { listDeliveryTypes } from "store/deliveries";
import ExportData from "components/Orders/ExportData";
import "./Orders.scss";
import Paper from "@mui/material/Paper";
import { useQuery } from "react-query";

export default function Orders() {
  const userInfo = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortNumbers, setSortNumbers] = useState(false);
  const [addexport, exportToggle] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortLocation, setSortLocation] = useState(false);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [convertedOrders, setConvertedOrders] = useState([]);
  const [sortOrders, setSortOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [spinner, toggleSpinner] = useState(true);
  const [products, setProducts] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  const { access_token, refreshAccessToken } = userInfo;

  const { isLoading } = useQuery([null, access_token], listUsers, {
    onSuccess: (data) => {
      data?.data && setUsers(data.data.data);
      // toggleSpinner(false);
      console.log(isLoading);
    },
    onError: (error) => {
      if (error && error.response && error.response.status === 401) {
        // toggleSpinner(true);
        refreshAccessToken();
      }
    },
  });

  useEffect(() => {
    toggleSpinner(true);
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
    listProducts(null, access_token)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          refreshAccessToken();
        }
      });
    listAgentUsers(access_token)
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          refreshAccessToken();
        }
      });
    toggleSpinner(false);
  }, [access_token, refreshAccessToken]);

  const currentUserSelection = (user) => {
    setCurrentUser(user);
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
  };

  const sortByName = () => {
    if (sortName) {
      setSortOrders(sortOrders.sort((a, b) => a.user_name.localeCompare(b.user_name)));
      setSortName(!sortName);
    } else {
      setSortOrders(sortOrders.sort((a, b) => b.user_name.localeCompare(a.user_name)));
      setSortName(!sortName);
    }
  };

  const sortByProduct = (e) => {
    if (sortNumbers) {
      setSortOrders(sortOrders.sort((a, b) => a.product.localeCompare(b.product)));
      setSortNumbers(!sortNumbers);
    } else {
      setSortOrders(sortOrders.sort((a, b) => b.product.localeCompare(a.product)));
      setSortNumbers(!sortNumbers);
    }
  };

  const sortByAgent = () => {
    if (sortLocation) {
      setSortOrders(sortOrders.sort((a, b) => a.agent_name.localeCompare(b.agent_name)));
      setSortLocation(!sortLocation);
    } else {
      setSortOrders(sortOrders.sort((a, b) => b.agent_name.localeCompare(a.agent_name)));
      setSortLocation(!sortLocation);
    }
  };

  const modifyOrders = useCallback(
    (e, val) => {
      e && e.preventDefault();
      setPage(val);
      const slicedArray = convertedOrders.slice((val - 1) * 6, val * 6);
      setSortOrders(slicedArray);
    },
    [convertedOrders]
  );

  const nnn = useCallback(() => {
    const orderstatus = ["booked", "delivered_morning", "delivered_evening", "cancelled", "intransit", "pickedup"];

    const orderStatus = (userqr) => {
      let statss = orderstatus[userqr];
      return statss ? statss : "Not Available";
    };

    const orderDate = (dateItem) => {
      return new Date(dateItem).toLocaleString("en-Gb");
    };

    const customername = (id) => {
      let nameItem = users.find((item) => item.user_id === id);
      let status = nameItem?.name;
      return status;
    };

    const orderType = (id) => {
      let nameItem = deliveryTypes.find((item) => item.delivery_type === id);
      return nameItem && nameItem.name;
    };

    const orderProducts = (id) => {
      let nameItem = products.find((item) => item.product_type === id);
      return nameItem && nameItem.name;
    };

    setConvertedOrders([]);
    orders.forEach((item) => {
      let abc = {
        user_id: item.user_id,
        delivery_id: item.delivery_id,
        user_name: customername(item.user_id),
        agent_name: customername(item.agent_id),
        delivery_type: orderType(item.delivery_type),
        product: orderProducts(item.product_type),
        delivery_status: orderStatus(item.delivery_status),
        quantity: item.quantity,
        price: item.price,
        lat: item.lat,
        lng: item.long,
        id: item.id,
        modified_at: orderDate(item.modified_at),
      };

      setConvertedOrders((prevData) => [...prevData, abc]);
    });
  }, [orders, deliveryTypes, products, users]);

  useEffect(() => {
    modifyOrders(null, 1);
  }, [convertedOrders, modifyOrders]);

  useEffect(() => {
    nnn();
  }, [orders, nnn]);

  return (
    <div className="main-container">
      {spinner ? (
        <>
          <Spinner />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton variant="rectangular" animation="wave" width={210} height={118} />
        </>
      ) : (
        <>
          <div className="Orders__main-heading">
            <div className="General-main-heading">
              <CartIcon /> {"  "} My Orders
            </div>
            <div>
              <button className="Users__refresh-button" onClick={(e) => exportToggle(!addexport)}>
                {addexport ? "Back to Orders" : "Export current data"}
              </button>
            </div>
          </div>
          {addexport ? (
            <Paper>
              <ExportData users={users} deliveryTypes={deliveryTypes} products={products} orders={convertedOrders} />
            </Paper>
          ) : (
            <>
              <MiniNavbar
                isVisible={currentUser}
                clearCurrentUser={clearCurrentUser}
                sortByName={sortByName}
                sortByProduct={sortByProduct}
                sortByAgent={sortByAgent}
              ></MiniNavbar>
              {currentUser ? (
                <OrdersCancel access_token={access_token} order={currentUser}></OrdersCancel>
              ) : (
                <div>
                  <OrdersListing
                    currentUserSelection={currentUserSelection}
                    orders={sortOrders}
                    // users={users}
                    // deliveryTypes={deliveryTypes}
                    // products={products}
                  ></OrdersListing>
                  <div className="Orders__pagination">
                    <Stack spacing={2}>
                      <Pagination
                        onChange={(event, val) => modifyOrders(event, val)}
                        variant="outlined"
                        color="primary"
                        boundaryCount={2}
                        count={orders.length % 6 === 0 ? orders.length / 6 : Math.floor(orders.length / 6) + 1}
                        page={page}
                      />
                    </Stack>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
