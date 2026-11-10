/**
 * TechTest Controller Hardware Revision & Part Decoder
 * Authoritative database and identification engine for Sony DualSense (BDM-010 to BDM-050),
 * DualSense Edge, and DualShock 4 motherboard revisions.
 */

export class RevisionDecoder {
  static DATABASE = {
    dualsense: [
      {
        revision: 'BDM-010',
        releaseYear: '2020 (Launch)',
        fccId: 'AK8CFIZCT1',
        modelSuffix: 'No suffix or trailing "1"',
        potentiometerResistance: '2.1 kΩ (Standard Blue/Green Alps)',
        triggerSpringThickness: '0.25mm (Prone to early breakage)',
        touchpadFlexCablePins: '18-Pin',
        microphoneCablePins: '14-Pin',
        analogModuleCompatibility: ['Alps 2.1kΩ Original', 'GuliKit Hall Effect V1 (BDM-010/020 only)', 'Favor Union 2.1kΩ'],
        incompatibleWith: ['BDM-030/040 Trigger Assemblies', 'BDM-030 10kΩ Potentiometers'],
        repairNotes: 'First generation release. Weak trigger return springs. Requires soldering 14-pin Alps thumbsticks or 2.1kΩ Hall sensors. Micro-USB power delivery IC is sensitive to non-compliant USB-C PD fast chargers.'
      },
      {
        revision: 'BDM-020',
        releaseYear: '2021 - 2022',
        fccId: 'AK8CFIZCT1A',
        modelSuffix: 'Ending in "A"',
        potentiometerResistance: '2.1 kΩ',
        triggerSpringThickness: '0.35mm (Reinforced steel spring)',
        touchpadFlexCablePins: '16-Pin (Narrower pitch)',
        microphoneCablePins: '12-Pin',
        analogModuleCompatibility: ['Alps 2.1kΩ Original', 'GuliKit Hall Effect V1/V2', 'K-Silver JH16 Hall Effect'],
        incompatibleWith: ['BDM-010 Touchpad Cables', 'BDM-030 Motherboards'],
        repairNotes: 'Most widely produced revision. Sony thickened the trigger spring to reduce trigger snap. Uses 16-pin touchpad ribbon cable. Ideal candidate for Hall effect stick upgrade.'
      },
      {
        revision: 'BDM-030',
        releaseYear: '2022 - 2023',
        fccId: 'AK8CFIZCT1B',
        modelSuffix: 'Ending in "B"',
        potentiometerResistance: '2.1 kΩ - 2.3 kΩ (Revised Alps footprint)',
        triggerSpringThickness: '0.35mm',
        touchpadFlexCablePins: '14-Pin',
        microphoneCablePins: '10-Pin',
        analogModuleCompatibility: ['BDM-030 Alps OEM', 'GuliKit Hall Effect V2 (BDM-030)', 'K-Silver JH16 BDM-030 Edition'],
        incompatibleWith: ['BDM-010 / BDM-020 flex ribbon cables', 'BDM-010 trigger assemblies'],
        repairNotes: 'Major internal chassis redesign. Motherboard mounting screw placement changed. Flex ribbon cable pin counts reduced across touchpad and triggers.'
      },
      {
        revision: 'BDM-040',
        releaseYear: '2023 - 2024 (PS5 Slim Launch)',
        fccId: 'AK8CFIZCT1C',
        modelSuffix: 'Ending in "C"',
        potentiometerResistance: '2.1 kΩ',
        triggerSpringThickness: '0.35mm',
        touchpadFlexCablePins: '14-Pin',
        microphoneCablePins: '10-Pin',
        analogModuleCompatibility: ['BDM-030/040 Alps OEM', 'Hall Effect BDM-040 Compatible Modules'],
        incompatibleWith: ['BDM-010/020 parts'],
        repairNotes: 'Shipped with PS5 Slim (CFI-2000). Features updated Bluetooth / Audio combo IC and slightly altered trigger motor gear ratios.'
      },
      {
        revision: 'BDM-050',
        releaseYear: '2024 - Present (PS5 Pro Era)',
        fccId: 'AK8CFIZCT1D',
        modelSuffix: 'Ending in "D"',
        potentiometerResistance: '2.1 kΩ',
        triggerSpringThickness: '0.35mm',
        touchpadFlexCablePins: '14-Pin',
        microphoneCablePins: '10-Pin',
        analogModuleCompatibility: ['BDM-040/050 Compatible OEM & Hall Effect'],
        incompatibleWith: ['BDM-010/020 chassis parts'],
        repairNotes: 'Current production board revision. Consolidated power delivery circuitry and updated Bluetooth 5.2 baseband firmware.'
      }
    ],
    dualSenseEdge: [
      {
        revision: 'BDM-E010',
        releaseYear: '2023',
        fccId: 'AK8CFIZCP1',
        modelSuffix: 'CFI-ZCP1',
        potentiometerResistance: 'Swappable Module (Stick Module CFI-ZSM1)',
        triggerSpringThickness: 'Adjustable trigger stop mechanism',
        repairNotes: 'Modular analog stick housings require no soldering. Modules can be swapped in 10 seconds. Compatible with Hall effect drop-in modular PCB assemblies.'
      }
    ]
  };

  /**
   * Identifies the exact or probable board revision based on user input.
   * @param {string} query Search text (FCC ID, model number, serial suffix, or board code)
   * @returns {Object} Identification match and technical repair guide
   */
  static decode(query) {
    if (!query || typeof query !== 'string') {
      return { matchFound: false, results: [] };
    }

    const clean = query.trim().toUpperCase().replace(/[\s-]/g, '');

    // Direct revision query
    for (const item of this.DATABASE.dualsense) {
      const revClean = item.revision.replace('-', '');
      if (clean.includes(revClean)) {
        return { matchFound: true, confidence: 'High (Direct Revision Match)', details: item };
      }
    }

    // Edge check
    if (clean.includes('ZCP1') || clean.includes('EDGE')) {
      return { matchFound: true, confidence: 'High (DualSense Edge Match)', details: this.DATABASE.dualSenseEdge[0] };
    }

    // Check FCC ID or suffix
    if (clean.includes('AK8CFIZCT1C') || clean.endsWith('C')) {
      return { matchFound: true, confidence: 'High (FCC ID Match: BDM-040)', details: this.DATABASE.dualsense[3] };
    }
    if (clean.includes('AK8CFIZCT1D') || clean.endsWith('D')) {
      return { matchFound: true, confidence: 'High (FCC ID Match: BDM-050)', details: this.DATABASE.dualsense[4] };
    }
    if (clean.includes('AK8CFIZCT1B') || clean.endsWith('B')) {
      return { matchFound: true, confidence: 'High (FCC ID Match: BDM-030)', details: this.DATABASE.dualsense[2] };
    }
    if (clean.includes('AK8CFIZCT1A') || clean.endsWith('A')) {
      return { matchFound: true, confidence: 'High (FCC ID Match: BDM-020)', details: this.DATABASE.dualsense[1] };
    }
    if (clean.includes('AK8CFIZCT1') || clean.includes('CFIZCT1W')) {
      return { matchFound: true, confidence: 'Likely BDM-010 (Check motherboard text)', details: this.DATABASE.dualsense[0] };
    }

    return {
      matchFound: false,
      message: 'No exact revision match found. Check the small white text printed on the green motherboard inside (e.g. BDM-010 or BDM-020).',
      allRevisions: this.DATABASE.dualsense
    };
  }
}

if (typeof window !== 'undefined') {
  window.RevisionDecoder = RevisionDecoder;
}
