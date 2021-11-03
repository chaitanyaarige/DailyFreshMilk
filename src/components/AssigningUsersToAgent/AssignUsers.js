import { useState, useContext } from "react";
import UserContext from "UserContext";
import { ReactComponent as UserBadge } from "components/svgs/users.svg";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "components/AssigningUsersToAgent/AssignUsers.scss";
// import Spinner from "spinner.png";
import SelectProduct from "components/AssigningUsersToAgent/SelectProduct";
import SelectUser from "components/AssigningUsersToAgent/SelectUser";
import SelectAgent from "components/AssigningUsersToAgent/SelectAgent";
import SelectQuantity from "components/AssigningUsersToAgent/SelectQuantity";
import SelectDeliveryType from "components/AssigningUsersToAgent/SelectDeliveryType";
import { assigningUsersToAgent } from "store/assignUsers";

export default function AssignUsers() {
  const userInfo = useContext(UserContext);
  // const [spinner, toggleSpinner] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [sendData, setSenddata] = useState({
    agent_id: "",
    // assignlist: {
    user_id: "",
    quantity: "",
    delivery_type: "",
    product_type: "",
    price: "",
    // },
  });
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  // const handleBack = () => {
  //   setActiveStep(activeStep - 1);
  // };

  const SubmitData = (e) => {
    e.preventDefault();
    let submit = {
      agent_id: sendData.agent_id,
      assignlist: [
        {
          user_id: sendData.user_id,
          quantity: sendData.quantity,
          delivery_type: sendData.delivery_type,
          product_type: sendData.product_type,
          price: "",
        },
      ],
    };

    assigningUsersToAgent(userInfo.access_token, submit);
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
    console.log(g, n);
    e.preventDefault();
    if (n === "agent") setSenddata({ ...sendData, agent_id: g });
    if (n === "user") setSenddata({ ...sendData, user_id: g });
    if (n === "delivery_type") setSenddata({ ...sendData, delivery_type: g });
    if (n === "product") setSenddata({ ...sendData, product_type: g });
    if (n === "quantity") setSenddata({ ...sendData, quantity: g });
    if (n === "price") setSenddata({ ...sendData, price: g });
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <SelectAgent
              access_token={userInfo.access_token}
              refreshAccessToken={userInfo.refreshAccessToken()}
              handleData={handleData}
            />
          </>
        );

      case 1:
        return (
          <>
            <SelectUser
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken()}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 2:
        return (
          <>
            <SelectProduct
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken()}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 3:
        return (
          <>
            <SelectQuantity
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken()}
              access_token={userInfo.access_token}
            />
          </>
        );
      case 4:
        return (
          <>
            <SelectDeliveryType
              handleData={handleData}
              refreshAccessToken={userInfo.refreshAccessToken()}
              access_token={userInfo.access_token}
            />
          </>
        );
      default:
        return "unknown step";
    }
  }

  return (
    <div className="AssignUsers__main">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <UserBadge /> {"  "} Assign Users to Agents
        </div>
      </div>

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
            {/* <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button> */}

            <Button
              className=""
              variant="contained"
              // disabled={if not selected data}
              color="primary"
              onClick={(e) =>
                activeStep === steps.length - 1 ? SubmitData(e) : handleNext(e)
              }
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </>
        )}
      </Paper>
    </div>
  );
}
