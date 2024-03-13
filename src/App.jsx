import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/AuthenticationPage";
import ChatPage from "./Pages/ChatPage";
import SecureRoute from "./Routes/SecureRoute";
import ChatProvider from "./Context/ChatProvider";
import ErrorPage from "./Pages/ErrorPage";
import theme from "./theme/theme.js";

function App() {
  return (
    <div className="App">
      <ChatProvider theme={theme}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/chats"
            element={
              <SecureRoute>
                <ChatPage />
              </SecureRoute>
            }
          ></Route>
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
