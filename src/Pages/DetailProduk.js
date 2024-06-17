import Header from "../Components/Header";
import Footer from "../Components/Footer";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_detail_produk, get_public_url } from "../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DetailProduk() {
  const data_params = useParams();
  const [detailProdukApi, setDetailProdukApi] = useState([]);
  const [namaProduk, setNamaProduk] = useState('');
  const [pilihJaringan, setPilihJaringan] = useState(0);
  const [pilihJaringanText, setPilihJaringanText] = useState('');
  const [pilihStok, setPilihStok] = useState(0);
  const [pilihStokText, setPilihStokText] = useState('');
  const [pilihStokJumlahStok, setPilihStokJumlahStok] = useState(0);
  const [pilihStokJumlahStokAll, setPilihStokJumlahStokAll] = useState([]);
  const [pilihStokNominalHarga, setPilihStokNominalHarga] = useState(0);
  const [pilihStokNominalHargaAll, setPilihStokNominalHargaAll] = useState([]);
  const [pilihMetodePembayaran, setPilihMetodePembayaran] = useState(0);
  const [pilihMetodePembayaranText, setPilihMetodePembayaranText] = useState('');
  const [pilihMetodePembayaranAtasNama, setPilihMetodePembayaranAtasNama] = useState('');
  const [pilihMetodePembayaranAtasNamaAll, setPilihMetodePembayaranAtasNamaAll] = useState([]);
  const [pilihMetodePembayaranNomor, setPilihMetodePembayaranNomor] = useState('');
  const [pilihMetodePembayaranNomorAll, setPilihMetodePembayaranNomorAll] = useState([]);
  const [qtyPesanan, setQtyPesanan] = useState(0);
  const [alamatDompet, setAlamatDompet] = useState('');
  const [totalHarga, setTotalHarga] = useState(0);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // Check is already login or not
  useEffect(() => {
    if (!localStorage._token && !localStorage._user) {
      navigate("/login");
    } else {
      getDetailProduk();
    }
  }, []);


  // function
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

  function checkOnClickButtonPilih(context_button, id_data, text_button) {
    if(context_button == 'pilih-jaringan') {
      if(pilihJaringan && parseInt(id_data) == parseInt(pilihJaringan)) {
        setPilihJaringan(0);
        setPilihJaringanText('');
      } else {
        setPilihJaringan(id_data);
        setPilihJaringanText(text_button);
      }
    } else if(context_button == 'pilih-stok') {
      if(pilihStok && parseInt(id_data) == parseInt(pilihStok)) {
        setPilihStok(0);
        setPilihStokText('');
        setPilihStokJumlahStok(0);
        setPilihStokNominalHarga(0);
      } else {
        setPilihStok(id_data);
        setPilihStokText(text_button);

        // get stok terkait
        setPilihStokJumlahStok(pilihStokJumlahStokAll[id_data]);
        setPilihStokNominalHarga(pilihStokNominalHargaAll[id_data]);
      }
    } else if (context_button == 'pilih-metode-pembayaran') {
      if(pilihMetodePembayaran && parseInt(id_data) == parseInt(pilihMetodePembayaran)) {
        setPilihMetodePembayaran(0);
        setPilihMetodePembayaranText('');
        setPilihMetodePembayaranAtasNama('');
        setPilihMetodePembayaranNomor('');
      } else {
        setPilihMetodePembayaran(id_data);
        setPilihMetodePembayaranText(text_button);

        // get metode pembayaran terkait
        setPilihMetodePembayaranAtasNama(pilihMetodePembayaranAtasNamaAll[id_data]);
        setPilihMetodePembayaranNomor(pilihMetodePembayaranNomorAll[id_data]);
      }

    }
  }

  function checkQtyPilih(event, from) {
    var qtyPesananSekarang = qtyPesanan;

    // ketika nominal belum dipilih kosong
    if(!pilihStok) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>Nominal Harus Dipilih!</p>,
        icon: 'warning'
      });
      return;
    }

    if(from == 'tombol-kurang') {
      // ketika kurang dari 0
      if(qtyPesananSekarang-1 < 0) {
        MySwal.fire({
          title: <strong>Maaf!</strong>,
          html: <p>QTY Tidak Boleh Kurang Dari 0!</p>,
          icon: 'warning'
        });
        return;
      }

      // kurangi qty pesanan
      qtyPesananSekarang -= 1;

      setQtyPesanan(qtyPesananSekarang);
      setTotalHarga(qtyPesananSekarang * pilihStokNominalHarga);
    } else if(from == 'tombol-tambah') {
      // ketika melebihi stok
      if(qtyPesananSekarang+1 > pilihStokJumlahStok) {
        MySwal.fire({
          title: <strong>Maaf!</strong>,
          html: <p>QTY Tidak Boleh Lebih Dari Stok!</p>,
          icon: 'warning'
        });
        return;
      }

      // tambah qty pesanan
      qtyPesananSekarang += 1;

      setQtyPesanan(qtyPesananSekarang);
      setTotalHarga(qtyPesananSekarang * pilihStokNominalHarga);
    } else if(from == 'kolom-qty-pesanan-input') {
      var nominal_qty_pilih = parseInt(event.target.value.replace(/\D/g, '')) || 0;
      qtyPesananSekarang = nominal_qty_pilih;

      // ganti dengan nominal yang benar
      setQtyPesanan(qtyPesananSekarang);

      if(qtyPesananSekarang > pilihStokJumlahStok) {
        MySwal.fire({
          title: <strong>Maaf!</strong>,
          html: <p>QTY Tidak Boleh Lebih Dari Stok!</p>,
          icon: 'warning'
        });

        // ganti dengan nominal yang benar (stok)
        setQtyPesanan(pilihStokJumlahStok);
        qtyPesananSekarang = pilihStokJumlahStok;
      }

      setTotalHarga(qtyPesananSekarang * pilihStokNominalHarga);
    }
  }

  // Get data dashboard from API
  function getDetailProduk() {
    var token = localStorage.getItem("_token");

    var Form = new FormData();
    Form.append("token", token);
    Form.append("id_produk", data_params.id_produk);

    fetch(get_api_detail_produk, {
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
          setNamaProduk(data.data.title_produk);
          setDetailProdukApi(data);
        } else {
          MySwal.fire({
            title: <strong>Maaf!</strong>,
            html: <p>{data.message}</p>,
            icon: 'warning'
          })

          // arahkan ke halaman utama produk
          setTimeout(() => {
            navigate("/produk");
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
          navigate("/produk");
        }, 1000);
      });
  }

  function checkoutPage() {

    // Validate data start
    if(!pilihJaringan) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>Jaringan Harus Dipilih!</p>,
        icon: 'warning'
      });
      return;
    }
    if(!pilihStok) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>Nominal Harus Dipilih!</p>,
        icon: 'warning'
      });
      return;
    }
    if(!pilihMetodePembayaran) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>Metode Pembayaran Harus Dipilih!</p>,
        icon: 'warning'
      });
      return;
    }
    if(!qtyPesanan || qtyPesanan <= 0) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>QTY Harus Diisi Lebih Dari 0!</p>,
        icon: 'warning'
      });
      return;
    }
    if(qtyPesanan > pilihStokJumlahStok) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>QTY Tidak Boleh Lebih Dari Stok!</p>,
        icon: 'warning'
      });
      return;
    }
    if(!alamatDompet) {
      MySwal.fire({
        title: <strong>Maaf!</strong>,
        html: <p>Alamat Dompet Harus Diisi!</p>,
        icon: 'warning'
      });
      return;
    }
    // Validate data end

    const requestData = {
      id_produk: data_params.id_produk,
      nama_produk: namaProduk,
      id_jaringan: pilihJaringan,
      title_jaringan_produk: pilihJaringanText,
      id_stok: pilihStok,
      title_stok_produk: pilihStokText,
      harga_stok_produk: pilihStokNominalHarga,
      id_metode_pembayaran: pilihMetodePembayaran,
      title_metode_pembayaran_produk: pilihMetodePembayaranText,
      atas_nama_metode_pembayaran: pilihMetodePembayaranAtasNama,
      nomor_metode_pembayaran: pilihMetodePembayaranNomor,
      qty_pesanan: qtyPesanan,
      alamat_dompet: alamatDompet,
      total_harga: totalHarga
    };

    MySwal.fire({
      title: "Apakah anda yakin akan melajutkan ke halaman checkout?",
      text: "Jika sudah di halaman checkout, anda tidak dapat kembali lagi ke halaman ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/checkout', { state: { data: requestData } });        
      } else {
        MySwal.fire({
          title: <strong>Maaf!</strong>,
          html: <p>Aksi ke halaman checkout dibatalkan!</p>,
          icon: 'warning'
        });
      }
    });
  }

  // component
  // Update state only when needed
  function AlamatDompet() {
    const alamatDompetRef = useRef(alamatDompet);
  
    // Update state only when needed
    const updateAlamatDompet = () => {
      setAlamatDompet(alamatDompetRef.current.value);
    };
  
    return (
      <input 
        type="text" 
        id="alamat_dompet" 
        className="form-control bg-secondary-young border-0 text-center fs-4" 
        placeholder="0x..............." 
        ref={alamatDompetRef}
        defaultValue={alamatDompet} // set the defaultValue to the current value of the state
        onBlur={updateAlamatDompet} // update state when input loses focus
      />
    );
  }

  const ButtonPilih = React.memo(({ id_data, context_button, text_button}) => {
    var warna_button = "btn-secondary-young";
  
    if(context_button == 'pilih-jaringan' && pilihJaringan && parseInt(id_data) == parseInt(pilihJaringan)) {
      warna_button = "btn-secondary";
    } else if(context_button == 'pilih-stok' && pilihStok && parseInt(id_data) == parseInt(pilihStok)) {
      warna_button = "btn-secondary";
    } else if(context_button == 'pilih-metode-pembayaran' && pilihMetodePembayaran && parseInt(id_data) == parseInt(pilihMetodePembayaran)) {
      warna_button = "btn-secondary";
    }
  
    return (
      <button 
        type="button" 
        id={`btn-toggle-${context_button}-${id_data}`} 
        className={`btn ${warna_button} btn-lg btn-${context_button}`} 
        role="button" 
        onClick={(e) => checkOnClickButtonPilih(context_button, id_data, text_button)} 
        style={{ paddingInline: "0.7rem", paddingBlock: "0.7em", width: "170px"}} 
        key={`btn-toggle-${context_button}-${id_data}`}
      >
        {text_button}
      </button>
    );
  });

  function ButtonPilihJaringan({ data }) {
    if(data.length) {
      return data.map((value, index) => {
        return (
          <div className="col-md-6 col-sm-6 col-12 p-3" key={`container-pilih-jaringan-${index}`}>
            <ButtonPilih id_data={`${value.id_jaringan_produk}`} context_button="pilih-jaringan" text_button={`${value.title_jaringan_produk}`} />
          </div>
        );
      });
    }
  }

  function ButtonPilihStok({ data }) {
    if(data.length) {
      return data.map((value, index) => {
        // map data stok all
        pilihStokJumlahStokAll[value.id_stok_produk] = value.jumlah_stok_produk;
        pilihStokNominalHargaAll[value.id_stok_produk] = value.harga_stok_produk;
        return (
          <div className="col-md-6 col-sm-6 col-12 p-3" key={`container-pilih-stok-${index}`}>
            <ButtonPilih id_data={`${value.id_stok_produk}`} context_button="pilih-stok" text_button={`${value.title_stok_produk}`} />
          </div>
        );
      });
    }
  }

  function ButtonPilihMetodePembayaran({ data }) {
    if(data.length) {
      return data.map((value, index) => {
        pilihMetodePembayaranNomorAll[value.id_metode_pembayaran_produk] = value.nomor_metode_pembayaran_produk;
        pilihMetodePembayaranAtasNamaAll[value.id_metode_pembayaran_produk] = value.atas_nama_metode_pembayaran_produk;
        return (
          <div className="col-md-6 col-sm-6 col-12 p-3" key={`container-pilih-metode-pembayaran-${index}`}>
            <ButtonPilih id_data={`${value.id_metode_pembayaran_produk}`} context_button="pilih-metode-pembayaran" text_button={`${value.title_metode_pembayaran_produk}`} />
          </div>
        );
      });
    }
  }

  function TextJaringanStokDipilih() {
    if(pilihJaringanText || pilihStokText) {
      return (
        <p className="fs-4 mt-2 fw-medium text-start">{pilihJaringanText}, {pilihStokText}</p>
      );
    } else {
      return (
        <p className="fs-4 mt-2 fw-medium text-start"></p>
      );
    }
  }

  const ImageProduk = React.memo(({ src, alt }) => {
    return (
      <img src={src} className="image-campaign-main rounded" alt={alt} />
    );
  });
  
  function ContentDetailProduk() {
    if (detailProdukApi && detailProdukApi.status == "success") {
      // Map Table
      return (
        <div className="wrapper-data mt-5 mb-5 row">
            <div className="col-md-4 col-sm-12 col-12">
              <div className="px-5 px-0-small">
                <div className="d-flex justify-content-center py-5 rounded-5" style={{ backgroundColor: "#121214" }}>
                <ImageProduk src={`${get_public_url}/uploads/picture_produk/${detailProdukApi.data.picture_produk}`} alt={`*Gambar Produk`} />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12 text-start">
              <h1 className="fw-bold">{namaProduk}</h1>
              <div className="container-fluid p-0 mt-3 container-pilih-jaringan">
                <p className="fw-bold fs-4 m-0">Pilih jaringan: </p>
                <div className="row">
                  <ButtonPilihJaringan data={detailProdukApi.data.jaringan_produk} />
                </div>
              </div>
              <div className="container-fluid p-0 mt-3 container-pilih-nominal">
                <p className="fw-bold fs-4 m-0">Pilih nominal: </p>
                <div className="row">
                  <ButtonPilihStok data={detailProdukApi.data.stok_produk} />
                </div>
              </div>
              <div className="container-fluid p-0 mt-3 container-deskripsi">
                <p className="fw-bold fs-4 m-0">Deskripsi: </p>
                <p className="fs-5 mt-2">{detailProdukApi.data.description_produk}</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="row border border-2 border-black p-3">
                <div className="col-12">
                  <p className="fw-bold fs-4 m-0 text-start">Atur jumlah dan masukkan alamat dompet: </p>
                </div>
                <div className="col-12">
                  <TextJaringanStokDipilih />
                </div>
                <div className="col-12 mt-3 row">
                  <div className="col-6">
                    <div className="row border-2 bg-secondary-young rounded-2 p-2">
                      <div className="col-3 d-flex justify-content-center align-items-center">
                        <FontAwesomeIcon icon="fa-solid fa-minus" size="xl" onClick={(e) => {checkQtyPilih(e, 'tombol-kurang')}} onMouseDown={(e) => e.preventDefault()}  style={{ cursor: "pointer" }} />
                      </div>
                      <div className="col-6">
                        <input type="text" id="qty_pesanan_input" className="form-control bg-secondary-young border-0 text-center fs-4" value={qtyPesanan} placeholder="0" onKeyDown={(e) => {const val = e.target.value; if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete' && !(e.key === '.' && !val.includes('.')) && !(e.key === '-' && val.length === 0)) {e.preventDefault();}}} onPaste={(e) => {const paste = e.clipboardData.getData('Text'); if (isNaN(paste) || paste.includes('-') || (paste.match(/\./g) || []).length > 1) {e.preventDefault();}}} onChange={(e) => {checkQtyPilih(e, 'kolom-qty-pesanan-input')}} />
                      </div>
                      <div className="col-3 d-flex justify-content-center align-items-center">
                        <FontAwesomeIcon icon="fa-solid fa-plus" size="xl" onClick={(e) => {checkQtyPilih(e, 'tombol-tambah')}} onMouseDown={(e) => e.preventDefault()} style={{ cursor: "pointer" }} />
                      </div>
                    </div>
                  </div>
                  <div className="col-6 d-flex justify-content-center align-items-center">
                    <p className="m-0 fs-4">Stok: <span className="text-stok">{pilihStokJumlahStok}</span></p>
                  </div>
                </div>
                <div className="col-12 mt-4">
                  <p className="fw-medium fs-4 m-0 text-start">Alamat Dompet: </p>
                </div>
                <div className="col-12 mt-3 p-0">
                  <AlamatDompet />
                </div>
                <div className="col-12 mt-4">
                  <p className="fw-medium fs-4 m-0 text-start">Pilih metode pembayaran : </p>
                </div>
                <div className="col-12 mt-3 p-0 row">
                  <ButtonPilihMetodePembayaran  data={detailProdukApi.data.metode_pembayaran_produk} />
                </div>
                <div className="col-12 mt-4 d-flex justify-content-between">
                  <p className="fw-bold fs-4 m-0 text-start">Total : </p>
                  <p className="fw-bold fs-4 m-0 text-end text-total-harga">{formatRupiah(totalHarga, 'Rp. ')}</p>
                </div>
                <div className="col-12 mt-4 d-flex ">
                  <button type="button" id="btn-beli" className="btn btn-success-young btn-lg container-fluid fs-4 fw-bold" role="button" onClick={checkoutPage} style={{ paddingInline: "0.7rem", paddingBlock: "0.7em"}}>Beli</button>
                </div>
              </div>
            </div>
          </div>
      );
    } else {
      // Map Table
      return (
        <div className="wrapper-data mt-5">
          <h1 className="mx-auto">Tidak Ada Data</h1>
        </div>
      );
    }
  }

  return (
    
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="bg-white px-5" style={{ minHeight: "90vh"}}>
        <ContentDetailProduk />
      </div>
      {/* Content End */}

      <Footer />
    </div>
  );
}

export default DetailProduk;