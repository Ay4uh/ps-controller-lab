/**
 * TechTest Automated Verification & Unit Test Suite
 * Validates AnalogMath, PollingAnalyzer, RevisionDecoder, HallEffectDiagnostic, and CertificateGenerator.
 */

import { AnalogMath } from '../shared/modules/analog-math.js';
import { PollingAnalyzer } from '../shared/modules/polling-analyzer.js';
import { RevisionDecoder } from '../shared/modules/revision-decoder.js';
import { HallEffectDiagnostic } from '../shared/modules/hall-effect.js';
import { CertificateGenerator } from '../shared/modules/certificate-generator.js';
import { VirtualGamepadSimulator } from '../shared/modules/virtual-gamepad.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('\n=== RUNNING TECHTEST AUTOMATED TEST SUITE ===\n');

// 1. AnalogMath Tests
console.log('--- 1. Testing AnalogMath Engine ---');

// Test 1.1: Ideal unit circle circularity
const perfectCircleSamples = [];
for (let angle = 0; angle < 2 * Math.PI; angle += 0.05) {
  perfectCircleSamples.push({ x: Math.cos(angle), y: Math.sin(angle) });
}
const circleResult = AnalogMath.calculateCircularity(perfectCircleSamples);
assert(circleResult.errorPercentage < 1.0, `Perfect circle error should be < 1.0% (got ${circleResult.errorPercentage}%)`);
assert(circleResult.averageRadius >= 0.99 && circleResult.averageRadius <= 1.01, `Average radius should be ~1.0 (got ${circleResult.averageRadius})`);
assert(circleResult.cardinalSnapping === false, 'Perfect circle should not have cardinal snapping');

// Test 1.2: Drift Analysis (Ideal vs Defective)
const pristineSamples = [];
for (let i = 0; i < 100; i++) {
  pristineSamples.push({ x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, timestamp: i * 16 });
}
const pristineDrift = AnalogMath.analyzeDrift(pristineSamples);
assert(pristineDrift.status === 'Pass', `Pristine resting stick must pass (got ${pristineDrift.status})`);
assert(pristineDrift.offsetDistance < 0.02, `Pristine offset distance should be < 0.02 (got ${pristineDrift.offsetDistance})`);

const defectiveSamples = [];
for (let i = 0; i < 100; i++) {
  defectiveSamples.push({ x: 0.38 + (Math.random() * 0.02), y: 0.22, timestamp: i * 16 });
}
const defectiveDrift = AnalogMath.analyzeDrift(defectiveSamples);
assert(defectiveDrift.status === 'Fail', `Severe drift must fail (got ${defectiveDrift.status})`);
assert(defectiveDrift.grade.includes('Grade F'), `Defective stick should be Grade F (got ${defectiveDrift.grade})`);

// Test 1.3: Deadzone Curve Mapping
const insideDeadzone = AnalogMath.applyDeadzoneAndCurve(0.02, 0.01, 0.05, 1.0);
assert(insideDeadzone.x === 0 && insideDeadzone.y === 0, 'Coordinates inside inner deadzone must clamp to (0, 0)');

const outsideDeadzone = AnalogMath.applyDeadzoneAndCurve(0.5, 0.0, 0.05, 1.0, 'linear');
assert(outsideDeadzone.x > 0.45 && outsideDeadzone.x < 0.50, `Linear deadzone mapping should correctly scale (got ${outsideDeadzone.x})`);

// 2. PollingAnalyzer Tests
console.log('\n--- 2. Testing PollingAnalyzer Engine ---');
const analyzer = new PollingAnalyzer(100);
let time = 1000;
// Simulate steady 250 Hz (4ms interval)
for (let i = 0; i < 50; i++) {
  time += 4.0;
  analyzer.recordEvent(time);
}
let pollStats = analyzer.getStats();
assert(pollStats.frequencyHz === 250, `Polling frequency should be 250 Hz (got ${pollStats.frequencyHz})`);
assert(pollStats.avgIntervalMs === 4.0, `Average interval should be 4.0 ms (got ${pollStats.avgIntervalMs})`);
assert(pollStats.jitterMs < 0.05, `Synthetic interval jitter should be ~0 ms (got ${pollStats.jitterMs})`);

// 3. RevisionDecoder Tests
console.log('\n--- 3. Testing RevisionDecoder Database ---');
const bdm010 = RevisionDecoder.decode('AK8CFIZCT1');
assert(bdm010.matchFound && bdm010.details.revision === 'BDM-010', 'AK8CFIZCT1 must match BDM-010');

const bdm020 = RevisionDecoder.decode('AK8CFIZCT1A');
assert(bdm020.matchFound && bdm020.details.revision === 'BDM-020', 'AK8CFIZCT1A must match BDM-020');

const bdm030 = RevisionDecoder.decode('CFI-ZCT1W B');
assert(bdm030.matchFound && bdm030.details.revision === 'BDM-030', 'Trailing B must match BDM-030');

