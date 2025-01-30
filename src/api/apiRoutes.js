const apiRoutes = {
  signup: "/auth/signup", // body - name, email, password
  signin: "/auth/signin", // body - email, password,

  getSensors: "/sensor",
  updateAction: "/sensor/action", // params - sensor id | body -  currentState: bool
  updateData: "/sensor/data", // params - sensor id | body - sensorData: (object which contains sensor data)
};

export default apiRoutes;
