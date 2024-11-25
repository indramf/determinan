// Fungsi konversi waktu ke jam (tidak ada perubahan dari kode sebelumnya)
function convertToHours(value, unit) {
  switch (unit) {
    case 'seconds':
      return value / 3600; // Konversi dari detik ke jam
    case 'minutes':
      return value / 60;   // Konversi dari menit ke jam
    case 'hours':
      return value;        // Sudah dalam jam
    case 'days':
      return value * 24;   // Konversi dari hari ke jam
    default:
      return value;
  }
}

// Fungsi konversi waktu berdasarkan periode
function convertTimeBasedOnPeriod(hours, period) {
  switch (period) {
    case 'day':
      return hours; // Sudah dalam hitungan per hari
    case 'week':
      return hours * 7; // Menghitung total jam untuk seminggu
    case 'month':
      return hours * 30; // Menghitung total jam untuk sebulan (asumsi 30 hari)
    default:
      return hours;
  }
}

// fungsi menghitung detrminan
function calculateOptimization() {
  // Ambil data input
  const profitA = parseFloat(document.getElementById('profit-a').value);
  const profitB = parseFloat(document.getElementById('profit-b').value);

  const timeMachineA = parseFloat(document.getElementById('time-machine-product-a').value);
  const unitMachineProductA = document.getElementById('time-unit-machine-product-a').value;

  const timeMachineB = parseFloat(document.getElementById('time-machine-product-b').value);
  const unitMachineProductB = document.getElementById('time-unit-machine-product-b').value;

  const timeLaborA = parseFloat(document.getElementById('time-labor-product-a').value);
  const unitLaborProductA = document.getElementById('time-unit-labor-product-a').value;

  const timeLaborB = parseFloat(document.getElementById('time-labor-product-b').value);
  const unitLaborProductB = document.getElementById('time-unit-labor-product-b').value;

  const totalMachineHours = parseFloat(document.getElementById('total-machine-hours').value);
  const totalLaborHours = parseFloat(document.getElementById('total-labor-hours').value);

  // Ambil periode waktu
  const period = document.getElementById('time-period').value;

  // Validasi input
  if (
    isNaN(profitA) || isNaN(profitB) ||
    isNaN(timeMachineA) || isNaN(timeMachineB) ||
    isNaN(timeLaborA) || isNaN(timeLaborB) ||
    isNaN(totalMachineHours) || isNaN(totalLaborHours)
  ) {
    alert('Mohon isi semua input dengan angka yang valid.');
    return;
  }

  // Konversi semua input waktu ke jam
  const timeMachineAInHours = convertToHours(timeMachineA, unitMachineProductA);
  const timeMachineBInHours = convertToHours(timeMachineB, unitMachineProductB);
  const timeLaborAInHours = convertToHours(timeLaborA, unitLaborProductA);
  const timeLaborBInHours = convertToHours(timeLaborB, unitLaborProductB);

  // Konversi total jam mesin dan jam tenaga kerja berdasarkan periode yang dipilih
  const adjustedMachineHours = convertTimeBasedOnPeriod(totalMachineHours, period);
  const adjustedLaborHours = convertTimeBasedOnPeriod(totalLaborHours, period);

  // Representasi matriks untuk sistem persamaan linear
  const coefficients = [
    [timeMachineAInHours, timeMachineBInHours],
    [timeLaborAInHours, timeLaborBInHours]
  ];
  const constants = [adjustedMachineHours, adjustedLaborHours];

  console.log("matrik A : " + coefficients);
  console.log("matrik B : " + constants);

  // Fungsi untuk menghitung determinan matriks 2x2
  function determinant2x2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  // Hitung determinan utama
  const detA = determinant2x2(coefficients);
  if (detA === 0) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Sistem persamaan tidak memiliki solusi unik.';
    resultDiv.classList.add('error');
    resultDiv.classList.remove('success');
    resultDiv.style.display = 'block';
    return;
  }

  // Hitung determinan untuk variabel x dan y
  const matrixX = [
    [constants[0], coefficients[0][1]],
    [constants[1], coefficients[1][1]]
  ];
  const matrixY = [
    [coefficients[0][0], constants[0]],
    [coefficients[1][0], constants[1]]
  ];
  const x = determinant2x2(matrixX) / detA;
  const y = determinant2x2(matrixY) / detA;

  // Hitung keuntungan maksimum
  let validX = x >= 0 ? x : 0;
  let validY = y >= 0 ? y : 0;
  const maxProfit = profitA * validX + profitB * validY;

  // Tampilkan hasil
  const resultDiv = document.getElementById('result');

  if (validX === 0 && validY === 0) {
    resultDiv.innerHTML = `
    <p>Hasil perhitungan tidak valid. Tidak ada solusi optimal untuk produksi.</p>
    `;
    resultDiv.classList.add('error');
    resultDiv.classList.remove('success');
  } else {
    resultDiv.innerHTML = `
    <span>Jumlah optimal prduksi untuk periode per ${period}</span><br>
    <span>Produk A: ${validX.toFixed(2)}</span><br>
    <span>Produk B: ${validY.toFixed(2)}</span><br>
    <span>Keuntungan maksimal: Rp ${maxProfit.toFixed(2)}</span>
    `;
    resultDiv.classList.add('success');
    resultDiv.classList.remove('error');
  }

  resultDiv.style.display = 'block';
}

// Fungsi untuk mereset semua input dan output
function reset() {
  // Menghapus nilai dari semua elemen dengan kelas 'reset'
  document.querySelectorAll(".reset").forEach(element => {
    element.value = "";
  });

  // Menghapus konten dari semua elemen dengan kelas 'outputHitung'
  document.querySelectorAll(".result").forEach(element => {
    element.innerHTML = "";
  });

  // Fokus ke input pertama dengan kelas 'reset'
  const firstInput = document.querySelector(".reset");
  if (firstInput) {
    firstInput.focus();
  };
}