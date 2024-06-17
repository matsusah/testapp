import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { get_api_index_dashboard, get_api_store_campaign } from "../Utils/Utils";
import TableCountCampaign from "../Components/TableCountCampaign";
import TableDataDashboard from "../Components/TableDataDashboard";

function Dashboard() {
  const location = useLocation();
  const data_request_location = location.state && location.state.data ? location.state.data : '';
  const [dashboardApi, setDashboardApi] = useState('');
  const [levelUserLogin, setLevelUserLogin] = useState('');
  const [levelUserLoginTampil, setLevelUserLoginTampil] = useState('');
  const [tabSelected, setTabSelected] = useState('request_airdrop');
  const [headerTableCampaignText, setHeaderTableCampaignText] = useState('');
  const [headerTablePesananText, setHeaderTablePesananText] = useState('');
  const [headerTableProdukText, setHeaderTableProdukText] = useState('');
  const [firstColumn, setFirstColumn] = useState(0);
  const [secondColumn, setSecondColumn] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [title, SetTitle] = useState("");
  const [description, SetDescription] = useState("");
  const [picture, SetPicture] = useState("");
  const [pictureText, SetPictureText] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Check is already login or not
  useEffect(() => {
    if (!localStorage._token && !localStorage._user) {
      navigate("/login");
    } else {
      // check apakah ada data dari location
      if(data_request_location != '') {
        setTabSelected(data_request_location.tab_selected);
      }
      
      getDashboard();

      // set level
      var user_data = localStorage.getItem("_user");
      checkComponentLoginUser(user_data);
    }
  }, []);

  // base dashboardAPI State
  useEffect(() => {
    if (dashboardApi && dashboardApi.status == 'success') {
      if (levelUserLogin == "Admin") {
        setFirstColumn(dashboardApi.data.request_accepted_count);
        setSecondColumn(dashboardApi.data.request_declined_count);
      } else {
        setFirstColumn(dashboardApi.data.request_submited_count);
        setSecondColumn(dashboardApi.data.request_accepted_count);
      }
    }
  }, [dashboardApi]);

  // function
  function checkComponentLoginUser(user_data) {
    var user_data_parse = JSON.parse(user_data);
    setLevelUserLogin(user_data_parse.level_users);
    if (user_data_parse.level_users == "Admin") {
      setLevelUserLoginTampil("Admin");
      setHeaderTableCampaignText('User Request Status');
      setHeaderTablePesananText('User Order');
      setHeaderTableProdukText('Daftar Produk');
    } else {
      setLevelUserLoginTampil("Users");
      setHeaderTableCampaignText('My Request Status');
      setHeaderTablePesananText('My Order Status');
      setHeaderTableProdukText('Daftar Produk');
    }
  }

  // Get data dashboard from API
  function getDashboard() {
    var token = localStorage.getItem("_token");

    var Form = new FormData();
    Form.append("token", token);

    fetch(get_api_index_dashboard, {
      method: "POST",
      body: Form,
    })
      .then(
        (response) => {
          return response.json();
        }
      )
      .then((data) => {
        if (data.status == true) {
          setDashboardApi(data);
        } else {
          setDashboardApi(data);
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

  function handleSubmitRequestForm(e) {
    e.preventDefault();

    if (title == "" || description == "" || picture == '') {
      const MySwal = withReactContent(Swal)
      MySwal.fire({
        title: <strong>Kesalahan Input</strong>,
        html: <i>Pastikan Input tidak kosong</i>,
        icon: 'error'
      })
      return false;
    }

    var token = localStorage.getItem("_token");

    var Form = new FormData();
    Form.append("edit", "false");
    Form.append("id", "0");
    Form.append("token", token);
    Form.append("title", title);
    Form.append("description", description);
    Form.append("picture", picture);


    fetch(get_api_store_campaign, {
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
          const MySwal = withReactContent(Swal)
          MySwal.fire({
            title: <strong>{data.message}</strong>,
            html: <p>Klik Oke, Modal Akan Tertutup</p>,
            icon: 'success'
          }).then(() => {
            window.location.reload();
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

  function handleConnectCustomInputFile() {
    document.getElementById('picture').click();
  }

  function resetInputModal() {
    SetTitle('');
    SetDescription('');
    SetPicture('');
  }

  function sendMessageSupport() {
    var no_hp_support = "6282140051717"

    window.open(`https://wa.me/${no_hp_support}`, '_blank')
  }

  // component
  function DataTableCampaignDashboard() {
    if (dashboardApi && dashboardApi.data.data_table_campaign.length > 0) {
      // Map Table
      return dashboardApi.data.data_table_campaign.map((value, index) => {
        return (
          <TableDataDashboard level_users={levelUserLogin} data={value} key={index} context_table={"data_table_campaign"} />
        );
      });
    } else {
      // Map Table
      return (
        <tr>
          <td colSpan={3} className="p-5 text-center">Tidak Ada Data</td>
        </tr>
      );
    }
  }


  function DataTablePesananDashboard() {
    if (dashboardApi && dashboardApi.data.data_table_pesanan.length > 0) {
      // Map Table
      return dashboardApi.data.data_table_pesanan.map((value, index) => {
        return (
          <TableDataDashboard level_users={levelUserLogin} data={value} key={index} context_table={"data_table_pesanan"} />
        );
      });
    } else {
      // Map Table
      return (
        <tr>
          <td colSpan={3} className="p-5 text-center">Tidak Ada Data</td>
        </tr>
      );
    }
  }

  function DataTableProdukDashboard() {
    if (dashboardApi && dashboardApi.data.data_table_produk.length > 0) {
      // Map Table
      return dashboardApi.data.data_table_produk.map((value, index) => {
        return (
          <TableDataDashboard level_users={levelUserLogin} data={value} key={index} context_table={"data_table_produk"} />
        );
      });
    } else {
      // Map Table
      return (
        <tr>
          <td colSpan={3} className="p-5 text-center">Tidak Ada Data</td>
        </tr>
      );
    }
  }

  const ButtonTab = React.memo(({id, contex_button, text_button, coL_button, target_tab}) => {
    var class_active = '';
    var selected = 'false';

    if(tabSelected == contex_button) {
      class_active = 'active';
      selected = 'true';
    }

    return (
      <button className={`nav-link text-dark ${coL_button} fw-bold ${class_active}`} id={`${id}`} data-bs-toggle="tab" data-bs-target={`#${target_tab}`}type="button" role="tab" aria-selected={`${selected}`}>{text_button}</button>
    );
  });

  function ButtonTabTableContent() {
    const content = useMemo(() => {
      if (levelUserLogin == "Admin") {
        return (
          <div className="nav nav-tabs row" id="nav-tab" role="tablist" style={{ paddingInline: "none" }}>
            <ButtonTab id="nav_request_airdrop_tab" contex_button="request_airdrop" text_button="Request Airdrop" coL_button="col-4" target_tab="request_airdrop_tab" />
            <ButtonTab id="nav_pesanan_tab" contex_button="pesanan" text_button="Pesanan" coL_button="col-4" target_tab="pesanan_tab" />
            <ButtonTab id="nav_produk_tab" contex_button="produk" text_button="Atur Produk" coL_button="col-4" target_tab="produk_tab" />
          </div>
        );
      } else {
        return (
          <div className="nav nav-tabs row" id="nav-tab" role="tablist" style={{ paddingInline: "none" }}>
              <ButtonTab id="nav_request_airdrop_tab" contex_button="request_airdrop" text_button="Request Airdrop" coL_button="col-6" target_tab="request_airdrop_tab" />
              <ButtonTab id="nav_pesanan_tab" contex_button="pesanan" text_button="Pesanan" coL_button="col-6" target_tab="pesanan_tab" />
          </div>
        );
      }
    }, [levelUserLogin]);

    return content;
  }

  const ContentBaseTab = React.memo(function ContentBaseTab() {
    var active_request_airdrop_tab = tabSelected == 'request_airdrop' ? 'show active' : '';
    var active_pesanan_tab = tabSelected == 'pesanan' ? 'show active' : '';
    var active_produk_tab = tabSelected == 'produk' ? 'show active' : '';

    if(levelUserLogin == "Admin") {
      return (
        <div className="tab-content" id="nav-tabContent">
          <div className={`tab-pane fade ${active_request_airdrop_tab} py-3`} id="request_airdrop_tab" role="tabpanel" tabIndex="0">
            <TableCountCampaign level_users={levelUserLogin} first_column={firstColumn} second_column={secondColumn} />
            <table className="table table-bordered border-black table-striped fs-3 fw-medium" style={{ marginTop: "7%" }}>
              <thead>
                <tr>
                  <th scope="col" colSpan={3} className="text-center" style={{ backgroundColor: "#F3F5F7" }}>{headerTableCampaignText}</th>
                </tr>
              </thead>
              <tbody>
                <DataTableCampaignDashboard />
              </tbody>
            </table>
            <div className="container-fluid d-flex justify-content-center mt-5 mb-5">
              <button type="button" className="btn btn-warning ms-md-3 fs-3 fw-bold d-block w-25" onClick={handleShow}>Request Form</button>
            </div>
          </div>
          <div className={`tab-pane fade ${active_pesanan_tab}`} id="pesanan_tab" role="tabpanel" tabIndex="0">
            <table className="table table-bordered border-black table-striped fs-3 fw-medium" style={{ marginTop: "2%" }}>
              <thead>
                <tr>
                  <th scope="col" colSpan={4} className="text-center" style={{ backgroundColor: "#F3F5F7" }}>{headerTablePesananText}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>No</th>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>Nama</th>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>Tanggal</th>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <DataTablePesananDashboard />
              </tbody>
            </table>
            {/* <div className="container-fluid d-flex justify-content-center mt-5 mb-5">
              <button type="button" className="btn btn-warning ms-md-3 fs-3 fw-bold d-block w-25" onClick={handleShow}>Request Form</button>
            </div> */}
          </div>
          <div className={`tab-pane fade ${active_produk_tab}`} id="produk_tab" role="tabpanel" tabIndex="0">
            <div className="container-fluid d-flex justify-content-center mt-5 mb-5">
              <button type="button" className="btn btn-success-young ms-md-3 fs-3 fw-bold d-block w-100" onClick={() => navigate("/dashboard/kelola-produk/0")}>Tambahkan Coin</button>
            </div>
            <table className="table table-bordered border-black table-striped fs-3 fw-medium" style={{ marginTop: "7%" }}>
              <thead>
                <tr>
                  <th scope="col" colSpan={3} className="text-center" style={{ backgroundColor: "#F3F5F7" }}>{headerTableProdukText}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>No</th>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>Nama</th>
                  <th scope="col" className="text-center" style={{ backgroundColor: "#F3F5F7" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <DataTableProdukDashboard />
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if(levelUserLogin == "Pengguna") {
      return (
        <div className="tab-content" id="nav-tabContent">
          <div className={`tab-pane fade ${active_request_airdrop_tab} py-3`} id="request_airdrop_tab" role="tabpanel" tabIndex="0">
            <TableCountCampaign level_users={levelUserLogin} first_column={firstColumn} second_column={secondColumn} />
            <table className="table table-bordered border-black table-striped fs-3 fw-medium" style={{ marginTop: "7%" }}>
              <thead>
                <tr>
                  <th scope="col" colSpan={3} className="text-center" style={{ backgroundColor: "#F3F5F7" }}>{headerTableCampaignText}</th>
                </tr>
              </thead>
              <tbody>
                <DataTableCampaignDashboard />
              </tbody>
            </table>
            <div className="container-fluid d-flex justify-content-center mt-5 mb-5">
              <button type="button" className="btn btn-warning ms-md-3 fs-3 fw-bold d-block w-25" onClick={handleShow}>Request Form</button>
            </div>
          </div>
          <div className={`tab-pane fade ${active_pesanan_tab}`} id="pesanan_tab" role="tabpanel" tabIndex="0">
            <table className="table table-bordered border-black table-striped fs-3 fw-medium" style={{ marginTop: "2%" }}>
              <thead>
                <tr>
                  <th scope="col" colSpan={4} className="text-center" style={{ backgroundColor: "#F3F5F7" }}>{headerTablePesananText}</th>
                </tr>
              </thead>
              <tbody>
                <DataTablePesananDashboard />
              </tbody>
            </table>
            <div className="container-fluid d-flex justify-content-center mt-5 mb-5">
              <button type="button" className="btn btn-success-young border border-2 border-black ms-md-3 fs-3 fw-bold d-flex w-25" onClick={sendMessageSupport}><img src={`../../img/gambar-whatsapp.jpg`} width="50" className="rounded mx-4 d-block" alt="*Gambar Handphone" />Support</button>
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <div className="App">
      <Header />

      {/* Content Start */}
      <div className="container-fluid bg-white px-5" style={{ minHeight: "100vh", maxWidth: "1300px" }}>
        <h2 className="fw-bold mt-5 mb-5">{levelUserLoginTampil} Dashboard</h2>
        <nav className="mt-4 border border-2 border-black bg-secondary-subtle" style={{ paddingInline: ".78em" }}>
          <ButtonTabTableContent />
        </nav>
        <div className="p-3 border border-2 border-black bg-secondary-subtle mb-4">
          <ContentBaseTab />
        </div>
      </div>
      {/* Content End */}

      {/* Modal Request Form Start */}
      <Modal show={show} onHide={handleClose} onExited={resetInputModal} size="xl">
        <Modal.Header className="border-bottom border-dark" style={{ backgroundColor: "#DCE1E7" }} closeButton>
          <Modal.Title className="text-center w-100">Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#DCE1E7" }}>
          <form className="p-3 bg-white">
            <div className="mb-3">
              <label htmlFor="title" className="form-label fs-5 fw-bold">Title: </label>
              <input type="text" className="form-control bg-body-secondary fw-bold" value={title} id="title" onInput={(e) => { SetTitle(e.target.value) }} placeholder="type here..." />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label fs-5 fw-bold">Description: </label>
              <textarea className="form-control bg-body-secondary fw-bold" id="description" value={description} onInput={(e) => { SetDescription(e.target.value) }} placeholder="type here..."></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="picture" className="form-label fs-5 fw-bold">Picture: </label>
              <input type="file" className="form-control bg-body-secondary fw-bold d-none" id="picture" onChange={(e) => handleFileInputChange(e)} />
              <div className="px-2 w-50">
                <div className="container-input-gambar form-control bg-body-secondary fw-bold mb-3 fw-bold">
                  <label htmlFor="picture" className="d-flex justify-content-between align-items-center m-0">
                    {selectedFileName ? selectedFileName : "Upload file"}
                    <img src={`img/upload-vektor.svg`} width="20" className="d-block" alt="*Gambar Upload" />
                  </label>
                  <input type="file" id="picture" className="d-none" onChange={(e) => handleFileInputChange(e)} />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center border-top-0" style={{ backgroundColor: "#DCE1E7" }}>
          {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
          <Button className="btn-lg btn-warning px-5 fw-bold" variant="warning" onClick={(e) => handleSubmitRequestForm(e)}>
            Submit Form
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal Request Form End */}


      <Footer />
    </div>
  );
}

export default Dashboard;
