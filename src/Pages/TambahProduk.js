import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_create_produk, get_api_store_produk, get_public_url } from "../Utils/Utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TambahProduk() {
  const data_params = useParams();
  const [isEdit, setIsEdit] = useState("false");
  const [createProdukAPI, setCreateProdukAPI] = useState([]);
  const [namaProduk, setNamaProduk] = useState('');
  const [deskripsiProduk, setDeskripsiProduk] = useState('');
  const [idStokProduk, setIdStokProduk] = useState([0]);
  const [idStokProdukIsEdit, setIdStokProdukIsEdit] = useState(['false']);
  const [namaStokProduk, setNamaStokProduk] = useState([]);
  const [jumlahStokProduk, setJumlahStokProduk] = useState([]);
  const [hargaStokProduk, setHargaStokProduk] = useState([]);
  const [idMetodePembayaranProduk, setIdMetodePembayaranProduk] = useState([0]);
  const [idMetodePembayaranProdukIsEdit, setIdMetodePembayaranProdukIsEdit] = useState(['false']);
  const [namaMetodePembayaranProduk, setNamaMetodePembayaranProduk] = useState([]);
  const [nomorMetodePembayaranProduk, setNomorMetodePembayaranProduk] = useState([]);
  const [atasNamaMetodePembayaranProduk, setAtasNamaMetodePembayaranProduk] = useState([]);
  const [idJaringanProduk, setIdJaringanProduk] = useState([0]);
  const [idJaringanProdukIsEdit, setIdJaringanProdukIsEdit] = useState(['false']);
  const [namaJaringanProduk, setNamaJaringanProduk] = useState([]);
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
      getCreateProduk();
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
       rupiah = "-" + rupiah;
    } else {
       rupiah = "" + rupiah;
    }
 
    return prefix === undefined ? rupiah : rupiah ? rupiah : "";
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

  // handle data stok produk
  const addIdStokProduk = () => {
    // hanya digunakan untuk menambahkan data baru

    setIdStokProduk(prevList => [...prevList, idStokProduk.length]);
    idStokProdukIsEdit.push('false');
  };

  const deleteIdStokProduk = (index) => {
    if(index == null) {
      return;
    }

    // hanya digunakan untuk menghapus data baru
    setIdStokProduk(prevList => prevList.filter((_, i) => i !== index));
    setIdStokProdukIsEdit(prevList => prevList.filter((_, i) => i !== index));
    setNamaStokProduk(prevList => prevList.filter((_, i) => i !== index));
    setJumlahStokProduk(prevList => prevList.filter((_, i) => i !== index));
    setHargaStokProduk(prevList => prevList.filter((_, i) => i !== index));
  };

  // handle data metode pembayaran produk
  const addIdMetodePembayaranProduk = () => {
    if(isEdit === 'true') {
      return;
    }

    // hanya digunakan untuk menambahkan data baru
    setIdMetodePembayaranProduk(prevList => [...prevList, idMetodePembayaranProduk.length]);
    idMetodePembayaranProdukIsEdit.push('false');
  };

  const deletedIdMetodePembayaranProduk = (index) => {
    if(index == null || isEdit === 'true') {
      return;
    }

    // hanya digunakan untuk menghapus data baru
    setIdMetodePembayaranProduk(prevList => prevList.filter((_, i) => i !== index));
    setIdMetodePembayaranProdukIsEdit(prevList => prevList.filter((_, i) => i !== index));
    setNamaMetodePembayaranProduk(prevList => prevList.filter((_, i) => i !== index));
    setNomorMetodePembayaranProduk(prevList => prevList.filter((_, i) => i !== index));
    setAtasNamaMetodePembayaranProduk(prevList => prevList.filter((_, i) => i !== index));
  };

  // handle data jaringan produk
  const addIdJaringanProduk = () => {
    if(isEdit === 'true') {
      return;
    }

    // hanya digunakan untuk menambahkan data baru
    setIdJaringanProduk(prevList => [...prevList, idJaringanProduk.length]);
    idJaringanProdukIsEdit.push('false');
  };

  const deletedIdJaringanProduk = (index) => {
    if(index == null || isEdit === 'true') {
      return;
    }

    // hanya digunakan untuk menghapus data baru
    setIdJaringanProduk(prevList => prevList.filter((_, i) => i !== index));
    setIdJaringanProdukIsEdit(prevList => prevList.filter((_, i) => i !== index));
    setNamaJaringanProduk(prevList => prevList.filter((_, i) => i !== index));
  };

  function mapDataFromDatabase(data) {
    var idStokProdukTemp = [];
    var idMetodePembayaranProdukTemp = [];
    var idJaringanProdukTemp = [];

    setNamaProduk(data.data.title_produk);
    setDeskripsiProduk(data.data.description_produk);

    if(data.status == 'success' && data.data.stok_produk.length) {
      idStokProdukIsEdit.splice(0, idStokProdukIsEdit.length);
      namaStokProduk.splice(0, namaStokProduk.length);
      jumlahStokProduk.splice(0, jumlahStokProduk.length);
      hargaStokProduk.splice(0, hargaStokProduk.length);

      data.data.stok_produk.forEach(element => {
        idStokProdukTemp.push(element.id_stok_produk);
        idStokProdukIsEdit.push('true');
        namaStokProduk.push(element.title_stok_produk);
        jumlahStokProduk.push(element.jumlah_stok_produk);
        hargaStokProduk.push(element.harga_stok_produk);
      });

      setIdStokProduk(idStokProdukTemp);
    }

    if(data.status == 'success' && data.data.metode_pembayaran_produk.length) {
      idMetodePembayaranProdukIsEdit.splice(0, idMetodePembayaranProdukIsEdit.length);
      namaMetodePembayaranProduk.splice(0, namaMetodePembayaranProduk.length);
      nomorMetodePembayaranProduk.splice(0, nomorMetodePembayaranProduk.length);
      atasNamaMetodePembayaranProduk.splice(0, atasNamaMetodePembayaranProduk.length);

      data.data.metode_pembayaran_produk.forEach(element => {
        idMetodePembayaranProdukTemp.push(element.id_metode_pembayaran_produk);
        idMetodePembayaranProdukIsEdit.push('true');
        namaMetodePembayaranProduk.push(element.title_metode_pembayaran_produk);
        nomorMetodePembayaranProduk.push(element.nomor_metode_pembayaran_produk);
        atasNamaMetodePembayaranProduk.push(element.atas_nama_metode_pembayaran_produk);
      });

      setIdMetodePembayaranProduk(idMetodePembayaranProdukTemp);
    }

    if(data.status == 'success' && data.data.jaringan_produk.length) {
      idJaringanProdukIsEdit.splice(0, idJaringanProdukIsEdit.length);
      namaJaringanProduk.splice(0, namaJaringanProduk.length);

      data.data.jaringan_produk.forEach(element => {
        idJaringanProdukTemp.push(element.id_jaringan_produk);
        idJaringanProdukIsEdit.push('true');
        namaJaringanProduk.push(element.title_jaringan_produk);
      });

      setIdJaringanProduk(idJaringanProdukTemp);
    }
  }

  function getCreateProduk() {
    var token = localStorage.getItem("_token");
    var isEditTemp = isEdit;

    // check apakah data edit atau tidak
    if(parseInt(data_params.id_produk)) {
      setIsEdit("true");
      isEditTemp = "true";
    }

    if(isEditTemp === 'false') {
      return;
    }

    var Form = new FormData();
    Form.append("token", token);
    Form.append("is_edit", isEditTemp);
    Form.append("id_produk", data_params.id_produk);

    fetch(get_api_create_produk, {
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
          // map data from database
          mapDataFromDatabase(data);

          setCreateProdukAPI(data);
        } else {
          MySwal.fire({
            title: <strong>Maaf!</strong>,
            html: <p>{data.message}</p>,
            icon: 'warning'
          });
        }
      })
      .catch((error) => {
        MySwal.fire({
          title: <strong>Error Di Bagian Server</strong>,
          html: <p>{error.message}</p>,
          icon: 'error'
        });
      });
  }

  function store_pesanan() {
    // disabled button
    document.getElementById("btn-submit").disabled = true;

    if(!picture && isEdit === 'false') {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gambar harus di diisi!',
      });

      // enabled button
      document.getElementById("btn-submit").disabled = false;
      return;
    }

    if(!namaProduk) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Nama produk harus di diisi!',
      });

      // enabled button
      document.getElementById("btn-submit").disabled = false;
      return;
    }

    if(!deskripsiProduk) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Deskripsi produk harus di diisi!',
      });

      // enabled button
      document.getElementById("btn-submit").disabled = false;
      return;
    }

    for(let i = 0; i < idStokProduk.length; i++) {
      if(!namaStokProduk[i] || !namaStokProduk[i].replace(/\D/g, '')) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Nama stok produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }

      if(!jumlahStokProduk[i]) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Jumlah stok produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }
    }

    for(let i = 0; i < idMetodePembayaranProduk.length; i++) {
      if(!namaMetodePembayaranProduk[i]) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Nama metode pembayaran produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }

      if(!nomorMetodePembayaranProduk[i]) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Nomor metode pembayaran produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }

      if(!atasNamaMetodePembayaranProduk[i]) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Atas nama metode pembayaran produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }
    }
    
    for(let i = 0; i < idJaringanProduk.length; i++) {
      if(!namaJaringanProduk[i]) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Nama jaringan produk harus di diisi!',
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
        return;
      }
    }

    var Form = new FormData();
    Form.append("token", localStorage._token);
    Form.append("id_produk", data_params.id_produk);
    Form.append("title_produk", namaProduk);
    Form.append("description_produk", deskripsiProduk);
    Form.append("picture_produk", picture);

    // Assuming idStokProduk is an array
    idStokProduk.forEach(function(item, index) {
        Form.append(`id_stok_produk[${index}]`, item);
    });

    idStokProdukIsEdit.forEach(function(item, index) {
        Form.append(`id_stok_produk_is_edit[${index}]`, item);
    });

    // Similar for other array fields
    namaStokProduk.forEach(function(item, index) {
        Form.append(`title_stok_produk[${index}]`, item);
    });

    jumlahStokProduk.forEach(function(item, index) {
        Form.append(`jumlah_stok_produk[${index}]`, item);
    });

    hargaStokProduk.forEach(function(item, index) {
        Form.append(`harga_stok_produk[${index}]`, item);
    });

    // If id_metode_pembayaran_produk is also an array, you need to handle it similarly
    idMetodePembayaranProduk.forEach(function(item, index) {
        Form.append(`id_metode_pembayaran_produk[${index}]`, item);
    });

    idMetodePembayaranProdukIsEdit.forEach(function(item, index) {
        Form.append(`id_metode_pembayaran_produk_is_edit[${index}]`, item);
    });

    // If title_metode_pembayaran_produk is also an array, you need to handle it similarly
    namaMetodePembayaranProduk.forEach(function(item, index) {
        Form.append(`title_metode_pembayaran_produk[${index}]`, item);
    });

    // If nomor_metode_pembayaran_produk is also an array, you need to handle it similarly
    nomorMetodePembayaranProduk.forEach(function(item, index) {
        Form.append(`nomor_metode_pembayaran_produk[${index}]`, item);
    });

    // If atas_nama_metode_pembayaran_produk is also an array, you need to handle it similarly
    atasNamaMetodePembayaranProduk.forEach(function(item, index) {
        Form.append(`atas_nama_metode_pembayaran_produk[${index}]`, item);
    });

    // If id_jaringan_produk is also an array, you need to handle it similarly
    idJaringanProduk.forEach(function(item, index) {
        Form.append(`id_jaringan_produk[${index}]`, item);
    });

    idJaringanProdukIsEdit.forEach(function(item, index) {
        Form.append(`id_jaringan_produk_is_edit[${index}]`, item);
    });

    // If title_jaringan_produk is also an array, you need to handle it similarly
    namaJaringanProduk.forEach(function(item, index) {
        Form.append(`title_jaringan_produk[${index}]`, item);
    });


    MySwal.fire({
      title: "Apakah Anda yakin akan menyelesaikan pesanan ini?",
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Tidak!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(get_api_store_produk, {
          method: "POST",
          body: Form,
        })
          .then((response) => response.json())
          .then((data) => {
            // enabled button
            document.getElementById("btn-submit").disabled = false;

            if (data.status === "success") {
              MySwal.fire({
                title: <strong>{data.message}</strong>,
                html: <p>Klik oke, dan kami akan mengarahkan kamu ke halaman dashboard</p>,
                icon: 'success'
              }).then(() => {
                const requestData = {
                  tab_selected: "produk",
                };
                navigate("/dashboard", { state: { data: requestData } });
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
            document.getElementById("btn-submit").disabled = false;
          });
      } else {
        MySwal.fire({
          title: <strong>Dibatalkan!</strong>,
          text: "Aksi dibatalkan!",
          icon: "error",
        });

        // enabled button
        document.getElementById("btn-submit").disabled = false;
      }
    });
  }

  // component
  function NamaProdukInput() {
    const namaProdukRef = useRef(namaProduk);
  
    // Update state only when needed
    const updateNamaProduk = () => {
      if (namaProdukRef.current.value != namaProduk) {
        setNamaProduk(namaProdukRef.current.value);
      }
    };
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id="nama_produk" 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Masukkan Nama" 
          ref={namaProdukRef}
          defaultValue={namaProduk} // set the defaultValue to the current value of the state
          onBlur={updateNamaProduk}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id="nama_produk" 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Masukkan Nama" 
          ref={namaProdukRef}
          defaultValue={namaProduk} // set the defaultValue to the current value of the state
        />
      );
    }
  }

  function DeskripsiProdukInput() {
    const deskripsiProdukRef = useRef(deskripsiProduk);
  
    // Update state only when needed
    const updateDeskripsiProduk = () => {
      if(deskripsiProdukRef.current.value != deskripsiProduk) {
        setDeskripsiProduk(deskripsiProdukRef.current.value);
      }
    };
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id="deskripsi_produk" 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Masukkan Deskripsi" 
          ref={deskripsiProdukRef}
          defaultValue={deskripsiProduk} // set the defaultValue to the current value of the state
          onBlur={updateDeskripsiProduk}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id="deskripsi_produk" 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Masukkan Deskripsi" 
          ref={deskripsiProdukRef}
          defaultValue={deskripsiProduk} // set the defaultValue to the current value of the state
        />
      );
    }
  }

  function NamaStokProdukInput({index}) {
    let getNamaStokProduk = namaStokProduk[index] ? namaStokProduk[index] : '';
    const namaStokProdukRef = useRef(getNamaStokProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getNamaStokProduk);
  
    // Update state only when needed
    const updateNamaStokProduk = () => {
      let valueNamaStokProduk = namaStokProdukRef.current.value.replace(/\D/g, '');

      if(valueNamaStokProduk != getNamaStokProduk) {
        namaStokProduk[index] = valueNamaStokProduk;
        hargaStokProduk[index] = valueNamaStokProduk;
      }
    }

    // handle input temp
    const handleKeyUp = (event) => {
      const formattedValue = event.target.value.replace(/\D/g, '');
      if(formattedValue != namaStokProduk) {
        setInputValueTemp(formattedValue);
      }
    }
    
    return (
      <input 
        type="text"
        id={`nama_stok_produk_${index}`} 
        className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
        placeholder="25000" 
        ref={namaStokProdukRef}
        defaultValue={formatRupiah(getNamaStokProduk, "")}
        onBlur={updateNamaStokProduk}
        // onChange={handleKeyUp}
      />
    );
  }

  function JumlahStokProdukInput({index}) {
    let getJumlahStokProduk = jumlahStokProduk[index] ? jumlahStokProduk[index] : '';
    const jumlahStokProdukRef = useRef(getJumlahStokProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getJumlahStokProduk);
  
    // Update state only when needed
    const updateState = () => {
      let valueJumlahStokProduk = jumlahStokProdukRef.current.value.replace(/\D/g, '');

      if(valueJumlahStokProduk != getJumlahStokProduk) {
        jumlahStokProduk[index] = valueJumlahStokProduk;
      }
    }

    // handle input temp
    const handleKeyUp = (event) => {
      const formattedValue = event.target.value.replace(/\D/g, '');
      if(formattedValue != jumlahStokProduk) {
        setInputValueTemp(formattedValue);
      }
    }
    
    return (
      <input 
        type="text"
        id={`jumlah_stok_produk_${index}`} 
        className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
        placeholder="100" 
        ref={jumlahStokProdukRef}
        defaultValue={formatRupiah(getJumlahStokProduk, "")}
        onBlur={updateState}
        // onChange={handleKeyUp}
      />
    );
  }


  function NamaMetodePembayaranInput({index}) {
    let getNamaMetodePembayaranProduk = namaMetodePembayaranProduk[index] ? namaMetodePembayaranProduk[index] : '';
    const namaMetodePembayaranProdukRef = useRef(getNamaMetodePembayaranProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getNamaMetodePembayaranProduk);
  
    // Update state only when needed
    const updateState = () => {
      let valueNamaMetodePembayaranProduk = namaMetodePembayaranProdukRef.current.value;

      if(valueNamaMetodePembayaranProduk != getNamaMetodePembayaranProduk) {
        namaMetodePembayaranProduk[index] = valueNamaMetodePembayaranProduk;
      }
    }
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id={`nama_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="DANA" 
          ref={namaMetodePembayaranProdukRef}
          defaultValue={getNamaMetodePembayaranProduk}
          onBlur={updateState}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id={`nama_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="DANA" 
          ref={namaMetodePembayaranProdukRef}
          defaultValue={getNamaMetodePembayaranProduk}
        />
      );
    }
  }

  function NomorMetodePembayaranInput({index}) {
    let getNomorMetodePembayaranProduk = nomorMetodePembayaranProduk[index] ? nomorMetodePembayaranProduk[index] : '';
    const nomorMetodePembayaranProdukRef = useRef(getNomorMetodePembayaranProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getNomorMetodePembayaranProduk);
  
    // Update state only when needed
    const updateState = () => {
      let valueNomorMetodePembayaranProduk = nomorMetodePembayaranProdukRef.current.value;

      if(valueNomorMetodePembayaranProduk != getNomorMetodePembayaranProduk) {
        nomorMetodePembayaranProduk[index] = valueNomorMetodePembayaranProduk;
      }
    }
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id={`nomor_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="0123456789" 
          ref={nomorMetodePembayaranProdukRef}
          defaultValue={getNomorMetodePembayaranProduk}
          onBlur={updateState}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id={`nomor_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="0123456789" 
          ref={nomorMetodePembayaranProdukRef}
          defaultValue={getNomorMetodePembayaranProduk}
        />
      );
    }
  }

  function AtasNamaMetodePembayaranInput({index}) {
    let getAtasNamaMetodePembayaranProduk = atasNamaMetodePembayaranProduk[index] ? atasNamaMetodePembayaranProduk[index] : '';
    const atasNamaMetodePembayaranProdukRef = useRef(getAtasNamaMetodePembayaranProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getAtasNamaMetodePembayaranProduk);
  
    // Update state only when needed
    const updateState = () => {
      let valueAtasNamarMetodePembayaranProduk = atasNamaMetodePembayaranProdukRef.current.value;

      if(valueAtasNamarMetodePembayaranProduk != getAtasNamaMetodePembayaranProduk) {
        atasNamaMetodePembayaranProduk[index] = valueAtasNamarMetodePembayaranProduk;
      }
    }
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id={`nomor_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Rifqi" 
          ref={atasNamaMetodePembayaranProdukRef}
          defaultValue={getAtasNamaMetodePembayaranProduk}
          onBlur={updateState}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id={`nomor_metode_pembayaran_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="Rifqi" 
          ref={atasNamaMetodePembayaranProdukRef}
          defaultValue={getAtasNamaMetodePembayaranProduk}
        />
      );
    }
  }

  function NamaJaringanProdukInput({index}) {
    let getNamaJaringanProduk = namaJaringanProduk[index] ? namaJaringanProduk[index] : '';
    const namaJaringanProdukRef = useRef(getNamaJaringanProduk);
    const [inputValueTemp, setInputValueTemp] = useState(getNamaJaringanProduk);
  
    // Update state only when needed
    const updateState = () => {
      let valueNamaJaringanProduk = namaJaringanProdukRef.current.value;

      if(valueNamaJaringanProduk != getNamaJaringanProduk) {
        namaJaringanProduk[index] = valueNamaJaringanProduk;
      }
    }
    
    if(isEdit === 'false') {
      return (
        <input 
          type="text"
          id={`nama_jaringan_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="BEP20" 
          ref={namaJaringanProdukRef}
          defaultValue={getNamaJaringanProduk}
          onBlur={updateState}
        />
      );
    } else {
      return (
        <input 
          type="text"
          readOnly
          id={`nama_jaringan_produk_${index}`} 
          className="form-control form-control-sm bg-secondary-young border-3 border-black fw-bold fs-5 placeholder-start" 
          placeholder="BEP20" 
          ref={namaJaringanProdukRef}
          defaultValue={getNamaJaringanProduk}
        />
      );
    }
  }

  function StokContentMap({idStokProduk}) {
    if(idStokProduk.length) {
      return idStokProduk.map((value, index) => {
        if(index == idStokProduk.length - 1) {
          return (
            <div className="col-md-6 col-sm-12 col-12 row py-2" key={index}>
              <div className="col-md-6 col-sm-12 col-12">
                <NamaStokProdukInput index={index} />
              </div>
              <div className="col-md-6 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Stok: </span>
                <JumlahStokProdukInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-plus" size="3x" className="ps-3" onClick={addIdStokProduk} />
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="col-md-6 col-sm-12 col-12 row py-2">
              <div className="col-md-6 col-sm-12 col-12">
                <NamaStokProdukInput index={index} />
              </div>
              <div className="col-md-6 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Stok: </span>
                <JumlahStokProdukInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-trash-can" size="3x" className="ps-3" onClick={() => deleteIdStokProduk(index)}  />
              </div>
            </div>
          );  
        }
      });
    }
  }

  function MetodePembayaranContentMap({idMetodePembayaranProduk}) {
    if(idMetodePembayaranProduk.length) {
      return idMetodePembayaranProduk.map((value, index) => {
        if(index == idMetodePembayaranProduk.length - 1) {
          return (
            <div className="col-md-12 col-sm-12 col-12 row py-2" key={index}>
              <div className="col-md-4 col-sm-12 col-12">
                <NamaMetodePembayaranInput index={index} />
              </div>
              <div className="col-md-4 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Nomor: </span>
                <NomorMetodePembayaranInput index={index} />
              </div>
              <div className="col-md-4 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Nama: </span>
                <AtasNamaMetodePembayaranInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-plus" size="3x" className="ps-3" onClick={addIdMetodePembayaranProduk} />
              </div>
            </div>
          );
        } else {
          return (
            <div className="col-md-12 col-sm-12 col-12 row py-2" key={index}>
              <div className="col-md-4 col-sm-12 col-12">
                <NamaMetodePembayaranInput index={index} />
              </div>
              <div className="col-md-4 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Nomor: </span>
                <NomorMetodePembayaranInput index={index} />
              </div>
              <div className="col-md-4 col-sm-12 col-12 d-flex">
                <span className="fs-4 fw-bold pe-3">Nama: </span>
                <AtasNamaMetodePembayaranInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-trash-can" size="3x" className="ps-3" onClick={() => deletedIdMetodePembayaranProduk(index)}  />
              </div>
            </div>
          );  
        }
      });
    }
  }

  function JaringanProdukContentMap({idJaringanProduk}) {
    if(idJaringanProduk.length) {
      return idJaringanProduk.map((value, index) => {
        if(index == idJaringanProduk.length - 1) {
          return (
            <div className="col-md-12 col-sm-12 col-12 row py-2" key={index}>
              <div className="col-md-12 col-sm-12 col-12 d-flex">
                <NamaJaringanProdukInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-plus" size="3x" className="ps-3" onClick={addIdJaringanProduk} />
              </div>
            </div>
          );
        } else {
          return (
            <div className="col-md-12 col-sm-12 col-12 row py-2" key={index}>
              <div className="col-md-12 col-sm-12 col-12 d-flex">
                <NamaJaringanProdukInput index={index} />
                <FontAwesomeIcon icon="fa-solid fa-trash-can" size="3x" className="ps-3" onClick={() => deletedIdJaringanProduk(index)}  />
              </div>
            </div>
          );  
        }
      });
    }
  }

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="container-fluid bg-light px-5 py-5" style={{ minHeight: "90vh"}}>
        <div className="row bg-white border border-2 border-black">
          <div className="col-12 py-3 border-2 border-bottom border-black">
            <h1 className="fw-bold m-0 text-center">Tambahkan Coin</h1>
          </div>
          <div className="col-12 mt-3 px-5">
            <p className="fw-bold fs-4 text-start m-0">Nama <span className="fs-3 required_field">*</span> </p>
            <div className="w-100 mt-2">
              <NamaProdukInput />
            </div>
          </div>
          <div className="col-12 mt-3 px-5">
            <p className="fw-bold fs-4 text-start m-0">Deskripsi <span className="fs-3 required_field">*</span> </p>
            <div className="w-100 mt-2">
              <DeskripsiProdukInput />
            </div>
          </div>
          <div className="col-12 mt-3 px-5">
            <p className="fw-bold fs-4 text-start m-0">Tambahkan Nominal <span className="fs-3 required_field">*</span> </p>
            <div className="w-100 mt-2 row container-stok-content">
              <StokContentMap idStokProduk={idStokProduk} />
            </div>
          </div>
          <div className="col-12 mt-3 px-5">
            <p className="fw-bold fs-4 text-start m-0">Tambahkan Metode Pembayaran <span className="fs-3 required_field">*</span> </p>
            <div className="w-100 mt-2 row container-metode-pembayaran">
              <MetodePembayaranContentMap idMetodePembayaranProduk={idMetodePembayaranProduk} />
            </div>
          </div>
          <div className="col-12 mt-3 px-5">
            <p className="fw-bold fs-4 text-start m-0">Tambahkan Jaringan <span className="fs-3 required_field">*</span> </p>
            <div className="w-100 mt-2 row container-jaringan">
              <JaringanProdukContentMap idJaringanProduk={idJaringanProduk} />
            </div>
          </div>
          <div className="col-12 mt-3 row px-5">
            <div className="col-12">
              <p className="fw-bold fs-4 text-start m-0">Tambahkan Gambar :</p>
            </div>
            <div className="col-md-4 col-sm-12 col-1 mt-2">
              <input type="file" className="form-control bg-body-secondary fw-bold d-none" id="picture_produk" onChange={(e) =>handleFileInputChange(e)} />
              <div className="d-flex">
                <div className="form-control border-2 border border-black fw-bold mb-3 me-4">
                  <label htmlFor="picture_produk_temp" className="d-flex justify-content-between align-items-center fs-5 m-0" style={{ cursor: "pointer" }}>
                    {selectedFileName ? selectedFileName : "....................."}
                  </label>
                  <input type="file" id="picture_produk_temp" className="d-none" onChange={(e) => handleFileInputChange(e)} />
                </div>
                <FontAwesomeIcon icon="fa-solid fa-file-arrow-up" size="3x" />
              </div>
            </div>            
          </div>
          <div className="col-12 py-4 px-5">
              <button type="button" id="btn-submit" className="btn btn-success-young btn-lg border-2 border border-black container-fluid fs-4 fw-bold" role="button" onClick={(e) => {store_pesanan()}} style={{ paddingInline: "0.7rem", paddingBlock: "0.7em"}}>Submit</button>
          </div>
        </div>
      </div>
      {/* Content End */}

      <Footer />
    </div>
  );
}

export default TambahProduk;