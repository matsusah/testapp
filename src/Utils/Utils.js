// base url

// export const main_url = "http://localhost/toko-koin/laravel";
export const main_url = "http://backend.a4bucks.com";

export const get_public_url = `${main_url}/public`;
export const get_api = `${main_url}/public/api`;

// url API non Auth
export const get_api_login = `${get_api}/login`;
export const get_api_register = `${get_api}/register`;


// url API required Auth
// guide API
export const get_api_index_guide_pagination = `${get_api}/index_guide_pagination`;
export const get_api_store_guide = `${get_api}/store_guide`;
export const get_api_detail_guide = `${get_api}/detail_guide`;

// faq API
export const get_api_index_faq_pagination = `${get_api}/index_faq_pagination`;
export const get_api_store_faq = `${get_api}/store_faq`;
export const get_api_detail_faq = `${get_api}/detail_faq`;

// announcement API
export const get_api_index_announcement_pagination = `${get_api}/index_announcement_pagination`;
export const get_api_store_announcement = `${get_api}/store_announcement`;
export const get_api_detail_announcement = `${get_api}/detail_announcement`;

// campaign API
export const get_api_index_campaign = `${get_api}/index_campaign`;
export const get_api_store_campaign = `${get_api}/store_campaign`;
export const get_api_detail_campaign = `${get_api}/detail_campaign`;
export const get_api_destroy_campaign = `${get_api}/destroy_campaign`;
export const get_api_update_verified_status = `${get_api}/update_verified_status`;
export const get_api_get_comment_campaign = `${get_api}/get_comment_campaign`;
export const get_api_store_comment_campaign = `${get_api}/store_comment_campaign`;


// dashboard API
export const get_api_index_dashboard = `${get_api}/index_dashboard`;
export const get_api_detail_review = `${get_api}/detail_review`;


// produk API
export const get_api_index_produk = `${get_api}/index_produk`;
export const get_api_create_produk = `${get_api}/create_produk`;
export const get_api_store_produk = `${get_api}/store_produk`;
export const get_api_detail_produk = `${get_api}/detail_produk`;
export const get_api_destroy_produk = `${get_api}/destroy_produk`;

// checkout API
export const get_api_store_pesanan = `${get_api}/store_pesanan`;
export const get_api_detail_pesanan = `${get_api}/detail_pesanan`;
export const get_api_selesaikan_pesanan = `${get_api}/selesaikan_pesanan`;