// script.js

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

// console.log("waktu " + convertToHours(value, unit));

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

// Fungsi untuk validasi input (sama seperti sebelumnya)
function validateInput(value) {
  if (value < 0) {
    return 'Nilai tidak boleh negatif.';
  }
  if (isNaN(value)) {
    return 'Nilai harus berupa angka.';
  }
  return null;
}

// Fungsi hitung optimasi yang diperbarui
function calculateOptimization() {
  // Ambil nilai input
  const profitA = parseFloat(document.getElementById('profit-a').value);
  const profitB = parseFloat(document.getElementById('profit-b').value);

  const timeMachineProductA = parseFloat(document.getElementById('time-machine-product-a').value);
  const unitMachineProductA = document.getElementById('time-unit-machine-product-a').value;

  const timeMachineProductB = parseFloat(document.getElementById('time-machine-product-b').value);
  const unitMachineProductB = document.getElementById('time-unit-machine-product-b').value;

  const timeLaborProductA = parseFloat(document.getElementById('time-labor-product-a').value);
  const unitLaborProductA = document.getElementById('time-unit-labor-product-a').value;

  const timeLaborProductB = parseFloat(document.getElementById('time-labor-product-b').value);
  const unitLaborProductB = document.getElementById('time-unit-labor-product-b').value;

  const totalMachineHours = parseFloat(document.getElementById('total-machine-hours').value);
  const totalLaborHours = parseFloat(document.getElementById('total-labor-hours').value);

  // Ambil periode waktu
  const period = document.getElementById('time-period').value;

  // Validasi input
  const errors = [
    validateInput(profitA),
    validateInput(profitB),
    validateInput(timeMachineProductA),
    validateInput(timeMachineProductB),
    validateInput(timeLaborProductA),
    validateInput(timeLaborProductB),
    validateInput(totalMachineHours),
    validateInput(totalLaborHours)
  ].filter(Boolean);

  // Tampilkan error jika ada
  const resultDiv = document.getElementById('result');
  if (errors.length > 0) {
    resultDiv.textContent = errors.join(' | ');
    resultDiv.classList.add('error');
    resultDiv.style.display = 'block';
    return;
  }

  // Konversi semua input waktu ke jam
  const timeMachineAInHours = convertToHours(timeMachineProductA, unitMachineProductA);
  const timeMachineBInHours = convertToHours(timeMachineProductB, unitMachineProductB);
  const timeLaborAInHours = convertToHours(timeLaborProductA, unitLaborProductA);
  const timeLaborBInHours = convertToHours(timeLaborProductB, unitLaborProductB);

  // console.log("mesin A " + timeMachineAInHours);
  // console.log("mesin B " + timeMachineBInHours);
  // console.log("kerja A " + timeLaborAInHours);
  // console.log("kerja B " + timeLaborBInHours);

  // Konversi total jam mesin dan jam tenaga kerja berdasarkan periode yang dipilih
  const adjustedMachineHours = convertTimeBasedOnPeriod(totalMachineHours, period);
  const adjustedLaborHours = convertTimeBasedOnPeriod(totalLaborHours, period);

  // console.log("total jam mesin " + adjustedMachineHours);
  // console.log("total jam kerja " + adjustedLaborHours);

  // Optimasi menggunakan metode Linear Programming
  const result = linearOptimization(
    profitA, profitB,
    timeMachineAInHours, timeMachineBInHours,
    timeLaborAInHours, timeLaborBInHours,
    adjustedMachineHours, adjustedLaborHours
  );

  // Tampilkan hasil optimasi
  if (result.success) {
    resultDiv.textContent = `Jumlah optimal produksi untuk periode ${period}:
    Produk A: ${result.unitsA} unit
    Produk B: ${result.unitsB} unit
    Keuntungan Maksimal: Rp ${result.totalProfit}`;
    resultDiv.classList.remove('error');
  } else {
    resultDiv.textContent = 'Tidak ada solusi yang memenuhi batasan yang diberikan.';
    resultDiv.classList.add('error');
  }
  resultDiv.style.display = 'block';
}

// Fungsi optimasi Linear Programming sederhana (sama seperti sebelumnya)
function linearOptimization(profitA, profitB, timeMachineA, timeMachineB, timeLaborA, timeLaborB, maxMachineHours, maxLaborHours) {
  let bestUnitsA = 0;
  let bestUnitsB = 0;
  let bestProfit = 0;

  // Coba semua kombinasi unit produksi dalam batasan yang ada
  for (let unitsA = 0; unitsA <= maxMachineHours / timeMachineA; unitsA++) {
    for (let unitsB = 0; unitsB <= maxMachineHours / timeMachineB; unitsB++) {
      // Cek apakah memenuhi batasan jam mesin dan jam tenaga kerja
      const totalMachineUsage = (unitsA * timeMachineA) + (unitsB * timeMachineB);
      const totalLaborUsage = (unitsA * timeLaborA) + (unitsB * timeLaborB);

      if (totalMachineUsage <= maxMachineHours && totalLaborUsage <= maxLaborHours) {
        // Hitung keuntungan
        const totalProfit = (unitsA * profitA) + (unitsB * profitB);

        // Perbarui jika ditemukan keuntungan yang lebih baik
        if (totalProfit > bestProfit) {
          bestProfit = totalProfit;
          bestUnitsA = unitsA;
          bestUnitsB = unitsB;
        }
      }
    }
  }


  // Return hasil optimasi
  return {
    success: bestProfit > 0,
    unitsA: bestUnitsA,
    unitsB: bestUnitsB,
    totalProfit: bestProfit
  };
}
