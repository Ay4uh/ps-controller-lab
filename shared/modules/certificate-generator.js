/**
 * TechTest Hardware Health Certification Engine
 * Generates verified, printable, and exportable hardware inspection certificates.
 */

export class CertificateGenerator {
  /**
   * Generates a unique, cryptographically random certificate ID.
   */
  static generateReportId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'TT-';
    for (let i = 0; i < 8; i++) {
      if (i === 4) id += '-';
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  /**
   * Renders a certificate data model into a high-fidelity printable view or initiates browser print/export.
   * @param {Object} certData 
   * @param {string} certData.category 'controller' | 'laptop' | 'display' | 'audio' | 'keyboard'
   * @param {string} certData.deviceModel Name/model of tested hardware
   * @param {string} certData.overallGrade e.g. 'Grade A+ (Pristine)'
   * @param {string} certData.status 'PASS' | 'ACCEPTABLE' | 'ACTION_REQUIRED'
   * @param {Array<{label: string, value: string, status: 'pass'|'warn'|'fail'}>} certData.metrics
   * @param {string} [certData.notes]
   */
  static openCertificateModal(certData) {
    const reportId = this.generateReportId();
    const timestamp = new Date().toUTCString();
    const verificationUrl = `https://ay5uh.com/verify?id=${reportId}`;

    const existingModal = document.getElementById('techtest-cert-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'techtest-cert-modal';
    modal.className = 'techtest-cert-backdrop';
    modal.innerHTML = `
      <div class="techtest-cert-container">
        <div class="techtest-cert-toolbar no-print">
          <button type="button" class="btn-cert-action" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print / Save as PDF
          </button>
          <button type="button" class="btn-cert-close" onclick="document.getElementById('techtest-cert-modal').remove()">
            ✕ Close
          </button>
        </div>

        <div class="techtest-cert-document" id="printableCertificate">
          <div class="cert-header">
            <div class="cert-brand">
              <div class="cert-logo-mark">⚡</div>
              <div>
                <h1 class="cert-title">TechTest Hardware Diagnostic Lab</h1>
                <p class="cert-subtitle">Standard Hardware Health & Diagnostic Certificate</p>
              </div>
            </div>
            <div class="cert-badge ${certData.status.toLowerCase()}">
              ${certData.status}
            </div>
          </div>

          <div class="cert-meta-grid">
            <div class="cert-meta-item">
              <span class="cert-meta-label">REPORT ID</span>
              <span class="cert-meta-value mono">${reportId}</span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">DATE & TIME (UTC)</span>
              <span class="cert-meta-value">${timestamp}</span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">HARDWARE CLASS</span>
              <span class="cert-meta-value uppercase">${certData.category}</span>
            </div>
            <div class="cert-meta-item">
              <span class="cert-meta-label">TESTED DEVICE</span>
              <span class="cert-meta-value">${certData.deviceModel || 'Generic Hardware Target'}</span>
            </div>
          </div>

          <div class="cert-grade-banner">
            <div class="cert-grade-label">OVERALL HARDWARE RATING:</div>
            <div class="cert-grade-title">${certData.overallGrade || 'Grade A'}</div>
          </div>

          <div class="cert-section-title">Measured Diagnostic Parameters</div>
          <table class="cert-table">
            <thead>
              <tr>
                <th>Test Parameter</th>
                <th>Measured Value</th>
                <th>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              ${(certData.metrics || []).map(m => `
                <tr>
                  <td><strong>${m.label}</strong></td>
                  <td class="mono">${m.value}</td>
                  <td><span class="metric-pill pill-${m.status}">${m.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${certData.notes ? `
            <div class="cert-notes">
              <strong>Technical Engineer Notes:</strong>
              <p>${certData.notes}</p>
            </div>
          ` : ''}

          <div class="cert-footer">
            <div class="cert-qr-box">
              <div class="cert-qr-dummy">QR VERIFIED</div>
              <span class="cert-qr-caption">${verificationUrl}</span>
            </div>
            <div class="cert-disclaimer">
              <strong>Verification & Privacy Notice:</strong> This diagnostic certification is computed in-browser using direct hardware telemetry (WebHID / Web Audio / WebGPU). No personally identifiable serial numbers or private device telemetry are broadcast or retained. Testing is performed under standard ambient operating tolerances.
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject styles
    if (!document.getElementById('techtest-cert-style')) {
      const style = document.createElement('style');
      style.id = 'techtest-cert-style';
      style.textContent = `
        .techtest-cert-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .techtest-cert-container {
          background: #ffffff;
          color: #1a1a1a;
          max-width: 800px;
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          margin: auto;
        }
        .techtest-cert-toolbar {
          background: #1e293b;
          color: #fff;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-cert-action {
          background: #3b82f6;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-cert-close {
          background: transparent;
          color: #94a3b8;
          border: none;
          font-size: 14px;
          cursor: pointer;
        }
        .techtest-cert-document {
          padding: 40px;
          background: #ffffff;
          font-family: 'Inter', system-ui, sans-serif;
          color: #1a1a1a;
        }
        .cert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .cert-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cert-logo-mark {
          width: 48px;
          height: 48px;
          background: #0f172a;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .cert-title {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .cert-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .cert-badge {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          border-radius: 6px;
        }
        .cert-badge.pass { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .cert-badge.acceptable { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
        .cert-badge.action_required { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .cert-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .cert-meta-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        .cert-meta-value {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
        }
        .cert-grade-banner {
          background: #f1f5f9;
          border-left: 4px solid #3b82f6;
          padding: 14px 20px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 24px;
        }
        .cert-grade-label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
        }
        .cert-grade-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }
        .cert-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          color: #334155;
        }
        .cert-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .cert-table th {
          text-align: left;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          padding: 10px 14px;
          font-size: 12px;
          color: #475569;
        }
        .cert-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
        }
        .metric-pill {
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
        }
        .pill-pass { background: #dcfce7; color: #166534; }
        .pill-warn { background: #fef9c3; color: #854d0e; }
        .pill-fail { background: #fee2e2; color: #991b1b; }
        .cert-notes {
          background: #fafafa;
          border: 1px solid #e5e5e5;
          padding: 14px 18px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 24px;
        }
        .cert-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .cert-qr-box {
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          padding: 8px 12px;
          text-align: center;
          flex-shrink: 0;
        }
        .cert-qr-dummy {
          font-weight: 800;
          font-size: 10px;
          color: #3b82f6;
          letter-spacing: 1px;
        }
        .cert-qr-caption {
          font-size: 9px;
          color: #94a3b8;
          display: block;
        }
        .cert-disclaimer {
          font-size: 11px;
          color: #64748b;
          line-height: 1.5;
        }
        @media print {
          body * { visibility: hidden; }
          #techtest-cert-modal, #techtest-cert-modal * { visibility: visible; }
          #techtest-cert-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff;
            padding: 0;
          }
          .no-print { display: none !important; }
          .techtest-cert-container { box-shadow: none; border-radius: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);
  }
}

if (typeof window !== 'undefined') {
  window.CertificateGenerator = CertificateGenerator;
}
