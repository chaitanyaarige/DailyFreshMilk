import { useState, useContext } from "react";
import UserContext from "UserContext";
import { ReactComponent as UserBadge } from "svgs/users.svg";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "components/AssigningUsersToAgent/AssignUsers.scss";
import Spinner from "components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import SelectProduct from "components/AssigningUsersToAgent/SelectProduct";
import SelectUser from "components/AssigningUsersToAgent/SelectUser";
import SelectAgent from "components/AssigningUsersToAgent/SelectAgent";
import SelectQuantity from "components/AssigningUsersToAgent/SelectQuantity";
import SelectDeliveryType from "components/AssigningUsersToAgent/SelectDeliveryType";
import { assigningUsersToAgent } from "store/assignUsers";

export default function AssignUsers() {
  const userInfo = useContext(UserContext);
  const [spinner, toggleSpinner] = useState(false);
  const [dataEntered, toggleDataEntered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [sendData, setSenddata] = useState({
    agent_id: "",
    users: "",
    quantity: "",
    delivery_type: "",
    product_type: "",
    price: "",
  });
  const steps = getSteps();

  const handleNext = () => {
    dataEntered && setActiveStep(activeStep + 1);
    toggleDataEntered(false);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const SubmitData = (e) => {
    e.preventDefault();
    toggleSpinner(true);

    let muser_id = sendData.users.map((item) => item.user_id);

    // let assignList = {
    //   user_id: sendData.user_id.map((item) => item.user_id),
    //   quantity: sendData.quantity,
    //   delivery_type: sendData.delivery_type,
    //   product_type: sendData.product_type,
    //   price: sendData.price,
    // };
    // return console.log(muser_id);

    let assignList = [];
    muser_id.map((item) => {
      return assignList.push({
        user_id: item,
        quantity: sendData.quantity,
        delivery_type: sendData.delivery_type,
        product_type: sendData.product_type,
        price: sendData.price,
      });
    });

    let submit = {
      agent_id: sendData.agent_id,
      assignlist: assignList,
    };

    assigningUsersToAgent(userInfo.access_token, submit)
      .then((res) => {
        setSenddata({
          agent_id: "",
          users: "",
          quantity: "",
          delivery_type: "",
          product_type: "",
          price: "",
        });
        setActiveStep(0);
        toggleSpinner(false);
        alert("successfully saved");
      })
      .catch((res) => {
        toggleSpinner(false);
        alert("Please try again");
      });
  };

  function getSteps() {
    return [
      "Select Agent",
      "Select User",
      "Select Product",
      "Select Quantity",
      "Select Delivery type",
    ];
  }

  const handleData = (e, g, n) => {
    e && e.preventDefault();
    if (n === "agent") setSenddata({ ...sendData, agent_id: g });
    if (n === "user") setSenddata({ ...sendData, users: g });
    if (n === "delivery_type") setSenddata({ ...sendData, delivery_type: g });
    if (n === "quantity") setSenddata({ ...sendData, quantity: g });
    toggleDataEntered(true);
  };

  const handlePData = (e, value) => {
    e.preventDefault();
    setSenddata({
      ...sendData,
      price: value.price,
      product_type: value.product_type,
      measurement: value.measurement || "",
    });
    toggleDataEntered(true);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <SelectAgent
              access_token={userInfo.access_token}
              refreshAccessToken={userInfo.refreshAccessToken}
              handleData={handleData}
            />
          </>
        );

      case 1:
        return (
          <>
            <SelectUser
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 2:
        return (
          <>
            <SelectProduct
              // handleData={handleData}
              handlePData={handlePData}
              refreshAccessToken={userInfo.refreshAccessToken}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 3:
        return (
          <>
            <SelectQuantity
              measurement={sendData.measurement || ""}
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 4:
        return (
          <>
            <SelectDeliveryType
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken}
              access_token={userInfo.access_token}
            />
          </>
        );
      default:
        return "unknown step";
    }
  }

  return (
    <div className="main-container">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <UserBadge /> {"  "} Assign Users to Agents
        </div>
      </div>

      {!spinner ? (
        <Paper className="AssignUsers__sub" elevation={2}>
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};

              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <Typography variant="h4" align="center">
              Agent Assigned to User Successfully
            </Typography>
          ) : (
            <>
              <form>{getStepContent(activeStep)}</form>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>

              <Button
                className=""
                variant="contained"
                disabled={!dataEntered}
                color="primary"
                onClick={(e) =>
                  activeStep === steps.length - 1
                    ? SubmitData(e)
                    : handleNext(e)
                }
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <>
          {" "}
          <Spinner />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={210}
            height={118}
          />{" "}
        </>
      )}
    </div>
  );
}
