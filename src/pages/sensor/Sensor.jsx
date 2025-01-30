import React, { useEffect, useState } from "react";
import useApiInstance from "../../customHooks/useApiInstance.js";
import apiRoutes from "../../api/apiRoutes.js";

import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Switch,
} from "@mui/material";
import { AxiosError } from "axios";
import { handleApiError, handleNetworkError } from "../../utils/handleError.js";
import CircularProgressWithLabel from "../../components/common/circularProgress/CircularProgressWithLabel.jsx";

const Sensor = () => {
  const [sensorList, setSensorList] = useState([]);
  const apiInstance = useApiInstance();

  const fetchSensorData = async () => {
    try {
      const sensorRes = await apiInstance.get(apiRoutes.getSensors);
      setSensorList(sensorRes.data.data);
      // store is state and render
      // console.log("sensor data is here :", sensorRes.data);
    } catch (error) {
      // console.log("Error while getting sensor data : ", error);
      if (
        error instanceof AxiosError &&
        (error.status === 401 ||
          error.status === 403 ||
          error.status === 404 ||
          error.status === 500)
      ) {
        handleApiError(error.response.data.error_code);
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        handleNetworkError();
      } else {
        // console.log("unexpected error when fetch sensor data : ", error);
      }
    }
  };

  useEffect(() => {
    fetchSensorData();
    setInterval(() => {
      fetchSensorData();
    }, 1 * 60 * 1000);
  }, []);

  const updateSensorAction = async (obj) => {
    try {
      const updateRes = await apiInstance.patch(
        apiRoutes.updateAction + `/${obj._id}`,
        {
          currentState: !obj.action.current_status,
        }
      );

      fetchSensorData();
      // console.log("sensor action updated ", updateRes);
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.status === 401 ||
          error.status === 403 ||
          error.status === 404 ||
          error.status === 500)
      ) {
        handleApiError(error.response.data.error_code);
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        handleNetworkError();
      } else {
        // console.log("unexpected error : ", error);
      }
    }
  };

  return (
    <div>
      {sensorList !== 0 &&
        sensorList.map((obj, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                marginTop: "12px",
              }}
            >
              <Card
                sx={{
                  width: 343,
                  padding: 2,
                }}
              >
                {/* Title */}
                <Typography variant="h5">{obj.type}</Typography>
                <Divider sx={{ marginTop: "10px" }} />
                {/* Content */}
                <CardContent sx={{ padding: 0, paddingBottom: 0 }}>
                  <List>
                    {Object.keys(obj.data).map((key, index) => {
                      return (
                        <ListItem sx={{ padding: 0 }} key={index}>
                          <ListItemText>{key}</ListItemText>
                          <ListItemText>{obj.data[key]}</ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
                <Divider sx={{ marginBottom: 1 }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontSize={15} variant="h5">
                    Battery percentage
                  </Typography>
                  <CircularProgressWithLabel value={obj.battery} />
                </div>
              </Card>
              {obj.action.has_action && (
                <Card
                  sx={{
                    width: 343,
                    padding: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      padding: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">Action</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => updateSensorAction(obj)}
                        loadingPosition="end"
                      >
                        {obj.action.current_status ? "turn OFF" : "turn ON"}
                      </Button>
                    </div>
                    <Divider sx={{ marginTop: "10px" }} />
                    <p>
                      Current status:{" "}
                      <span
                        style={{
                          color: `${
                            obj.action.current_status ? "green" : "red"
                          }`,
                        }}
                      >
                        {obj.action.current_status ? "Running" : "Stop"}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Sensor;
