import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// import "./App.css";

function generateRandomInt() {
  const result = Math.floor(Math.random() * 100);
  return result;
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};
const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => generateRandomInt()),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    // {
    //   label: "Dataset 2",
    //   data: labels.map(() => generateRandomInt()),
    //   borderColor: "rgb(53, 162, 235)",
    //   backgroundColor: "rgba(53, 162, 235, 0.5)",
    // },
  ],
};

function App() {
  const [pdfExportLoading, setPdfExportLoading] = useState(false);

  const exportToPdf = () => {
    try {
      setPdfExportLoading(true);
      const doc = new jsPDF();

      const element = document.getElementById("pdf-export-area");

      if (!element) {
        console.error("Element not found");
        setPdfExportLoading(false);
        return;
      }

      // Hide all elements with the class "hide-item"
      const items = document.querySelectorAll(".hide-item");
      items.forEach((el) => (el.style.display = "none"));

      html2canvas(element)
        .then((canvas) => {
          
          // Show elements again after export
          items.forEach((el) => (el.style.display = ""));

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 210; // A4 mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let position = 0;

          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          doc.save(`pdf-export-file-${Date.now()}.pdf`);

          setPdfExportLoading(false);
        })
        .catch((error) => {
          console.error("html2canvas error: ", error);
          setPdfExportLoading(false);
        });
    } catch (error) {
      setPdfExportLoading(false);
      console.error("exportToPdf error: " + error);
    }
  };

  const exportToXLSX = (arrayData = [], fileName = "file") => {
    try {
      const fileMimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const normalizedFileName = `${fileName}_export_${Date.now()}.${fileExtension}`;

      const ws = XLSX.utils.json_to_sheet(arrayData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileMimeType });
      FileSaver.saveAs(data, normalizedFileName);
    } catch (error) {
      console.error("exportToXLSX error: " + error);
    }
  };

  const exportData = () => {
    const arrayData = labels.map((item, index) => ({
      Month: item,
      Count: data.datasets[0].data[index],
    }));
    exportToXLSX(arrayData, "my-excel");
  };

  return (
    <>
      <div className="container">
        <h1>Vite + React</h1>
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginRight: 10 }}
            onClick={exportToPdf}
            disabled={pdfExportLoading}
          >
            {pdfExportLoading ? "Exporting..." : "Export to PDF"}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={exportData}
          >
            Export to XLSX
          </button>
        </div>
        <div className="row" id="pdf-export-area">
          <h1 className="hide-item">Hide this area while exporting PDF</h1>
          <div className="col-md-6">
            <div className="card">
              <Line options={options} data={data} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <Line options={options} data={data} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <Line options={options} data={data} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <Line options={options} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
