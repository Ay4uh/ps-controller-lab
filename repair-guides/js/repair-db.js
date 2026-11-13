/**
 * Laptop Repair Knowledge Base & Guided Repair Platform
 * Database Service & Offline Seed Data Engine
 * 
 * Supports Cloud Firestore when configured, with transparent local seed caching
 * and technician bench note persistence.
 */

export const SEED_DEVICES = [
  {
    id: 'apple-macbook-air-m1-a2337',
    category: 'macbook',
    manufacturer: 'Apple',
    family: 'MacBook Air',
    modelName: 'MacBook Air 13" (M1, Late 2020)',
    modelNumbers: ['A2337', 'EMC 3598', 'MGN63LL/A', 'MGN93LL/A'],
    releaseYear: 2020,
    architecture: 'Apple Silicon (M1)',
    displaySpec: '13.3" Retina (2560x1600) LED-backlit IPS, P3 Wide Color, True Tone',
    batterySpec: '49.9 Wh Lithium-Polymer (A2389)',
    storageType: 'Integrated Apple NVMe NAND (Soldered)',
    screwTypes: ['P5 Pentalobe', 'Torx T3', 'Torx T5', 'Torx T8']
  },
  {
    id: 'apple-macbook-air-m2-a2681',
    category: 'macbook',
    manufacturer: 'Apple',
    family: 'MacBook Air',
    modelName: 'MacBook Air 13.6" (M2, 2022)',
    modelNumbers: ['A2681', 'EMC 4074', 'MLXW3LL/A', 'MLY33LL/A'],
    releaseYear: 2022,
    architecture: 'Apple Silicon (M2)',
    displaySpec: '13.6" Liquid Retina (2560x1664) with Notch, 500 nits',
    batterySpec: '52.6 Wh Lithium-Polymer (A2669)',
    storageType: 'Integrated Apple NVMe NAND (Soldered)',
    screwTypes: ['P5 Pentalobe', 'Torx T3', 'Torx T5', 'Torx T8']
  },
  {
    id: 'apple-macbook-pro-14-m1-a2442',
    category: 'macbook',
    manufacturer: 'Apple',
    family: 'MacBook Pro',
    modelName: 'MacBook Pro 14" (M1 Pro / M1 Max, Late 2021)',
    modelNumbers: ['A2442', 'EMC 3650', 'MKGP3LL/A'],
    releaseYear: 2021,
    architecture: 'Apple Silicon (M1 Pro / Max)',
    displaySpec: '14.2" Liquid Retina XDR Mini-LED (3024x1964) 120Hz ProMotion',
    batterySpec: '70 Wh Lithium-Polymer (A2519)',
    storageType: 'Integrated Apple NVMe NAND (Soldered)',
    screwTypes: ['P5 Pentalobe', 'Torx T3', 'Torx T5', 'Torx T8']
  },
  {
    id: 'lenovo-thinkpad-t14-gen1-amd',
    category: 'windows',
    manufacturer: 'Lenovo',
    family: 'ThinkPad T Series',
    modelName: 'ThinkPad T14 Gen 1 (AMD Ryzen)',
    modelNumbers: ['20UD', '20UE'],
    releaseYear: 2020,
    architecture: 'AMD x86_64 (Zen 2 / Renoir)',
    displaySpec: '14.0" FHD (1920x1080) IPS Matte Anti-Glare, 30-Pin eDP',
    batterySpec: '50 Wh Internal Li-Ion (02DL006 / L18M3P74)',
    storageType: 'M.2 2280 NVMe PCIe 3.0 x4 (Replaceable)',
    screwTypes: ['Phillips #00', 'Captive Base Screws']
  },
  {
    id: 'dell-latitude-5420',
    category: 'windows',
    manufacturer: 'Dell',
    family: 'Latitude',
    modelName: 'Dell Latitude 5420 / 5430',
    modelNumbers: ['Latitude 5420', 'P137G'],
    releaseYear: 2021,
    architecture: 'Intel 11th Gen Core (Tiger Lake)',
    displaySpec: '14.0" FHD (1920x1080) WVA, 30-Pin eDP non-touch',
    batterySpec: '4-cell 63 Wh ExpressCharge (RJ40G / WY9DX)',
    storageType: 'M.2 2280 / 2230 NVMe PCIe SSD',
    screwTypes: ['Phillips #00', 'Captive Base Screws']
  },
  {
    id: 'dell-xps-13-9310',
    category: 'windows',
    manufacturer: 'Dell',
    family: 'XPS',
    modelName: 'Dell XPS 13 (9310 / 9320)',
    modelNumbers: ['9310', 'P117G'],
    releaseYear: 2021,
    architecture: 'Intel 11th/12th Gen Core',
    displaySpec: '13.4" 16:10 FHD+ (1920x1200) or 4K+ OLED',
    batterySpec: '52 Wh Lithium-Ion (722KK)',
    storageType: 'M.2 2280 NVMe SSD',
    screwTypes: ['Torx T5', 'Phillips #00']
  },
  {
    id: 'hp-elitebook-840-g7',
    category: 'windows',
    manufacturer: 'HP',
    family: 'EliteBook',
    modelName: 'HP EliteBook 840 G7 / G8',
    modelNumbers: ['840 G7', 'HSN-I36C'],
    releaseYear: 2020,
    architecture: 'Intel 10th/11th Gen Core',
    displaySpec: '14.0" FHD (1920x1080) IPS Anti-glare, 30-pin eDP',
    batterySpec: '3-cell 53 Wh Long Life Li-ion (CC03XL)',
    storageType: 'M.2 2280 NVMe PCIe',
    screwTypes: ['Phillips #00', 'Captive Base Screws']
  }
];

export const SEED_TOOLS = [
  { id: 'tool-p5', name: 'P5 Pentalobe Screwdriver', desc: '1.2mm Apple proprietary casing screws on MacBook Air & Pro' },
  { id: 'tool-t3', name: 'Torx T3 Screwdriver', desc: 'Internal flex cable brackets & antenna cowlings on MacBooks' },
  { id: 'tool-t5', name: 'Torx T5 Screwdriver', desc: 'Motherboard, battery power screw, and I/O board screws' },
  { id: 'tool-t8', name: 'Torx T8 Screwdriver', desc: 'Heavy-duty display hinge anchor screws on MacBooks' },
  { id: 'tool-ph00', name: 'Phillips #00 Screwdriver', desc: 'Standard precision crosshead for Windows laptop base covers and internals' },
  { id: 'tool-spudger', name: 'ESD-Safe Nylon Spudger', desc: 'Non-conductive probe for disconnecting delicate battery & flex latches' },
  { id: 'tool-picks', name: 'Plastic Opening Picks / Cards', desc: 'Separating bezel clips and slicing through softened battery adhesive' },
  { id: 'tool-ipa', name: 'Isopropyl Alcohol (90%+)', desc: 'Solvent for dissolving lithium-ion battery stretch adhesive' },
  { id: 'tool-suction', name: 'Suction Cup Handle', desc: 'Lifting display glass and pulling unclipped bottom pans' },
  { id: 'tool-usb-boot', name: 'USB 3.0 Flash Drive (16GB+)', desc: 'High-speed drive for Windows 10/11 Media Creation & macOS Installers' }
];

export const SEED_PARTS = [
  { id: 'part-mba-m1-screen', name: 'MacBook Air 13" M1 Full Display Assembly', partNumber: '661-16806 (Space Gray), 661-16807 (Silver)', notes: 'Full top lid with panel, eDP cable, TrueTone sensor & FaceTime HD camera' },
  { id: 'part-t14-screen', name: 'ThinkPad T14 14.0" FHD IPS 30-Pin Matte Panel', partNumber: 'NV140FHM-N48 / B140HAN04.0', notes: 'FRU 01YN155 / 01YN156, non-touch 300 nits' },
  { id: 'part-mba-m1-battery', name: 'MacBook Air M1 Replacement Battery Pack', partNumber: 'A2389 (020-04026)', notes: '49.9 Wh 4379 mAh OEM specification with pre-applied stretch tabs' },
  { id: 'part-t14-battery', name: 'ThinkPad T14 Gen 1 Internal Battery', partNumber: '02DL006 / L18M3P74 / SB10K97644', notes: '50 Wh 3-cell Li-ion internal pack' },
  { id: 'part-latitude-battery', name: 'Dell Latitude 5420 4-Cell Battery', partNumber: 'RJ40G / 0WY9DX / 0M59G5', notes: '63 Wh ExpressCharge capable battery pack' },
  { id: 'part-thermal-paste', name: 'Non-Conductive Thermal Paste', partNumber: 'Arctic MX-4 / Thermal Grizzly Kryonaut', notes: 'For CPU/GPU repasting during heatsink maintenance' }
];

