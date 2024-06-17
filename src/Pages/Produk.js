import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_index_produk, get_public_url } from "../Utils/Utils";

function Produk() {
  // left getter, rigth setter
  const [produkApi, produkAPI] = useState("");
  const [status_aktif, SetStatusAktif] = useState("All");
  const navigate = useNavigate();
  // const handleAll = () => SetStatusAktif("All");
  // const handleExpired = () => SetStatusAktif("Expired");

  // Check is already login or not
  useEffect(() => {
    if (!localStorage._token && !localStorage._user) {
      navigate("/login");
    } else {
      getProduk();
    }
  }, []);

  // data change base on setStatusChange
  useEffect(() => {
    getProduk();
  }, [status_aktif]);

  // Get data dashboard from API
  function getProduk() {
    var token = localStorage.getItem("_token");

    var Form = new FormData();
    Form.append("token", token);

    fetch(get_api_index_produk, {
      method: "POST",
      body: Form,
    })
      .then(
        (response) => {
          return response.json();
        }
      )
      .then((data) => {
        produkAPI(data);
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

  function ContentCard() {
    if (produkApi && produkApi.status == "success") {
      return produkApi.data.map((value, index) => {
        return (
          <div className="col-md-4 col-sm-6 col-12 d-flex justify-content-center p-5" key={index}>
            <div className="card rounded-4" style={{ width: "25rem", backgroundColor: "#121214" }}>
              <div className="p-3 d-flex justify-content-center">
                <img src={`${get_public_url}/uploads/picture_produk/${value.picture_produk}`} className="image-campaign-main rounded" alt={`*Gambar ${value.title_produk}`} />
              </div>
              <div className="card-body">
                <h5 className="card-title text-white card-title-main-campaign text-center">{value.title_produk}</h5>
                <div className="container-fluid p-0 mt-3">
                  <button type="submit" className="btn btn-light d-block w-100 fw-bold" onClick={(e) => { navigate("/produk/detail/" + value.id_produk) }} style={{ color: "#F7A600" }}>Detail</button>
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="px-5 fw-bold text-center" style={{ cursor: "pointer" }}>
          Tidak ada data produk
        </div>
      );
    }
  }

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="container-fluid bg-white text-start mt-4" style={{ minHeight: "100vh" }}>
        <div className="col-md-12 col-sm-12 px-1">
          <h2 className="mx-5 fw-bold" style={{ textAlign: "center" }}>
            Toko Coin
          </h2>
        </div>

        {/* Content Card */}
        <div className="row px-5">
          <ContentCard />
        </div>
      </div>

      {/* Content End */}


      <Footer />
    </div>
  );
}

export default Produk;
