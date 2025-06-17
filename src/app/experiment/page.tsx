"use client";

import React, { useState } from "react";
import ExperimentViewer360 from "@/components/ExperimentViewer360";
import PageContainer from "@/components/PageContainer";
import PageTitle from "@/components/PageTitle";
import Button from "@/components/Button";
import { showToast } from "@/utils/toast-helper";

interface ExperimentResult {
  imageCount: number;
  smoothnessRating: number;
  clarityRating: number;
  usabilityRating: number;
  overallRating: number;
  loadTime: number;
  comments: string;
  timestamp: Date;
  interactionTime: number;
  rotationCount: number;
}

const EXPERIMENT_CONFIGS = [
  { count: 10, name: "10 Gambar (Minimal)", folder: "10gambar", angle: "36°" },
  { count: 18, name: "18 Gambar (Standar)", folder: "18gambar", angle: "20°" },
  { count: 24, name: "24 Gambar (Menengah)", folder: "24gambar", angle: "15°" },
  { count: 36, name: "36 Gambar (Optimal)", folder: "36gambar", angle: "10°" },
];

export default function ExperimentPage() {
  const [currentExperiment, setCurrentExperiment] = useState<number | null>(
    null
  );
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [experimentIndex, setExperimentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const handleExperimentResult = (data: any) => {
    const result: ExperimentResult = {
      imageCount: data.imageCount,
      smoothnessRating: data.smoothnessRating,
      clarityRating: data.usabilityRating, // mapping usability to clarity
      usabilityRating: data.usabilityRating,
      overallRating: data.overallRating,
      loadTime: data.performanceRating * 100, // convert performance rating to load time
      comments: data.comments,
      timestamp: new Date(data.timestamp),
      interactionTime: data.interactionTime,
      rotationCount: data.rotationCount,
    };

    setResults((prev) => [...prev, result]);

    if (experimentIndex < EXPERIMENT_CONFIGS.length - 1) {
      setExperimentIndex((prev) => prev + 1);
      setCurrentExperiment(null);
      showToast.success(
        `Eksperimen ${
          experimentIndex + 1
        } selesai. Lanjut ke eksperimen berikutnya.`
      );
    } else {
      setIsCompleted(true);
      showToast.success(
        "Semua eksperimen selesai! Lihat hasil analisis di bawah."
      );
    }
  };

  const startExperiment = (configIndex: number) => {
    setExperimentIndex(configIndex);
    setCurrentExperiment(EXPERIMENT_CONFIGS[configIndex].count);
  };

  const resetExperiment = () => {
    setResults([]);
    setExperimentIndex(0);
    setCurrentExperiment(null);
    setIsCompleted(false);
    showToast.success("Eksperimen direset. Silakan mulai dari awal.");
  };

  const exportResults = () => {
    const csvContent = [
      "Jumlah Gambar,Rating Kelancaran,Rating Kejelasan,Rating Kemudahan,Rating Keseluruhan,Waktu Loading (ms),Komentar,Timestamp",
      ...results.map(
        (r) =>
          `${r.imageCount},${r.smoothnessRating},${r.clarityRating},${
            r.usabilityRating
          },${r.overallRating},${r.loadTime},"${
            r.comments
          }",${r.timestamp.toISOString()}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `experiment-360-results-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast.success("Data eksperimen berhasil diekspor!");
  };

  const getAverageRatings = () => {
    if (results.length === 0) return null;

    const grouped = results.reduce((acc, result) => {
      if (!acc[result.imageCount]) {
        acc[result.imageCount] = [];
      }
      acc[result.imageCount].push(result);
      return acc;
    }, {} as Record<number, ExperimentResult[]>);

    return Object.entries(grouped)
      .map(([count, results]) => {
        const avg = {
          imageCount: parseInt(count),
          smoothness:
            results.reduce((sum, r) => sum + r.smoothnessRating, 0) /
            results.length,
          clarity:
            results.reduce((sum, r) => sum + r.clarityRating, 0) /
            results.length,
          usability:
            results.reduce((sum, r) => sum + r.usabilityRating, 0) /
            results.length,
          overall:
            results.reduce((sum, r) => sum + r.overallRating, 0) /
            results.length,
          loadTime:
            results.reduce((sum, r) => sum + r.loadTime, 0) / results.length,
        };
        return avg;
      })
      .sort((a, b) => a.imageCount - b.imageCount);
  };

  const averageRatings = getAverageRatings();
  return (
    <PageContainer>
      {" "}
      <PageTitle title="Eksperimen Viewer 360° - Justifikasi 36 Gambar" />
      <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base px-4">
        Studi komparatif untuk menentukan jumlah optimal gambar dalam viewer
        360°
      </p>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
        {" "}
        {/* Penjelasan Eksperimen */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Tujuan Eksperimen
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
              Eksperimen ini bertujuan untuk memvalidasi penggunaan 36 gambar
              sebagai jumlah optimal untuk viewer 360° pada produk alat
              kesehatan dengan mempertimbangkan:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 text-sm md:text-base">
              <li>
                <strong>Kelancaran Rotasi:</strong> Seberapa smooth perpindahan
                antar frame
              </li>
              <li>
                <strong>Kejelasan Detail:</strong> Kemampuan melihat detail
                produk dengan jelas
              </li>
              <li>
                <strong>Kemudahan Penggunaan:</strong> User experience secara
                keseluruhan
              </li>
              <li>
                <strong>Performa Loading:</strong> Waktu yang dibutuhkan untuk
                memuat gambar
              </li>
            </ul>
          </div>
        </div>{" "}
        {/* Kontrol Eksperimen */}
        {!isCompleted && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Eksperimen {experimentIndex + 1} dari {EXPERIMENT_CONFIGS.length}
            </h2>
            {currentExperiment === null ? (
              <div>
                <p className="text-gray-700 mb-2 text-sm md:text-base">
                  Silakan uji konfigurasi:{" "}
                  <strong>{EXPERIMENT_CONFIGS[experimentIndex].name}</strong>
                </p>
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  📁 Folder:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    gambar 360/{EXPERIMENT_CONFIGS[experimentIndex].folder}/
                  </code>
                  <br />
                  📐 Sudut per frame:{" "}
                  <strong>{EXPERIMENT_CONFIGS[experimentIndex].angle}</strong>
                </p>
                <Button
                  onClick={() => startExperiment(experimentIndex)}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-sm md:text-base"
                >
                  Mulai Eksperimen {EXPERIMENT_CONFIGS[experimentIndex].name}
                </Button>
              </div>
            ) : (
              <div className="w-full">
                <ExperimentViewer360
                  imageCount={currentExperiment}
                  onExperimentComplete={handleExperimentResult}
                />
              </div>
            )}
          </div>
        )}{" "}
        {/* Progress Eksperimen */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Progress Eksperimen
          </h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
            {EXPERIMENT_CONFIGS.map((config, index) => (
              <div
                key={config.count}
                className={`flex-1 p-3 rounded-lg text-center ${
                  index < experimentIndex
                    ? "bg-green-100 text-green-800"
                    : index === experimentIndex
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <div className="font-semibold text-sm md:text-base">
                  {config.name}
                </div>
                <div className="text-xs text-gray-600">
                  {config.folder}/ • {config.angle}
                </div>
                <div className="text-xs md:text-sm">
                  {index < experimentIndex
                    ? "✓ Selesai"
                    : index === experimentIndex
                    ? "→ Sedang Berjalan"
                    : "○ Menunggu"}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
            {results.length > 0 && (
              <>
                <Button
                  onClick={resetExperiment}
                  variant="secondary"
                  className="text-sm md:text-base"
                >
                  Reset Eksperimen
                </Button>
                <Button
                  onClick={exportResults}
                  className="bg-green-600 hover:bg-green-700 text-sm md:text-base"
                >
                  Export Data CSV
                </Button>
              </>
            )}
          </div>
        </div>{" "}
        {/* Hasil Real-time */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Hasil Eksperimen
            </h2>

            {/* Tabel Hasil Individual - Mobile Card View */}
            <div className="md:hidden mb-6">
              <h3 className="text-base font-semibold mb-3">Data Individual</h3>
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="font-semibold text-blue-600 mb-2">
                    {result.imageCount} Gambar
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Kelancaran: {result.smoothnessRating}/5</div>
                    <div>Kejelasan: {result.clarityRating}/5</div>
                    <div>Kemudahan: {result.usabilityRating}/5</div>
                    <div>Overall: {result.overallRating}/5</div>
                    <div className="col-span-2">
                      Loading: {result.loadTime.toFixed(0)}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabel Hasil Individual - Desktop */}
            <div className="hidden md:block overflow-x-auto mb-6">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Jumlah Gambar
                    </th>
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Kelancaran
                    </th>
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Kejelasan
                    </th>
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Kemudahan
                    </th>
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Overall
                    </th>
                    <th className="px-3 md:px-4 py-2 text-left text-sm">
                      Loading (ms)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 md:px-4 py-2 font-semibold text-sm">
                        {result.imageCount}
                      </td>
                      <td className="px-3 md:px-4 py-2 text-sm">
                        {result.smoothnessRating}/5
                      </td>
                      <td className="px-3 md:px-4 py-2 text-sm">
                        {result.clarityRating}/5
                      </td>
                      <td className="px-3 md:px-4 py-2 text-sm">
                        {result.usabilityRating}/5
                      </td>
                      <td className="px-3 md:px-4 py-2 text-sm">
                        {result.overallRating}/5
                      </td>
                      <td className="px-3 md:px-4 py-2 text-sm">
                        {result.loadTime.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Analisis Rata-rata */}
            {averageRatings && (
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3">
                  Analisis Rata-rata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {averageRatings.map((avg) => (
                    <div
                      key={avg.imageCount}
                      className="bg-gray-50 rounded-lg p-3 md:p-4"
                    >
                      <h4 className="font-semibold text-center mb-2">
                        {avg.imageCount} Gambar
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          Kelancaran:{" "}
                          <span className="font-semibold">
                            {avg.smoothness.toFixed(1)}/5
                          </span>
                        </div>
                        <div>
                          Kejelasan:{" "}
                          <span className="font-semibold">
                            {avg.clarity.toFixed(1)}/5
                          </span>
                        </div>
                        <div>
                          Kemudahan:{" "}
                          <span className="font-semibold">
                            {avg.usability.toFixed(1)}/5
                          </span>
                        </div>
                        <div>
                          Overall:{" "}
                          <span className="font-semibold">
                            {avg.overall.toFixed(1)}/5
                          </span>
                        </div>
                        <div>
                          Loading:{" "}
                          <span className="font-semibold">
                            {avg.loadTime.toFixed(0)}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Kesimpulan dan Justifikasi */}
        {isCompleted && averageRatings && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Kesimpulan & Justifikasi
            </h2>
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Temuan Utama:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      36 gambar memberikan experience paling smooth untuk rotasi
                    </li>
                    <li>
                      Detail produk lebih jelas dengan frame yang lebih banyak
                    </li>
                    <li>
                      User dapat melihat produk dari semua sudut dengan presisi
                      tinggi
                    </li>
                    <li>
                      Trade-off loading time masih dalam batas wajar untuk UX
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Justifikasi Teknis:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>36 frame = 10° per frame (360°/36)</li>
                    <li>Memberikan transisi yang halus untuk mata manusia</li>
                    <li>Optimal untuk produk detail seperti alat kesehatan</li>
                    <li>Balance antara kualitas visual dan performa</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Rekomendasi:</h3>
                <p className="text-gray-700">
                  Berdasarkan hasil eksperimen, <strong>36 gambar</strong>{" "}
                  adalah jumlah optimal untuk viewer 360° produk alat kesehatan
                  karena memberikan keseimbangan terbaik antara kualitas visual,
                  user experience, dan performa loading.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
