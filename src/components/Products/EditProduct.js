import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { updateProduct } from "store/products";
import { useNavigate } from "react-router-dom";
import Spinner from "components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import { ReactComponent as ProductIcon } from "svgs/checkList.svg";
import "./Products.scss";
import { listProducts } from "store/products";
import UserContext from "UserContext";
import { useQuery } from "react-query";

export default function EditProducts() {
  // Global values
  const navigate = useNavigate();
  const userInfo = useContext(UserContext);
  const { access_token, refreshAccessToken } = userInfo;

  //  State
  const [spinner, toggleSpinner] = useState(false);
  // const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProductProfile] = useState({
    name: "",
    description: "",
    price: "",
    measurement: "",

    //     availability: 1
    // created_at: "2022-02-05T15:13:37.000Z"
    // description: "cow ghee"
    // id: "e176d60b-01fd-4279-9f85-9c670cd6b049"
    // image: null
    // measurement: "kg"
    // name: "Ghee"
    // price: 80
    // product_type: 1
  });

  // Functions
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
    reset,
  } = useForm();

  const submitDataFinal = () => {
    updateProduct(access_token, selectedProduct.id, product)
      .then((res) => {
        alert("success");
        navigate("/products");
      })
      .catch((err) => {
        console.log("Failed", err.response);
        alert("Failed");
      });
  };

  useQuery([0, access_token], listProducts, {
    retry: 2,
    onSuccess: (data) => {
      // data?.data && setProducts(data.data.data);
      data?.data?.data && setCurrentProduct(data.data.data);
      toggleSpinner(false);
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        toggleSpinner(true);
        refreshAccessToken();
      }
    },
  });

  const setCurrentProduct = (p) => {
    let curr_id = window.location.pathname.split("/")[2];
    if (curr_id) {
      let abb = p.find((item) => item.id === curr_id);
      setSelectedProduct(abb);
      reset({ name: abb.name, price: abb.price, description: abb.description, measurement: abb.measurement });
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
                value="Edit Product"
              ></input>
            </div>
          </form>
        </div>
      ) : (
        <div className="Products__spinners">
          <Spinner />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton variant="rectangular" animation="wave" width={210} height={118} />
          {/* <img height="150px" width="150px" src={Spinner} alt="Daily"></img> */}
        </div>
      )}
    </div>
  );
}