export const SEED_SOURCES = [
  {
    id: 'source-rossmann-macbook-screen',
    channelName: 'Hugh Jeffreys',
    videoTitle: 'M1 MacBook Air Screen Replacement & True Tone Calibration Walkthrough',
    youtubeId: 'R96c7x9m0zY',
    youtubeUrl: 'https://www.youtube.com/watch?v=R96c7x9m0zY',
    verifiedBy: 'Senior Apple Hardware Specialist',
    keyTimestamps: [
      { time: '01:15', note: 'P5 lower casing screw extraction & length map' },
      { time: '02:22', note: 'Battery connector isolation' },
      { time: '04:50', note: 'Display eDP flex cowling removal' },
      { time: '06:10', note: 'T8 Torx hinge bolt extraction' },
      { time: '10:15', note: 'New assembly seating and True Tone testing' }
    ]
  },
  {
    id: 'source-ers-thinkpad-screen',
    channelName: 'Laptop Repair Secrets',
    videoTitle: 'ThinkPad T14 Screen Replacement: Don\'t Blow The F1 Backlight Fuse!',
    youtubeId: 'hU3VazgQqV8',
    youtubeUrl: 'https://www.youtube.com/watch?v=hU3VazgQqV8',
    verifiedBy: 'Component-Level Electronics Technician',
    keyTimestamps: [
      { time: '00:45', note: 'UEFI/BIOS internal battery disable procedure' },
      { time: '01:30', note: 'Display bezel pry points without cracking clips' },
      { time: '05:15', note: '30-pin eDP connector release and wire bail' },
      { time: '07:45', note: 'Panel alignment and stretch tape application' }
    ]
  },
  {
    id: 'source-ipad-rehab-battery',
    channelName: 'iFixit Tech Guides',
    videoTitle: 'MacBook Air M1 A2337 Battery Replacement: Safe Adhesive Removal',
    youtubeId: 'QTfk17eDTPg',
    youtubeUrl: 'https://www.youtube.com/watch?v=QTfk17eDTPg',
    verifiedBy: 'Microsoldering & Thermal Safety Specialist',
    keyTimestamps: [
      { time: '01:10', note: 'P5 screw layout & lower case removal' },
      { time: '02:15', note: 'Battery power screw interposer plate removal' },
      { time: '03:30', note: 'Trackpad flex ribbon cable hazard boundary' },
      { time: '04:45', note: '90%+ IPA application to stretch adhesive' }
    ]
  },
  {
    id: 'source-adamant-it-windows-battery',
    channelName: 'Dell Technical Training',
    videoTitle: 'Dell Latitude 5420 Battery Replacement Tutorial (Type RJ40G 63Wh)',
    youtubeId: 'i8og-_SHtNI',
    youtubeUrl: 'https://www.youtube.com/watch?v=i8og-_SHtNI',
    verifiedBy: 'Dell Certified Systems Expert',
    keyTimestamps: [
      { time: '00:30', note: 'System shutdown & ESD wrist strap setup' },
      { time: '01:05', note: 'Captive base screw loosening pattern' },
      { time: '02:20', note: 'Multi-wire battery connector unseating' },
      { time: '04:40', note: 'Installing replacement ExpressCharge pack' }
    ]
  },
  {
    id: 'source-secrets-windows-install',
    channelName: 'CareyHolzman / TechBench',
    videoTitle: 'Windows 10/11 Clean Install: NVMe SSD Not Detected (Intel RST / VMD Driver)',
    youtubeId: 'OR1MdaKGT5w',
    youtubeUrl: 'https://www.youtube.com/watch?v=OR1MdaKGT5w',
    verifiedBy: 'Windows Enterprise Deployment Specialist',
    keyTimestamps: [
      { time: '01:20', note: 'Creating GPT/UEFI bootable USB media' },
      { time: '03:40', note: 'Placing iaStorVD.sys & iaStorVD.inf on USB drive' },
      { time: '07:05', note: 'Loading VMD driver at "We couldn\'t find any drives"' },
      { time: '09:15', note: 'Diskpart clean to remove OEM recovery partitions' }
    ]
  },
  {
    id: 'source-rossmann-macos-recovery',
    channelName: 'Mr. Macintosh',
    videoTitle: 'Apple Silicon DFU Restore & macOS Reinstallation Complete Guide',
    youtubeId: 'q-FsB2onSx0',
    youtubeUrl: 'https://www.youtube.com/watch?v=q-FsB2onSx0',
    verifiedBy: 'Apple Certified Support Professional',
    keyTimestamps: [
      { time: '01:15', note: 'Holding power button for 1-True-Recovery on M-series' },
      { time: '03:30', note: 'Disk Utility: "Show All Devices" container erase' },
      { time: '09:40', note: 'Target DFU port selection on MacBook Air' },
      { time: '12:15', note: 'DFU Revive vs Restore with Apple Configurator 2' }
    ]
  }
];

