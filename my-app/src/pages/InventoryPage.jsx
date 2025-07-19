import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InventoryPage = () => {
  const [approvedPOs, setApprovedPOs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/approved-pos')
      .then(res => res.json())
      .then(data => setApprovedPOs(data))
      .catch(err => console.error("Error fetching approved POs:", err));
  }, []);

  const handleExportPDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Approved_POs.pdf');
    });
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fafafa' }}>
      <div style={headerStyle}>
        <BackButton />
        <button onClick={handleExportPDF} style={exportBtnStyle}>
          Export as PDF
        </button>
      </div>

      <div id="pdf-content" style={pdfContentStyle}>
        <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>Approved Purchase Orders (Inventory)</h2>

        {approvedPOs.length === 0 ? (
          <p>No approved POs yet.</p>
        ) : (
          <table style={tableStyle}>
            <thead style={{ backgroundColor: '#e3f2fd' }}>
              <tr>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Project</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {approvedPOs.map(po =>
                po.items?.map((item, idx) => (
                  <tr key={`${po.id}-${idx}`}>
                    <td style={tdStyle}>{item.item}</td>
                    <td style={tdStyle}>{item.project}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>{item.vendor}</td>
                    <td style={tdStyle}>{item.deliveryDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const exportBtnStyle = {
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const pdfContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  backgroundColor: '#f0f8ff',
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

export default InventoryPage;
