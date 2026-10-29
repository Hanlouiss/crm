# CRM Membership (Next.js + TypeScript)

Conversion of the PHP/XAMPP project `crm_tes2`. Same MySQL database (`uas_crm`), same features:
registration, login, products + points, membership levels, reward shop, and the admin panel.

## Run it

1. Start MySQL in XAMPP (Apache is no longer needed).
2. In phpMyAdmin make sure the `uas_crm` database exists (import `database/uas_crm.sql` if not).
   No schema change is needed: `log.password` is already `varchar(255)`.
3. Copy `.env.example` to `.env.local` and fill it in. Restart `npm run dev` after every change.
4. `npm install` then `npm run dev` -> http://localhost:3000

No SMTP settings yet? The "Kirim Email" mail is printed in the terminal instead of being sent (development only).

## Old PHP file -> new route

| PHP | Next.js |
|---|---|
| login.php / logout.php | /login, `logoutAction` |
| createakun.php, createdatadiri.php | /register, /register/profile |
| customer_dashboard.php | /dashboard |
| beliproduk.php | /beli-produk |
| membershipshop.php | /membership-shop |
| membership.php | /membership |
| lihattransaksi.php | /transaksi-saya |
| check_poin_pelanggan.php | /poin-saya |
| viewprofile.php | /profil |
| admin_dashboard.php | /admin |
| crud_customer/* | /admin/pelanggan |
| admin_crud_produk/* | /admin/produk |
| admin_crud_membership/* | /admin/membership |
| customerpoint.php, kirimemail.php | /admin/transaksi-produk (+ send email button) |
| transaksi_poin.php | /admin/transaksi-poin |
| lihat_profil_pelanggan.php, fetch_customer_details.php | /admin/profil-pelanggan |
| koneksi.php | lib/db.ts + .env.local |

Menu paths stored in the `membership` table (e.g. `http://localhost/crm_tes2/beliproduk.php`) are translated
automatically by `lib/menu.ts`, so the table does not need to change.
