const apiRoutes = {
  signup: "/auth/signup", // body - name, email, password
  signin: "/auth/signin", // body - email, password,

  getSensors: "/sensor",
  breach: "/breach",
  action: "/action", // body - currentStatus, params - action_id
};

export default apiRoutes;
