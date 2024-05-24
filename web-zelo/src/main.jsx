import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./provider/authContext.jsx";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./configs/react-query";
import GroupProvider from "./provider/GroupProvider";

/* dotenv.config(); */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

//