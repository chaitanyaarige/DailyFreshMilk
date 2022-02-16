// react imports
import { useEffect, useState } from "react";

// external imports
import { useForm } from "react-hook-form";

// internal imports
import { editUser } from "store/user";
import MySnack from "components/common/MySnack";
import "../Users.scss";

export default function EditUser(props) {
  const [user, setUserProfile] = useState({
    name: "",
    email_id: "",
    address: "",
    user_type: "3",
  });
  const [alertmessage, setalertmessage] = useState(null);

  const onSubmit = async (newdata) => {
    const returnedTarget = Object.assign(user, newdata);
    await setUserProfile({ ...returnedTarget });
    if (errors.length) return;
    submitUserProfile();
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    reset({ name: props.currUser.name, address: props.currUser.address, email_id: props.currUser.email_id });
  }, [props.currUser.name, props.currUser.address, props.currUser.email_id, reset]);

  const submitUserProfile = (e) => {
    let data = {
      name: user.name,
      email_id: user.email_id,
      address: user.address,
      access_token: props.access_token,
    };
    editUser(data)
      .then((res) => {
        setalertmessage("successfully saved");
      })
      .catch((err) => {
        setalertmessage("Failed to saved");
        console.log(err.response);
      });
  };

  return (
    <div className="Users__sub-container">
      {
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="Login__col-3">
              {errors.name && <div className="Users__errors">Name needs to be at least 5 characters</div>}
              <input className="Login__input-focus-effect" type="text" placeholder="Name" {...register("name", { required: true, min: 5 })}></input>

              <span className="focus-border"></span>
            </div>

            <div className="Login__col-3">
              {errors.email_id && <span className="Users__errors">{errors.email_id.message}</span>}
              <input
                className="Login__input-focus-effect"
                type="text"
                placeholder="Email"
                {...register("email_id", {
                  required: "required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              ></input>

              <span className="focus-border"></span>
            </div>

            <div className="Login__col-3">
              {errors.address && <span className="Users__errors">{errors.address.message}</span>}
              <input
                className="Login__input-focus-effect"
                type="text"
                placeholder="Address"
                {...register("address", {
                  required: "required",
                  minLength: {
                    value: 8,
                    message: "Please enter full address",
                  },
                })}
              ></input>
              <span className="focus-border"></span>
            </div>

            <div className="Login__col-3">
              <input
                className={errors.length ? "Users__refresh-button Users__refresh-button-disabled" : "Users__refresh-button"}
                type="submit"
                value="Save User Details"
              ></input>
            </div>
          </form>
        </div>
      }
      {alertmessage && <MySnack message={alertmessage} />}
    </div>
  );
}
