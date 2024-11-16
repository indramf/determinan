// Fungsi untuk menampilkan/menyembunyikan input Produk C berdasarkan pilihan jumlah produk
function toggleProductC() {
  const productCount = document.getElementById('product-count').value;
  const productCFields = document.getElementById('product-c-fields');
  productCFields.style.display = productCount === '3' ? 'block' : 'none';
}

// Fungsi konversi waktu ke jam
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

// Fungsi untuk validasi input
function validateInput(value) {
  if (value < 0) {
    return 'Nilai tidak boleh negatif.';
  }
  if (isNaN(value)) {
    return 'Nilai harus berupa angka.';
  }
  return null;
}

// Fungsi utama untuk menghitung optimasi
function calculateOptimization() {
  const productCount = parseInt(document.getElementById('product-count').value);

  // Ambil nilai input untuk Produk A dan B
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

  // Ambil nilai input untuk Produk C jika produkCount adalah 3
  let profitC = 0, timeMachineProductC = 0, unitMachineProductC = '', timeLaborProductC = 0, unitLaborProductC = '';
  if (productCount === 3) {
    profitC = parseFloat(document.getElementById('profit-c').value);
    timeMachineProductC = parseFloat(document.getElementById('time-machine-product-c').value);
    unitMachineProductC = document.getElementById('time-unit-machine-product-c').value;
    timeLaborProductC = parseFloat(document.getElementById('time-labor-product-c').value);
    unitLaborProductC = document.getElementById('time-unit-labor-product-c').value;
  }

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
  ];

  if (productCount === 3) {
    errors.push(
      validateInput(profitC),
      validateInput(timeMachineProductC),
      validateInput(timeLaborProductC)
    );
  }

  const resultDiv = document.getElementById('result');
  if (errors.filter(Boolean).length > 0) {
    resultDiv.textContent = errors.filter(Boolean).join(' | ');
    resultDiv.classList.add('error');
    resultDiv.style.display = 'block';
    return;
  }

  // Konversi semua input waktu ke jam
  const timeMachineAInHours = convertToHours(timeMachineProductA, unitMachineProductA);
  const timeMachineBInHours = convertToHours(timeMachineProductB, unitMachineProductB);
  const timeLaborAInHours = convertToHours(timeLaborProductA, unitLaborProductA);
  const timeLaborBInHours = convertToHours(timeLaborProductB, unitLaborProductB);

  let timeMachineCInHours = 0, timeLaborCInHours = 0;
  if (productCount === 3) {
    timeMachineCInHours = convertToHours(timeMachineProductC, unitMachineProductC);
    timeLaborCInHours = convertToHours(timeLaborProductC, unitLaborProductC);
  }

  // Konversi total jam mesin dan jam tenaga kerja berdasarkan periode yang dipilih
  const adjustedMachineHours = convertTimeBasedOnPeriod(totalMachineHours, period);
  const adjustedLaborHours = convertTimeBasedOnPeriod(totalLaborHours, period);

  // Panggil fungsi optimasi
  const result = linearOptimization(
    profitA, profitB, profitC,
    timeMachineAInHours, timeMachineBInHours, timeMachineCInHours,
    timeLaborAInHours, timeLaborBInHours, timeLaborCInHours,
    adjustedMachineHours, adjustedLaborHours,
    productCount
  );

  // Tampilkan hasilnya
  if (result.success) {
    let resultText = `Jumlah optimal produksi untuk periode ${period}:\nProduk A: ${result.unitsA} unit\nProduk B: ${result.unitsB} unit`;
    if (productCount === 3) {
      resultText += `\nProduk C: ${result.unitsC} unit`;
    }
    resultText += `\nKeuntungan Maksimal: Rp ${result.totalProfit}`;
    resultDiv.textContent = resultText;
  } else {
    resultDiv.textContent = 'Tidak ada solusi yang memenuhi batasan yang diberikan.';
  }
  resultDiv.style.display = 'block';
}

// Fungsi optimasi Linear Programming sederhana
function linearOptimization(profitA, profitB, profitC, timeMachineA, timeMachineB, timeMachineC, timeLaborA, timeLaborB, timeLaborC, maxMachineHours, maxLaborHours, productCount) {
  let bestUnitsA = 0;
  let bestUnitsB = 0;
  let bestUnitsC = 0;
  let bestProfit = 0;

  // Coba semua kombinasi unit produksi dalam batasan yang ada
  for (let unitsA = 0; unitsA <= maxMachineHours / timeMachineA; unitsA++) {
    for (let unitsB = 0; unitsB <= maxMachineHours / timeMachineB; unitsB++) {
      for (let unitsC = 0; unitsC <= (productCount === 3 ? maxMachineHours / timeMachineC : 0); unitsC++) {
        // Cek apakah memenuhi batasan jam mesin dan jam tenaga kerja
        const totalMachineUsage = (unitsA * timeMachineA) + (unitsB * timeMachineB) + (productCount === 3 ? unitsC * timeMachineC : 0);
        const totalLaborUsage = (unitsA * timeLaborA) + (unitsB * timeLaborB) + (productCount === 3 ? unitsC * timeLaborC : 0);

        if (totalMachineUsage <= maxMachineHours && totalLaborUsage <= maxLaborHours) {
          // Hitung keuntungan
          const totalProfit = (unitsA * profitA) + (unitsB * profitB) + (productCount === 3 ? unitsC * profitC : 0);

          // Perbarui jika ditemukan keuntungan yang lebih baik
          if (totalProfit > bestProfit) {
            bestProfit = totalProfit;
            bestUnitsA = unitsA;
            bestUnitsB = unitsB;
            bestUnitsC = unitsC;
          }
        }
      }
    }
  }

  // Return hasil optimasi
  return {
    success: bestProfit > 0,
    unitsA: bestUnitsA,
    unitsB: bestUnitsB,
    unitsC: productCount === 3 ? bestUnitsC : 0,
    totalProfit: bestProfit
  };
}