export const SEED_GUIDES = [
  {
    id: 'macbook-screen-replacement-a2337',
    title: 'MacBook Air 13" M1 (A2337) — Full Display Assembly Replacement',
    deviceCategory: 'macbook',
    manufacturer: 'Apple',
    deviceRef: 'apple-macbook-air-m1-a2337',
    supportedModels: ['MacBook Air 13" M1 (2020)', 'A2337', 'EMC 3598'],
    repairCategory: 'screen',
    difficulty: 'Intermediate',
    estimatedTime: '45–60 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-rossmann-macbook-screen',
    tools: ['tool-p5', 'tool-t3', 'tool-t5', 'tool-t8', 'tool-spudger', 'tool-picks'],
    parts: ['part-mba-m1-screen'],
    safetyWarnings: [
      'CRITICAL: You MUST disconnect the battery flex cable before disconnecting or reconnecting the display eDP cable. If battery voltage remains active, the 20V backlight power rail will short to ground, destroying the logic board display PMIC or backlight driver chip.',
      'Handle the replacement display assembly strictly by its aluminum perimeter. Never torque the glass or press directly on the display panel surface.'
    ],
    initialDiagnosis: 'Connect an external USB-C / HDMI monitor. If external display outputs video normally while internal screen exhibits vertical lines, cracked glass, or dark backlight (visible under strong flashlight), the display assembly is defective and motherboard GPU is functional.',
    commonMistakes: [
      'Attempting to pry the lower case from the front without sliding it forward first, which snaps the hidden aluminum retention clips.',
      'Mixing up P5 Pentalobe lower casing screws (2 rear screws are noticeably longer than the 8 front/side screws).',
      'Forgetting to reconnect the ambient light sensor / lid angle sensor flex cable, causing sleep/wake cycles to malfunction.',
      'Over-torquing the T8 hinge screws beyond 0.4 Nm, which strips the logic board standoffs.'
    ],
    testingChecklist: [
      'Internal Retina display powers on with even LED backlight',
      'True Tone sensor registers ambient light and transitions color temperature',
      'FaceTime HD camera feeds video at 720p 30fps without distortion',
      'Lid close activates magnetic sleep mode; reopening instantly wakes system',
      'Microphone array in display hinge feeds crisp audio'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Lower Case Screw Extraction',
        videoTimestamp: "01:15",
        videoSeconds: 75,
        diagramType: "macbook-screws",
        instructions: 'Place MacBook upside down on a clean antistatic mat. Use a P5 Pentalobe screwdriver to extract the 10 casing screws: 2 long screws (at rear near exhaust vent) and 8 shorter screws (front and sides). Store them on a magnetic project mat in their exact layout.',
        technicianNotes: 'Screw lengths: 2x 12.3mm (rear corners), 8x 4.9mm (perimeter). Never force a long screw into a front hole or you will puncture the aluminum top case through to the palm rest.',
        warning: 'Only use a genuine P5 driver. Standard Torx or Phillips bits will strip Apple pentalobe star heads instantly.'
      },
      {
        stepNumber: 2,
        title: 'Release Case Retention Clips',
        videoTimestamp: "01:50",
        videoSeconds: 110,
        diagramType: "macbook-clips",
        instructions: 'Use a suction cup handle on the lower front center edge of the bottom pan to lift slightly (1–2 mm), then slide the bottom pan forward toward the front lip to disengage the two internal slide-in locking clips.',
        technicianNotes: 'Listen for a clean click as the slide clips release. Do not yank straight upwards.'
      },
      {
        stepNumber: 3,
        title: 'CRITICAL: Disconnect Battery Power Latch',
        videoTimestamp: "02:22",
        videoSeconds: 142,
        diagramType: "macbook-battery-latch",
        instructions: 'Locate the battery connector board between the battery pouches and the logic board. Peel back the protective black tape covering the battery data flex cable. Use an ESD nylon spudger to flip up the ZIF latch and slide out the data cable. Next, remove the T5 screw securing the large gold battery power terminal and cover it with an insulating plastic card.',
        technicianNotes: 'Press the MacBook power button for 5 seconds after battery disconnection to drain residual capacitor charge from the backlight filter circuit.',
        warning: 'DO NOT SKIP. Touching display connectors with battery connected causes instant 20V backlight rail short circuit.'
      },
      {
        stepNumber: 4,
        title: 'Remove Display Cable Cowlings',
        videoTimestamp: "03:45",
        videoSeconds: 225,
        diagramType: "macbook-edp-cowling",
        instructions: 'Remove the 2 Torx T3 screws securing the metal cowling bracket over the eDP display data connector on the logic board. Lift the bracket with tweezers. Use a plastic spudger to pry the eDP flex connector straight up from its socket.',
        technicianNotes: 'Pry gently on the connector body, never on the delicate wires.'
      },
      {
        stepNumber: 5,
        title: 'Disconnect Antenna Bar & Coaxial Cables',
        videoTimestamp: "04:50",
        videoSeconds: 290,
        diagramType: "macbook-antenna-coax",
        instructions: 'Remove the 4 Torx T3 screws securing the plastic antenna bar cover along the rear edge. Use fine curved tweezers to pop the 2 miniature Wi-Fi/Bluetooth coaxial antenna plugs straight up. Disconnect the camera flex cable connector next to the left hinge.',
        technicianNotes: 'When reinstalling later, snap the antenna connectors down with a satisfying micro-click; misaligned coaxial pins will bend easily.'
      },
      {
        stepNumber: 6,
        title: 'Open Display to 90° and Position at Bench Edge',
        videoTimestamp: "06:10",
        videoSeconds: 370,
        diagramType: "macbook-90deg-bench",
        instructions: 'Carefully open the MacBook lid to a 90-degree angle. Place the laptop bottom-side-up with the display hanging over the edge of your repair bench so the hinges are fully exposed and accessible without stress.',
        technicianNotes: 'Support the display lid with your hand or a foam block so it does not flex under gravity.'
      },
      {
        stepNumber: 7,
        title: 'Remove Hinge Anchor Screws & Detach Display',
        videoTimestamp: "07:15",
        videoSeconds: 435,
        diagramType: "macbook-hinge-t8",
        instructions: 'Using a Torx T8 screwdriver, remove the 3 hinge screws on the left hinge, then remove the 3 hinge screws on the right hinge (6 screws total). With both hands, gently slide the old display assembly backwards out of the chassis hinge pockets.',
        technicianNotes: 'T8 screws have blue factory thread-locker. Keep them grouped by hinge.'
      },
      {
        stepNumber: 8,
        title: 'Install Replacement Display Assembly',
        videoTimestamp: "08:40",
        videoSeconds: 520,
        diagramType: "macbook-assembly-mount",
        instructions: 'Slide the hinges of the replacement display assembly into the chassis hinge cutouts. Thread the 6 Torx T8 screws by hand, but DO NOT tighten them completely yet.',
        technicianNotes: 'Hand-tight allows free movement for critical corner alignment.'
      },
      {
        stepNumber: 9,
        title: 'Precise Chassis Alignment & Torquing',
        videoTimestamp: "09:30",
        videoSeconds: 570,
        diagramType: "macbook-hinge-align",
        instructions: 'Close the lid and inspect the alignment gap around all four outer aluminum edges. Once the lid is perfectly flush with the chassis corners, open the lid back to 90° and torque the 6 T8 hinge screws firmly in an alternating criss-cross pattern.',
        technicianNotes: 'Torque to approximately 0.4 Nm. Uneven torque causes hinge stiffness or lid creaking.'
      },
      {
        stepNumber: 10,
        title: 'Reconnect All Display & Antenna Flex Cables',
        videoTimestamp: "10:15",
        videoSeconds: 615,
        diagramType: "macbook-edp-reconnect",
        instructions: 'Reinstall the antenna bar, snapping down the Wi-Fi/Bluetooth coaxial connectors. Reconnect the camera flex cable. Reconnect the eDP display data cable, seat its metal bracket, and secure with the 2 Torx T3 screws.',
        technicianNotes: 'Ensure no antenna cables are pinched beneath the hinge brackets.'
      },
      {
        stepNumber: 11,
        title: 'Reconnect Battery & Bench Power Test',
        videoTimestamp: "11:05",
        videoSeconds: 665,
        diagramType: "macbook-bench-power",
        instructions: 'Remove the insulating card from the battery power terminal. Reinstall the T5 gold battery screw and reconnect the battery data flex cable, locking the ZIF latch. Connect OEM USB-C charger and verify that the screen illuminates with Apple logo.',
        technicianNotes: 'Perform bench test BEFORE snapping bottom case shut to verify camera and display backlight.'
      },
      {
        stepNumber: 12,
        title: 'Final Reassembly & Post-Repair Verification',
        videoTimestamp: "12:45",
        videoSeconds: 765,
        diagramType: "macbook-truetone-verify",
        instructions: 'Slide the lower case on from front to back until the internal clips engage with a snap. Reinstall the 10 P5 Pentalobe screws (remember: 2 long screws in the rear corners). Boot into macOS and verify camera, True Tone, and backlight brightness scale.',
        technicianNotes: 'Complete the testing checklist and record the repair serial in the work order.'
      }
    ]
  },
  {
    id: 'thinkpad-t14-screen-replacement',
    title: 'Lenovo ThinkPad T14 Gen 1 (AMD/Intel) — LCD Panel Replacement',
    deviceCategory: 'windows',
    manufacturer: 'Lenovo',
    deviceRef: 'lenovo-thinkpad-t14-gen1-amd',
    supportedModels: ['ThinkPad T14 Gen 1 AMD (20UD, 20UE)', 'ThinkPad T14 Gen 1 Intel (20S0, 20S1)', 'ThinkPad P14s Gen 1'],
    repairCategory: 'screen',
    difficulty: 'Intermediate',
    estimatedTime: '30–45 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-ers-thinkpad-screen',
    tools: ['tool-ph00', 'tool-spudger', 'tool-picks'],
    parts: ['part-t14-screen'],
    safetyWarnings: [
      'CRITICAL: You MUST disable the internal battery in the ThinkPad BIOS before touching the display assembly. Disconnecting or connecting a 30-pin eDP cable with power alive will instantly blow the F1 backlight fuse on the motherboard, leaving the new screen completely dark!',
      'Do not use metal spudgers near the fragile glass edge of the LCD panel or camera array.'
    ],
    initialDiagnosis: 'Plug in an external monitor via HDMI or USB-C. If external display works cleanly while laptop panel is blank, cracked, or dim (image faintly visible under flashlight), the LCD panel or eDP cable is faulty. Check F1 fuse continuity with multimeter if backlight is dark on known-good screen.',
    commonMistakes: [
      'Skipping the BIOS "Disable Built-in Battery" step, causing motherboard fuse failure.',
      'Yanking the plastic bezel too aggressively at the bottom hinge cover, which breaks delicate plastic retention clips.',
      'Pulling the eDP cable by its wires rather than unlocking the metal flip wire bracket first.',
      'Installing a 40-pin panel on a 30-pin non-touch cable harness.'
    ],
    testingChecklist: [
      'LCD panel boots with sharp ThinkPad boot splash',
      'Brightness adjustable across all 10 levels via Fn + F5 / F6 keys',
      'No dead, stuck, or hot subpixels in full-screen solid RGB colors',
      'Webcam and ThinkShutter privacy slider operate cleanly',
      'Microphone array in upper bezel captures clear audio'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Disable Internal Battery in BIOS',
        videoTimestamp: "00:45",
        videoSeconds: 45,
        diagramType: "thinkpad-bios-battery",
        instructions: 'Power off the laptop completely. Turn on and immediately tap F1 repeatedly to enter ThinkPad BIOS Setup. Navigate to: Config > Power > Disable Built-in Battery. Press Enter, confirm "Yes". The system will automatically shut down and isolate the battery circuit.',
        technicianNotes: 'The internal battery remains electronically disconnected until an AC adapter is plugged in again.',
        warning: 'MANDATORY STEP. Disconnecting display cable with power alive blows motherboard backlight fuse.'
      },
      {
        stepNumber: 2,
        title: 'Redundant Physical Battery Disconnect',
        videoTimestamp: "01:30",
        videoSeconds: 90,
        diagramType: "thinkpad-captive-screws",
        instructions: 'Loosen the captive Phillips #00 screws on the base cover, remove bottom pan, and physically unplug the battery harness for 100% electrical safety.',
        technicianNotes: 'All base cover screws on ThinkPads are captive and do not need to be fully removed from the plastic plate.'
      },
      {
        stepNumber: 3,
        title: 'Unhook Plastic Display Bezel',
        videoTimestamp: "02:40",
        videoSeconds: 160,
        diagramType: "thinkpad-bezel-pry",
        instructions: 'Insert a thin plastic guitar pick between the inner edge of the plastic bezel and the display back cover, starting along the top edge near the webcam. Gently slide the pick around the perimeter to release the snap hooks.',
        technicianNotes: 'Use your fingers to support the back cover so it does not bow inward while unhooking.'
      },
      {
        stepNumber: 4,
        title: 'Release Bottom Hinge Cover Clips',
        videoTimestamp: "03:50",
        videoSeconds: 230,
        diagramType: "thinkpad-bottom-hinge",
        instructions: 'Gently tilt the bottom edge of the bezel forward. Work slowly along the hinge cover area where double-sided adhesive and strong clips hold the bottom strip.',
        technicianNotes: 'If resistant, warm gently with a hair dryer on low for 15 seconds to soften adhesive tape.'
      },
      {
        stepNumber: 5,
        title: 'Lay LCD Panel Forward onto Keyboard',
        videoTimestamp: "05:15",
        videoSeconds: 315,
        diagramType: "thinkpad-panel-fold",
        instructions: 'Place a clean microfiber cloth over the keyboard deck to protect keycaps. Grasp the top corners of the LCD panel and gently fold it forward face-down onto the keyboard deck, exposing the rear eDP connector.',
        technicianNotes: 'Do not pull the panel away from the hinge yet—the eDP cable is still attached at the bottom rear!'
      },
      {
        stepNumber: 6,
        title: 'Unlock & Disconnect 30-Pin eDP Cable',
        videoTimestamp: "06:30",
        videoSeconds: 390,
        diagramType: "thinkpad-edp-lock",
        instructions: 'Peel back the clear adhesive tape covering the 30-pin eDP connector. Use a plastic spudger or fingernail to flip the tiny metal wire locking bracket upward. Slide the cable straight backwards out of the socket.',
        technicianNotes: 'Inspect the 30 gold pins under magnification. Ensure no pins are bent or blackened from previous shorts.'
      },
      {
        stepNumber: 7,
        title: 'Connect Replacement 14.0" FHD IPS Panel',
        instructions: 'Align the replacement panel face-down on the keyboard cloth. Slide the 30-pin eDP connector straight into the socket until fully seated. Flip the metal wire lock bracket down and secure firmly with fresh Kapton tape.',
        technicianNotes: 'A loose eDP cable causes color banding, flickering, or missing lines.'
      },
      {
        stepNumber: 8,
        title: 'Bench Power Test (Before Snapping Bezel)',
        videoTimestamp: "08:35",
        videoSeconds: 515,
        diagramType: "thinkpad-bench-test",
        videoTimestamp: "07:45",
        videoSeconds: 465,
        diagramType: "thinkpad-panel-connect",
        instructions: 'Reinstall the base cover and connect the USB-C AC power adapter (this wakes the BIOS out of battery-disable mode). Power on the laptop and verify the Lenovo boot logo appears with crisp, bright backlight.',
        technicianNotes: 'Always verify image and brightness control BEFORE snapping the bezel back in place.'
      },
      {
        stepNumber: 9,
        title: 'Reattach Display Bezel & Final Assembly',
        videoTimestamp: "09:20",
        videoSeconds: 560,
        diagramType: "thinkpad-bezel-snap",
        instructions: 'Disconnect AC adapter again. Align the replacement bezel, starting at the bottom hinge area, and press firmly around all edges until every snap clip clicks audibly into place. Re-tighten captive base cover screws.',
        technicianNotes: 'Ensure the webcam privacy shutter (ThinkShutter) slider slides smoothly without binding against the bezel cutout.'
      }
    ]
  },
  {
    id: 'macbook-battery-replacement-pro-air',
    title: 'MacBook Air & Pro — Glued Lithium-Ion Battery Replacement & Safety Protocol',
    deviceCategory: 'macbook',
    manufacturer: 'Apple',
    deviceRef: 'apple-macbook-air-m1-a2337',
    supportedModels: ['MacBook Air M1 (A2337)', 'MacBook Air M2 (A2681)', 'MacBook Pro 13" Retina (A1708, A1989, A2289, A2338)'],
    repairCategory: 'battery',
    difficulty: 'Intermediate',
    estimatedTime: '60–90 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-ipad-rehab-battery',
    tools: ['tool-p5', 'tool-t5', 'tool-t3', 'tool-spudger', 'tool-picks', 'tool-ipa'],
    parts: ['part-mba-m1-battery'],
    safetyWarnings: [
      'SEVERE HAZARD: Lithium-ion batteries contain flammable liquid electrolyte. DO NOT puncture, bend, pierce, slice, or exert sharp localized force on battery pouches. A punctured pouch will experience immediate thermal runaway, producing smoke, fire, and toxic fumes!',
      'If a battery pouch is visibly swollen ("pillowing"), DO NOT use metal pry tools. Use ONLY 90%+ Isopropyl Alcohol solvent and flexible plastic cards to dissolve adhesive.',
      'Discharge the battery below 25% before beginning repair. Keep a Class D fire extinguisher or sand bucket readily accessible.'
    ],
    initialDiagnosis: 'In macOS, click Apple Logo > System Settings > Battery > Battery Health. If condition displays "Service Recommended", maximum capacity is < 80%, cycle count > 1000, or trackpad fails to click due to underneath battery swelling, the battery pack requires replacement.',
    commonMistakes: [
      'Slicing blindly under the center battery cell and severing the trackpad ribbon cable running directly beneath it.',
      'Prying with metal screwdrivers against aluminum casing, puncturing the pouch barrier.',
      'Using acetone or low-grade alcohol instead of 90%+ Isopropyl Alcohol (acetone dissolves MacBook trackpad plastics).',
      'Failing to perform a calibration cycle after replacement, causing inaccurate percentage readings.'
    ],
    testingChecklist: [
      'Battery recognized in macOS System Report (SPPowerDataType) with 100% health & 0-1 cycle count',
      'Charges smoothly to 100% on OEM USB-C power delivery adapter',
      'System runs stably on battery alone without sudden shutdown at 20-30%',
      'Trackpad haptic / physical click functions freely with no bulging friction',
      'No thermal abnormalities during charging'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Safety Prep & Battery Discharge',
        videoTimestamp: "01:10",
        videoSeconds: 70,
        diagramType: "macbook-p5-case",
        instructions: 'Discharge the MacBook battery below 25% by playing video on battery power. Power off laptop. Prepare your workstation with eye protection, fire bucket, and 90%+ Isopropyl Alcohol (IPA).',
        technicianNotes: 'A discharged battery stores significantly less chemical energy, drastically reducing thermal runaway risk if accidentally damaged.'
      },
      {
        stepNumber: 2,
        title: 'Lower Case Removal & Power Isolation',
        videoTimestamp: "02:15",
        videoSeconds: 135,
        diagramType: "macbook-power-interposer",
        instructions: 'Remove the 10 P5 Pentalobe screws and slide bottom pan off. Peel back the black tape on the battery data connector, flip up the ZIF latch, and disconnect the ribbon. Remove the large Torx T5 screw securing the gold battery power terminal.',
        technicianNotes: 'Insert a non-conductive plastic guitar pick under the gold power terminal to isolate it physically from logic board contacts.'
      },
      {
        stepNumber: 3,
        title: 'CRITICAL: Trackpad Cable Identification Zone',
        videoTimestamp: "03:30",
        videoSeconds: 210,
        diagramType: "macbook-trackpad-flex-hazard",
        instructions: 'Examine the area between the logic board and the trackpad. The trackpad data ribbon cable routes DIRECTLY beneath the middle battery pouches. Mark this zone visually and NEVER slide a spudger deep into this center channel.',
        technicianNotes: 'Disconnect and lift the trackpad cable out of the battery path if possible on your specific model.'
      },
      {
        stepNumber: 4,
        title: 'Release Adhesive Pull-Tabs (If Present)',
        videoTimestamp: "04:45",
        videoSeconds: 285,
        diagramType: "macbook-ipa-adhesive",
        instructions: 'On models equipped with stretch-release adhesive tabs (white/black tabs protruding at cell edges), grasp the tab with tweezers, wrap around a spudger, and pull SLOWLY and horizontally parallel to the aluminum chassis at a shallow 10-degree angle.',
        technicianNotes: 'Do not pull upwards against the cell; pulling horizontally allows the adhesive elastomer to stretch and release cleanly.'
      },
      {
        stepNumber: 5,
        title: 'Solvent Application (If Tabs Snap or Swollen Cells)',
        videoTimestamp: "06:10",
        videoSeconds: 370,
        diagramType: "macbook-stretch-release",
        instructions: 'If pull-tabs snap or cells are glued solid, apply 3–5 drops of 90%+ Isopropyl Alcohol along the outer edges of the battery pouches using a plastic syringe. Tilt the MacBook slightly so gravity carries the alcohol underneath the cells. Wait 2–3 minutes for the solvent to dissolve the acrylic adhesive bond.',
        technicianNotes: '90%+ IPA evaporates cleanly without residue and is safe on logic board electronics, but keep away from display panel glass.'
      },
      {
        stepNumber: 6,
        title: 'Plastic Card Adhesive Slicing',
        videoTimestamp: "07:20",
        videoSeconds: 440,
        diagramType: "macbook-plastic-card-slice",
        instructions: 'Slide a flexible plastic playing card or battery pry sheet under the battery cell at a shallow angle. Gently saw back and forth to slice through the softened adhesive. Never lever upwards against the cell body.',
        technicianNotes: 'If resistance is felt, add 2 more drops of IPA and wait 60 seconds. Never force a stuck cell.'
      },
      {
        stepNumber: 7,
        title: 'Extract Old Battery Pack Intact',
        videoTimestamp: "08:40",
        videoSeconds: 520,
        diagramType: "macbook-well-cleanup",
        instructions: 'Once all pouches are freed from the chassis, lift the entire multi-cell battery pack straight up and place immediately into an ESD fireproof bag or safe containment tray.',
        technicianNotes: 'Inspect the underside of the extracted battery to ensure no punctured foil or chemical leaks.'
      },
      {
        stepNumber: 8,
        title: 'Chassis Aluminum Cleaning',
        videoTimestamp: "09:30",
        videoSeconds: 570,
        diagramType: "macbook-a2389-install",
        instructions: 'Scrape remaining adhesive foam from the aluminum chassis using a plastic scraper and IPA until the metal surface is smooth, clean, and dry.',
        technicianNotes: 'A bumpy surface prevents the new battery from seating flush, which can rub against the bottom cover.'
      },
      {
        stepNumber: 9,
        title: 'Dry-Fit Replacement Battery Pack',
        videoTimestamp: "10:15",
        videoSeconds: 615,
        diagramType: "macbook-interposer-torque",
        instructions: 'Without peeling the adhesive backing films, place the new battery pack into the chassis. Align the gold power terminal screw hole and screw standoff perfectly.',
        technicianNotes: 'Dry-fitting prevents misaligned installation once the aggressive adhesive touches aluminum.'
      },
      {
        stepNumber: 10,
        title: 'Final Adhesion, Screw Torquing & Cable Reconnection',
        videoTimestamp: "11:00",
        videoSeconds: 660,
        diagramType: "macbook-casing-screws",
        instructions: 'Peel the protective adhesive release liners from the bottom of the new battery pack. Lower into position, press firmly on cell perimeter frames for 30 seconds. Reinstall the T5 gold power screw. Reconnect the battery data ribbon and lock the ZIF latch.',
        technicianNotes: 'Ensure battery power terminal screw is torqued snugly; loose power screws create high contact resistance and heat.'
      },
      {
        stepNumber: 11,
        title: 'Reassembly & Initial Boot Verification',
        videoTimestamp: "11:45",
        videoSeconds: 705,
        diagramType: "macbook-smc-calibrate",
        instructions: 'Snap the lower case back onto the chassis and install the 10 P5 screws. Connect OEM USB-C charger. System will chime and boot. Open System Report > Power to verify cycle count is 0 or 1 and condition is "Normal".',
        technicianNotes: 'Carry out full calibration: charge to 100%, leave on charger for 2 hours, discharge to 0% until sleep, then recharge to 100% uninterrupted.'
      }
    ]
  },
  {
    id: 'windows-battery-replacement-dell-hp-lenovo',
    title: 'Windows Laptop (Dell, HP, Lenovo) — Internal Battery Replacement & Swelling Hazards',
    deviceCategory: 'windows',
    manufacturer: 'Dell',
    deviceRef: 'dell-latitude-5420',
    supportedModels: ['Dell Latitude 5420 / 5430', 'Dell XPS 13 / 15', 'HP EliteBook 840', 'Lenovo ThinkPad T14 / E14', 'ASUS ZenBook'],
    repairCategory: 'battery',
    difficulty: 'Beginner',
    estimatedTime: '20–30 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-adamant-it-windows-battery',
    tools: ['tool-ph00', 'tool-spudger'],
    parts: ['part-latitude-battery', 'part-t14-battery'],
    safetyWarnings: [
      'DO NOT puncture or bend swollen batteries. Lithium polymer pouch cells under pressure from internal gas expansion can vent violently if punctured by screwdriver tips.',
      'Always unplug the AC adapter and discharge static before touching internal laptop connectors.'
    ],
    initialDiagnosis: 'Windows battery report (`powercfg /batteryreport`) reveals "Full Charge Capacity" significantly lower than "Design Capacity" (e.g. < 60%). Physical swelling causes trackpad button stiffness or chassis separation along bottom seam.',
    commonMistakes: [
      'Pulling on the individual wires of the battery harness rather than grasping the plastic connector head, ripping wires out of terminal crimps.',
      'Overtightening mounting screws into brittle plastic chassis standoffs.',
      'Buying cheap counterfeit packs lacking functional BMS over-temperature protection.'
    ],
    testingChecklist: [
      'Battery percentage increases continuously when plugged into OEM charger',
      'Battery health in BIOS / SupportAssist reports "Good" or "Excellent"',
      'Laptop runs under high CPU stress test without sudden shutdown',
      'Trackpad clicks freely with zero chassis swelling friction'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Disconnect AC Power & Inspect Chassis',
        videoTimestamp: "00:30",
        videoSeconds: 30,
        diagramType: "dell-shutdown-esd",
        instructions: 'Shut down Windows completely. Disconnect the power adapter and all external peripherals. Inspect the bottom cover and trackpad for physical bulging caused by battery cell swelling.',
        technicianNotes: 'If chassis is visibly bowed, remove screws carefully as the cover may pop off under internal pressure.'
      },
      {
        stepNumber: 2,
        title: 'Remove Base Cover Screws',
        videoTimestamp: "01:05",
        videoSeconds: 65,
        diagramType: "dell-captive-screws",
        instructions: 'Using a Phillips #00 (or Torx T5 on XPS models), remove all base cover screws. Keep screws organized by length. Gently pry open the cover clips using a plastic spudger.',
        technicianNotes: 'Check under adhesive rubber feet on HP and Lenovo consumer laptops for hidden screws.'
      },
      {
        stepNumber: 3,
        title: 'Disconnect Battery Wiring Harness',
        videoTimestamp: "01:45",
        videoSeconds: 105,
        diagramType: "dell-perimeter-pry",
        instructions: 'Locate the multi-wire battery cable connecting the battery pack to the motherboard. Using your fingers or an ESD spudger on the plastic connector ears, gently slide the plug straight out of its header.',
        technicianNotes: 'NEVER pull on the colored wires! Pull only on the plastic connector body.',
        warning: 'Pulling on wires causes terminal pull-out and short circuits.'
      },
      {
        stepNumber: 4,
        title: 'Extract Battery Mounting Screws',
        videoTimestamp: "02:20",
        videoSeconds: 140,
        diagramType: "dell-connector-unseat",
        instructions: 'Remove the 3 to 6 Phillips #00 mounting screws holding the battery frame to the chassis. Note any captive screws.',
        technicianNotes: 'Do not lose the screws into the chassis fans or motherboard.'
      },
      {
        stepNumber: 5,
        title: 'Lift Out Old Battery Pack',
        videoTimestamp: "03:10",
        videoSeconds: 190,
        diagramType: "dell-m2x5-screws",
        instructions: 'Carefully lift the battery pack up and out of its alignment guide pins. Inspect the battery bay for foreign debris, loose screws, or dust.',
        technicianNotes: 'Clean dust with compressed air while battery is removed.'
      },
      {
        stepNumber: 6,
        title: 'Install & Fasten Replacement Pack',
        videoTimestamp: "03:55",
        videoSeconds: 235,
        diagramType: "dell-swelling-inspect",
        instructions: 'Position the new battery over the alignment guide pins. Fasten all mounting screws evenly in a criss-cross pattern until snug. Do not overtighten.',
        technicianNotes: 'Ensure the battery frame sits completely flat against the chassis.'
      },
      {
        stepNumber: 7,
        title: 'Plug in Battery Connector & Base Cover Reassembly',
        videoTimestamp: "04:40",
        videoSeconds: 280,
        diagramType: "dell-rj40g-install",
        instructions: 'Firmly plug the battery cable harness into the motherboard header until seated with zero gap. Snap base cover back on and fasten all screws.',
        technicianNotes: 'Plug in OEM AC adapter to initialize battery fuel gauge BMS controller.'
      },
      {
        stepNumber: 8,
        title: 'Post-Install Verification in Windows',
        videoTimestamp: "05:30",
        videoSeconds: 330,
        diagramType: "dell-epsa-diagnostics",
        instructions: 'Boot into Windows, open PowerShell as Admin, and run `powercfg /batteryreport`. Open the generated report to verify Design Capacity matches Full Charge Capacity and cycle count is 0.',
        technicianNotes: 'Run battery diagnostic test in Dell SupportAssist or Lenovo Vantage.'
      }
    ]
  },
  {
    id: 'windows-10-11-clean-installation-guide',
    title: 'Windows 10 & 11 — Clean OS Installation, Intel VMD / RST Storage Drivers & Activation',
    deviceCategory: 'windows',
    manufacturer: 'Microsoft / Multi-Vendor',
    deviceRef: 'dell-latitude-5420',
    supportedModels: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Custom Built Laptops'],
    repairCategory: 'os_install',
    difficulty: 'Intermediate',
    estimatedTime: '30–50 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-secrets-windows-install',
    tools: ['tool-usb-boot'],
    parts: [],
    safetyWarnings: [
      'A clean Windows installation erases all existing partitions on the target drive! Verify technician backup of client documents, photos, desktop, and BitLocker recovery keys before proceeding.',
      'Ensure the laptop is plugged into reliable AC power during installation. Sudden power loss during UEFI partition creation or firmware driver injection can corrupt the drive partition table.'
    ],
    initialDiagnosis: 'Windows fails to boot, infinite boot loops ("Automatic Repair could not repair your PC"), corrupted BCD store, malware infestation, or replacing a defective SSD with a brand-new unformatted drive.',
    commonMistakes: [
      'Getting stuck at "Where do you want to install Windows? — We couldn\'t find any drives" on Intel 11th–14th Gen systems due to missing Intel VMD / RST storage controller drivers.',
      'Formatting drive as MBR on a pure UEFI system, causing "Windows cannot be installed to this disk".',
      'Getting blocked by the Windows 11 setup network requirement screen when Wi-Fi drivers are not preloaded (Bypass with Shift+F10 > OOBE\\BYPASSNRO).'
    ],
    testingChecklist: [
      'Windows 10/11 boots to clean desktop in < 15 seconds',
      'Device Manager exhibits 0 yellow exclamation marks (all chipset, audio, Wi-Fi, and GPU drivers loaded)',
      'Windows shows "Windows is activated with a digital license linked to your Microsoft account / OEM hardware"',
      'Windows Update runs cleanly with 0 failing cumulative updates',
      'Sleep, wake, restart, and thermal fan curves operate normally'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Verified Bootable USB Drive',
        videoTimestamp: "01:20",
        videoSeconds: 80,
        diagramType: "windows-rufus-gpt",
        instructions: 'On a working PC, download the official Windows 11 Media Creation Tool from microsoft.com. Insert a 16GB+ USB 3.0 flash drive. Select "Create installation media" and choose USB Flash Drive. The tool creates a UEFI GPT bootable drive with FAT32 bootloader.',
        technicianNotes: 'For legacy systems or custom unattended setups, use Rufus set to: Partition scheme: GPT, Target system: UEFI (non CSM).'
      },
      {
        stepNumber: 2,
        title: 'CRITICAL PRE-STEP: Prepare Intel VMD / RST Storage Driver',
        videoTimestamp: "03:40",
        videoSeconds: 220,
        diagramType: "windows-iastorvd-folder",
        instructions: 'Modern 11th, 12th, 13th, and 14th Gen Intel laptops use Intel Volume Management Device (VMD). Windows Setup does NOT include this driver out of the box, causing "No drives were found". Download the Intel Rapid Storage Technology (IRST) Driver package from Dell, HP, or Lenovo support. Extract the `f6vmdflpy-x64` folder containing `iaStorVD.inf` and `iaStorVD.sys` onto a folder named `Drivers` directly on your Windows install USB.',
        technicianNotes: 'Alternatively, you can enter BIOS Setup and switch Storage Controller from "RAID On / VMD" to "AHCI / NVMe", but native driver injection is preferred for OEM compatibility.',
        warning: 'Without this driver on USB, modern Intel laptops will not show the SSD in Windows Setup!'
      },
      {
        stepNumber: 3,
        title: 'BIOS / UEFI Configuration',
        videoTimestamp: "05:10",
        videoSeconds: 310,
        diagramType: "windows-uefi-bootmenu",
        instructions: 'Insert the install USB into the laptop. Power on and repeatedly press the Boot Menu key (F12 on Dell, F12 on Lenovo, F9 on HP, F8 on ASUS, F11 on MSI). In BIOS, verify: Secure Boot is ENABLED, Boot Mode is UEFI, and Fast Boot is disabled during setup.',
        technicianNotes: 'Select your UEFI USB drive from the F12 / F9 one-time boot menu.'
      },
      {
        stepNumber: 4,
        title: 'Initial Setup & Drive Detection ("No Drives Found" Fix)',
        instructions: 'Select language and keyboard layout, click "Install Now", and choose "Custom: Install Windows only (advanced)". If the drive list is blank: Click "Load driver" > Browse > navigate to your USB drive > `Drivers/f6vmdflpy-x64` > select "Intel RST VMD Controller". Click Next. The NVMe SSD partitions will instantly appear!',
        technicianNotes: 'This solves 95% of modern laptop SSD detection complaints on bench repairs.'
      },
      {
        stepNumber: 5,
        title: 'Diskpart Clean & Partition Allocation',
        videoTimestamp: "09:15",
        videoSeconds: 555,
        diagramType: "windows-diskpart-clean",
        videoTimestamp: "07:05",
        videoSeconds: 425,
        diagramType: "windows-load-driver-screen",
        instructions: 'If previous partitions exist: delete all partitions on Drive 0 until you have single "Drive 0 Unallocated Space". If partition errors occur, press Shift + F10 to open Command Prompt. Run: `diskpart` > `list disk` > `select disk 0` > `clean` > `convert gpt` > `exit`. Select the Unallocated Space and click Next. Windows installer will automatically build EFI (100MB), MSR (16MB), and Primary OS partition.',
        technicianNotes: 'Letting Windows automatically partition Unallocated Space ensures proper 4KB cluster alignment on modern SSDs.'
      },
      {
        stepNumber: 6,
        title: 'Bypass Windows 11 Internet Lockout (If Wi-Fi Driver Missing)',
        videoTimestamp: "11:30",
        videoSeconds: 690,
        diagramType: "windows-installing-files",
        instructions: 'If Windows 11 setup halts at "Let\'s connect you to a network" because internal Wi-Fi drivers are not yet installed: Press Shift + F10 to open Command Prompt. Type: `OOBE\\BYPASSNRO` and press Enter. The laptop will automatically reboot. Return to setup and click "I don\'t have internet" to proceed to local account creation!',
        technicianNotes: 'This critical technician bypass allows offline local account creation without needing a Microsoft account.'
      },
      {
        stepNumber: 7,
        title: 'Automated Driver Provisioning & Device Manager Audit',
        videoTimestamp: "13:45",
        videoSeconds: 825,
        diagramType: "windows-oobe-bypassnro",
        instructions: 'Once at desktop, connect to Wi-Fi. Run Windows Update until all updates finish. Download and run the OEM driver assistant (Dell Command | Update, Lenovo Commercial Vantage, or HP Image Assistant) to flash latest firmware and chipset drivers. Open Device Manager (Win + X > Device Manager) and verify ZERO unknown devices or yellow exclamation marks.',
        technicianNotes: 'Always flash the latest BIOS update to resolve battery charging and sleep state bugs.'
      },
      {
        stepNumber: 8,
        title: 'OEM Activation Verification',
        videoTimestamp: "15:20",
        videoSeconds: 920,
        diagramType: "windows-device-manager",
        instructions: 'Windows will automatically activate via the OEM product key embedded in the motherboard BIOS ACPI MSDM table. To verify the hardware key in PowerShell: `(Get-CimInstance -ClassName SoftwareLicensingService).OA3xOriginalProductKey`. Ensure Settings > System > Activation reads "Active".',
        technicianNotes: 'Legitimate Windows OEM keys on modern laptops are permanently bound to the motherboard hardware hash.'
      }
    ]
  },
  {
    id: 'macos-clean-install-recovery-guide',
    title: 'macOS — Clean Installation, Internet Recovery, APFS Container Formatting & DFU Revive',
    deviceCategory: 'macbook',
    manufacturer: 'Apple',
    deviceRef: 'apple-macbook-air-m1-a2337',
    supportedModels: ['Apple Silicon (M1, M2, M3, M4)', 'Intel Macs with T2 Chip (2018–2020)', 'Intel Macs without T2 (2012–2017)'],
    repairCategory: 'os_install',
    difficulty: 'Intermediate',
    estimatedTime: '30–60 Minutes',
    verificationStatus: 'published',
    lastReviewed: '2026-11-13',
    sourceRef: 'source-rossmann-macos-recovery',
    tools: ['tool-usb-boot'],
    parts: [],
    safetyWarnings: [
      'A full clean install with Disk Utility erase permanently removes all user data, encryption keys, and recovery containers on the APFS volume. Ensure user backup is confirmed.',
      'On Apple Silicon and T2 Macs, ensure Activation Lock is removed by the owner (Apple ID logout) before performing clean wipe, otherwise the Mac will enter iCloud Activation Lock on setup.'
    ],
    initialDiagnosis: 'Mac stuck at flashing question mark folder, prohibitory symbol, boot loop at Apple logo with progress bar, corrupted macOS update, or preparing refurbished MacBook for a new user.',
    commonMistakes: [
      'Erasing only the "Macintosh HD - Data" subvolume instead of viewing all devices and erasing the parent Apple SSD container, leaving orphaned ghost APFS snapshots.',
      'Using Intel recovery key combos on Apple Silicon (Option+Cmd+R does nothing on M1/M2/M3; you MUST hold the power button down).',
      'Attempting full DFU Restore when DFU Revive would have preserved customer data while re-flashing corrupted BridgeOS / Secure Enclave firmware.'
    ],
    testingChecklist: [
      'Mac boots to "Hello" setup assistant or user desktop cleanly',
      'APFS Container configured with standard Macintosh HD / Data split',
      'Apple Diagnostics (hold "D" at boot) passes with reference code ADP000 (No issues found)',
      'Wi-Fi, Bluetooth, Audio, FaceTime Camera, and Touch ID register properly',
      'FileVault encryption successfully initializes if enabled'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Architecture: Apple Silicon vs Intel Recovery Trigger',
        videoTimestamp: "01:15",
        videoSeconds: 75,
        diagramType: "macos-powerbutton-hold",
        instructions: 'Determine device architecture before booting:\n• APPLE SILICON (M1/M2/M3/M4): Start with Mac powered OFF. Press and HOLD the Power / Touch ID button continuously. Keep holding through the Apple logo until you see "Loading startup options". Click "Options" then "Continue".\n• INTEL MACS: Power on and immediately press and hold `Option + Command + R` (for latest compatible macOS via Internet Recovery) or `Command + R` (local recovery partition).',
        technicianNotes: 'Apple Silicon Macs store base recovery in a dedicated hardware container on internal NAND.'
      },
      {
        stepNumber: 2,
        title: 'Clean vs In-Place Reinstallation Decision',
        videoTimestamp: "03:30",
        videoSeconds: 210,
        diagramType: "macos-diskutility-devices",
        instructions: 'Determine client requirement:\n• In-Place Reinstallation: Choose "Reinstall macOS" directly WITHOUT touching Disk Utility. This replaces system files, kernel caches, and drivers while 100% preserving client applications, photos, and desktop documents.\n• Full Clean Wipe: Proceed to Step 3 to format the APFS container in Disk Utility.',
        technicianNotes: 'Always offer in-place reinstall first if client did not backup their data.'
      },
      {
        stepNumber: 3,
        title: 'Disk Utility APFS Container Formatting',
        videoTimestamp: "05:20",
        videoSeconds: 320,
        diagramType: "macos-apfs-erase",
        instructions: 'In macOS Recovery, open Disk Utility. In the menu bar, click View > Show All Devices (CRITICAL). In the left sidebar, select the top-level parent drive (e.g. "APPLE SSD AP0512Q Media"). Click "Erase". Enter Name: `Macintosh HD`, Format: `APFS`, Scheme: `GUID Partition Map`. Click Erase.',
        technicianNotes: 'If you do not click "Show All Devices", you will only format child volumes, leaving broken APFS container fragments.',
        warning: 'This permanently erases all internal NAND storage.'
      },
      {
        stepNumber: 4,
        title: 'Run macOS Installer',
        videoTimestamp: "07:10",
        videoSeconds: 430,
        diagramType: "macos-sonoma-reinstall",
        instructions: 'Quit Disk Utility to return to main Recovery menu. Select "Reinstall macOS [Sonoma / Ventura / Sequoia]". Click Continue, agree to terms, select "Macintosh HD" as the destination, and click Install. Keep laptop connected to high-speed Wi-Fi and OEM charger.',
        technicianNotes: 'The installer downloads ~12GB of encrypted payload directly from Apple CDN servers and reboots several times.'
      },
      {
        stepNumber: 5,
        title: 'Alternative: High-Speed Bootable USB Installation',
        videoTimestamp: "09:40",
        videoSeconds: 580,
        diagramType: "macos-dfu-thunderbolt-port",
        instructions: 'To install without waiting for slow Internet Recovery downloads: On another Mac, download macOS installer from App Store. In Terminal run: `sudo /Applications/Install\\ macOS\\ Sonoma.app/Contents/Resources/createinstallmedia --volume /Volumes/MyUSB`. Plug USB into client Mac. On Apple Silicon, select the USB from Startup Options. On T2 Intel, ensure Startup Security Utility allows booting from external media.',
        technicianNotes: 'Saves 45 minutes on bench repairs with multiple units.'
      },
      {
        stepNumber: 6,
        title: 'DFU Mode & Apple Configurator (When Recovery Fails)',
        videoTimestamp: "12:15",
        videoSeconds: 735,
        diagramType: "macos-configurator-revive",
        instructions: 'If an Apple Silicon or T2 Mac shows a black screen, exclamation mark, or corrupted recovery container: Connect the target Mac via its specific DFU USB-C port to a host Mac running Apple Configurator. Hold the DFU key combo (Power + Right Shift + Left Option + Left Control) for 10 seconds. In Apple Configurator, select Actions > Advanced > Revive Device (reflashes firmware without erasing data) or Restore (full factory flash).',
        technicianNotes: 'Revive Device fixes 80% of "bricked after update" Apple Silicon Macs with zero data loss.'
      },
      {
        stepNumber: 7,
        title: 'Hardware Diagnostics Verification',
        videoTimestamp: "14:50",
        videoSeconds: 890,
        diagramType: "macos-setup-assistant",
        instructions: 'Once installation completes, restart the Mac. For Apple Silicon: power off, press and hold Power button until startup options appear, then press and hold `Command + D`. For Intel: restart and hold `D` key. Run Apple Diagnostics. Confirm code `ADP000` (No issues found).',
        technicianNotes: 'Apple Diagnostics verifies battery health, RAM banks, GPU cores, and ambient thermal sensors.'
      }
    ]
  }
];