const bdm040 = RevisionDecoder.decode('AK8CFIZCT1C');
assert(bdm040.matchFound && bdm040.details.revision === 'BDM-040', 'AK8CFIZCT1C must match BDM-040');

const bdm050 = RevisionDecoder.decode('AK8CFIZCT1D');
assert(bdm050.matchFound && bdm050.details.revision === 'BDM-050', 'AK8CFIZCT1D must match BDM-050');

const edge = RevisionDecoder.decode('CFI-ZCP1');
assert(edge.matchFound && edge.details.revision === 'BDM-E010', 'CFI-ZCP1 must match DualSense Edge');

// 4. HallEffectDiagnostic Tests
console.log('\n--- 4. Testing HallEffectDiagnostic Engine ---');
const uncoupled = HallEffectDiagnostic.testMagneticInterference({ x: 0.002, y: 0.001 }, { x: 0.004, y: 0.002 });
assert(uncoupled.hasInterference === false, 'Minor shift < 0.035 should report no magnetic coupling');

const coupled = HallEffectDiagnostic.testMagneticInterference({ x: 0.002, y: 0.001 }, { x: 0.08, y: 0.09 });
assert(coupled.hasInterference === true, 'Shift > 0.035 should report magnetic coupling');

// 5. CertificateGenerator Tests
console.log('\n--- 5. Testing CertificateGenerator ---');
const certId1 = CertificateGenerator.generateReportId();
const certId2 = CertificateGenerator.generateReportId();
assert(certId1.startsWith('TT-'), `Certificate ID must start with TT- (got ${certId1})`);
assert(certId1.length === 12, `Certificate ID must be 12 chars (got ${certId1})`);
assert(certId1 !== certId2, 'Subsequent certificate IDs must be uniquely randomized');

// Cryptographic signing and verification
async function runAsyncTests() {
  const testPayload = JSON.stringify({ id: certId1, category: 'controller', grade: 'Grade A+', status: 'Certified' });
  const sig = await CertificateGenerator.signPayload(testPayload);
  assert(typeof sig === 'string' && sig.length >= 16, `HMAC signature should be a valid hex string (got ${sig})`);

  const isValid = await CertificateGenerator.verifySignature(testPayload, sig);
  assert(isValid === true, 'Signature must verify true for untouched payload');

  const tamperedPayload = JSON.stringify({ id: certId1, category: 'controller', grade: 'Grade F (Tampered)', status: 'Certified' });
  const isTamperedValid = await CertificateGenerator.verifySignature(tamperedPayload, sig);
  assert(isTamperedValid === false, 'Signature must reject tampered payload');

  // Procedural QR Code generation
  const qrSvg = CertificateGenerator.generateQrSvg('https://ay5uh.com/verify/?id=' + certId1, 100);
  assert(qrSvg.startsWith('<svg') && qrSvg.includes('</svg>'), 'QR generator must produce valid SVG string');
  assert(qrSvg.includes('<rect'), 'QR SVG must contain matrix rect elements');

  // 6. VirtualGamepadSimulator Tests
  console.log('\n--- 6. Testing VirtualGamepadSimulator ---');
  const sim = new VirtualGamepadSimulator();
  assert(sim.preset === 'pristine', 'Default preset should be pristine');
  assert(sim.params.driftX < 0.01 && sim.params.driftY < 0.01, 'Pristine preset should have negligible drift offset');

  sim.setPreset('moderate_drift');
  assert(sim.preset === 'moderate_drift', 'Preset should switch to moderate_drift');
  assert(sim.params.driftX === 0.14, 'Moderate drift offset should match preset config');

  sim.setPreset('severe_drift');
  assert(sim.preset === 'severe_drift', 'Preset should switch to severe_drift');
  assert(sim.params.cardinalSnap === true, 'Severe drift preset should exhibit cardinal snapping');

  sim.setPreset('hall_effect');
  assert(sim.preset === 'hall_effect', 'Preset should switch to hall_effect');
  assert(sim.params.noiseAmp === 0.0005, 'Hall effect preset should feature near-zero noise floor');

  // Test simulated frame dispatch
  let receivedFrame = null;
  sim.start((frame) => {
    receivedFrame = frame;
  });

  // Wait a small tick for simulator loop
  await new Promise(r => setTimeout(r, 60));
  sim.stop();

  assert(receivedFrame !== null, 'Simulator should dispatch telemetry frames');
  assert(receivedFrame.axes && receivedFrame.axes.length === 4, 'Frame must contain 4 stick axes [lx, ly, rx, ry]');
  assert(receivedFrame.rawImu && receivedFrame.rawImu.az === 8192, 'Frame must include realistic 6-axis IMU gravity vector');
  assert(receivedFrame.isSimulated === true, 'Frame must be clearly tagged as isSimulated: true');

  console.log(`\n=== TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED ===\n`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('ALL SUITE TESTS PASSED PERFECTLY (10/10)!\n');
  }
}

await runAsyncTests();
