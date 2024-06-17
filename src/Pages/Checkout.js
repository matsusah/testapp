import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_store_pesanan, get_public_url } from "../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Checkout() {
  const location = useLocation();
  const data_request = location.state.data;
  const [nomorMetodePembayaran, setNomorMetodePembayaran] = useState(data_request.nomor_metode_pembayaran);
  const [picture, SetPicture] = useState("");
  const [pictureText, SetPictureText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // Check is already login or not
  useEffect(() => {
    if (!localStorage._token && !localStorage._user) {
      navigate("/login");
    }
  }, []);

  // function
  function copyText(id_input) {
    var copyText = document.getElementById(id_input);
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    MySwal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Text berhasil di copy',
    });
  }

  function handleFileInputChange(e) {
    const file = e.target.files[0]; // Ambil file yang dipilih oleh pengguna
    if (file) {
      SetPicture(file);
      // Buat objek FileReader
      const reader = new FileReader();

      // Tentukan apa yang terjadi ketika file selesai dibaca
      reader.onloadend = () => {
        // Ambil konten dari file dan simpan ke state picture
        SetPictureText(reader.result);
      };

      const selectedFile = e.target.files[0];
      setSelectedFileName(selectedFile ? selectedFile.name : "");
      // Jika upload gambar maka nama file yang diupload akan muncul

      // Baca konten file sebagai URL data
      reader.readAsDataURL(file);
    }
  }

  function store_pesanan() {
    // disabled button
    document.getElementById("btn-beli").disabled = true;

    if(!picture) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Bukti transfer harus di diisi!',
      });

      // enabled button
      document.getElementById("btn-beli").disabled = false;
      return;
    }

    var Form = new FormData();
    Form.append("token", localStorage._token);
    Form.append("token_creator", localStorage._token);
    Form.append("id_pesanan", "0");
    Form.append("alamat_dompet", data_request.alamat_dompet);
    Form.append("bukti_transfer_user", picture);
    Form.append("id_item_pesanan", "0");
    Form.append("produk_id", data_request.id_produk);
    Form.append("stok_produk_id", data_request.id_stok);
    Form.append("jaringan_produk_id", data_request.id_jaringan);
    Form.append("metode_pembayaran_produk_id", data_request.id_metode_pembayaran);
    Form.append("qty_pesanan", data_request.qty_pesanan);

    MySwal.fire({
      title: "Apakah Anda yakin akan menyelesaikan pesanan ini?",
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Tidak!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(get_api_store_pesanan, {
          method: "POST",
          body: Form,
        })
          .then((response) => response.json())
          .then((data) => {
            // enabled button
            document.getElementById("btn-beli").disabled = false;

            if (data.status === "success") {
              MySwal.fire({
                title: <strong>{data.message}</strong>,
                html: <p>Klik oke, dan kami akan mengarahkan kamu ke halaman dashboard</p>,
                icon: 'success'
              }).then(() => {
                const requestData = {
                  tab_selected: "pesanan",
                };
                navigate("../dashboard", { state: { data: requestData } });
              })
            } else {
              MySwal.fire({
                title: <strong>Maaf!</strong>,
                html: <p>{data.message}</p>,
                icon: 'error'
              });
            }
          }).catch((error) => {
            MySwal.fire({
              title: <strong>Error Di Bagian Server</strong>,
              html: <p>{error.message}</p>,
              icon: 'error'
            });

            // enabled button
            document.getElementById("btn-beli").disabled = false;
          });
      } else {
        MySwal.fire({
          title: <strong>Dibatalkan!</strong>,
          text: "Aksi dibatalkan!",
          icon: "error",
        });

        // enabled button
        document.getElementById("btn-beli").disabled = false;
      }
    });
  }

  // component
  function NomorMetodePembayaranInput() {
    const nomorMetodePembayaranRef = useRef(nomorMetodePembayaran);
  
    // Update state only when needed
    const updateNomorMetodePembayaran = () => {
      setNomorMetodePembayaran(nomorMetodePembayaranRef.current.value);
    };
  
    return (
      <input 
        type="text" 
        readOnly
        id="nomor_metode_pembayaran" 
        className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold text-center fs-5" 
        placeholder="xx..............." 
        ref={nomorMetodePembayaranRef}
        defaultValue={nomorMetodePembayaran} // set the defaultValue to the current value of the state
      />
    );
  }

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="container-fluid bg-white px-5 py-5" style={{ minHeight: "90vh", maxWidth: "1000px" }}>
        <div className="row border border-2 border-black">
          <div className="col-12 py-3">
            <p className="fs-4 m-0 text-center">Checkout: </p>
          </div>
          <div className="col-12 border-2 border-top border-black py-4 px-5">
            <p className="fw-bold fs-5 text-start m-0">{data_request.nama_produk} </p>
            <p className="fw-medium fs-5 text-start m-0">Jaringan : <span>{data_request.title_jaringan_produk}</span></p>
            <p className="fw-medium fs-5 text-start m-0">Nominal : <span>{data_request.title_stok_produk}</span></p>
            <p className="fw-medium fs-5 text-start m-0">Metode Pembayaran : <span>{data_request.title_metode_pembayaran_produk}</span></p>
            <p className="fw-medium fs-5 text-start m-0">Alamat Dompet : <span>{data_request.alamat_dompet}</span></p>
          </div>
          <div className="col-12 border-2 border-top border-black py-4 px-5">
            <p className="fw-bold fs-4 text-start">Silahkan transfer ke nomor berikut   : </p>
            <p className="fw-bold fs-5 text-start m-0">Metode Pembayaran : <span>{data_request.title_metode_pembayaran_produk}</span></p>
            <p className="fw-bold fs-5 text-start m-0">Nama : <span>{data_request.atas_nama_metode_pembayaran}</span></p>
            <div className="fs-5 text-start m-0 row p-0"> 
              <div className="col-2 fw-bold p-0 d-flex align-items-center">Nomor :</div>
              <div className="col-6 p-0">
                <NomorMetodePembayaranInput />
              </div>
              <div className="col-4 p-0 px-4">
                <button className="btn" onClick={(e) => {copyText('nomor_metode_pembayaran')}}><FontAwesomeIcon icon="fa-solid fa-copy" size="2xl" /></button>
              </div>
            </div>
          </div>
          <div className="col-12 border-2 border-top border-black py-4 px-5">
            <input type="file" className="form-control bg-body-secondary fw-bold d-none" id="picture_bukti_transfer" onChange={(e) => handleFileInputChange(e)} />
            <div className="px-2">
              <div className="form-control border-2 border border-black fw-bold mb-3">
                <label htmlFor="picture_bukti_transfer_temp" className="d-flex justify-content-between align-items-center fs-5 m-0" style={{ cursor: "pointer" }}>
                  {selectedFileName ? selectedFileName : "Upload bukti transfer"}
                  <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" size="2xl" />
                </label>
                <input type="file" id="picture_bukti_transfer_temp" className="d-none" onChange={(e) => handleFileInputChange(e)} />
              </div>
            </div>
          </div>
          <div className="col-12 border-2 border-top border-black py-4 px-5">
            <button type="button" id="btn-beli" className="btn btn-success-young btn-lg border-2 border border-black container-fluid fs-4 fw-bold" role="button" onClick={(e) => {store_pesanan()}} style={{ paddingInline: "0.7rem", paddingBlock: "0.7em"}}>Selesaikan Pesanan</button>
          </div>
        </div>
      </div>
      {/* Content End */}

      <Footer />
    </div>
  );
}

export default Checkout;