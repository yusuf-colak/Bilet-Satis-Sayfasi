import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginBilgileriContext } from "../context/LoginBilgileri";

import "react-toastify/dist/ReactToastify.css";

import "./CSS/LoginPage.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";

interface LoginFormState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

const LoginPage: React.FC = () => {
  const { loginBilgileri, setLoginBilgileri } = useContext(
    LoginBilgileriContext
  );
  const [loginStatus, setLoginStatus] = useState<
    "none" | "loading" | "success" | "failure"
  >("none");

  const [hataliGiris, setHataliGiris] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (loginStatus === "loading") {
      // İsterseniz yükleme durumunu gösteren bir tost mesajı ekleyebilirsiniz
    } else if (loginStatus === "success") {
      notifySuccess();
      navigate("/");
    } else if (loginStatus === "failure") {
      notifyFail();
    }
  }, [loginStatus]);
  const notifyFail = () =>
    toast.warn("Kullanıcı adı veya şifre hatalı!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifySuccess = () =>
    toast.success("Giriş başarılı!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [formData, setFormData] = useState<LoginFormState>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    id: "",
  });

  useEffect(() => {
    // Retrieve username and password from localStorage if available
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    // Update the formData state if the values are available in localStorage
    if (savedUsername && savedPassword) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: savedUsername,
        password: savedPassword,
      }));
      // Perform automatic login using the saved credentials
      handleLogin(savedUsername, savedPassword);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (username: string, password: string) => {
    // API çağrısı yapmadan önce login durumunu "loading" olarak ayarlayın
    setLoginStatus("loading");

    axios
      .post("login/user", { username, password })
      .then((response) => {
        if (response.status === 200) {
          console.log("Giriş başarılı:", response.data.firstName);

          setLoginBilgileri({
            username: response.data.username,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            password: response.data.password,
            id: response.data.id,
          });
          setLoginStatus("success");
        } else {
          console.log("Giriş başarısız!");
          setLoginStatus("failure");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("Kullanıcı adı veya şifre hatalı!");
          setHataliGiris("Kullanıcı adı veya şifre hatalı!");
          // Giriş durumunu "failure" olarak güncelleyin
          setLoginStatus("failure");
        } else {
          console.error("Hata:", error.message);
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleLogin(formData.username, formData.password);
  };

  const handleLogout = () => {
    // Remove username and password from localStorage on logout
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    // Perform any other logout operations you may have
    // For example, resetting the loginBilgileri context state.
  };

  return (
    <div id="Login-MainContainer">
      <div id="Login-Container">
        <div>
          <h2 id="LoginYazisi">Login</h2>
        </div>
        <div id="Login-Form">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username: Deneme1 veya kayıt olabilirsin</label>
              <InputText
                placeholder="Username"
                className="w-full mb-3"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Password: 123456</label>
              <InputText
                placeholder="Password"
                className="w-full mb-3"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {hataliGiris ? (
              <Message id="Message" severity="warn" text={hataliGiris} />
            ) : null}
            <div>
              <Button
                id="Login-Button"
                icon="pi pi-user"
                className="w-full"
                type="submit"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
