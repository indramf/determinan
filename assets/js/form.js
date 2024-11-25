//  <!-- script form -->
const scriptURL = 'https://script.google.com/macros/s/AKfycbxYn4u9H8MyR_fB5negGxhs1ksmVvouWBnw2SRLirE-2O8lfWwmH1WCGqDWkzyvSCuZ/exec';
const form = document.forms['submit-to-google-sheet'];
const btnSend = document.querySelector('.btn-send');
const btnLoading = document.querySelector('.btn-loading');
const alertBerhasil = document.querySelector('.alert-berhasil');
const alertGagal = document.querySelector('.alert-gagal');

// Fungsi untuk menyembunyikan semua alert
function resetAlerts() {
  alertBerhasil.classList.add('d-none');
  alertGagal.classList.add('d-none');
}

// Menutup alert ketika diklik
alertBerhasil.addEventListener('click', () => {
  alertBerhasil.classList.add('d-none');
});

alertGagal.addEventListener('click', () => {
  alertGagal.classList.add('d-none');
});

form.addEventListener('submit', e => {
  e.preventDefault();

  // Reset alert sebelum memulai pengiriman
  resetAlerts();

  // Toggle tombol loading
  btnSend.classList.toggle('d-none');
  btnLoading.classList.toggle('d-none');

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      // Toggle tombol kembali
      btnSend.classList.toggle('d-none');
      btnLoading.classList.toggle('d-none');

      // Tampilkan alert berhasil
      alertBerhasil.classList.remove('d-none');

      // Reset form
      form.reset();

      console.log('Success!', response);
    })
    .catch(error => {
      // Toggle tombol kembali
      btnSend.classList.toggle('d-none');
      btnLoading.classList.toggle('d-none');

      // Tampilkan alert gagal
      alertGagal.classList.remove('d-none');

      console.error('Error!', error.message);
    });
});
