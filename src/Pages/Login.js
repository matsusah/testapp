import Header from "./../Components/Header";
import Footer from "./../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_login } from "../Utils/Utils";

function Login() {

  // 
  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const navigate = useNavigate();

  // Check is already login or not
  useEffect(() => {
    if (localStorage._token && localStorage._user) {
      navigate("../");
      console.log("Ada");
    }
  }, []);
  // Check apakah token dan user tersimpan pada localstorage
  // Selanjutnya navigate ke halaman utama 


  function login(e) {
    e.preventDefault();
    if (password == "" || email == "") {
      const MySwal = withReactContent(Swal)
      MySwal.fire({
        title: <strong>Kesalahan Input</strong>,
        html: <i>Pastikan Input tidak kosong</i>,
        icon: 'error'
      })
      return false;
    }
    // Check jika pw/email kosong akan muncul pesan

    var Form = new FormData();
    Form.append("email", email);
    Form.append("password", password);

    fetch(get_api_login, {
      method: "POST",
      body: Form,
    })
      .then(
        (response) => {
          return response.json();
        }
      )
      //Jika respon sukses token dan user disimpan ke localstorage dan akan navigate ke home
      .then((data) => {
        if (data.status == 'success') {
          const MySwal = withReactContent(Swal)
          localStorage.setItem("_token", data.data.token);
          localStorage.setItem("_user", JSON.stringify(data.data));
          MySwal.fire({
            title: <strong>{data.message}</strong>,
            html: <p>Klik oke, dan kita akan mengarahkan kamu ke halaman home</p>,
            icon: 'success'
          }).then(() => {
            navigate("../");
          })
        } else {
          const MySwal = withReactContent(Swal)
          MySwal.fire({
            title: <strong>Error Di Bagian Server</strong>,
            html: <p>{data.message}</p>,
            icon: 'error'
          })
        }
      })
      .catch((error) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: <strong>Error Di Bagian Server</strong>,
          html: <p>{error.message}</p>,
          icon: 'error'
        })
      });
  }

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="wrapper-data container-fluid p-5 mt-5 mb-5">
        <div className="card w-25 mx-auto" style={{ minWidth: "270px" }}>
          <div className="card-body" style={{ backgroundColor: "F3F5F7" }}>
            <h2 className="card-title">LOGIN</h2>
            <form className="mt-4 mb-4 form-login">
              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label fw-bold">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onInput={(e) => { Setemail(e.target.value) }} />
              </div>
              <div className="mb-4 text-start">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input type="password" className="form-control" id="password" value={password} onInput={(e) => { Setpassword(e.target.value) }} />
              </div>

              <button type="submit" className="btn btn-dark d-block w-100 fw-bold" style={{ color: "#F7A600" }} onClick={(e) => { login(e) }}>LOGIN</button>

            </form>
            <span className="fw-bold" style={{ color: "#F7A600" }}>Don`t have account? <Link className="text-decoration-none text-dark fw-bold" to={"/signup"}>SIGN UP</Link></span>
          </div>
        </div>
      </div>
      {/* Content End */}

      <Footer />
    </div>
  );
}


export default Login;