class RepairDatabaseService {
  constructor() {
    this.devices = SEED_DEVICES;
    this.tools = SEED_TOOLS;
    this.parts = SEED_PARTS;
    this.sources = SEED_SOURCES;
    this.guides = SEED_GUIDES;
    this.db = null;
    this.storage = null;
    this.initFirebase();
  }

  async initFirebase() {
    if (typeof window !== 'undefined' && window.firebase) {
      try {
        if (window.firebase.firestore) {
          this.db = window.firebase.firestore();
        }
        if (window.firebase.storage) {
          this.storage = window.firebase.storage();
        }
      } catch (e) {
        console.warn('Firebase online backend not initialized, using local seed storage.', e);
      }
    }
  }

  async getGuides(filter = {}) {
    let result = [...this.guides];

    if (filter.deviceCategory && filter.deviceCategory !== 'all') {
      result = result.filter(g => g.deviceCategory === filter.deviceCategory);
    }
    if (filter.repairCategory && filter.repairCategory !== 'all') {
      result = result.filter(g => g.repairCategory === filter.repairCategory);
    }
    if (filter.manufacturer && filter.manufacturer !== 'all') {
      result = result.filter(g => g.manufacturer.toLowerCase().includes(filter.manufacturer.toLowerCase()));
    }
    if (filter.verificationStatus && filter.verificationStatus !== 'all') {
      result = result.filter(g => g.verificationStatus === filter.verificationStatus);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(g => {
        const text = (
          g.title + ' ' + 
          g.deviceCategory + ' ' + 
          g.manufacturer + ' ' + 
          g.supportedModels.join(' ') + ' ' + 
          g.initialDiagnosis + ' ' +
          (g.commonMistakes ? g.commonMistakes.join(' ') : '')
        ).toLowerCase();
        return q.split(/\s+/).every(word => text.includes(word));
      });
    }

    return result;
  }

