// ===== 2.a Layout utama: navigasi Ajax =====
var pageInit = {};
var cacheKucing = null;

function getKucing(cb){
  if(cacheKucing) return cb(cacheKucing);
  $.getJSON("data/kucing.json").done(function(d){ cacheKucing=d; cb(d); })
   .fail(function(){ $("#konten").html('<p class="loading">Data kucing gagal dimuat. Jalankan lewat server lokal (Live Server / python -m http.server).</p>'); });
}

function loadPage(name){
  $("#konten").html('<p class="loading">Memuat halaman…</p>');
  $.ajax({url:"pages/"+name+".html", dataType:"html"})
   .done(function(html){
      $("#konten").html(html);
      if(pageInit[name]) pageInit[name]();
      window.scrollTo(0,0);
   })
   .fail(function(){ $("#konten").html('<p class="loading">Halaman tidak dapat dimuat. Jalankan lewat server lokal, bukan file://</p>'); });
  $("#menu a").removeClass("active").filter('[data-page="'+name+'"]').addClass("active");
  $("#menu").removeClass("open"); $("#menu-toggle").attr("aria-expanded","false");
}

var routes = {beranda:"beranda", katalog:"katalog", adopsi:"form-adopsi"};
function route(){ var h=location.hash.replace("#","")||"beranda"; loadPage(routes[h]||"beranda"); }

$(function(){
  // klik link ke halaman yang sedang aktif: muat ulang manual
  $(document).on("click","[data-page]",function(e){
    var p=$(this).data("page"), key=Object.keys(routes).filter(function(k){return routes[k]===p;})[0];
    if(location.hash==="#"+key){ e.preventDefault(); loadPage(p); }
  });
  $("#menu-toggle").on("click",function(){
    var o=$("#menu").toggleClass("open").hasClass("open"); $(this).attr("aria-expanded",o);
  });
  // tutup menu mobile saat klik di luar navbar
  $(document).on("click",function(e){
    if(!$(e.target).closest(".navbar").length){ $("#menu").removeClass("open"); $("#menu-toggle").attr("aria-expanded","false"); }
  });
  $(window).on("hashchange",route);
  route();
});

// ===== Beranda: pratinjau kucing yang bisa diajukan =====
pageInit.beranda = function(){
  getKucing(function(data){
    var pilih=data.filter(function(k){return k.bisa_diajukan;}).sort(function(a,b){return a.nama.localeCompare(b.nama);}).slice(0,4);
    var $g=$("#beranda-kucing").empty();
    pilih.forEach(function(k){
      $g.append('<article class="card"><div class="pic"><img src="'+k.foto+'" alt="Kucing '+k.nama+'" loading="lazy"></div><div class="body">'+
        '<h3>'+k.nama+' <small>#'+k.kode+'</small></h3><span>'+k.jk+' · '+k.lokasi+'</span>'+
        '<div><span class="tag ok">Steril</span> <span class="tag">'+k.kampus+'</span></div>'+
        '<div class="act"><a class="btn" href="#adopsi" data-kucing="'+k.id+'">Ajukan adopsi</a></div></div></article>');
    });
    $g.on("click","[data-kucing]",function(){ sessionStorage.setItem("kucingPilihan",$(this).data("kucing")); });
  });
};

// ===== 2.b Katalog interaktif =====
pageInit.katalog = function(){
  getKucing(function(data){
    var filter="semua", tampil=12, PER=12;
    var lokasi=[]; data.forEach(function(k){ if(lokasi.indexOf(k.lokasi)<0) lokasi.push(k.lokasi); });
    lokasi.sort().forEach(function(l){ $("#lokasi").append($("<option>").val(l).text(l)); });
    function hasil(){
      var q=$("#cari").val().toLowerCase(), lk=$("#lokasi").val();
      return data.filter(function(k){
        var f = filter==="semua" || (filter==="ajukan"&&k.bisa_diajukan) || (filter==="Diadopsi"&&k.status==="Diadopsi") || k.kampus===filter;
        return f && (!lk||k.lokasi===lk) && (k.nama+" "+k.kode+" "+k.lokasi+" "+k.ciri.join(" ")).toLowerCase().indexOf(q)>-1;
      }).sort(function(a,b){ return a.nama.localeCompare(b.nama); });
    }
    function render(reset){
      if(reset) tampil=PER;
      var list=hasil();
      $("#jumlah").text(list.length+" kucing ditemukan");
      var $g=$("#grid").empty();
      if(!list.length){ $("#lagi").hide(); return $g.append('<p class="empty">Tidak ada kucing yang cocok. Coba ubah kata kunci atau filter.</p>'); }
      list.slice(0,tampil).forEach(function(k){
        var badge = k.status==="Terdata" ? (k.steril==="Sudah steril"?'<span class="tag ok">Steril</span>':'<span class="tag">'+k.steril+'</span>') : '<span class="tag">'+k.status+'</span>';
        $g.append('<article class="card"><div class="pic"><img src="'+k.foto+'" alt="Kucing '+k.nama+'" loading="lazy"></div><div class="body">'+
          '<h3>'+k.nama+' <small>#'+k.kode+'</small></h3>'+
          '<span>'+k.jk+' · '+k.lokasi+'</span><div>'+badge+' <span class="tag">'+k.kampus+'</span></div>'+
          '<div class="act"><button class="btn ghost detail" data-id="'+k.id+'">Detail</button>'+
          (k.bisa_diajukan?'<a class="btn" href="#adopsi" data-kucing="'+k.id+'">Ajukan adopsi</a>':'')+'</div></div></article>');
      });
      $("#lagi").toggle(list.length>tampil).text("Tampilkan lebih banyak ("+(list.length-tampil)+" lagi)");
    }
    $("#cari").on("input",function(){render(true);}); $("#lokasi").on("change",function(){render(true);});
    $("#lagi").on("click",function(){ tampil+=PER; render(); });
    $(".chip").on("click",function(){ $(".chip").removeClass("on"); $(this).addClass("on"); filter=$(this).data("f"); render(true); });
    $("#grid").on("click",".detail",function(){
      var id=$(this).data("id"), k=data.filter(function(x){return x.id==id;})[0];
      var ciri=k.ciri.length? '<ul>'+k.ciri.map(function(c){return '<li>'+c+'</li>';}).join("")+'</ul>' : '<p class="hint">Belum ada ciri tercatat.</p>';
      $("#m-isi").html('<img class="detail-img" src="'+k.foto+'" alt="Kucing '+k.nama+'"><h2>'+k.nama+' <small>#'+k.kode+'</small></h2>'+
        '<p class="hint">'+k.jk+' · '+k.steril+' · Status: '+k.status+'<br>Lokasi: '+k.lokasi+' (Kampus '+k.kampus+')</p>'+ciri);
      $("#modal").addClass("open"); $("#m-tutup").focus();
    });
    $("#grid").on("click","[data-kucing]",function(){ sessionStorage.setItem("kucingPilihan",$(this).data("kucing")); });
    $("#m-tutup,#modal").on("click",function(e){ if(e.target===this) $("#modal").removeClass("open"); });
    $(document).off("keydown.modal").on("keydown.modal",function(e){ if(e.key==="Escape") $("#modal").removeClass("open"); });
    render(true);
  });
};

