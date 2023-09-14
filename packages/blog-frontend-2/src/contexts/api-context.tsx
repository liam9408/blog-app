import * as React from "react";
import config from "../configs";
import ApiService from "../services/api.service";

const apiService = new ApiService(config.apiUrl);

export const ApiContext = React.createContext({} as ApiService);

const ApiContextProvider: React.FC = (props) => {
  return (
    <ApiContext.Provider value={apiService}>
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;
