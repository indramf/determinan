//show form
function showForm(formId) {
  // Menghapus bagian terkait "one-dimension"
  // document.getElementById("one-dimension").style.display = "none";
  document.getElementById("two-dimension").style.display = "none";
  document.getElementById("three-dimension").style.display = "none";
  // document.getElementById("btn-one-dimension").classList.remove("active");
  document.getElementById("btn-two-dimension").classList.remove("active");
  document.getElementById("btn-three-dimension").classList.remove("active");

  // Mengabaikan "one-dimension" dalam logika if
  // if (formId === "one-dimension") {
  //   document.getElementById("one-dimension").style.display = "block";
  //   document.getElementById("btn-one-dimension").classList.add("active");
  // } else 
  if (formId === "two-dimension") {
    document.getElementById("two-dimension").style.display = "block";
    document.getElementById("btn-two-dimension").classList.add("active");
  } else if (formId === "three-dimension") {
    document.getElementById("three-dimension").style.display = "block";
    document.getElementById("btn-three-dimension").classList.add("active");
  }
}

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


function calculateOptimizationTwo() {
  // Mengambil nilai input dari form
  const var1 = parseFloat(document.getElementById("two-var1").value); // Keuntungan Produk A
  const var2 = parseFloat(document.getElementById("two-var2").value); // Waktu Mesin Produk A
  const var3 = parseFloat(document.getElementById("two-var3").value); // Waktu Kerja Produk A
  const var4 = parseFloat(document.getElementById("two-var4").value); // Keuntungan Produk B
  const var5 = parseFloat(document.getElementById("two-var5").value); // Waktu Mesin Produk B
  const var6 = parseFloat(document.getElementById("two-var6").value); // Waktu Kerja Produk B
  const var7 = parseFloat(document.getElementById("two-var7").value); // Total Waktu Mesin
  const var8 = parseFloat(document.getElementById("two-var8").value); // Total Waktu Kerja

  // Validasi input
  if (isNaN(var1) || isNaN(var2) || isNaN(var3) || isNaN(var4) || isNaN(var5) || isNaN(var6) || isNaN(var7) || isNaN(var8)) {
    document.getElementById("output-two").innerHTML = "Mohon isi semua kolom dengan angka.";
    return;
  }

  // Matriks koefisien
  const determinant = (var2 * var6) - (var3 * var5);

  if (determinant === 0) {
    document.getElementById("output-two").innerHTML = "Sistem tidak memiliki solusi unik karena determinan = 0.";
    return;
  }

  // Matriks solusi
  const determinantX = (var7 * var6) - (var8 * var5);
  const determinantY = (var2 * var8) - (var3 * var7);

  // Nilai X (jumlah produk A) dan Y (jumlah produk B)
  const x = determinantX / determinant;
  const y = determinantY / determinant;

  // Total keuntungan
  const totalProfit = (x * var1) + (y * var4);

  // Menampilkan hasil
  document.getElementById("output-two").innerHTML =
    `Jumlah Produk A: ${x.toFixed(2)}<br>
     Jumlah Produk B: ${y.toFixed(2)}<br>
     Total Keuntungan: Rp ${totalProfit.toFixed(2)}`;
}


// Fungsi untuk validasi input
function validateInput(value, name) {
  if (isNaN(value) || value < 0) {
    return `${name} harus berupa angka positif.`;
  }
  return null;
}

// Fungsi untuk Linear Programming
function linearOptimization(profitA, profitB, machineTimeA, machineTimeB, laborTimeA, laborTimeB, totalMachineHours, totalLaborHours) {
  // Perhitungan manual (contoh sederhana)
  const determinant = (machineTimeA * laborTimeB) - (machineTimeB * laborTimeA);

  if (determinant === 0) {
    return { success: false }; // Tidak ada solusi
  }

  const unitsA = ((profitB * laborTimeB) - (profitA * laborTimeB)) / determinant;
  const unitsB = ((profitA * machineTimeB) - (profitB * machineTimeA)) / determinant;

  if (unitsA >= 0 && unitsB >= 0 && (unitsA * machineTimeA + unitsB * machineTimeB <= totalMachineHours) && (unitsA * laborTimeA + unitsB * laborTimeB <= totalLaborHours)) {
    const totalProfit = (unitsA * profitA) + (unitsB * profitB);
    return {
      success: true,
      unitsA: Math.floor(unitsA),
      unitsB: Math.floor(unitsB),
      totalProfit: Math.floor(totalProfit)
    };
  }

  return { success: false };

}

// Fungsi untuk mereset semua input dan output
function reset() {
  // Menghapus nilai dari semua elemen dengan kelas 'reset'
  document.querySelectorAll(".reset").forEach(element => {
    element.value = "";
  });

  // Menghapus konten dari semua elemen dengan kelas 'outputHitung'
  document.querySelectorAll(".outputHitung").forEach(element => {
    element.innerHTML = "";
  });

  // Fokus ke input pertama dengan kelas 'reset'
  const firstInput = document.querySelector(".reset");
  if (firstInput) {
    firstInput.focus();
  }
}


