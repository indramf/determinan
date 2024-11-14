document.getElementById("inputForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Mengambil nilai dari formulir
    const keuntunganA = parseInt(document.getElementById("keuntunganA").value);
    const keuntunganB = parseInt(document.getElementById("keuntunganB").value);
    const jamMesinA = parseInt(document.getElementById("jamMesinA").value);
    const jamMesinB = parseInt(document.getElementById("jamMesinB").value);
    const jamKerjaA = parseInt(document.getElementById("jamKerjaA").value);
    const jamKerjaB = parseInt(document.getElementById("jamKerjaB").value);
    const totalJamMesin = parseInt(document.getElementById("totalJamMesin").value);
    const totalJamKerja = parseInt(document.getElementById("totalJamKerja").value);

    // Matriks koefisien untuk sistem persamaan
    const a = jamMesinA;
    const b = jamMesinB;
    const c = jamKerjaA;
    const d = jamKerjaB;
    
    // Matriks hasil
    const e = totalJamMesin;
    const f = totalJamKerja;

    // Menghitung determinan utama (D)
    const D = (a * d) - (b * c);

    console.log("nilai D " + D)

    if (D === 0) {
        document.getElementById("hasilText").innerText = "Tidak ada solusi unik, karena determinan utama bernilai 0.";
        return;
    }

    // Menghitung determinan untuk x (Dx) dan y (Dy)
    const Dx = (d * e) - (b * f);
    const Dy = (a * f) - (c * e);

    console.log("nilai Dx " + Dx)
    console.log("nilai Dy " + Dy)

    // Menentukan nilai x dan y
    const x = Dx / D;
    const y = Dy / D;

    console.log("nilai x " + x)
    console.log("nilai y " + y)

    // Memastikan hasil x dan y adalah angka bulat dan tidak negatif
    if (x < 0 || y < 0 || !Number.isInteger(x) || !Number.isInteger(y)) {
        document.getElementById("hasilText").innerText = "Tidak ada solusi produksi yang memenuhi batasan dan menghasilkan nilai bulat positif.";
        return;
    }

    // Menghitung keuntungan maksimum
    const maxKeuntungan = (x * keuntunganA) + (y * keuntunganB);

    // Menampilkan hasil optimasi
    document.getElementById("hasilText").innerText = `Jumlah optimal:
    - Produk A: ${x} unit
    - Produk B: ${y} unit
    - Keuntungan Maksimum: Rp ${maxKeuntungan}`;
});
