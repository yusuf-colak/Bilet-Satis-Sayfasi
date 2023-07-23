import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SeferData } from "./Sefer";
import axios from "axios";

import "./CSS/koltukSec.css";

type secilenCinsiyet = "Erkek" | "Kadın";

interface SeatData {
  secilenKoltukNumarasi: number;
  secilenCinsiyet: secilenCinsiyet;
}
interface KoltukSecProps {
  sefer: SeferData;
}
interface Satilmislar {
  seferId: number;
  koltukNo: number;
  cinsiyet: string;
}

const KoltukSec: React.FC<KoltukSecProps> = ({ sefer }) => {
  const [secilenler, setSecilenler] = useState<SeatData[]>([]);
  const [showsecilenCinsiyetModal, setShowsecilenCinsiyetModal] =
    useState<boolean>(false);
  const [secilenNumara, setSecilenNumara] = useState<number | null>(null);
  const [tutar, setTutar] = useState<number>(0);
  const [satılmısKoltuklar, setSatılmısKoltuklar] = useState<Satilmislar[]>([]);
  const {
    id,
    seferSirketResim,
    seferSirketi,
    seferKalkisYeri,
    seferVarisYeri,
    seferTarihi,
    seferSuresi,
    seferSaati,
    seferKapasitesi,
    seferUcreti,
    seferAciklama,
    seferKoltukDüzeni,
  } = sefer;

  // Satılmış olan koltukların verisini çekiyoruz
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/koltuk/koltukBul",
          { seferId: id }
        );
        const veriler = response.data;
        setSatılmısKoltuklar(veriler);
      } catch (error) {
        // Hata durumunda yapılacak işlemler
        console.error("Bir hata oluştu:", error);
      }
    };

    fetchData();
  }, []);
  //-----------------------------------------------------------

  // Satılmış olan koltukların verisini consol da görüyoruz

  // useEffect(() => {
  //   console.log("Satılmış Olan Koltuklar ", satılmısKoltuklar);
  //   satılmısKoltuklar.forEach((satilmis) => {
  //     console.log(
  //       "Satılmış Koltuk Numarası ve Cinsiyeti: ",
  //       satilmis.koltukNo,
  //       satilmis.cinsiyet
  //     );
  //   });
  //   console.log("Seçilen Koltuklar ", secilenler);
  // }, [satılmısKoltuklar, secilenler]);

  //-----------------------------------------------------------
  const handleSeatClick = (koltuk: number) => {
    if (
      satılmısKoltuklar.some((satilmis) => Number(satilmis.koltukNo) === koltuk)
    ) {
      toast.error("Bu koltuk satılmıştır.");
    } else {
      const seatIndex = secilenler.findIndex(
        (seatData) => seatData.secilenKoltukNumarasi === koltuk
      );

      if (seatIndex !== -1) {
        // Koltuk seçiliyse seçimden çıkarıyoruz
        setSecilenler((prevsecilenler) =>
          prevsecilenler.filter((_, index) => index !== seatIndex)
        );
      } else if (secilenler.length < 5) {
        // Koltuk sayısı 5 olana kadar ekliyoruz
        setSecilenNumara(koltuk);
        setShowsecilenCinsiyetModal(true);
      } else {
        // 6. eklemeye çalışıldığında hata veriyor
        toast.error("En fazla 5 koltuk seçebilirsiniz.");
      }
    }
  };

  const handlesecilenCinsiyetSelect = (secilenCinsiyet: secilenCinsiyet) => {
    setShowsecilenCinsiyetModal(false);
    if (secilenNumara !== null) {
      setSecilenler((prevsecilenler) => [
        ...prevsecilenler,
        { secilenKoltukNumarasi: secilenNumara, secilenCinsiyet },
      ]);
      setSecilenNumara(null);
    }
  };

  const Koltuklar: number[] = [];
  for (let i = 1; i <= 50; i++) {
    Koltuklar.push(i);
  }
  // Koltukları otobüste konumlandırdılk ve aralarında boşluk bıraktık
  const getMarginBottom = (koltuk: number): string => {
    if (koltuk === 26) return "1px";
    if (koltuk > 26 && (koltuk - 26) % 4 === 2) {
      return "35px";
    }
    if (koltuk < 26 && koltuk % 4 === 2) {
      return "35px";
    }
    return "1px";
  };
  const get25Number = (koltuk: number): string => {
    return koltuk === 25 ? "109px" : "1px";
  };
  //-----------------------------------------------------------

  // Koltukları seçildiğinde yeşil renge boyuyoruz  ve Seçilen koltukları cinsiyete göre boyuyoruz
  const getSeatBgColor = (koltuk: number): string => {
    const seatData = secilenler.find(
      (seatData) => seatData.secilenKoltukNumarasi === koltuk
    );
    return seatData?.secilenCinsiyet === "Erkek"
      ? "#50a4f3"
      : seatData?.secilenCinsiyet === "Kadın"
      ? "#bd8598"
      : "";
  };
  //-----------------------------------------------------------

  useEffect(() => {
    const updatedTutar = secilenler.length * Number(seferUcreti);
    setTutar(updatedTutar);
  }, [secilenler.length, seferUcreti]);

  // Satılmış koltukları cinsiyete göre mavi veya pembe renge boyuyoruz

  const koltuklarRendered = Koltuklar.map((koltuk) => {
    const isSatilmisKoltuk = satılmısKoltuklar.some(
      (satilmis) => Number(satilmis.koltukNo) === koltuk
    );

    const seatData = secilenler.find(
      (seatData) => seatData.secilenKoltukNumarasi === koltuk
    );

    const backgroundColor = isSatilmisKoltuk
      ? satılmısKoltuklar.find(
          (satilmis) => Number(satilmis.koltukNo) === koltuk
        )?.cinsiyet === "Erkek"
        ? "blue"
        : "pink"
      : seatData?.secilenCinsiyet === "Erkek"
      ? "#50a4f3"
      : seatData?.secilenCinsiyet === "Kadın"
      ? "#bd8598"
      : "";

    return (
      <div
        className="K-MAP"
        key={koltuk}
        style={{
          marginBottom: getMarginBottom(koltuk),
          marginTop: get25Number(koltuk),
          backgroundColor,
        }}
        onClick={() => handleSeatClick(koltuk)}
      >
        <div id="K-Koltuklar">{koltuk} </div>
      </div>
    );
  });

  //-----------------------------------------------------------

  return (
    <div id="K-MainContainer">
      <div id="K-Container1">
        <div id="K-Container1_1">
          <img
            id="fotoDireksiyon"
            src="https://svgsilh.com/svg/150137.svg"
            alt="onTaraf"
          />
        </div>
        <div id="K-Container1_2">{koltuklarRendered}</div>

        {/* <div id="K-Container1_2">
          {Koltuklar.map((koltuk) => (
            <div
              className="K-MAP"
              key={koltuk}
              style={{
                marginBottom: getMarginBottom(koltuk),
                marginTop: get25Number(koltuk),
                backgroundColor: satılmısKoltuklar.some(
                  (satilmis) => Number(satilmis.koltukNo) === koltuk
                  // satılmış koltukları cinsityete göre mavi veya pembe renge boyamalıyız  burayı yaparmısın
                )
                  ? "red"
                  : secilenler.some(
                      (seatData) => seatData.secilenKoltukNumarasi === koltuk
                    )
                  ? "#52b680"
                  : "",
              }}
              onClick={() => handleSeatClick(koltuk)}
            >
              <div id="K-Koltuklar">{koltuk} </div>
            </div>
          ))}
        </div> */}
        <div>
          {showsecilenCinsiyetModal && (
            <div className="secilenCinsiyet-modal">
              <button onClick={() => handlesecilenCinsiyetSelect("Erkek")}>
                Erkek
              </button>
              <button onClick={() => handlesecilenCinsiyetSelect("Kadın")}>
                Kadın
              </button>
            </div>
          )}
        </div>
      </div>

      <div id="K-Container2">
        {secilenler.length > 0 ? (
          <div id="K-Container2_1">
            <div>
              <p>Seçilen Koltuklar</p>
              <div id="K-secilenler">
                {secilenler.map((seatData) => (
                  <div
                    id="K-secilenler-ic"
                    key={seatData.secilenKoltukNumarasi}
                  >
                    <div
                      className="K-MAP"
                      style={{
                        backgroundColor: getSeatBgColor(
                          seatData.secilenKoltukNumarasi
                        ),
                      }}
                    >
                      {seatData.secilenKoltukNumarasi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p>Toplam Tutar</p>
              <div id="K-tutar">{tutar} TL</div>
            </div>
          </div>
        ) : (
          <p>Lütfen soldan koltuk seçin.</p>
        )}
        <button disabled={secilenler.length < 1} id="K-Button">
          {" "}
          Ödeme Yap{" "}
        </button>
      </div>
    </div>
  );
};

export default KoltukSec;