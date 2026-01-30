import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import ChatBotPage from './Components/ChatBotPage';
import FileUploadComponent from './Components/FileUploadComponent';
import PrivateRoute from './Components/PrivateRoute';

function App() {

  console.log("HIiii")
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/chat" element={<PrivateRoute><ChatBotPage/></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