// ===== 2.c Form pengajuan + validasi =====
pageInit["form-adopsi"] = function(){
  getKucing(function(data){
    data.filter(function(k){return k.bisa_diajukan;}).sort(function(a,b){return a.nama.localeCompare(b.nama);}).forEach(function(k){
      $("#id_kucing").append('<option value="'+k.id+'">'+k.nama+' (#'+k.kode+')</option>');
    });
    var pilih=sessionStorage.getItem("kucingPilihan"); if(pilih) $("#id_kucing").val(pilih);
  });

  var rules={
    nama_pemohon:function(v){ if(!v) return "Nama lengkap wajib diisi."; if(v.length<3) return "Minimal 3 karakter."; if(v.length>100) return "Maksimal 100 karakter."; if(!/^[A-Za-z\s.'-]+$/.test(v)) return "Nama hanya boleh berisi huruf."; return ""; },
    nomor_whatsapp:function(v){ if(!v) return "Nomor WhatsApp wajib diisi."; if(!/^(\+62|62|0)8[0-9]{8,12}$/.test(v)) return "Gunakan format 08xx atau +628xx (10–14 digit)."; return ""; },
    email:function(v){ if(!v) return "Email wajib diisi."; if(v.length>150) return "Maksimal 150 karakter."; if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Format email tidak valid."; return ""; },
    id_kucing:function(v){ return v? "" : "Pilih kucing yang ingin diadopsi."; },
    jenis_hunian:function(v){ return v? "" : "Pilih jenis tempat tinggal."; },
    alamat:function(v){ if(!v) return "Alamat wajib diisi."; if(v.length<10) return "Alamat minimal 10 karakter."; return ""; },
    komitmen:function(v,$el){ return $el.is(":checked")? "" : "Anda harus menyetujui pernyataan komitmen."; }
  };
  function cek($el){
    var msg=rules[$el.attr("name")]($.trim($el.val()),$el), $f=$el.closest(".field");
    $f.toggleClass("invalid",!!msg).toggleClass("valid",!msg).find(".msg").text(msg);
    return !msg;
  }
  $("#form-adopsi")
   .on("blur","input:not([type=checkbox]),textarea",function(){ cek($(this)); })
   .on("input change","input,select,textarea",function(){ if($(this).closest(".field").is(".invalid,.valid")) cek($(this)); })
   .on("submit",function(e){
      e.preventDefault();
      var ok=true, $first=null;
      $(this).find("input,select,textarea").each(function(){ if(!cek($(this))){ ok=false; if(!$first) $first=$(this); } });
      if(!ok){ $first.focus(); return; }   // validasi gagal: tidak dikirim ke server
      var no="ADP-"+new Date().getFullYear()+"-"+(Math.floor(Math.random()*900)+100);
      var kode=Math.random().toString(36).slice(2,10).toUpperCase();
      var payload=$(this).serialize()+"&nomor_pengajuan="+no+"&kode_tracking="+kode+"&status_pengajuan=Menunggu Review";
      var $btn=$("#btn-kirim").prop("disabled",true).text("Mengirim…");
      // Submit ke server HTTP (httpbin.org = server uji). Ganti dengan endpoint PHP kelompok bila ada.
      $.ajax({url:"https://httpbin.org/post",method:"POST",data:payload})
       .always(function(_d,status){
          $btn.prop("disabled",false).text("Kirim pengajuan");
          $("#hasil").html('<div class="result"><strong>Pengajuan diterima.</strong><br>Nomor pengajuan: <b>'+no+'</b><br>Kode tracking: <b>'+kode+'</b><br>Simpan keduanya untuk mengecek status.'+(status==="error"?'<br><span class="hint">Server uji tidak dapat dihubungi, sehingga data hanya divalidasi di browser.</span>':'')+'</div>')[0].scrollIntoView({behavior:"smooth"});
          $("#form-adopsi")[0].reset(); $(".field").removeClass("valid invalid");
       });
   });
};
