import Header from "../Components/Header";
import Footer from "../Components/Footer";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_store_pesanan, get_api_detail_pesanan, get_api_selesaikan_pesanan, get_public_url } from "../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DetailPesanan() {
  const data_params = useParams();
  const [levelUserLogin, setLevelUserLogin] = useState('');
  const [detailPesanan, setDetailPesananApi] = useState('');
  const [nomorMetodePembayaran, setNomorMetodePembayaran] = useState('');
  const [alamatDompet, setAlamatDompet] = useState('');
  const [txHash, setTxHash] = useState('');
  const [picture, SetPicture] = useState("");
  const [pictureText, SetPictureText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // Check is already login or not
  useEffect(() => {
    if (!localStorage._token && !localStorage._user) {
      navigate("/login");
    } else {
      getDetailPesanan();

      // set level
      var user_data = localStorage.getItem("_user");
      checkComponentLoginUser(user_data);
    }
  }, []);

  // function
  function checkComponentLoginUser(user_data) {
    var user_data_parse = JSON.parse(user_data);
    setLevelUserLogin(user_data_parse.level_users);
  }

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

  function formatRupiah(angka, prefix) {
    var isNegative = false;
    
    // Cek apakah angka negatif
    if (angka < 0) {
       isNegative = true;
       angka = Math.abs(angka);
    }
 
    var number_string = angka.toString().replace(/[^,\d]/g, "");
    var split = number_string.split(",");
    var sisa = split[0].length % 3;
    var rupiah = split[0].substr(0, sisa);
    var ribuan = split[0].substr(sisa).match(/\d{3}/gi);
 
    if (ribuan) {
       var separator = sisa ? "." : "";
       rupiah += separator + ribuan.join(".");
    }
 
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
 
    // Tambahkan tanda minus setelah "Rp." jika angka negatif
    if (isNegative) {
       rupiah = "Rp. -" + rupiah;
    } else {
       rupiah = "Rp. " + rupiah;
    }
 
    return prefix === undefined ? rupiah : rupiah ? rupiah : "";
   }

  function getDetailPesanan() {
    var token = localStorage.getItem("_token");

    var Form = new FormData();
    Form.append("token", token);
    Form.append("id_pesanan", data_params.id_pesanan);

    fetch(get_api_detail_pesanan, {
      method: "POST",
      body: Form,
    })
      .then(
        (response) => {
          return response.json();
        }
      )
      .then((data) => {
        if (data.status == 'success') {
          var data_pesanan = data.data;

          setAlamatDompet(data_pesanan.alamat_dompet);
          setTxHash(data_pesanan.tx_hash);
          setDetailPesananApi(data);
        } else {
          MySwal.fire({
            title: <strong>Maaf!</strong>,
            html: <p>{data.message}</p>,
            icon: 'warning'
          })

          // arahkan ke halaman utama dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      })
      .catch((error) => {
        MySwal.fire({
          title: <strong>Error Di Bagian Server</strong>,
          html: <p>{error.message}</p>,
          icon: 'error'
        })

        // arahkan ke halaman utama produk
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      });
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

    if(txHash == '') {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'TxHash harus di diisi!',
      });

      // enabled button
      document.getElementById("btn-beli").disabled = false;
      return;

    }

    var Form = new FormData();
    Form.append("token", localStorage._token);
    Form.append("id_pesanan", data_params.id_pesanan);
    Form.append("tx_hash", txHash);
    Form.append("bukti_transfer_admin", picture);

    MySwal.fire({
      title: "Apakah Anda yakin akan menyelesaikan pesanan ini?",
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Tidak!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(get_api_selesaikan_pesanan, {
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

                navigate("../", { state: { data: requestData } });
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
  // function NomorMetodePembayaranInput() {
  //   const nomorMetodePembayaranRef = useRef(nomorMetodePembayaran);
  
  //   // Update state only when needed
  //   const updateNomorMetodePembayaran = () => {
  //     setNomorMetodePembayaran(nomorMetodePembayaranRef.current.value);
  //   };
  
  //   return (
  //     <input 
  //       type="text" 
  //       readOnly
  //       id="nomor_metode_pembayaran" 
  //       className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold text-center fs-5" 
  //       placeholder="xx..............." 
  //       ref={nomorMetodePembayaranRef}
  //       defaultValue={nomorMetodePembayaran} // set the defaultValue to the current value of the state
  //     />
  //   );
  // }

  function TxHashInput({ readonly="true" }) {
    const txHashRef = useRef(txHash);
  
    // Update state only when needed
    const updateTxHash = () => {
      setTxHash(txHashRef.current.value);
    };
    
    if(readonly == "true") {
      return (
        <input 
          type="text" 
          id="tx_hash" 
          className="form-control bg-secondary-young border-3 border-black fw-bold text-center fs-5" 
          placeholder="Submit txhash" 
          ref={txHashRef}
          defaultValue={txHash} // set the defaultValue to the current value of the state
          readOnly
        />
      );
    } else {
      return (
        <input 
          type="text" 
          id="tx_hash" 
          className="form-control bg-secondary-young border-3 border-black fw-bold text-center fs-5" 
          placeholder="Submit txhash" 
          ref={txHashRef}
          defaultValue={txHash} // set the defaultValue to the current value of the state
          onBlur={updateTxHash}
        />
      );
    }
  }

  function AlamatDompetInput() {
    const alamatDompetRef = useRef(alamatDompet);
  
    // Update state only when needed
    const updateAlamatDompet = () => {
      setNomorMetodePembayaran(alamatDompetRef.current.value);
    };
  
    return (
      <input 
        type="text" 
        readOnly
        id="alamat_dompet" 
        className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold text-center fs-5 w-50 rounded-0" 
        placeholder="xx..............." 
        ref={alamatDompetRef}
        defaultValue={alamatDompet} // set the defaultValue to the current value of the state
      />
    );
  }

  const ImageBukti = React.memo(({ src, alt }) => {
    return (
      <img src={src} className="image-bukti-transfer rounded border border-2 border-black" alt={alt} />
    );
  });

  function ContentComponent() {
    if(detailPesanan && detailPesanan.status == 'success') {
      var data_pesanan = detailPesanan.data;

      // check data pesanan berdasarkan status dan level user yang login
      if(data_pesanan.status_pesanan == 'Pending' && levelUserLogin == 'Admin') {
        return (
          <div className="container-fluid bg-white px-5 py-3" style={{ minHeight: "90vh" }}>
          <div className="row">
            <div className="col-12 py-3">
              <p className="fw-bold fs-3 m-0 text-start">Pesanan Dibuat Pada : {data_pesanan.tgl_waktu_pemesanan}</p>
            </div>
            <div className="col-12">
              <p className="fw-bold fs-4 text-start m-0">{data_pesanan.item_pesanan[0].produk.title_produk}</p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Jaringan : <span>{data_pesanan.item_pesanan[0].jaringan_produk.title_jaringan_produk}</span></p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Nominal : <span>{formatRupiah(data_pesanan.item_pesanan[0].stok_produk.title_stok_produk, '')}</span></p>
              <p className="fw-medium fs-5 text-start m-0">Metode Pembayaran : <span>{data_pesanan.item_pesanan[0].metode_pembayaran_produk.title_metode_pembayaran_produk}</span></p>
              <div className="fw-medium fs-5 text-start m-0 row p-0"> 
                <div className="col-2 fw-bold p-0 d-flex align-items-center">Alamat Dompet :</div>
                <div className="col-10 p-0 d-flex">
                  <AlamatDompetInput />
                  <button className="btn border-2 border-black bg-secondary-young rounded-0" onClick={(e) => {copyText('alamat_dompet')}}><FontAwesomeIcon icon="fa-solid fa-copy" size="2xl" /></button>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <p className="fw-bold fs-4 text-start m-0">Bukti Transfer User</p>
              <div className="col-md-4 col-sm-12 col-12 mt-3 d-flex justify-content-start">
                <ImageBukti src={`${get_public_url}/uploads/bukti_transfer_user/${data_pesanan.bukti_transfer_user}`} alt={`*Gambar Bukti Transfer User`} />
              </div>
            </div>
            <div className="col-12 mt-3">
              <p className="fw-bold fs-4 text-start m-0">TxHash :</p>
              <div className="w-100 mt-3">
                <TxHashInput readonly="false" />
              </div>
            </div>
            <div className="col-12 mt-3 row">
              <div className="col-12">
                <p className="fw-bold fs-4 text-start m-0">Bukti Transfer :</p>
              </div>
              <div className="col-md-4 col-sm-12 col-1 mt-2">
                <input type="file" className="form-control bg-body-secondary fw-bold d-none" id="picture_bukti_transfer" onChange={(e) =>handleFileInputChange(e)} />
                <div className="d-flex">
                  <div className="form-control border-2 border border-black fw-bold mb-3 me-4">
                    <label htmlFor="picture_bukti_transfer_temp" className="d-flex justify-content-between align-items-center fs-5 m-0" style={{ cursor: "pointer" }}>
                      {selectedFileName ? selectedFileName : "....................."}
                    </label>
                    <input type="file" id="picture_bukti_transfer_temp" className="d-none" onChange={(e) => handleFileInputChange(e)} />
                  </div>
                  <FontAwesomeIcon icon="fa-solid fa-file-arrow-up" size="3x" />
                </div>
              </div>            
            </div>
            <div className="col-12 border-2 border-top border-black py-4 px-5">
              <button type="button" id="btn-beli" className="btn btn-success-young btn-lg border-2 border border-black container-fluid fs-4 fw-bold" role="button" onClick={(e) => {store_pesanan()}} style={{ paddingInline: "0.7rem", paddingBlock: "0.7em"}}>Submit</button>
            </div>
          </div>
        </div>
        );
      } else if(data_pesanan.status_pesanan == 'Selesai' && levelUserLogin == 'Admin') {
        return (
          <div className="container-fluid bg-white px-5 py-3 mb-5" style={{ minHeight: "90vh" }}>
          <div className="row">
            <div className="col-12 py-3">
              <p className="fw-bold fs-3 m-0 text-start">Pesanan Dibuat Pada : {data_pesanan.tgl_waktu_pemesanan}</p>
            </div>
            <div className="col-12">
              <p className="fw-bold fs-4 text-start m-0">{data_pesanan.item_pesanan[0].produk.title_produk}</p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Jaringan : <span>{data_pesanan.item_pesanan[0].jaringan_produk.title_jaringan_produk}</span></p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Nominal : <span>{formatRupiah(data_pesanan.item_pesanan[0].stok_produk.title_stok_produk, '')}</span></p>
              <p className="fw-medium fs-5 text-start m-0">Metode Pembayaran : <span>{data_pesanan.item_pesanan[0].metode_pembayaran_produk.title_metode_pembayaran_produk}</span></p>
              <div className="fw-medium fs-5 text-start m-0 row p-0"> 
                <div className="col-2 fw-bold p-0 d-flex align-items-center">Alamat Dompet :</div>
                <div className="col-10 p-0 d-flex">
                  <AlamatDompetInput />
                  <button className="btn border-2 border-black bg-secondary-young rounded-0" onClick={(e) => {copyText('alamat_dompet')}}><FontAwesomeIcon icon="fa-solid fa-copy" size="2xl" /></button>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <p className="fw-bold fs-4 text-start m-0">Bukti Transfer User</p>
              <div className="col-md-4 col-sm-12 col-12 mt-3 d-flex justify-content-start">
                <ImageBukti src={`${get_public_url}/uploads/bukti_transfer_user/${data_pesanan.bukti_transfer_user}`} alt={`*Gambar Bukti Transfer User`} />
              </div>
            </div>
          </div>
        </div>
        );
      } else if(levelUserLogin == 'Pengguna') {
        return (
          <div className="container-fluid bg-white px-5 py-3 mb-5" style={{ minHeight: "90vh" }}>
          <div className="row">
            <div className="col-12 py-3">
              <p className="fw-bold fs-3 m-0 text-start">Pesanan Dikirim Pada : {data_pesanan.tgl_waktu_selesai}</p>
            </div>
            <div className="col-12">
              <p className="fw-bold fs-4 text-start m-0">{data_pesanan.item_pesanan[0].produk.title_produk}</p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Jaringan : <span>{data_pesanan.item_pesanan[0].jaringan_produk.title_jaringan_produk}</span></p>
              <p className="fw-medium fs-5 text-start m-0 mt-2">Nominal : <span>{formatRupiah(data_pesanan.item_pesanan[0].stok_produk.title_stok_produk, '')}</span></p>
              <p className="fw-medium fs-5 text-start m-0">Metode Pembayaran : <span>{data_pesanan.item_pesanan[0].metode_pembayaran_produk.title_metode_pembayaran_produk}</span></p>
              <div className="fw-medium fs-5 text-start m-0 row p-0"> 
                <div className="col-2 fw-bold p-0 d-flex align-items-center">Alamat Dompet :</div>
                <div className="col-10 p-0 d-flex">
                  <AlamatDompetInput />
                  <button className="btn border-2 border-black bg-secondary-young rounded-0" onClick={(e) => {copyText('alamat_dompet')}}><FontAwesomeIcon icon="fa-solid fa-copy" size="2xl" /></button>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <p className="fw-bold fs-4 text-start m-0">Bukti Transfer Admin</p>
              <div className="col-md-4 col-sm-12 col-12 mt-3 d-flex justify-content-start">
                <ImageBukti src={`${get_public_url}/uploads/bukti_transfer_admin/${data_pesanan.bukti_transfer_admin}`} alt={`*Gambar Bukti Transfer Admin`} />
              </div>
            </div>
            <div className="col-12 mt-3">
              <p className="fw-bold fs-4 text-start m-0">TxHash :</p>
              <div className="w-100 mt-3">
                <TxHashInput readonly="true" />
              </div>
            </div>
          </div>
        </div>
        );
      }
      
    } else {
      return(
        <div className="container-fluid bg-white px-5 mt-5" style={{ minHeight: "90vh" }}>
          <h1 className="mx-auto">Tidak Ada Data</h1>
        </div>
      );
    }
  }

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <ContentComponent />
      {/* Content End */}

      <Footer />
    </div>
  );
}

export default DetailPesanan;