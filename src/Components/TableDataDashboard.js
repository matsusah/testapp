import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { get_api_destroy_produk, get_public_url } from "../Utils/Utils";

function TableDataDashboard({level_users, data, context_table}) {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // function
  function destroyProduk(id_produk) {
    var Form = new FormData();
    Form.append("token", localStorage._token);
    Form.append("id_produk", id_produk);

    MySwal.fire({
      title: "Apakah Anda yakin akan menghapus data produk ini?",
      text: "Jika produk sudah dihapus, tidak dapat dikembalikan lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Tidak!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(get_api_destroy_produk, {
          method: "POST",
          body: Form,
        })
          .then((response) => response.json())
          .then((data) => {
            // enabled button
            if (data.status === "success") {
              MySwal.fire({
                title: <strong>{data.message}</strong>,
                html: <p>Klik oke, kami akan merefresh halaman</p>,
                icon: 'success'
              }).then(() => {
                window.location.reload();
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
          });
      } else {
        MySwal.fire({
          title: <strong>Dibatalkan!</strong>,
          text: "Aksi dibatalkan!",
          icon: "error",
        });
      }
    });
  }

  // component
  function TombolAksi({level_users, data, context_table}) {
    const navigate = useNavigate();
    if(context_table == "data_table_campaign") {
      // table campaign
      if(level_users == "Admin") {
        return (
          <button type="button" className="btn text-white ms-md-3 fw-bold d-block w-50" style={{ backgroundColor: "#64E987" }} onClick={() => navigate("/dashboard/review/"+data.id_users)}>view</button>
        );
      } else if(level_users == "Pengguna") {
        if(data.status_campaign == "Pending") {
          return (
            <button type="button" className="btn btn-light ms-md-3 fw-bold d-block w-50">in review</button>
          );
        } else {
          return (
            <button type="button" className="btn btn-light ms-md-3 fw-bold d-block w-50">{data.status_campaign}</button>
          );
        }
      }
    } else if(context_table == "data_table_pesanan") {
      // table pesanan
      if(level_users == "Admin") {
        if(data.status_pesanan == 'Pending') {
          return (
            <button type="button" className="btn text-white ms-md-3 fw-bold d-block w-50" onClick={() => navigate("/dashboard/review-pesanan/"+data.id_pesanan)} style={{ backgroundColor: "#64E987" }}>kirim pesanan</button>
          );
        } else {
          return (
            <button type="button" className="btn text-white ms-md-3 fw-bold d-block w-50" onClick={() => navigate("/dashboard/review-pesanan/"+data.id_pesanan)} style={{ backgroundColor: "#64E987" }}>view</button>
          );
        }
      } else if(level_users == "Pengguna") {
        return (
          <button type="button" className="btn btn-light ms-md-3 fw-bold d-block w-50" onClick={() => navigate("/dashboard/review-pesanan/"+data.id_pesanan)} style={{ backgroundColor: "#64E987" }}>view</button>
        );
      }
    } else if(context_table == "data_table_produk") {
      return (
        <div className="d-flex justify-content-center w-100">
          <button type="button" className="btn btn-primary ms-md-3 fw-bold d-block w-25" onClick={() => navigate("/dashboard/kelola-produk/"+data.id_produk)}>Edit Stok</button>
          <button type="button" className="btn btn-danger ms-md-3 fw-bold d-block w-25" onClick={() => destroyProduk(data.id_produk)}>Hapus Produk</button>
        </div>
      );
    }
  }

  function StatusTombol({data}) {
    if(data.status_pesanan == "Pending") {
      return (
        <button type="button" className="btn btn-light ms-md-3 fw-bold d-block w-50">in proses</button>
      );
    } else {
      return (
        <button type="button" className="btn btn-light ms-md-3 fw-bold d-block w-50">{data.status_pesanan}</button>
      );
    }
  }

  if(context_table == "data_table_campaign" || context_table == "data_table_produk") {
    return (
      <tr>
        <td>{data.number}</td>
        <td><span className="d-block w-100 text-start" style={{ width: "15vw" }}>{data.second_column}</span></td>
        <td>
          <span className="d-flex justify-content-center">
            <TombolAksi level_users={level_users} data={data} context_table={context_table} />
          </span>
        </td>
      </tr>
    );
  } else if(context_table == "data_table_pesanan") {
    if(level_users == "Admin") {
      return (
        <tr>
          <td>{data.number}</td>
          <td><span className="d-block w-100 text-start" style={{ width: "20vw" }}>{data.second_column}</span></td>
          <td><span className="d-block w-100 text-start" style={{ width: "20vw" }}>{data.tanggal_pemesanan}</span></td>
          <td>
            <span className="d-flex justify-content-center">
              <TombolAksi level_users={level_users} data={data} context_table={context_table} />
            </span>
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{data.number}</td>
          <td><span className="d-block w-100 text-start" style={{ width: "20vw" }}>{data.second_column}</span></td>
          <td>
            <span className="d-flex w-100 justify-content-center" style={{ width: "20vw" }}>
              <StatusTombol data={data} />
            </span>
          </td>
          <td>
            <span className="d-flex justify-content-center">
              <TombolAksi level_users={level_users} data={data} context_table={context_table} />
            </span>
          </td>
        </tr>
      );
    }
  }
}


export default TableDataDashboard;