  async getGuideById(id) {
    const aliasMap = {
      'macbook-battery-replacement-a2337': 'macbook-battery-replacement-pro-air',
      'dell-latitude-battery-replacement-5420': 'windows-battery-replacement-dell-hp-lenovo',
      'macos-clean-installation-recovery-guide': 'macos-clean-install-recovery-guide'
    };
    const lookupId = aliasMap[id] || id;
    const guide = this.guides.find(g => g.id === lookupId);
    if (!guide) return null;

    // Attach expanded device, tools, parts, and source metadata
    const device = this.devices.find(d => d.id === guide.deviceRef);
    const tools = (guide.tools || []).map(tId => this.tools.find(t => t.id === tId)).filter(Boolean);
    const parts = (guide.parts || []).map(pId => this.parts.find(p => p.id === pId)).filter(Boolean);
    const source = this.sources.find(s => s.id === guide.sourceRef);

    return {
      ...guide,
      deviceData: device,
      toolsData: tools,
      partsData: parts,
      sourceData: source
    };
  }

  async getDevices(filter = {}) {
    let list = [...this.devices];
    if (filter.category && filter.category !== 'all') {
      list = list.filter(d => d.category === filter.category);
    }
    if (filter.manufacturer && filter.manufacturer !== 'all') {
      list = list.filter(d => d.manufacturer.toLowerCase() === filter.manufacturer.toLowerCase());
    }
    return list;
  }

