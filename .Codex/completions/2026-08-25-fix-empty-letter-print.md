# Fix Empty Letter Print

- Memulihkan `display: revert !important` pada area printable agar isi surat tampil di dialog print.
- Menambahkan override display `flex` dan `grid` agar layout kolom tetap benar.
- Mengganti prefiks nomor `140` dengan tiga non-breaking spaces sebelum `/PPN`.
- Validasi TypeScript dan bundle CSS berhasil; bundle memuat aturan print terbaru.
