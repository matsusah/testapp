import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Campaign from "./Pages/Campaign";
import Dashboard from "./Pages/Dashboard";
import DetailCampaign from "./Pages/DetailCampaign";
import DetailGuide from "./Pages/DetailGuide";
import DetailFaq from "./Pages/DetailFaq";
import DetailAnnouncement from "./Pages/DetailAnnouncement";
import DetailReview from "./Pages/DetailReview";
import Guide from "./Pages/Guide";
import Faq from "./Pages/Faq";
import Announcement from "./Pages/Announcement";
import Home from './Pages/Home';
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ProdukUser from "./Pages/Produk";
import DetailProdukUser from "./Pages/DetailProduk";
import Checkout from "./Pages/Checkout";
import DetailPesanan from "./Pages/DetailPesanan";
import TambahProduk from "./Pages/TambahProduk";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard/'>
          <Route index element={<Dashboard />} />
          <Route path='review/:id_users' element={<DetailReview />} />
          <Route path='review-pesanan/:id_pesanan' element={<DetailPesanan />} />
          <Route path='kelola-produk/:id_produk' element={<TambahProduk />} />
        </Route>
        <Route path='/campaign/'>
          <Route index element={<Campaign />} />
          <Route path='detail/:id_campaign' element={<DetailCampaign />} />
        </Route>
        <Route path='/guide/'>
          <Route index element={<Guide />} />
          <Route path='detail/:id_guide' element={<DetailGuide />} />
        </Route>
        <Route path='/faq/'>
          <Route index element={<Faq />} />
          <Route path='detail/:id_faq' element={<DetailFaq />} />
        </Route>
        <Route path='/announcement/'>
          <Route index element={<Announcement />} />
          <Route path='detail/:id_announcement' element={<DetailAnnouncement />} />
        </Route>
        <Route path='/produk/'>
          <Route index element={<ProdukUser />} />
          <Route path='detail/:id_produk' element={<DetailProdukUser />} />
        </Route>
        <Route path='/checkout/'>
          <Route index element={<Checkout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
