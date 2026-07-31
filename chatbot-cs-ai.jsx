import React, { useState, useRef, useEffect } from "react";
import { Send, Package, Clock, CheckCircle2, Search, Bot, User, Circle } from "lucide-react";

// ============ DATA INVENTORY (contoh — ganti dengan data asli via API/database Anda) ============
const INVENTORY = [
  { id: "SKU-001", nama: "Kemeja Flanel Pria", kategori: "Pakaian", harga: 189000, stok: 42, deskripsi: "Kemeja flanel lengan panjang, bahan katun premium, tersedia size S-XXL." },
  { id: "SKU-002", nama: "Sepatu Sneakers Runner X", kategori: "Sepatu", harga: 459000, stok: 7, deskripsi: "Sneakers ringan untuk lari harian, sol empuk anti slip." },
  { id: "SKU-003", nama: "Tas Ransel Laptop 15\"", kategori: "Tas", harga: 275000, stok: 0, deskripsi: "Ransel tahan air, muat laptop 15 inch, ada port USB charging." },
  { id: "SKU-004", nama: "Jam Tangan Digital Sport", kategori: "Aksesoris", harga: 320000, stok: 15, deskripsi: "Water resistant 50m, stopwatch, tahan lama baterai 2 tahun." },
  { id: "SKU-005", nama: "Jaket Hoodie Basic", kategori: "Pakaian", harga: 165000, stok: 3, deskripsi: "Hoodie fleece tebal, cocok untuk cuaca dingin, unisex." },
  { id: "SKU-006", nama: "Powerbank 20000mAh", kategori: "Elektronik", harga: 210000, stok: 25, deskripsi: "Fast charging 22.5W, 2 port output, indikator LED." },
];

const FAQ = [
  { kata: ["ongkir", "pengiriman", "kirim", "ekspedisi"], jawaban: "Kami mengirim ke seluruh Indonesia via JNE, J&T, dan SiCepat. Estimasi 2-4 hari kerja untuk luar kota, 1-2 hari untuk dalam kota. Ongkir dihitung otomatis saat checkout sesuai lokasi Anda." },
  { kata: ["retur", "tukar", "kembali", "refund", "garansi"], jawaban: "Barang bisa ditukar/dikembalikan dalam 7 hari setelah diterima, asal kondisi masih baru & lengkap. Untuk klaim, kirim foto produk dan nomor pesanan ke tim kami." },
  { kata: ["bayar", "pembayaran", "transfer", "cod", "metode"], jawaban: "Kami menerima transfer bank, e-wallet (OVO, GoPay, Dana), kartu kredit/debit, dan COD untuk area tertentu." },
  { kata: ["jam", "buka", "operasional", "kapan"], jawaban: "Chat ini aktif 24 jam nonstop untuk menjawab pertanyaan seputar produk & pesanan. Untuk hal yang butuh tindakan manual (klaim garansi kompleks, dsb), agen manusia kami membalas jam 08.00–21.00 WIB." },
];

const RUPIAH = (n) => "Rp" + n.toLocaleString("id-ID");

function cariProduk(teks) {
  const t = teks.toLowerCase();
  return INVENTORY.filter((p) =>
    t.includes(p.nama.toLowerCase()) ||
    p.nama.toLowerCase().split(" ").some((w) => w.length > 3 && t.includes(w)) ||
    t.includes(p.kategori.toLowerCase())
  );
}

function jawabPertanyaan(pesan) {
  const t = pesan.toLowerCase().trim();

  if (["halo", "hai", "hi", "pagi", "siang", "malam", "sore"].some((g) => t.includes(g)) && t.length < 25) {
    return "Halo! Selamat datang 👋 Saya asisten CS otomatis, siap bantu 24 jam. Anda bisa tanya soal harga, stok, atau detail produk kami. Mau cari apa hari ini?";
  }

  for (const f of FAQ) {
    if (f.kata.some((k) => t.includes(k))) return f.jawaban;
  }

  const produkDitemukan = cariProduk(t);

  if (t.includes("stok") || t.includes("ready") || t.includes("tersedia") || t.includes("ada ga") || t.includes("ada gak")) {
    if (produkDitemukan.length > 0) {
      return produkDitemukan
        .map((p) => (p.stok > 0
          ? `${p.nama} — stok tersedia: ${p.stok} unit ✅`
          : `${p.nama} — mohon maaf, stok sedang habis 🙏`))
        .join("\n");
    }
    return "Boleh sebutkan nama produknya? Supaya saya cek stok terbaru langsung dari sistem inventory kami.";
  }

  if (t.includes("harga") || t.includes("berapa") || t.includes("price")) {
    if (produkDitemukan.length > 0) {
      return produkDitemukan.map((p) => `${p.nama}: ${RUPIAH(p.harga)} (stok: ${p.stok > 0 ? p.stok + " unit" : "habis"})`).join("\n");
    }
    return "Produk mana yang mau ditanyakan harganya? Coba ketik nama produknya, misalnya \"harga sepatu sneakers\".";
  }

  if (produkDitemukan.length > 0) {
    return produkDitemukan
      .map((p) => `📦 ${p.nama}\n${p.deskripsi}\nHarga: ${RUPIAH(p.harga)} | Stok: ${p.stok > 0 ? p.stok + " unit" : "Habis"}`)
      .join("\n\n");
  }

  if (t.includes("kategori") || t.includes("apa aja") || t.includes("produk apa") || t.includes("jual apa")) {
    const kategori = [...new Set(INVENTORY.map((p) => p.kategori))];
    return `Kami menjual produk kategori: ${kategori.join(", ")}. Ada sekitar ${INVENTORY.length} jenis produk tersedia. Mau lihat salah satu kategorinya?`;
  }

  return "Maaf, saya belum menangkap maksud pertanyaannya 🙏 Coba tanyakan nama produk, harga, atau stok secara spesifik — atau ketik \"produk apa aja\" untuk lihat katalog. Jika butuh bantuan lebih lanjut, saya bisa sambungkan ke agen manusia.";
}

