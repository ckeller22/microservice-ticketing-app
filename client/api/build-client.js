import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // On server

    return axios.create({
      baseURL: "http://www.tixgit.website/",
      headers: req.headers,
    });
  } else {
    // In browser

    return axios.create({});
  }
};

export default buildClient;