  async getSources() {
    return [...this.sources];
  }

  async getTools() {
    return [...this.tools];
  }

  async getParts() {
    return [...this.parts];
  }

  // Technician Bench Notes (Stored in localStorage or Firestore if authenticated)
  saveTechnicianNote(guideId, stepNumber, noteText) {
    const key = `tech_notes_${guideId}`;
    let notes = {};
    try {
      notes = JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {}
    notes[stepNumber] = {
      text: noteText,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(notes));

    // If Firestore is available and user is authenticated:
    if (this.db && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
      const uid = window.firebase.auth().currentUser.uid;
      this.db.collection('users').doc(uid).collection('notes').doc(`${guideId}_step_${stepNumber}`).set({
        guideId,
        stepNumber,
        text: noteText,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true }).catch(err => console.warn('Cloud sync error:', err));
    }

    return notes;
  }

  getTechnicianNotes(guideId) {
    const key = `tech_notes_${guideId}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  // Interactive Bench Step Checklist
  toggleStepChecklist(guideId, stepNumber) {
    const key = `tech_checklist_${guideId}`;
    let list = {};
    try {
      list = JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {}
    list[stepNumber] = !list[stepNumber];
    localStorage.setItem(key, JSON.stringify(list));
    return list;
  }

  getStepChecklist(guideId) {
    const key = `tech_checklist_${guideId}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  // YouTube Research Pipeline Draft Submission
  submitResearchVideo(data) {
    const newSource = {
      id: 'source-user-' + Date.now(),
      channelName: data.channelName,
      videoTitle: data.videoTitle,
      youtubeUrl: data.youtubeUrl,
      verifiedBy: data.technicianName || 'Community Technician',
      keyTimestamps: data.timestamps || []
    };
    this.sources.unshift(newSource);

    // Save to local research cache
    const key = 'techtest_research_drafts';
    let drafts = [];
    try {
      drafts = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}
    drafts.unshift({
      ...data,
      sourceId: newSource.id,
      submittedAt: new Date().toISOString(),
      status: 'research_pending'
    });
    localStorage.setItem(key, JSON.stringify(drafts));
    return newSource;
  }

  getResearchDrafts() {
    const key = 'techtest_research_drafts';
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }
}

export const repairDb = new RepairDatabaseService();
if (typeof window !== 'undefined') {
  window.repairDb = repairDb;
}
