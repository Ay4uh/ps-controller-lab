class Report {
  constructor(cpuResult, gpuResult, thermalData) {
    this.cpuResult = cpuResult;
    this.gpuResult = gpuResult;
    this.thermalData = thermalData;
    this.timestamp = new Date();
  }

  // Generate summary
  generate() {
    const cpuPassed = this.cpuResult ? this.cpuResult.score > 60 : true;
    const gpuPassed = this.gpuResult ? this.gpuResult.score > 60 : true;
    const thermalOk = !this.thermalData.isThrottling();

    let overallScore = 0;
    if (this.cpuResult && this.gpuResult) {
      overallScore = Math.round((this.cpuResult.score + this.gpuResult.score) / 2);
    } else if (this.cpuResult) {
      overallScore = this.cpuResult.score;
    } else if (this.gpuResult) {
      overallScore = this.gpuResult.score;
    }

    return {
      timestamp: this.timestamp,
      overall: {
        passed: cpuPassed && gpuPassed && thermalOk,
        score: overallScore
      },
      cpu: this.cpuResult,
      gpu: this.gpuResult,
      thermal: {
        avgTemp: this.thermalData.getAverage(),
        maxTemp: this.thermalData.getMax(),
        throttled: this.thermalData.isThrottling()
      },
      issues: this.detectIssues()
    };
  }

  // Detect problems
  detectIssues() {
    const issues = [];

    if (this.cpuResult && this.cpuResult.score < 60) {
      issues.push('CPU performance below threshold');
    }

    if (this.gpuResult && this.gpuResult.score < 60) {
      issues.push('GPU performance below threshold');
    }

    if (this.thermalData.isThrottling()) {
      issues.push('Thermal throttling detected - clean vents or apply thermal paste');
    }

    if (this.thermalData.getMax() > 90) {
      issues.push('High temperature detected - improve cooling');
    }

    return issues;
  }

  // Export as JSON
  exportJSON() {
    return JSON.stringify(this.generate(), null, 2);
  }

  // Export as CSV
  exportCSV() {
    const data = this.generate();
    let csv = 'Metric,Value\n';
    csv += `Timestamp,${data.timestamp.toISOString()}\n`;
    csv += `Overall Score,${data.overall.score}\n`;
    if (data.cpu) {
      csv += `CPU Score,${data.cpu.score}\n`;
    }
    if (data.gpu) {
      csv += `GPU Score,${data.gpu.score}\n`;
    }
    csv += `Avg Temp,${data.thermal.avgTemp.toFixed(1)}\n`;
    csv += `Max Temp,${data.thermal.maxTemp.toFixed(1)}\n`;
    csv += `Throttled,${data.thermal.throttled}\n`;
    return csv;
  }

  // Download file
  download(format = 'json') {
    const content = format === 'json' ? this.exportJSON() : this.exportCSV();
    const filename = `stress-test-report-${Date.now()}.${format}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

window.Report = Report;