export default function ChatbotCS() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Halo! Saya asisten customer service otomatis, online 24 jam untuk bantu Anda 🙌 Tanyakan apa saja soal produk, harga, atau stok.", time: waktu() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState("");
  const endRef = useRef(null);

  function waktu() {
    return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function kirimPesan(teksKirim) {
    const teks = (teksKirim ?? input).trim();
    if (!teks) return;
    const userMsg = { id: Date.now(), sender: "user", text: teks, time: waktu() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 500 + Math.random() * 600;
    setTimeout(() => {
      const jawaban = jawabPertanyaan(teks);
      setMessages((m) => [...m, { id: Date.now() + 1, sender: "bot", text: jawaban, time: waktu() }]);
      setTyping(false);
    }, delay);
  }

  const produkFiltered = INVENTORY.filter(
    (p) => p.nama.toLowerCase().includes(query.toLowerCase()) || p.kategori.toLowerCase().includes(query.toLowerCase())
  );

  const cepat = ["Produk apa aja?", "Cek stok sepatu sneakers", "Harga powerbank", "Cara retur barang?"];

  return (
    <div className="min-h-screen w-full bg-[#EEF1F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* ===== CHAT PANEL ===== */}
        <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[640px] overflow-hidden border border-[#DCE1EC]">
          <div className="bg-[#22265B] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3A3D8F] flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <div className="font-semibold tracking-tight">Asisten CS Toko</div>
                <div className="text-[11px] text-[#B9BEEA] flex items-center gap-1">
                  <Circle size={7} className="fill-[#4ADE80] text-[#4ADE80]" /> Online — siap 24 jam
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] bg-[#3A3D8F]/60 px-2.5 py-1 rounded-full">
              <Clock size={12} /> 24/7
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F7F8FC]">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.sender === "user" ? "bg-[#E8A33D]" : "bg-[#3A3D8F]"}`}>
                    {m.sender === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                  </div>
                  <div>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-line ${
                        m.sender === "user" ? "bg-[#22265B] text-white rounded-br-sm" : "bg-white text-[#22265B] border border-[#E2E5F0] rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className={`text-[10px] text-[#9AA0B8] mt-1 ${m.sender === "user" ? "text-right" : ""}`}>{m.time}</div>
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#3A3D8F] flex items-center justify-center"><Bot size={14} className="text-white" /></div>
                <div className="bg-white border border-[#E2E5F0] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#9AA0B8] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#9AA0B8] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#9AA0B8] rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap bg-[#F7F8FC]">
            {cepat.map((c) => (
              <button
                key={c}
                onClick={() => kirimPesan(c)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-[#DCE1EC] bg-white text-[#3A3D8F] hover:bg-[#EEF1F6] transition"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[#E2E5F0] bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && kirimPesan()}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[#DCE1EC] text-sm focus:outline-none focus:ring-2 focus:ring-[#3A3D8F]/30"
            />
            <button
              onClick={() => kirimPesan()}
              className="w-10 h-10 rounded-full bg-[#22265B] text-white flex items-center justify-center hover:bg-[#3A3D8F] transition shrink-0"
              aria-label="Kirim"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* ===== PANEL INVENTORY (simulasi koneksi real-time) ===== */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DCE1EC] h-[640px] flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-[#E2E5F0]">
            <div className="flex items-center gap-2 text-[#22265B] font-semibold">
              <Package size={16} /> Data Inventory
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#4ADE80] mt-1">
              <CheckCircle2 size={12} /> Tersambung ke sistem stok
            </div>
            <div className="relative mt-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0B8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#DCE1EC] text-xs focus:outline-none focus:ring-2 focus:ring-[#3A3D8F]/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {produkFiltered.map((p) => (
              <div key={p.id} className="border border-[#E2E5F0] rounded-xl p-3 hover:bg-[#F7F8FC] transition">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-[13px] font-medium text-[#22265B]">{p.nama}</div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      p.stok === 0 ? "bg-red-50 text-red-500" : p.stok < 10 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {p.stok === 0 ? "Habis" : `Stok ${p.stok}`}
                  </span>
                </div>
                <div className="text-[11px] text-[#9AA0B8] mt-0.5">{p.kategori} · {p.id}</div>
                <div className="text-[13px] font-semibold text-[#3A3D8F] mt-1.5">{RUPIAH(p.harga)}</div>
              </div>
            ))}
            {produkFiltered.length === 0 && <div className="text-xs text-[#9AA0B8] text-center py-6">Produk tidak ditemukan.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
