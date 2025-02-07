import React, { useEffect, useState } from "react";
import "./Sensor.css";
import VideoComponent from "../../components/videoComponent";
import useApiInstance from "../../customHooks/useApiInstance.js";
import apiRoutes from "../../api/apiRoutes.js";
import { AxiosError } from "axios";
import { handleApiError, handleNetworkError } from "../../utils/handleError.js";
import { Button, Switch } from "@mui/material";
import { formatDateTime, formatTime } from "../../utils/functions.js";

const Sensor = () => {
  const [sensorList, setSensorList] = useState([]);
  const [breach, setBreach] = useState(0);
  const [deviceControlStatus, setDeviceControlStatus] = useState(false);
  const [deviceControlDoc, setDeviceControlDoc] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const apiInstance = useApiInstance();

  const fetchSensorDataAndBreach = async () => {
    try {
      // sensor data
      const sensorRes = await apiInstance.get(apiRoutes.getSensors);
      setSensorList(sensorRes.data.data);
      // breach data
      const breachRes = await apiInstance.get(apiRoutes.breach);
      setBreach(breachRes.data.data);
      console.log("sensor list : ", sensorRes.data.data);
      // console.log("Breach in last 24 hours : ", breachRes.data.data);
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

  const fetchDeviceControlStatus = async () => {
    try {
      const statusRes = await apiInstance.get(apiRoutes.action);
      setDeviceControlStatus(statusRes.data.data.current_status);
      setDeviceControlDoc(statusRes.data.data);
      console.log("status : ", statusRes.data.data.current_status);
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
        // console.log("unexpected error when fetch sensor data : ", error);
      }
    }
  };
  useEffect(() => {
    fetchSensorDataAndBreach();
    fetchDeviceControlStatus();
    const interval = setInterval(() => {
      console.log("Interval called");
      fetchSensorDataAndBreach();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const updateAction = async () => {
    try {
      const updateRes = await apiInstance.patch(
        apiRoutes.action + `/${deviceControlDoc._id}`,
        {
          currentStatus: !deviceControlStatus,
        }
      );
      setDeviceControlStatus(updateRes.data.data.current_status);
      console.log("status after update :", updateRes.data.data);
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

  const renderSensorData = (sensorList) => {
    return sensorList.map((sensor, index) => {
      return (
        <tr key={index}>
          <td>
            <div>
              <p className="sensor_name">{sensor.name}</p>
              <span className="sensor_time_label">Updated Data time</span>
              <p className="sensor_time"> {formatTime(sensor.updated_at)}</p>
            </div>
          </td>
          <td> {sensor.battery} %</td>
          <td>
            {" "}
            {sensor.type === "TEMPERATURE" ? (
              <span
                style={{
                  color: `${
                    sensor.data.value >= -5 && sensor.data.value <= 2
                      ? "Green"
                      : "Red"
                  }`,
                }}
              >
                {sensor.data.value} {sensor.data.unit}
              </span>
            ) : (
              <span
                style={{
                  color: `#77aaff`,
                }}
              >
                {sensor.data.value} {sensor.data.unit}
              </span>
            )}
          </td>
        </tr>
      );
    });
  };

  const downloadCSV = async (sensorList) => {
    const sensorData = await apiInstance.get(apiRoutes.sensorData);
    console.log("sensor data is here :", sensorData.data.data);

    for (const obj of sensorData.data.data) {
      const sensor = sensorList.filter((sensorObj) => {
        if (sensorObj._id === obj._id) {
          return sensorObj;
        }
      });

      const jsonData = obj.data.map((dataObj) => {
        return {
          time: formatDateTime(dataObj.timestamp),
          data: dataObj.data,
        };
      });
      console.log("sensor details : ", jsonData);

      const csvHeader = ["Date time,Data Value,Data Unit"];
      const csvRows = jsonData.map(
        (item) => `${item.time},${item.data.value},${item.data.unit}`
      );

      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${sensor[0].name}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="sensor_section">
      <div>
        <table className="srt">
          <thead>
            <tr>
              <th className="no-sort">Device name</th>
              <th aria-sort="ascending">
                Device Battery %<span aria-hidden="true"></span>
              </th>
              <th aria-sort="ascending">
                Gender<span aria-hidden="true"></span>
              </th>
            </tr>
          </thead>
          <tbody>{renderSensorData(sensorList)}</tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => downloadCSV(sensorList)}
          >
            Download
          </Button>
        </div>
      </div>
      <div>
        <VideoComponent width={"600px"} />
        <div style={{ marginTop: "10px" }}>
          Breach in last 24 hours:{" "}
          <span style={{ color: "red" }}>{breach}</span>
        </div>
        <div
          style={{ fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}
        >
          Device Control :{" "}
          <Switch
            checked={deviceControlStatus}
            onChange={(e) => updateAction()}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Sensor;
