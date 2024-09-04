import axios from "axios";
import { APIKEY } from "../constants";

export const apiCall = async (url: string, method: string) => {
  try {
    // Use axios to make api call
    const response = await axios({
      method: method,
      url: `${url}&appid=${APIKEY}`,
    });

    return {
      status: response?.status,
      data: response?.data,
      msg: response?.data?.msg || "",
    };
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
  }
};
