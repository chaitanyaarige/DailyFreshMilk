import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { addProduct } from "store/products";
import { useNavigate } from "react-router-dom";
import Spinner from "components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import { ReactComponent as ProductIcon } from "svgs/checkList.svg";
import "./Products.scss";
import { listProducts } from "store/products";
import UserContext from "UserContext";

export default function EditProducts() {
  const navigate = useNavigate();
  const userInfo = useContext(UserContext);
  const [spinner, toggleSpinner] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();

  const {access_token, refreshAccessToken} = userInfo

  const [product, setProductProfile] = useState({
    name: "",
    description: "",
    price: "",
    measurement: "",
  }); 

  const onSubmit = async (data) => {
    const returnedTarget = Object.assign(product, data);
    setProductProfile({ ...returnedTarget });
    if (errors.length) return;
    await submitDataFinal();
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitDataFinal = () => {
    let data = {
      product,
      access_token: access_token,
    };
    addProduct(data)
      .then((res) => {
        alert("success");
        setTimeout(() => {
        }, 2000);
      })
      .catch((err) => {
        console.log("Failed", err.response);
        alert("Failed");
      });
  };

  useEffect(() => {
    toggleSpinner(true);
    listProducts(null, userInfo.access_token)
      .then((res) => {
        setProducts(res.data.data);
        setCurrentProduct();
        toggleSpinner(false);
      })
      .catch((res) => {
        // optional chaining
        let status = res?.response?.status;
        if (status & (status === 401)) {
          refreshAccessToken();
          toggleSpinner(false);
        }
      });
  }, [userInfo.access_token]);

  const setCurrentProduct = () => {
    let curr_id = window.location.pathname.split("/")[2];
    if (curr_id) {
      let abb = products.find((item) => item.id == curr_id);
      setSelectedProduct(abb);
    }
  };

  const goBack = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  //   const modifyHistoryData = (hist) => {
  //     // setHistoryData(hist);
  //     hist.forEach((item, index) => {
  //       let abc = {
  //         id: index + 1,
  //         user_name: item.UserDetail.name,
  //         // agent_name: item.UserDetail.name,
  //         delivery_type: item.DeliveryType.name,
  //         product: item.Product.name,
  //         quantity: item.quantity,
  //         price: item.price,
  //         delivered_at: new Date(item.delivered_at).toLocaleString("en-Gb"),
  //       };
  //       setHistoryData((prevData) => [...prevData, abc]);
  //     });
  //   };

  return (
    <div className="main-container">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <ProductIcon /> {"  "} Edit Product
        </div>
        <div>
          <button className="Users__refresh-button" onClick={(e) => goBack(e)}>
            {" "}
            Back to Products
          </button>
        </div>
      </div>
      {!spinner ? (
    <div className="Products__sub-container">
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="Login__col-3">
        {errors.name && <div className="Users__errors">Name needs to be at least 3 characters</div>}
        <input
          className="Login__input-focus-effect"
          type="text"
          placeholder="Name"
          {...register("name", {
            required: "required",
            minLength: {
              value: 3,
              message: "Please enter a valid password min 8 char",
            },
          })}
        ></input>
        <span className="focus-border"></span>
      </div>

      <div className="Login__col-3">
        {errors.price && <div className="Users__errors">This field is required</div>}

        <input
          className="Login__input-focus-effect"
          placeholder="Price"
          type="number"
          {...register("price", {
            required: "required",
            min: 1,
          })}
        />
        <span className="focus-border"></span>
      </div>

      <div className="Login__col-3">
        {errors.description && <div className="Users__errors">Please enter a valid description min 8 char"</div>}
        <input
          className="Login__input-focus-effect"
          type="description"
          placeholder="Description"
          {...register("description", { required: "required", min: 5 })}
        ></input>
        <span className="focus-border"></span>
      </div>

      <div className="Login__col-3">
        {errors.measurement && <div className="Users__errors">Please enter a valid measurement Kg/packet/Litre"</div>}
        <input
          className="Login__input-focus-effect"
          type="measurement"
          placeholder="measurement"
          {...register("measurement", { required: "required", min: 5 })}
        ></input>
        <span className="focus-border"></span>
      </div>

      <div className="Login__col-3">
        <input
          className={errors.length ? "Users__refresh-button Users__refresh-button-disabled" : "Users__refresh-button"}
          type="submit"
          value="Add New Product"
        ></input>
      </div>
    </form>
  </div>      ) : (
        <div className="Products__spinners">
          <Spinner />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={210}
            height={118}
          />
          {/* <img height="150px" width="150px" src={Spinner} alt="Daily"></img> */}
        </div>
      )}
    </div>
  );
}
