               try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    // Remote Diagnostics Logging
    window.onerror = function(message, source, lineno, colno, error) {
      fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source, lineno, colno, error: error ? error.stack : null })
      });
      return false;
    };
    window.addEventListener('unhandledrejection', function(event) {
      fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Unhandled Rejection: ' + event.reason, error: event.reason ? event.reason.stack : null })
      });
    });

    // Constants
    const FILTERS = [
      { vendorId: 0x054C, productId: 0x05C4 }, // DualShock 4 V1
      { vendorId: 0x054C, productId: 0x09CC }, // DualShock 4 V2
      { vendorId: 0x054C, productId: 0x0CE6 }, // DualSense
      { vendorId: 0x054C, productId: 0x0DF2 }, // DualSense Edge
    ];

    // SVG Template Markup for PlayStation Controller Silhouette
    const CONTROLLER_SVG_MARKUP = `<svg id="controller-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 518" style="width: 80%; height: auto; max-width: 80%;" stroke-width="1">
  <g id="Button_infills">
    <g id="Mute_infill" transform="translate(0,0.65) scale(0.70)">
      <path id="Mute_infill" d="M454.47,468.7c-6.47,0-12.69.04-18.75.14-.92.01-2.18.28-2.96,1.48-.56.85-.83,2.14-.8,3.81.03,2.24.41,3.3,3.67,3.32,4.47.03,8.94.02,13.41.02l5.53-.03c1.83,0,3.67,0,5.5-.01,4.41-.01,8.97-.03,13.46.04,3.68.09,4.03-1.61,4.06-3.62.02-1.47-.23-2.58-.76-3.39-.67-1.03-1.83-1.6-3.26-1.62-6.64-.08-12.98-.12-19.1-.12Z"/>
    </g>
    <g id="Down_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M177.4,357.17c-1.88,2.05-4.45,3.18-7.24,3.18h-22.91c-2.79,0-5.36-1.13-7.25-3.18-1.88-2.05-2.79-4.71-2.55-7.49l1.25-14.78c.43-5.04,2.71-9.71,6.42-13.16l9.04-8.39c1.21-1.12,2.74-1.68,4.27-1.68s2.98.54,4.18,1.61l9.44,8.45c3.87,3.47,6.24,8.23,6.68,13.4l1.23,14.55c.24,2.78-.67,5.44-2.56,7.49Z"/>
    </g>
    <g id="PS_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M455.41,437.59c11.37.03,20.87-9.06,21-20.1.14-11.24-9.39-20.97-20.61-21.05-11.23-.08-21,9.57-20.99,20.72,0,11.16,9.32,20.4,20.6,20.43Z"/>
    </g>
    <g id="Right_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M223.51,284.09v22.91c0,2.79-1.13,5.36-3.18,7.24-2.05,1.89-4.71,2.8-7.49,2.56l-14.55-1.23c-5.17-.44-9.93-2.81-13.39-6.68l-8.46-9.44c-2.17-2.43-2.14-6.06.07-8.45l8.4-9.04c3.44-3.71,8.11-5.99,13.15-6.42l14.78-1.25c2.78-.24,5.44.67,7.49,2.56,2.05,1.88,3.18,4.45,3.18,7.24Z"/>
    </g>
    <g id="Left_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M140.97,299.45l-8.46,9.44c-3.46,3.87-8.22,6.24-13.39,6.68l-14.55,1.23c-2.78.24-5.44-.67-7.49-2.56-2.05-1.88-3.18-4.45-3.18-7.24v-22.91c0-2.79,1.13-5.36,3.18-7.24,1.84-1.69,4.17-2.6,6.63-2.6.28,0,.57.01.86.04l14.78,1.25c5.04.43,9.71,2.71,13.15,6.42l8.4,9.04c2.21,2.39,2.24,6.02.07,8.45Z"/>
    </g>
    <g id="Up_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M179.96,241.41l-1.23,14.55c-.44,5.17-2.81,9.93-6.68,13.39l-9.44,8.46c-2.43,2.17-6.06,2.14-8.45-.07l-9.04-8.4c-3.71-3.44-5.99-8.11-6.42-13.15l-1.25-14.78c-.24-2.78.67-5.44,2.55-7.49,1.89-2.05,4.46-3.18,7.25-3.18h22.91c2.79,0,5.36,1.13,7.24,3.18,1.89,2.05,2.8,4.71,2.56,7.49Z"/>
    </g>
    <g id="Triangle_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M751.45,261.08c15.08-.01,26.75-11.5,26.73-26.31-.02-14.47-12.19-26.62-26.73-26.69-14.57-.07-26.65,11.99-26.66,26.63-.01,14.84,11.65,26.37,26.66,26.36Z"/>
    </g>
    <g id="Cross_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M750.93,379.05c15.44-.06,27.38-11.64,27.24-26.43-.13-14.28-12.84-26.83-26.99-26.3-14.58.55-26.43,12.2-26.39,26.91.04,14.23,11.83,25.88,26.14,25.82Z"/>
    </g>
    <g id="Circle_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M787.29,293.47c-.03,14.49,11.88,26.68,26.15,26.75,14.74.08,26.99-11.95,26.95-26.46-.04-14.51-12.12-26.34-27.04-26.48-14.04-.14-26.03,11.91-26.06,26.18Z"/>
    </g>
    <g id="Square_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M689.1,320.22c14.61.11,27.23-12.13,27.17-26.35-.06-14.09-12.36-26.44-26.54-26.66-14.42-.22-26.52,11.67-26.66,26.18-.13,14.49,11.74,26.73,26.03,26.83Z"/>
    </g>
    <g id="Options_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M691.58,199.27l-4.27,17.92c-.91,3.82-4.76,6.19-8.58,5.28-3.82-.91-6.19-4.76-5.28-8.58l4.27-17.92c.78-3.27,3.71-5.48,6.93-5.48.54,0,1.1.06,1.65.19,1.85.44,3.42,1.58,4.42,3.2s1.3,3.53.86,5.38Z"/>
    </g>
    <g id="Create_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M224.03,191.39c.55-.13,1.11-.19,1.65-.19,3.22,0,6.15,2.21,6.93,5.47l4.27,17.93c.44,1.85.13,3.76-.86,5.38-1,1.62-2.57,2.76-4.42,3.2-3.82.91-7.67-1.46-8.58-5.28l-4.27-17.92c-.91-3.82,1.46-7.67,5.28-8.58Z"/>
    </g>
    <g id="R2_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M800.14,115.88c-1.06,1.16-2.71,1.73-5.05,1.73-.01,0-.03,0-.04-.01-24.46-6.24-52.88-10.2-84.5-11.76h-.12c-4.19.08-7.09-.8-8.55-2.62-1.41-1.74-1.67-4.53-.77-8.29l.03-.15,9.87-67.57c3.29-14.17,13.23-21.12,30.28-21.12,2.57,0,5.31.16,8.22.47,13.16,1.54,22.93,6.87,29.86,16.29,2.6,3.53,4.67,7.72,6.16,12.44,7.81,24.72,11.55,46.61,15.88,71.95l.15.88c.41,3.61-.06,6.25-1.42,7.76Z"/>
    </g>
    <g id="L2_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M208.41,103.22c-1.47,1.82-4.36,2.7-8.55,2.62h-.12c-31.62,1.56-60.04,5.52-84.5,11.76-.01.01-.03.01-.04.01-2.34,0-4-.57-5.05-1.73-1.36-1.51-1.84-4.15-1.42-7.76l.15-.88c4.33-25.34,8.07-47.23,15.87-71.95,1.49-4.72,3.57-8.91,6.17-12.44,6.93-9.42,16.7-14.75,29.86-16.29,2.9-.31,5.64-.47,8.22-.47,17.05,0,26.98,6.95,30.28,21.12l9.87,67.57.03.15c.89,3.76.63,6.55-.77,8.29Z"/>
    </g>
    <g id="R1_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M805.8,173.73c-45.97-8.48-86.34-15.03-123.26-19.99,2.9-8.22,9.5-13.32,20.48-15.9,26.02-3.4,53.76,2.2,87.27,17.61.98.44,1.96.95,2.94,1.51,9.2,5.27,12.41,9.42,12.57,16.77Z"/>
    </g>
    <g id="L1_infill" transform="translate(0,0.65) scale(0.70)">
      <path d="M226.89,153.84c-42.76,6.62-84.3,13.1-123.56,19.27.76-6.19,2.09-12.15,27.86-22.29,28.7-10.58,37.26-12.24,70.44-13.64,2.49-.11,4.68,0,6.67.32,9.71,1.57,15.81,6.94,18.59,16.34Z"/>
    </g>
  </g>
  <g id="Outline" transform="translate(0,0.65) scale(0.70)">
    <g id="Controller">
      <path id="Controller_outline" d="M804.61,172.5s.09.02.13.02c-45.03-8.29-84.58-14.71-120.82-19.6.06,0,.12.02.17.02-.09.21-.14.44-.23.66-1.95.4-4.06.27-6,.85-.01-.01-.04-.03-.06-.05-.04-.13-.09-.26-.14-.39.02,0,.04,0,.07,0-4.87-.52-9.74-1.01-14.62-1.5-4.79-.46-9.6-.91-14.4-1.34h-.01s-.37-.05-.37-.05c-9.11-.83-18.27-1.58-27.45-2.28,0,.04,0,.08,0,.11,6.85.92,13.16,2.58,18.67,6.93,0,0-.01-.01-.02-.02,1.13.1,2.24.2,3.36.3,5.18,1.42,9.39,5.36,10.93,10.49,1.6,5.35,1.3,12.24-.9,20.47l-21.05,109.2c-4.19,26.12-19.01,37.08-42.82,41.56l-143.01.03-128.89-.03c-23.72-4.39-39.07-18.19-42.83-41.64l-2.11-10.93c-.29-2.09-.65-4.23-1.12-6.43l-12.19-62.64-5.57-28.92-.04-.19c-.09-.35-.16-.68-.25-1.03l-1.25-6.42s0-.03-.01-.04c-.67-4.99-.48-9.34.61-12.98,1.44-4.81,5.22-8.56,9.95-10.19,1.68-.14,3.36-.28,5.03-.42-.01,0-.02.02-.04.03.13-.02.26-.04.39-.06,1.51-.96,3.05-1.79,4.52-2.46,4.51-2.11,9.69-3.99,14.78-4.58-8.71.66-17.56,1.37-26.29,2.11l-1.11.09c-9.48.82-18.77,1.68-27.61,2.55l-.46.05s0-.01,0-.02c-.02.03-.03.06-.04.09-1.99.06-3.94-.42-5.98-.72,0-.03,0-.06-.01-.09.03,0,.06,0,.08-.01-41.23,6.38-81.95,12.73-121.09,18.88,0-.03.01-.07.02-.1l-5.76,1.61c-1.39.76-2.77,1.68-4.11,2.75-6.4,5.15-12.04,13.69-17.24,26.11-27.39,64.19-47.54,129.24-59.9,193.34C4.64,462.34-.21,530.22,3.08,597.4c2.41,40.48,7.54,66.82,16.62,85.41,9.85,20.12,24.59,31.39,46.4,35.45l39.76,12.39.33.07h.1c.97.12,1.93.18,2.86.18,13.63,0,18.84-11.41,21.55-19.96,27.65-75.71,49.02-130.11,67.27-171.19,8.52-19.59,24.3-29.11,48.23-29.11,3.5,0,7.23.21,11.11.63h.17c60.68,2.54,123.31,3.82,186.16,3.82,70.29,0,142.26-1.6,213.94-4.76,2.31-.2,4.59-.3,6.77-.3,23.28,0,39.64,11.03,50,33.68,26.25,62.96,48.44,119.86,67.83,173.94,3.28,8.94,9.45,13.47,18.32,13.47,1.52,0,3.14-.14,4.82-.4h.06s45.5-13.11,45.5-13.11c2-.48,4.05-1.09,6.27-1.86l.13-.04.72-.25v-.02c15.47-5.75,26.84-17.21,34.75-35,7.77-17.48,12.58-41.33,15.58-77.35,4.35-57.49-1.58-134.16-16.29-210.35-15.8-81.82-40.06-154.86-68.3-205.65-2.37-4.62-4.05-7.26-5.79-9.11-2.01-2.17-4.26-3.46-7.64-4.35,0-.05-.03.03-.04-.02M654.75,157.28c1.32.12,2.27.2,2.26.19,4.84.46,9.76.95,14.92,1.48-3.75,2.27-6.89,5.18-9.51,8.8-.01-.02-.01-.04-.02-.06-.81,1.03-1.56,2.12-2.23,3.26-.18-2.07-.53-4.04-1.07-5.86-.89-2.98-2.4-5.62-4.35-7.82ZM251.1,157.47l.22-.17.34-.03c-2.05,2.16-3.62,4.8-4.53,7.83-.29.95-.5,1.95-.69,2.98-.3-.5-.5-.83-.51-.82-2.55-3.31-5.76-6.16-9.46-8.41,4.54-.44,9.37-.89,14.63-1.37ZM63.74,711.34c-1.7,0-3.53-.26-5.45-.77l-.46-.09c-15.03-4.97-25.58-14.54-33.18-30.09-8.75-17.89-13.71-43.59-16.08-83.29C2.18,466.43,27.04,334.31,82.48,204.42c5.96-14.26,12.4-22.95,19.68-26.57,36.97-5.81,77.23-12.09,119.66-18.67,12.6,2.24,22,10.48,24.57,21.52.29,2.12.73,4.32,1.3,6.61l5.63,28.91,13.52,70.16c3.04,22.28-4.43,36.44-19.51,54.89-33.86,35.52-63.96,83.16-92.02,145.65-22.57,50.27-43.21,108.54-64.97,183.45-3.79,15.91-8.97,32.96-18.74,38.81-2.41,1.45-4.98,2.16-7.85,2.16ZM804.28,725.31c-1.3.21-2.54.31-3.7.31-6.47,0-10.8-3.22-13.23-9.84-19.36-54.03-41.59-111.02-67.97-174.28-11.21-24.52-29.78-36.96-55.17-36.96-2.28,0-4.64.1-6.97.3-71.45,3.15-143.25,4.75-213.42,4.75-62.79,0-125.39-1.28-185.99-3.8-3.91-.42-7.72-.63-11.32-.63-26.2,0-44.22,10.9-53.58,32.37-18.31,41.24-39.73,95.76-67.43,171.64-3.62,11.38-8.49,16.23-16.28,16.23-.66,0-1.36-.03-2.07-.1l-34.11-10.63c.47-.24.93-.49,1.38-.76,11.51-6.9,17.19-25.2,21.22-42.14,31.82-109.48,78.28-245.56,155.72-326.77l.12-.14c10.32-12.6,15.94-21.99,18.94-31.77.01.02.02.03.03.05l.04-.29c.47-1.24.83-2.6,1.14-4.03,5.82,18.4,22.43,32.57,45.18,34.56l129.25.04,143.13-.03h.24c23.32-2.05,38.12-13.14,44.92-33.72.1.51.2,1.01.32,1.53,3.02,14.37,11.49,26.24,20.3,37l.17.19c81.44,78.96,128.1,212.33,162.99,332.38,5.91,20.1,10.54,31.1,19.1,35.05l-32.95,9.49ZM902.84,602.66c-4.81,57.88-14.43,96.11-47.36,107.83-4.19,1.09-7.37,1.59-9.99,1.59-9.87,0-14.41-6.75-22.08-32.85-22.39-77.03-43.38-136.08-66.05-185.82-29.41-64.53-61.55-113.22-98.27-148.86-16.5-20.18-23.88-35.21-18.4-61.3l20.03-98.96c4.49-15.34,12.4-22.67,27.28-25.27,35.69,4.91,74.62,11.29,119,19.5h.07c5.65,1.12,7.18,2.15,11.82,11.17,60.68,109.11,92.4,301.63,83.95,412.97Z"/>
      <g id="Speaker_grill">
        <circle cx="420.29" cy="357.71" r="4.82"/>
        <circle cx="437.84" cy="357.71" r="4.82"/>
        <circle cx="455.38" cy="357.71" r="4.82"/>
        <circle cx="472.93" cy="357.71" r="4.82"/>
        <circle cx="490.47" cy="358.68" r="4.82"/>
      </g>
      <path id="L3_surround" d="M340.92,373.72c-12.1-11.94-28.56-18.52-46.36-18.52-1.03,0-2.06.02-3.11.06-16.56.69-32.12,7.92-43.82,20.35-11.43,12.15-17.66,28.1-17.11,43.7-.63,16.4,5.79,32.86,17.63,45.16,12.39,12.87,29.14,19.96,47.17,19.96h.13c17.75-.03,34.16-6.86,46.21-19.24,12.14-12.46,18.58-29.31,18.14-47.45-.41-16.77-7.12-32.41-18.9-44.04ZM296.63,478.55c-.35,0-.7,0-1.06,0-16.24,0-31.34-6.14-42.53-17.29-11.18-11.15-17.33-26.19-17.32-42.36.02-27.96,22.56-58.15,58.94-58.15h.29c16.72.07,32,6.28,43.02,17.47,10.8,10.97,16.65,25.88,16.48,41.98-.4,36.53-29.71,58.36-57.82,58.36Z"/>
      <path id="R3_surround" d="M617.17,355.14c-1.39,0-2.81.05-4.21.13-16.38,1.04-31.68,7.93-43.07,19.39-11.63,11.71-18.09,27.2-18.18,43.63-.1,18.38,6.27,34.57,18.42,46.8,12.21,12.3,29.46,19.38,47.3,19.41h.1c16.61,0,32.4-6.7,44.48-18.88,12.21-12.3,19.13-29.12,19-46.1.29-16.6-6.42-33.11-18.41-45.31-12.1-12.31-28.23-19.09-45.43-19.09ZM675.5,419.52c-.02,32.9-25.99,58.85-59.12,59.08h-.4c-15.55,0-30.85-6.54-41.96-17.95-11.2-11.5-17.15-26.51-16.74-42.27.84-32.25,26.93-57.61,59.4-57.74h.24c16.08,0,31.03,6.27,42.11,17.65,10.89,11.19,16.89,26.21,16.48,41.23Z"/>
    </g>
    <g id="Button_outlines">
      <path id="L1" d="M131.54,151.76c28.58-10.54,37.1-12.19,70.13-13.58.62-.03,1.21-.04,1.78-.04,1.7,0,3.23.11,4.69.35,8.92,1.44,14.64,6.2,17.45,14.54-.03,0-.06,0-.08.01,0,.03,0,.06.01.09,2.04.3,3.99.78,5.98.72.02-.03.03-.06.04-.09-3.07-11.83-10.65-18.79-22.53-20.72-1.76-.27-3.6-.41-5.61-.41-.63,0-1.28,0-1.95.04-5.25.22-9.69.44-13.55.68-23.59,1.48-33.63,4.15-58.32,13.26-1.9.75-3.55,1.43-5.01,2.05l-.16.07c-23.9,10.2-24.72,17.05-25.6,24.3-.02.13-.04.25-.05.38l5.76-1.61c.79-5.14,3.38-10.75,27.02-20.05Z"/>
      <path id="R1" d="M804.81,159.88c-2.27-2.33-5.34-4.53-9.35-6.83-1.04-.6-2.15-1.17-3.28-1.69-27.77-12.77-52.08-18.98-74.31-18.98-5.21,0-10.43.34-15.56,1.02l-.23.04c-13.31,3.1-21.29,9.84-24.35,20.58-.02,0-.04,0-.07,0,.05.13.1.26.14.39.02.02.05.03.06.05.49-.18,1-.3,1.52-.33,1.52-.11,3.01-.3,4.48-.51.01-.04.03-.08.05-.12.05-.18.11-.36.18-.54-.06,0-.12-.02-.17-.02,2.98-7.21,9.14-11.7,19.28-14.1,4.8-.62,9.73-.94,14.65-.94,21.43,0,44.99,6.05,72.03,18.48.91.41,1.84.89,2.85,1.47,8.44,4.83,11.54,8.54,12.01,14.69-.05,0-.09-.02-.13-.02.06.13.12.25.16.39.02.06.05.12.07.18,1.01.07,1.98.26,2.89.58.87-.31,1.74-.34,2.57-.15-.14-5.55-1.73-9.75-5.49-13.61Z"/>
      <path id="L2_outline" d="M115.16,122.1h.4l.52-.07.06-.02c24.15-6.19,52.33-10.12,83.69-11.68h.47c5.39,0,9.3-1.44,11.61-4.29,2.31-2.88,2.86-6.94,1.67-11.99l-9.91-67.79c-3.78-16.37-15.49-24.66-34.81-24.66-2.7,0-5.6.17-8.61.49-14.28,1.66-25.37,7.75-32.97,18.08-2.9,3.94-5.2,8.57-6.83,13.75-7.91,25.05-11.67,47.06-16.02,72.55l-.18,1.03c-.57,5.06.28,8.9,2.55,11.39,1.92,2.12,4.73,3.2,8.34,3.2ZM109.72,108.29l.15-.89c4.32-25.3,8.06-47.16,15.84-71.81,1.46-4.61,3.48-8.7,6.02-12.15,6.76-9.19,16.3-14.38,29.16-15.89,2.88-.31,5.61-.46,8.11-.46,16.53,0,26.12,6.66,29.29,20.26l9.88,67.62.04.18c.81,3.44.62,5.94-.57,7.43-1.21,1.5-3.65,2.25-7.25,2.25h-.69c-31.62,1.56-60.09,5.52-84.61,11.76-1.98-.02-3.35-.48-4.19-1.4-1.15-1.27-1.55-3.69-1.18-6.92Z"/>
      <path id="R2_outline" d="M709.98,110.34h.41c31.43,1.56,59.6,5.48,83.74,11.68l.06.02.53.07h.4c3.61,0,6.42-1.08,8.34-3.2,2.27-2.5,3.13-6.33,2.54-11.45l-.17-.97c-4.35-25.49-8.11-47.5-16.02-72.55-1.63-5.18-3.93-9.81-6.83-13.75-7.61-10.33-18.71-16.42-32.99-18.08-3-.33-5.89-.49-8.6-.49-19.32,0-31.03,8.3-34.82,24.74l-9.87,67.63c-1.21,5.13-.66,9.2,1.66,12.08,2.31,2.85,6.22,4.29,11.61,4.29ZM702.09,95.12l.04-.2,9.85-67.49c3.18-13.69,12.77-20.35,29.31-20.35,2.49,0,5.22.16,8.1.46,12.87,1.51,22.41,6.7,29.17,15.89,2.53,3.43,4.55,7.52,6.01,12.15,7.79,24.65,11.52,46.51,15.85,71.82l.14.83c.37,3.3-.03,5.71-1.17,6.97-.85.93-2.22,1.39-4.19,1.4-24.52-6.25-52.99-10.21-84.66-11.77h-.64c-3.56,0-6.07-.77-7.26-2.25-1.2-1.49-1.4-3.99-.56-7.47Z"/>
      <path id="Create_outline" d="M218.64,218.94c1.25,5.26,5.9,8.93,11.31,8.93.92,0,1.83-.11,2.69-.32,3.02-.72,5.57-2.57,7.2-5.22,1.63-2.65,2.13-5.76,1.41-8.77l-4.26-17.93c-1.25-5.26-5.9-8.93-11.31-8.93-.9,0-1.81.11-2.7.32-3.02.71-5.57,2.57-7.2,5.21-1.63,2.65-2.13,5.76-1.42,8.78l4.27,17.93ZM220.47,195.11c.86-1.4,2.21-2.37,3.79-2.75.46-.11.93-.16,1.42-.16,2.85,0,5.3,1.93,5.96,4.7l4.27,17.93c.38,1.59.11,3.23-.74,4.62-.86,1.4-2.21,2.38-3.8,2.75-.47.11-.94.17-1.42.17-2.85,0-5.3-1.94-5.96-4.71l-4.27-17.93c-.38-1.59-.11-3.23.75-4.62Z"/>
      <path id="Options_outline" d="M677.7,226.85c.91.21,1.82.32,2.69.32,5.4,0,10.05-3.68,11.3-8.94l4.27-17.92c.72-3.02.22-6.15-1.41-8.79-1.63-2.64-4.18-4.5-7.2-5.22-.88-.21-1.79-.31-2.69-.31-5.41,0-10.06,3.67-11.32,8.93l-4.27,17.93c-1.49,6.23,2.38,12.51,8.62,14.01ZM674.43,214.12l4.26-17.92c.66-2.77,3.11-4.71,5.96-4.71.5,0,.96.06,1.42.17,1.59.38,2.94,1.35,3.8,2.74.85,1.38,1.12,3.03.74,4.63l-4.26,17.92c-.66,2.77-3.11,4.71-5.96,4.71-.47,0-.95-.06-1.42-.17-1.59-.38-2.94-1.35-3.8-2.75-.86-1.39-1.12-3.04-.74-4.63Z"/>
      <path id="Left_outline" d="M99.81,321.31c1.27.35,2.6.53,3.93.53.42,0,.83-.02,1.25-.06l14.55-1.23c5.53-.47,10.68-2.71,14.76-6.39.68-.6,1.32-1.25,1.94-1.94l8.45-9.44c3.91-4.36,3.85-10.88-.13-15.18l-8.39-9.04c-4.29-4.63-10.11-7.47-16.4-8l-14.78-1.25c-4.13-.36-8.24,1.05-11.29,3.85s-4.8,6.79-4.8,10.93v22.91c0,4.14,1.75,8.12,4.8,10.93,1.75,1.61,3.85,2.76,6.11,3.38ZM93.9,284.09c0-2.79,1.13-5.36,3.18-7.24,1.84-1.69,4.17-2.6,6.63-2.6.28,0,.57.01.86.04l14.78,1.25c5.04.43,9.71,2.71,13.15,6.42l8.4,9.04c2.21,2.39,2.24,6.02.07,8.45l-8.46,9.44c-3.46,3.87-8.22,6.24-13.39,6.68l-14.55,1.23c-2.78.24-5.44-.67-7.49-2.56-2.05-1.88-3.18-4.45-3.18-7.24v-22.91Z"/>
      <path id="Right_outline" d="M172.85,287.6c-3.98,4.3-4.04,10.82-.14,15.18l8.27,9.23.19.21c4.32,4.83,10.25,7.78,16.7,8.33l14.55,1.23c.42.04.83.06,1.25.06,1.4,0,2.79-.2,4.12-.58,2.18-.64,4.22-1.76,5.92-3.33,3.05-2.81,4.8-6.79,4.8-10.93v-22.91c0-4.14-1.75-8.13-4.8-10.93-3.05-2.8-7.16-4.2-11.29-3.85l-14.78,1.25c-.74.06-1.48.16-2.2.28-2.7.47-5.27,1.36-7.65,2.64-2.43,1.31-4.64,3.01-6.55,5.08l-8.39,9.04ZM198.06,275.54l14.78-1.25c2.78-.24,5.44.67,7.49,2.56,2.05,1.88,3.18,4.45,3.18,7.24v22.91c0,2.79-1.13,5.36-3.18,7.24-2.05,1.89-4.71,2.8-7.49,2.56l-14.55-1.23c-5.17-.44-9.93-2.81-13.39-6.68l-8.46-9.44c-2.17-2.43-2.14-6.06.07-8.45l8.4-9.04c3.44-3.71,8.11-5.99,13.15-6.42Z"/>
      <path id="Down_outline" d="M183.71,334.71c-.13-1.61-.42-3.18-.84-4.71-.05-.16-.1-.32-.15-.47-.22-.68-.45-1.34-.69-2-1.43-3.61-3.69-6.87-6.65-9.52l-9.44-8.46c-4.36-3.9-10.88-3.85-15.18.14l-9.04,8.39c-1.05.97-2,2.01-2.85,3.12-2.94,3.82-4.74,8.41-5.15,13.28l-1.25,14.78c-.15,1.83.03,3.65.54,5.38.62,2.18,1.75,4.21,3.31,5.91,2.8,3.05,6.79,4.8,10.93,4.8h22.91c4.14,0,8.12-1.75,10.93-4.8,2.8-3.05,4.2-7.16,3.85-11.29l-1.23-14.55ZM177.4,357.17c-1.88,2.05-4.45,3.18-7.24,3.18h-22.91c-2.79,0-5.36-1.13-7.25-3.18-1.88-2.05-2.79-4.71-2.55-7.49l1.25-14.78c.43-5.04,2.71-9.71,6.42-13.16l9.04-8.39c1.21-1.12,2.74-1.68,4.27-1.68s2.98.54,4.18,1.61l9.44,8.45c3.87,3.47,6.24,8.23,6.68,13.4l1.23,14.55c.24,2.78-.67,5.44-2.56,7.49Z"/>
      <path id="Up_outline" d="M133.72,256.61c.48,5.73,2.88,11.07,6.81,15.22.38.41.78.8,1.19,1.18l9.04,8.39c2.18,2.02,4.92,3.03,7.67,3.03s5.36-.97,7.51-2.9l9.44-8.45c1.35-1.2,2.55-2.53,3.58-3.96,2.51-3.43,4.1-7.44,4.64-11.72.05-.34.08-.68.11-1.02l1.23-14.55c.35-4.13-1.05-8.24-3.85-11.29-2.81-3.05-6.79-4.8-10.93-4.8h-22.91c-4.14,0-8.13,1.75-10.93,4.8-1.53,1.66-2.64,3.64-3.27,5.76-.54,1.77-.74,3.65-.58,5.53l1.25,14.78ZM140,233.92c1.89-2.05,4.46-3.18,7.25-3.18h22.91c2.79,0,5.36,1.13,7.24,3.18,1.89,2.05,2.8,4.71,2.56,7.49l-1.23,14.55c-.44,5.17-2.81,9.93-6.68,13.39l-9.44,8.46c-2.43,2.17-6.06,2.14-8.45-.07l-9.04-8.4c-3.71-3.44-5.99-8.11-6.42-13.15l-1.25-14.78c-.24-2.78.67-5.44,2.55-7.49Z"/>
      <path id="Cross_outline" d="M751.82,321.39h-.11c-8.53,0-16.94,3.65-23.08,10.01-5.91,6.13-9.01,13.94-8.72,21.98.63,17.53,13.54,30.1,31.38,30.57h.03c17.47,0,31.35-13.6,31.6-30.96.12-8.05-3.19-16.1-9.08-22.09-5.9-6.01-13.93-9.48-22.02-9.51ZM770.09,370.25c-4.93,5-11.74,7.77-19.16,7.8h-.1c-13.76,0-24.99-11.14-25.03-24.82-.04-13.99,11.13-25.37,25.43-25.91.28-.01.56-.02.84-.02,13.25,0,24.99,11.83,25.12,25.32.06,6.67-2.46,12.93-7.09,17.63Z"/>
      <path id="Triangle_outline" d="M751.06,266c.21,0,.41,0,.62,0,8.36,0,16.79-3.45,22.54-9.22,5.71-5.73,8.72-13.49,8.69-22.44-.05-17.11-14.19-31.03-31.52-31.03h-.19c-17.15.1-31.24,14.15-31.4,31.3-.08,8.08,3.16,15.85,9.1,21.87,5.94,6.02,14.02,9.48,22.16,9.51ZM751.32,209.08h.12c13.93.07,25.71,11.83,25.73,25.69.01,6.89-2.62,13.27-7.4,17.98-4.79,4.71-11.3,7.31-18.35,7.32-6.99,0-13.47-2.6-18.25-7.33-4.77-4.72-7.4-11.13-7.39-18.03.01-14.13,11.47-25.63,25.53-25.63Z"/>
      <path id="Circle_outline" d="M791.23,272.06c-5.72,5.82-8.79,13.5-8.65,21.62.31,17.85,13.17,30.72,31.27,31.3.3,0,.6.01.9.01,16.35,0,30.24-14.13,30.33-30.86.05-8.44-3.12-16.31-8.92-22.14-5.91-5.94-13.96-9.21-22.68-9.21-8.47,0-16.37,3.3-22.25,9.28ZM839.39,293.77c.02,6.64-2.62,12.96-7.44,17.78-4.93,4.95-11.46,7.67-18.37,7.67,0,0-.14,0-.14,0-13.66-.07-25.18-11.87-25.15-25.75.03-13.65,11.4-25.19,24.83-25.19h.23c14.33.14,26.01,11.57,26.05,25.49Z"/>
      <path id="Square_outline" d="M691.99,262.62c-.79-.06-1.6-.09-2.38-.09-8.46,0-16.39,3.35-22.34,9.45-5.74,5.88-8.93,13.76-8.74,21.58-.29,17.51,12.78,31.02,30.42,31.42.26,0,.52,0,.78,0,17.09,0,30.37-12.98,30.9-30.18.51-16.54-12.34-30.97-28.64-32.18ZM707.82,311.38c-4.97,4.99-11.72,7.85-18.53,7.85,0,0-.18,0-.18,0-6.58-.05-12.82-2.74-17.59-7.59-4.87-4.95-7.51-11.43-7.45-18.24.13-13.89,11.46-25.19,25.26-25.19h.38c13.56.21,25.5,12.2,25.56,25.67.03,6.44-2.62,12.65-7.44,17.5Z"/>
      <path id="PS_outline" d="M455.4,442.49h.21c14.28-.12,25.41-11.31,25.35-25.47-.06-14.05-11.44-25.51-25.42-25.54-13.74,0-25.39,11.7-25.44,25.55-.03,6.72,2.63,13.09,7.46,17.95,4.82,4.84,11.16,7.51,17.84,7.51ZM441.75,403.34c3.78-3.75,8.85-5.9,13.92-5.9h.13c5.08.04,10.12,2.23,13.84,6.02,3.73,3.8,5.84,8.91,5.78,14.02-.13,10.54-9.08,19.11-20,19.11h0c-10.81-.02-19.6-8.74-19.6-19.43,0-5.03,2.17-10.07,5.94-13.82Z"/>
      <path id="Mute_outline" d="M474.24,464.3c-6.6-.06-13.03-.1-19.11-.1-6.51,0-12.67.04-18.82.11-2.55.03-4.67.99-6.15,2.77-1.4,1.7-2.12,4.04-2.07,6.78.07,3.52,1.54,7.73,8.15,7.76,2.64.01,5.27.02,7.91.02h11.06s1.74-.03,1.74-.03c0,0,7.44-.02,9.31-.02,2.62,0,5.25,0,7.86.04h.17c7.21,0,8.38-5.01,8.43-8,.05-2.57-.65-4.8-2.03-6.45-1.54-1.85-3.77-2.85-6.45-2.88ZM473.79,476.4h-2.19c-2.66-.05-2.76-.04-5.42-.04-1.84,0-10.97.03-10.97.03l-5.52.04h-5.9c-2.5,0-5,0-7.5-.02-.93,0-2.31-.66-2.33-2.29-.02-1.53-.18-2.63.18-3.31.57-1.06,1.65-1.24,2.25-1.25,6.08-.11,12.21-.17,18.74-.17,6.06,0,12.48.05,19.09.15,1.14.02,2.07.53,2.55,1.42.21.4.5,1.12.47,2.82-.02,1.47-.69,2.61-3.43,2.61Z"/>
    </g>
  </g>
  <g transform="translate(0,0.65) scale(0.70)">
    <g id="Trackpad_infill" >
      <path d="M452.27,328.53v-.02c40.22,0,80.43.07,120.65-.07,6.47-.02,13.17.01,19.36-1.58,19.32-4.99,29.59-18.18,33.51-36.6,7.44-34.93,15.37-69.99,21.95-105.09,1.8-9.6-.91-20.7-9.35-26.91-6.53-4.8-15.07-5.38-22.94-6-15.84-1.24-31.65-1.69-47.52-2.33-25.29-1.01-52.32-3.71-77.62-4-59.86-.67-117.65,1.12-177.41,5.09-10.18.68-20.91.48-30.97,2.12-12.6,2.05-25.72,12.82-22.5,31.32,2.97,17.08,7.65,34.26,11,51.28,3.72,18.85,7.61,37.68,11.08,56.58,2.33,12.67,8.64,23.23,19.04,30.56,9.97,7.03,21.64,5.61,33.14,5.62,39.53.06,79.06.02,118.6.02Z"/>
    </g>
    <g id="Trackpad_outline" >
      <path d="M272.25,153.56c-4.52,2.07-9.76,5.6-12.42,9.85-4.66,6.89-3.71,15.95-1.11,26.9l19.74,98.37c4.52,27.51,18.61,41.63,45.84,43.95h.12l235.94.06c-4.66-.08,4.33,0,9.56,0,35.3,0,49.5-11.1,56.07-37.73l20.44-101.35c4.26-16.93,3.93-29.59-6.87-37.71-6.24-4.92-13.49-6.41-21.4-7.26-52.97-4-107.12-6.03-161.4-6.03-.3,0-.6,0-.9,0-2.3-.01-4.58-.02-6.81-.02-.36,0-.72,0-1.08,0-.33,0-.66,0-1,0-3.06.02-6.18.05-9.34.09-48.92.43-98.66,2.47-148.15,6.11-5.85.15-12,2.31-17.24,4.76ZM641.07,192.4l-20.45,101.35c-6.01,24.35-18.98,33.44-50.41,33.44-3.02,0-6.24.2-9.64,0l-235.88-.06c-24.7-2.11-36.7-14.33-40.82-39.44l-19.79-98.56c-2.23-9.46-3.46-17.08.31-22.64,4.07-6.04,11.93-10.09,23.26-12.03,13.9-1.04,27.83-1.95,41.74-2.73,35.06-1.79,70.63-3.02,101.96-3.47.19,0,.38,0,.58,0,1.55-.02,3.08-.04,4.6-.06,6.53-.06,13.04-.09,19.54-.09,46.61.2,104.83,2.34,158.55,5.8,3.45.26,7.4.89,10.36,1.77,18.01,5.87,21.08,16.85,16.09,36.73Z"/>
    </g>
  </g>
  <g id="L3" transform="translate(0,0.65) scale(0.70)">
    <g id="L3_infill">
      <path d="M295.63,461.03c23.36,0,41.53-17.87,41.57-40.86.03-23.53-18.65-42.27-42.16-42.27-23.09,0-41.82,18.55-41.83,41.45-.01,23.9,18.09,41.69,42.42,41.69Z"/>
    </g>
    <g id="L3_outline">
      <path d="M295.14,466.67c-26.36-.18-47.62-21.47-47.16-47.19.51-28.21,21.76-46.51,47.28-47.04,25.52-.53,47.65,22.07,47.37,47.25-.29,26.05-21.63,47.15-47.5,46.98ZM295.63,461.03c23.36,0,41.53-17.87,41.57-40.86.03-23.53-18.65-42.27-42.16-42.27-23.09,0-41.82,18.55-41.83,41.45-.01,23.9,18.09,41.69,42.42,41.69Z"/>
    </g>
  </g>
  <g id="R3" transform="translate(0,0.65) scale(0.70)">
    <g id="R3_infill">
      <path d="M658.23,419.7c.55-22.76-17.76-41.19-40.35-41.72-23.43-.55-42.68,18.19-43.29,40.74-.65,23.92,18.7,41.15,39.11,42.46,25.96,1.66,44.96-18.72,44.52-41.48Z"/>
    </g>
    <g id="R3_outline">
      <path d="M664.07,419.78c-.01,26.37-21.16,47.39-47.6,47.32-26.19-.06-48.19-21.58-47.62-47.5.59-26.82,21.12-47.52,48.44-47.45,26.83.08,46.79,21.47,46.78,47.62ZM658.23,419.7c.55-22.76-17.76-41.19-40.35-41.72-23.43-.55-42.68,18.19-43.29,40.74-.65,23.92,18.7,41.15,39.11,42.46,25.96,1.66,44.96-18.72,44.52-41.48Z"/>
    </g>
  </g>
  <g id="TriggerPercentages" transform="translate(0,0.65) scale(0.70)">
    <text id="L2_percentage" x="160" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1a237e" text-anchor="middle" opacity="0">0 %</text>
    <text id="R2_percentage" x="750" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1a237e" text-anchor="middle" opacity="0">0 %</text>
  </g>
</svg>
`;

    // Global application state
    let hidDevice = null;
    let isConnected = false;
    let isClone = false;
    let isEdge = false;
    let connectionType = "USB"; // USB / Bluetooth
    let batteryLevel = null;
    let isBatteryCharging = false;
    let btMacAddress = "";
    let hwVersionHex = "";
    let boardModel = "";
    let compileDate = "";
    let compileTime = "";
    let swVersion = "";
    let nvsState = 1; // 0=Unlocked, 1=Locked, 2=Error
    let lastWebHidAxes = [0, 0, 0, 0];
    let sensorState = { gyroX: 0, gyroY: 0, gyroZ: 0, accelX: 0, accelY: 0, accelZ: 1.0 };
    
    // Damped visual coordinates for buttery-smooth animations
    let visualLx = 0, visualLy = 0, visualRx = 0, visualRy = 0;
    let visualL2 = 0, visualR2 = 0;
    let visualRotX = 0, visualRotY = 0;
    
    // Polling / Gamepad API variables
    let gamepadIndex = -1;
    let requestAnimationFrameId = null;
    let lastActiveTab = "tab-overview";
    let inputPollingCount = 0;
    let pollingRateHz = 0;
    let lastHzTime = performance.now();
    let isVibrating = false;
    let isCalibrating = false;
    let leftStickDriftStatus = "ok";
    let rightStickDriftStatus = "ok";
    
    // Button state logging
    const buttonNames = [
      "Cross", "Circle", "Square", "Triangle", 
      "L1", "R1", "L2", "R2", 
      "Share / Create", "Options", "L3", "R3", 
      "D-Pad Up", "D-Pad Down", "D-Pad Left", "D-Pad Right", 
      "PS Button", "Touchpad Click"
    ];
    const buttonPressCounts = Array(18).fill(0);
    const lastButtonStates = Array(18).fill(false);
    
    // Touchpad state
    let touchpadPoints = [
      { active: false, id: 0, x: 0, y: 0, trail: [] },
      { active: false, id: 0, x: 0, y: 0, trail: [] }
    ];
    let isTouchpadClicked = false;

    // Toast utility
    const toastEl = document.getElementById('appToast');
    const toastMessage = document.getElementById('toastMessage');
    let bootstrapToast = null;
    try {
      if (typeof bootstrap !== 'undefined') {
        bootstrapToast = new bootstrap.Toast(toastEl, { delay: 4000 });
      } else {
        console.warn("Bootstrap not defined, Toast fallback active");
      }
    } catch (e) {
      console.warn("Bootstrap Toast load error, using fallback alert", e);
    }
    
    function showNotification(msg, type = "success") {
      toastEl.className = `toast align-items-center text-white border-0 ${type === 'danger' ? 'bg-danger' : 'bg-dark'}`;
      toastMessage.innerHTML = msg;
      
      if (!bootstrapToast && typeof bootstrap !== 'undefined') {
        try {
          bootstrapToast = new bootstrap.Toast(toastEl, { delay: 4000 });
        } catch (e) {
          console.warn("Bootstrap Toast lazy load error", e);
        }
      }
      
      if (bootstrapToast) {
        bootstrapToast.show();
      } else {
        console.log(`[Notification] ${msg}`);
        // Log to raw HID log as a non-blocking UI message fallback
        const time = new Date().toLocaleTimeString([], { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
        const item = document.createElement("div");
        item.className = "history-log-item";
        item.innerHTML = `<span class="history-log-time">[${time}]</span> <span class="text-info">Notification: ${msg}</span>`;
        if (rawHidLogEl) {
          rawHidLogEl.appendChild(item);
          rawHidLogEl.scrollTop = rawHidLogEl.scrollHeight;
        }
      }
    }

    // Logging helpers
    const rawHidLogEl = document.getElementById("rawHidReportsLog");
    function logRawHID(msg) {
      const time = new Date().toLocaleTimeString([], { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
      const item = document.createElement("div");
      item.className = "history-log-item";
      item.innerHTML = `<span class="history-log-time">[${time}]</span> <span>${msg}</span>`;
      rawHidLogEl.appendChild(item);
      rawHidLogEl.scrollTop = rawHidLogEl.scrollHeight;
    }

    const testerHistoryLogEl = document.getElementById("testerHistoryLog");
    function logInputHistory(msg) {
      const time = new Date().toLocaleTimeString([], { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
      const item = document.createElement("div");
      item.className = "history-log-item";
      item.innerHTML = `<span class="history-log-time">${time}</span> <span>${msg}</span>`;
      
      // Clean up waiting banner
      if (testerHistoryLogEl.querySelector('.text-muted')) {
        testerHistoryLogEl.innerHTML = "";
      }
      
      testerHistoryLogEl.insertBefore(item, testerHistoryLogEl.firstChild);
      
      // Keep last 30 entries
      while (testerHistoryLogEl.children.length > 30) {
        testerHistoryLogEl.removeChild(testerHistoryLogEl.lastChild);
      }
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        lastActiveTab = targetTab;
      });
    });

    // Clear logs
    document.getElementById("btnClearRawLog").addEventListener("click", () => {
      rawHidLogEl.innerHTML = '<div class="text-muted text-center pt-5">Waiting for HID interface actions...</div>';
    });
    document.getElementById("btnClearHistory").addEventListener("click", () => {
      testerHistoryLogEl.innerHTML = '<div class="text-muted text-center pt-5">Waiting for button presses...</div>';
    });

    // WebHID Feature Report Helpers
    function alloc_req(device, data) {
      const reportId = data[0];
      let payloadSize = data.length - 1;
      
      if (device && device.collections) {
        for (const coll of device.collections) {
          let report = coll.featureReports?.find(r => r.reportId === reportId);
          if (!report && coll.outputReports) {
            report = coll.outputReports?.find(r => r.reportId === reportId);
          }
          if (report && report.items) {
            let bitSize = 0;
            for (const item of report.items) {
              bitSize += (item.reportSize || 0) * (item.reportCount || 0);
            }
            if (bitSize > 0) {
              payloadSize = Math.ceil(bitSize / 8);
            }
            break;
          }
        }
      }
      const totalSize = Math.max(payloadSize + 1, data.length);
      const buf = new Uint8Array(totalSize);
      buf.set(data);
      return buf;
    }

    async function sendFeatureReport(device, reportId, data) {
      // Assemble full report including the report ID
      const packet = new Uint8Array(data.length + 1);
      packet[0] = reportId;
      packet.set(data, 1);
      
      // Pad to required collection size
      const paddedPacket = alloc_req(device, packet);
      const payloadToSend = paddedPacket.subarray(1);
      
      logRawHID(`Sending Feature Report ID: 0x${reportId.toString(16).toUpperCase().padStart(2, '0')} (Len: ${paddedPacket.length}) -> [${Array.from(paddedPacket).map(x => '0x' + x.toString(16).toUpperCase().padStart(2, '0')).join(', ')}]`);
      await device.sendFeatureReport(reportId, payloadToSend);
    }

    async function receiveFeatureReport(device, reportId) {
      logRawHID(`Requesting Feature Report ID: 0x${reportId.toString(16).toUpperCase().padStart(2, '0')}`);
      const dataView = await device.receiveFeatureReport(reportId);
      const bytes = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);
      logRawHID(`Received Feature Report ID: 0x${reportId.toString(16).toUpperCase().padStart(2, '0')} (Len: ${bytes.length}) <- [${Array.from(bytes).map(x => '0x' + x.toString(16).toUpperCase().padStart(2, '0')).join(', ')}]`);
      return dataView;
    }

    // Connect controller
    async function triggerConnectDevice() {
      try {
        if (!navigator.hid) {
          showNotification("WebHID is not supported by your browser. Please use Chrome, Edge, or Opera.", "danger");
          return;
        }
        
        const devices = await navigator.hid.requestDevice({ filters: FILTERS });
        if (devices.length === 0) return;
        
        const device = devices[0];
        await device.open();
        
        handleConnect(device);
      } catch (err) {
        if (err.name === 'SecurityError' || err.message.includes('No device selected') || err.name === 'NotFoundError') {
           console.log("Device selection cancelled by user.");
           return;
        }
        console.error("Connection failed", err);
        showNotification("Connection failed: " + err.message, "danger");
      }
    }

    document.getElementById("btnConnect").addEventListener("click", triggerConnectDevice);
    
    const btnConnectReq = document.getElementById("btnConnectRequired");
    if (btnConnectReq) {
      btnConnectReq.addEventListener("click", triggerConnectDevice);
    }

    const btnDemoReq = document.getElementById("btnDemoRequired");
    if (btnDemoReq) {
      btnDemoReq.addEventListener("click", () => {
        startDemoMode();
        showNotification("Running in Virtual Simulator / Demo Mode", "success");
      });
    }

    // Disconnect controller
    document.getElementById("btnDisconnect").addEventListener("click", () => {
      handleDisconnect();
    });

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (hidDevice === device) {
        showNotification("Controller Disconnected", "danger");
        handleDisconnect();
      }
    });

    // Parse Controller info on connection
    async function handleConnect(device) {
      hidDevice = device;
      isConnected = true;
      isClone = false;
      isEdge = false;
      demoModeActive = false; // Turn off demo mode
      document.getElementById("demoModeIndicator").classList.add("d-none");
      
      // Update page visibility
      document.getElementById("connectionRequiredScreen").classList.add("d-none");
      document.getElementById("appDashboardContent").classList.remove("d-none");
      
      btMacAddress = "";
      hwVersionHex = "";
      boardModel = "";
      compileDate = "";
      compileTime = "";
      swVersion = "";

      // Find Gamepad API Index and Connection Type immediately
      locateGamepadIndex(device);

      // Show elements
      document.getElementById("btnDisconnect").classList.remove("d-none");
      document.getElementById("btnConnect").classList.add("d-none");
      document.getElementById("overviewInfoCard").classList.remove("opacity-50");
      document.getElementById("calibrationOptionsCard").classList.remove("opacity-50");
      document.getElementById("driftResultsRow").classList.remove("opacity-50");
      
      const isDualSense = device.productId === 0x0CE6 || device.productId === 0x0DF2;
      const isDualShock = device.productId === 0x05C4 || device.productId === 0x09CC;
      isEdge = device.productId === 0x0DF2;

      let devName = device.productName || "Unknown PlayStation Controller";
      if (device.productId === 0x05C4) devName = "DualShock 4 V1";
      if (device.productId === 0x09CC) devName = "DualShock 4 V2";
      if (device.productId === 0x0CE6) devName = "DualSense";
      if (device.productId === 0x0DF2) devName = "DualSense Edge";

      document.getElementById("overviewDevName").innerText = devName;
      document.getElementById("footerModelName").innerText = devName;
      document.getElementById("overviewDevStatus").innerText = "Connected via WebHID interface.";
      
      logRawHID(`Connected: ${devName} (VID: 0x${device.vendorId.toString(16)}, PID: 0x${device.productId.toString(16)})`);

      if (isEdge) {
        document.getElementById("edgeWarningBanner").classList.remove("d-none");
      } else {
        document.getElementById("edgeWarningBanner").classList.add("d-none");
      }

      // Read reports to get details
      try {
        if (isDualShock) {
          document.getElementById("ds4BoardModelContainer").classList.remove("d-none");
          
          // Read Bluetooth MAC Address from 0x12 (starts at index 1 of the report payload, 6 bytes, reversed)
          try {
            const macData = await receiveFeatureReport(device, 0x12);
            if (macData.byteLength >= 7) { // 1 byte report ID + 6 bytes MAC
              const bytes = [];
              for (let i = 0; i < 6; i++) {
                const idx = 1 + (5 - i);
                bytes.push(macData.getUint8(idx).toString(16).toUpperCase().padStart(2, '0'));
              }
              btMacAddress = bytes.join(':');
              document.getElementById("infoMac").innerText = btMacAddress;
            }
          } catch (e) {
            console.warn("Failed to read MAC address", e);
            logRawHID(`Error reading MAC address: ${e.message}`);
          }

          // Read Version / Build Info from 0xA3
          let infoData = null;
          let failed0xA3 = false;
          try {
            infoData = await receiveFeatureReport(device, 0xA3);
          } catch (e) {
            console.warn("Failed to read report 0xA3", e);
            logRawHID(`0xA3 read failed: ${e.message}`);
            failed0xA3 = true;
          }

          // Clone detection 1: 0xA3 failed or size too small
          if (failed0xA3 || !infoData || infoData.byteLength < 48) {
            isClone = true;
          } else {
            // Parse compile date & time
            const bytes = new Uint8Array(infoData.buffer, infoData.byteOffset, infoData.byteLength);
            
            // compile_date is 16 bytes, compile_time is 16 bytes
            const dateBytes = bytes.subarray(0, 16);
            const timeBytes = bytes.subarray(16, 32);
            
            compileDate = new TextDecoder("ascii").decode(dateBytes).replace(/\0/g, '').trim();
            compileTime = new TextDecoder("ascii").decode(timeBytes).replace(/\0/g, '').trim();
            document.getElementById("infoBuildDate").innerText = `${compileDate} ${compileTime}`;

            // Hardware & software versions (little endian)
            const hwMajor = bytes[32] | (bytes[33] << 8);
            const hwMinor = bytes[34] | (bytes[35] << 8);
            const swMajor = bytes[36] | (bytes[37] << 8) | (bytes[38] << 16) | (bytes[39] << 24);
            const swMinor = bytes[40] | (bytes[41] << 8);
            
            hwVersionHex = `0x${hwMinor.toString(16).toUpperCase().padStart(4, '0')}`;
            swVersion = `${swMajor}.${swMinor}`;

            // Hardware board model parsing based on hwMinor upper byte
            const hwUpperByte = (hwMinor >> 8) & 0xFF;
            if (hwUpperByte === 0x31) { boardModel = "JDM-001 (Type V1)"; }
            else if (hwUpperByte === 0x43) { boardModel = "JDM-011 (Type V1)"; }
            else if (hwUpperByte === 0x54) { boardModel = "JDM-030 (Type V2)"; }
            else if (hwUpperByte >= 0x64 && hwUpperByte <= 0x74) { boardModel = "JDM-040 (Type V2)"; }
            else if ((hwUpperByte >= 0x81 && hwUpperByte <= 0x83) || hwUpperByte === 0x93) { boardModel = "JDM-020 (Type V1)"; }
            else if (hwUpperByte === 0xA4 || hwUpperByte === 0x90 || hwUpperByte === 0xA0) { boardModel = "JDM-050 (Type V2)"; }
            else if (hwUpperByte === 0xB0) { boardModel = "JDM-055 (Scuf?) (Type V2)"; }
            else if (hwUpperByte === 0xB4) { boardModel = "JDM-055 (Type V2)"; }
            else { boardModel = `Unknown (Upper: 0x${hwUpperByte.toString(16).toUpperCase()})`; }
            
            document.getElementById("infoBoardModel").innerText = boardModel;
          }

          // Clone detection 2: try report 0x81
          try {
            await receiveFeatureReport(device, 0x81);
          } catch (e) {
            console.warn("Report 0x81 failed, clone likely", e);
            logRawHID(`0x81 read failed (indicator of clone): ${e.message}`);
            isClone = true;
          }

        } else if (isDualSense) {
          document.getElementById("ds4BoardModelContainer").classList.add("d-none");
          document.getElementById("dualsenseFineTuneCard").classList.remove("d-none");

          // Read feature report 0x20
          let infoData = null;
          let failed0x20 = false;
          try {
            infoData = await receiveFeatureReport(device, 0x20);
          } catch (e) {
            console.warn("Failed to read report 0x20", e);
            logRawHID(`0x20 read failed: ${e.message}`);
            failed0x20 = true;
          }

          // Clone detection
          if (failed0x20 || !infoData || infoData.byteLength < 63) {
            isClone = true;
          } else {
            const bytes = new Uint8Array(infoData.buffer, infoData.byteOffset, infoData.byteLength);
            
            // build_date is 11 bytes, build_time is 8 bytes
            const dateBytes = bytes.subarray(0, 11);
            const timeBytes = bytes.subarray(11, 19);
            
            compileDate = new TextDecoder("ascii").decode(dateBytes).replace(/\0/g, '').trim();
            compileTime = new TextDecoder("ascii").decode(timeBytes).replace(/\0/g, '').trim();
            document.getElementById("infoBuildDate").innerText = `${compileDate} ${compileTime}`;

            // Check if build date contains letters (months) to confirm validity
            if (!/[A-Za-z]/.test(compileDate) || compileDate.length < 5) {
              isClone = true;
            }

            const fwVersion = bytes[27] | (bytes[28] << 8) | (bytes[29] << 16) | (bytes[30] << 24);
            const hwInfo = bytes[23] | (bytes[24] << 8) | (bytes[25] << 16) | (bytes[26] << 24);
            
            hwVersionHex = `0x${hwInfo.toString(16).toUpperCase().padStart(8, '0')}`;
            swVersion = `0x${fwVersion.toString(16).toUpperCase().padStart(8, '0')}`;

            // Read Bluetooth MAC Address for DualSense from report 0x81 (after sending 0x80 [9, 2])
            try {
              await sendFeatureReport(device, 0x80, new Uint8Array([9, 2]));
              await new Promise(r => setTimeout(r, 100));
              const macData = await receiveFeatureReport(device, 0x81);
              if (macData.byteLength >= 10) { // 1 byte report ID + 3 bytes header + 6 bytes MAC
                const macBytes = [];
                for (let i = 0; i < 6; i++) {
                  const idx = 4 + (5 - i);
                  macBytes.push(macData.getUint8(idx).toString(16).toUpperCase().padStart(2, '0'));
                }
                btMacAddress = macBytes.join(':');
                document.getElementById("infoMac").innerText = btMacAddress;
              }
            } catch (e) {
              console.warn("Failed to read DualSense MAC address", e);
              logRawHID(`Error reading DualSense MAC address: ${e.message}`);
            }
          }
        }

        // Lock / Unlock status check for DS4
        if (isDualShock && !isClone) {
          await queryNvsStatus();
        } else {
          document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked (Ready)</span>`;
          nvsState = 0;
        }

        // Register Touchpad inputs if connected via WebHID
        device.addEventListener("inputreport", handleInputReport);

      } catch (err) {
        console.error("Failed to parse controller diagnostic", err);
        showNotification("Failed to fetch diagnostics: " + err.message, "danger");
      }

      // Display connection / clone warning banners and badges
      if (connectionType === "Bluetooth") {
        document.getElementById("bluetoothWarningBanner").classList.remove("d-none");
        document.getElementById("cloneWarningBanner").classList.add("d-none");
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> USB Req.</span>`;
        document.getElementById("btnCalibrateCenter").disabled = true;
        document.getElementById("btnCalibrateRange").disabled = true;
        document.getElementById("btnSavePermanently").disabled = true;
      } else if (isClone) {
        document.getElementById("cloneWarningBanner").classList.remove("d-none");
        document.getElementById("bluetoothWarningBanner").classList.add("d-none");
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Clone</span>`;
        document.getElementById("btnCalibrateCenter").disabled = true;
        document.getElementById("btnCalibrateRange").disabled = true;
        document.getElementById("btnSavePermanently").disabled = true;
        document.getElementById("btnCalibrateCenter").setAttribute("title", "Calibration not supported on clone controllers.");
        document.getElementById("btnCalibrateRange").setAttribute("title", "Calibration not supported on clone controllers.");
      } else {
        document.getElementById("cloneWarningBanner").classList.add("d-none");
        document.getElementById("bluetoothWarningBanner").classList.add("d-none");
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-check"></i> Genuine</span>`;
        document.getElementById("btnCalibrateCenter").disabled = false;
        document.getElementById("btnCalibrateRange").disabled = false;
        
        if (nvsState === 0) {
          document.getElementById("btnSavePermanently").disabled = false;
        }
      }

      // Start Gamepad loop
      if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = requestAnimationFrame(pollGamepad);
      
      showNotification("Successfully connected to controller!", "success");
    }

    function locateGamepadIndex(hidDev) {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp) {
          if (gp.id.toLowerCase().includes("54c") || gp.id.toLowerCase().includes("playstation") || gp.id.toLowerCase().includes("sony")) {
            gamepadIndex = i;
            document.getElementById("infoConnectionType").innerText = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
            connectionType = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
            return;
          }
        }
      }
      gamepadIndex = 0;
      document.getElementById("infoConnectionType").innerText = "USB (Auto)";
    }

    // Listen to direct Gamepad API connections (even without WebHID Connect click)
    window.addEventListener("gamepadconnected", (e) => {
      logRawHID(`Gamepad Connected at index ${e.gamepad.index}: ${e.gamepad.id}`);
      if (gamepadIndex === -1) {
        gamepadIndex = e.gamepad.index;
        
        document.getElementById("overviewInfoCard").classList.remove("opacity-50");
        document.getElementById("driftResultsRow").classList.remove("opacity-50");
        
        const type = e.gamepad.id.includes("Bluetooth") ? "Bluetooth" : "USB";
        document.getElementById("infoConnectionType").innerText = type;
        
        if (demoModeActive) {
          demoModeActive = false;
          document.getElementById("demoModeIndicator").classList.add("d-none");
        }
        
        // Guess controller type based on ID (prioritizing specific model matching)
        let guessedName = "PlayStation Controller";
        const idLower = e.gamepad.id.toLowerCase();
        
        if (idLower.includes("dualsense") || idLower.includes("0ce6") || idLower.includes("0df2")) {
          guessedName = "DualSense";
        } else if (idLower.includes("dualshock") || idLower.includes("05c4") || idLower.includes("09cc")) {
          guessedName = "DualShock 4";
        } else if (idLower.includes("wireless controller")) {
          if (idLower.includes("0ce6") || idLower.includes("0df2")) {
            guessedName = "DualSense";
          } else if (idLower.includes("05c4") || idLower.includes("09cc")) {
            guessedName = "DualShock 4";
          } else {
            // Default fallback for generic PlayStation wireless controller name
            guessedName = "DualSense / DS4";
          }
        }
        
        document.getElementById("overviewDevName").innerText = guessedName;
        document.getElementById("footerModelName").innerText = guessedName;
        document.getElementById("overviewDevStatus").innerText = "Connected via standard Gamepad API. Press Connect Controller for calibration features.";
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-check"></i> Connected</span>`;
      }
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      logRawHID(`Gamepad Disconnected from index ${e.gamepad.index}`);
      if (gamepadIndex === e.gamepad.index) {
        handleDisconnect();
      }
    });

    function handleDisconnect() {
      if (hidDevice) {
        try {
          hidDevice.removeEventListener("inputreport", handleInputReport);
          hidDevice.close();
        } catch (e) {}
      }

      hidDevice = null;
      isConnected = false;
      isClone = false;
      isEdge = false;
      gamepadIndex = -1;
      demoModeActive = false;
      const demoIndicator = document.getElementById("demoModeIndicator");
      if (demoIndicator) demoIndicator.classList.add("d-none");
      
      document.getElementById("btnDisconnect").classList.add("d-none");
      document.getElementById("btnConnect").classList.remove("d-none");
      document.getElementById("cloneWarningBanner").classList.add("d-none");
      document.getElementById("edgeWarningBanner").classList.add("d-none");
      document.getElementById("bluetoothWarningBanner").classList.add("d-none");
      
      document.getElementById("overviewDevName").innerText = "No Controller Connected";
      document.getElementById("footerModelName").innerText = "-";
      document.getElementById("overviewDevStatus").innerText = "Please connect a PlayStation controller and click Connect.";
      
      // Reset details card
      document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-muted">Not Connected</span>`;
      document.getElementById("infoConnectionType").innerText = "-";
      document.getElementById("infoBattery").innerHTML = `<i class="fa-solid fa-battery-empty text-muted"></i> -`;
      document.getElementById("infoMac").innerText = "-";
      document.getElementById("infoBoardModel").innerText = "-";
      document.getElementById("infoBuildDate").innerText = "-";
      document.getElementById("ds4BoardModelContainer").classList.add("d-none");
      document.getElementById("dualsenseFineTuneCard").classList.add("d-none");
      
      document.getElementById("overviewInfoCard").classList.add("opacity-50");
      document.getElementById("calibrationOptionsCard").classList.add("opacity-50");
      document.getElementById("driftResultsRow").classList.add("opacity-50");
      
      document.getElementById("btnCalibrateCenter").disabled = true;
      document.getElementById("btnCalibrateRange").disabled = true;
      document.getElementById("btnSavePermanently").disabled = true;
      document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-muted">Not Checked</span>`;

      // Vibration status reset
      document.getElementById("vibrationSupportBadge").innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-circle-xmark"></i> Unsupported</span>`;

      // Reset coordinates
      drawCoordinateGrid("canvasLeftStick", 0, 0);
      drawCoordinateGrid("canvasRightStick", 0, 0);
      
      document.getElementById("footerStatusDot").className = "status-dot disconnected";
      document.getElementById("footerStatusText").innerText = "Disconnected";
      document.getElementById("footerPollingRate").innerText = "0 Hz";
      
      // Show connection required screen on disconnect
      document.getElementById("connectionRequiredScreen").classList.remove("d-none");
      document.getElementById("appDashboardContent").classList.add("d-none");
      logRawHID("Disconnected controller.");
    }

    // NVS Protection state query
    async function queryNvsStatus() {
      if (!hidDevice || isClone) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          await sendFeatureReport(hidDevice, 0x08, new Uint8Array([0xff, 0, 12]));
          await new Promise(r => setTimeout(r, 100));
          const res = await receiveFeatureReport(hidDevice, 0x11);
          if (res.byteLength >= 2) {
            const status = res.getUint8(1);
            if (status === 0) {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked (Ready)</span>`;
              nvsState = 0;
              document.getElementById("btnSavePermanently").disabled = false;
            } else if (status === 1) {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-lock"></i> Locked (Read-only)</span>`;
              nvsState = 1;
              document.getElementById("btnSavePermanently").disabled = true;
            } else {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-circle-xmark"></i> NVS Error</span>`;
              nvsState = 2;
            }
          }
        } else {
          // DualSense
          await sendFeatureReport(hidDevice, 0x80, new Uint8Array([3, 3]));
          await new Promise(r => setTimeout(r, 100));
          const res = await receiveFeatureReport(hidDevice, 0x81);
          if (res.byteLength >= 5) {
            const ret = res.getUint32(1, false);
            if (ret === 0x03030200) {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked (Ready)</span>`;
              nvsState = 0;
              document.getElementById("btnSavePermanently").disabled = false;
            } else if (ret === 0x03030201) {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-lock"></i> Locked (Read-only)</span>`;
              nvsState = 1;
              document.getElementById("btnSavePermanently").disabled = true;
            } else if (ret === 0x15010100) {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-rotate"></i> Pending Reboot</span>`;
              nvsState = 4;
              document.getElementById("btnSavePermanently").disabled = true;
            } else {
              document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-circle-xmark"></i> NVS Error (0x${ret.toString(16).toUpperCase()})</span>`;
              nvsState = 2;
            }
          }
        }
      } catch (err) {
        console.error("Failed to query NVS status", err);
        logRawHID(`NVS query failed: ${err.message}`);
      }
    }

    // Toggle NVS Lock/Unlock commands
    async function nvsUnlock() {
      if (!hidDevice || isClone) return false;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          logRawHID("Attempting DS4 NVS unlock...");
          await sendFeatureReport(hidDevice, 0xA0, new Uint8Array([10, 2, 0x3E, 0x71, 0x7F, 0x89]));
        } else {
          logRawHID("Attempting DualSense NVS unlock...");
          await sendFeatureReport(hidDevice, 0x80, new Uint8Array([3, 2, 101, 50, 64, 12]));
          await new Promise(r => setTimeout(r, 100));
          await receiveFeatureReport(hidDevice, 0x81);
        }
        await new Promise(r => setTimeout(r, 100));
        // Query status asynchronously to update the UI badge, but don't block calibration write on it
        queryNvsStatus().catch(err => console.warn("Failed to query NVS status after unlock", err));
        return true;
      } catch (err) {
        console.error("NVS Unlock failed", err);
        logRawHID(`NVS Unlock failed: ${err.message}`);
        return false;
      }
    }

    async function nvsLock() {
      if (!hidDevice || isClone) return false;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          logRawHID("Attempting DS4 NVS lock...");
          await sendFeatureReport(hidDevice, 0xA0, new Uint8Array([10, 1, 0]));
        } else {
          logRawHID("Attempting DualSense NVS lock...");
          await sendFeatureReport(hidDevice, 0x80, new Uint8Array([3, 1]));
          await new Promise(r => setTimeout(r, 100));
          await receiveFeatureReport(hidDevice, 0x81);
        }
        await new Promise(r => setTimeout(r, 100));
        // Query status asynchronously to update the UI badge
        queryNvsStatus().catch(err => console.warn("Failed to query NVS status after lock", err));
        return true;
      } catch (err) {
        console.error("NVS Lock failed", err);
        logRawHID(`NVS Lock failed: ${err.message}`);
        return false;
      }
    }

    // DualSense Edge stick module lock/unlock and read/write commands
    async function waitUntilWritten(expected) {
      let attempts = 0;
      const maxAttempts = 10;
      while (attempts < maxAttempts) {
        const res = await receiveFeatureReport(hidDevice, 0x81);
        if (res.byteLength >= 4) {
          const b1 = res.getUint8(1);
          const b2 = res.getUint8(2);
          const b3 = res.getUint8(3);
          if (b1 === expected[0] && b2 === expected[1] && b3 === expected[2]) {
            return true;
          }
        }
        attempts++;
        await new Promise(r => setTimeout(r, 50));
      }
      return false;
    }

    async function unlockModule(i) {
      const m_name = i === 0 ? "left module" : "right module";
      await sendFeatureReport(hidDevice, 0x80, new Uint8Array([21, 6, i, 11]));
      await new Promise(r => setTimeout(r, 200));
      const ret = await waitUntilWritten([21, 6, 2]);
      if (!ret) {
        throw new Error(`Cannot unlock ${m_name}`);
      }
    }

    async function lockModule(i) {
      const m_name = i === 0 ? "left module" : "right module";
      await sendFeatureReport(hidDevice, 0x80, new Uint8Array([21, 4, i, 8]));
      await new Promise(r => setTimeout(r, 200));
      const ret = await waitUntilWritten([21, 4, 2]);
      if (!ret) {
        throw new Error(`Cannot lock ${m_name}`);
      }
    }

    async function getInMemoryModuleData() {
      const param = isEdge ? 4 : 2;
      await sendFeatureReport(hidDevice, 0x80, new Uint8Array([12, param]));
      await new Promise(r => setTimeout(r, 100));
      const data = await receiveFeatureReport(hidDevice, 0x81);
      if (data.byteLength < 28) {
        return null;
      }
      const cmd = data.getUint8(0);
      const p1 = data.getUint8(1);
      const p2 = data.getUint8(2);
      const p3 = data.getUint8(3);

      if (cmd !== 129 || p1 !== 12 || (p2 !== 2 && p2 !== 4) || p3 !== 2) {
        return null;
      }

      const arr = [];
      for (let i = 0; i < 12; i++) {
        arr.push(data.getUint16(4 + i * 2, true));
      }
      return arr;
    }

    async function writeFinetuneData(data) {
      const payload = new Uint8Array(26);
      payload[0] = 12;
      payload[1] = 1;
      for (let i = 0; i < 12; i++) {
        const val = data[i];
        payload[2 + i * 2] = val & 0xff;
        payload[2 + i * 2 + 1] = (val >> 8) & 0xff;
      }
      await sendFeatureReport(hidDevice, 0x80, payload);
    }

    async function saveCalibrationPermanently() {
      if (isEdge) {
        logRawHID("DualSense Edge NVS and module flash sequence started...");
        await unlockModule(0);
        await unlockModule(1);
        const unlockSuccess = await nvsUnlock();
        if (!unlockSuccess) throw new Error("Failed to unlock NVS.");
        
        const data = await getInMemoryModuleData();
        if (!data) throw new Error("Failed to retrieve in-memory module calibration data.");
        
        await writeFinetuneData(data);
        await new Promise(r => setTimeout(r, 100));

        await lockModule(0);
        await lockModule(1);
        const lockSuccess = await nvsLock();
        if (!lockSuccess) throw new Error("NVS locking verification failed.");
      } else {
        logRawHID("Standard controller NVS flash sequence started...");
        const unlockSuccess = await nvsUnlock();
        if (!unlockSuccess) throw new Error("Failed to unlock NVS.");
        
        await new Promise(r => setTimeout(r, 500));
        const lockSuccess = await nvsLock();
        if (!lockSuccess) throw new Error("NVS locking verification failed.");
      }
    }

    document.getElementById("btnSavePermanently").addEventListener("click", async () => {
      if (!hidDevice || isClone) return;
      try {
        document.getElementById("btnSavePermanently").disabled = true;
        showNotification("Writing changes to controller NVS storage...", "warning");
        
        await saveCalibrationPermanently();
        showNotification("✓ Saved permanently to controller memory!", "success");
      } catch (err) {
        showNotification("NVS Write Error: " + err.message, "danger");
      } finally {
        await queryNvsStatus();
      }
    });

    // Touchpad and Controller Input report parsing
    function handleInputReport(event) {
      const { reportId, data } = event;

      // Bluetooth detection: USB report length is strictly 63 bytes. Bluetooth sends longer packets.
      if (data.byteLength !== 63 && connectionType !== "Bluetooth") {
        connectionType = "Bluetooth";
        document.getElementById("infoConnectionType").innerText = "Bluetooth";
        document.getElementById("bluetoothWarningBanner").classList.remove("d-none");
        document.getElementById("cloneWarningBanner").classList.add("d-none");
        isClone = false;
        
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> USB Req.</span>`;
        document.getElementById("btnCalibrateCenter").disabled = true;
        document.getElementById("btnCalibrateRange").disabled = true;
        document.getElementById("btnSavePermanently").disabled = true;
        
        logRawHID("Bluetooth connection detected via input report length. Calibration disabled.");
      }

      if (!hidDevice) return;

      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      
      // 1. Process and update live button & axis values directly from WebHID if connected
      if (data.byteLength === 63) {
        let lx_byte = 0, ly_byte = 1, rx_byte = 2, ry_byte = 3;
        let l2_byte = 7, r2_byte = 8;
        let hat_byte = 4, btn_byte1 = 5, btn_byte2 = 6;
        
        if (!isDS4) {
          // DualSense USB Offsets
          l2_byte = 4;
          r2_byte = 5;
          hat_byte = 7;
          btn_byte1 = 8;
          btn_byte2 = 9;
        }
        
        // Parse axes: convert 0..255 to -1.0..1.0
        const lx = (data.getUint8(lx_byte) - 127.5) / 127.5;
        const ly = (data.getUint8(ly_byte) - 127.5) / 127.5;
        const rx = (data.getUint8(rx_byte) - 127.5) / 127.5;
        const ry = (data.getUint8(ry_byte) - 127.5) / 127.5;
        
        lastWebHidAxes = [lx, ly, rx, ry];
        
        // Parse triggers: convert 0..255 to 0.0..1.0
        const l2Val = data.getUint8(l2_byte) / 255.0;
        const r2Val = data.getUint8(r2_byte) / 255.0;
        
        // Parse D-Pad hat
        const hat = data.getUint8(hat_byte) & 0x0F;
        const dpadUp = (hat === 0 || hat === 1 || hat === 7);
        const dpadDown = (hat === 3 || hat === 4 || hat === 5);
        const dpadLeft = (hat === 5 || hat === 6 || hat === 7);
        const dpadRight = (hat === 1 || hat === 2 || hat === 3);
        
        // Parse Action Buttons
        const square = (data.getUint8(hat_byte) & 0x10) !== 0;
        const cross = (data.getUint8(hat_byte) & 0x20) !== 0;
        const circle = (data.getUint8(hat_byte) & 0x40) !== 0;
        const triangle = (data.getUint8(hat_byte) & 0x80) !== 0;
        
        // Parse bumper, triggers buttons, share, options, stick clicks
        const l1 = (data.getUint8(btn_byte1) & 0x01) !== 0;
        const r1 = (data.getUint8(btn_byte1) & 0x02) !== 0;
        const l2Btn = (data.getUint8(btn_byte1) & 0x04) !== 0;
        const r2Btn = (data.getUint8(btn_byte1) & 0x08) !== 0;
        const share = (data.getUint8(btn_byte1) & 0x10) !== 0;
        const options = (data.getUint8(btn_byte1) & 0x20) !== 0;
        const l3 = (data.getUint8(btn_byte1) & 0x40) !== 0;
        const r3 = (data.getUint8(btn_byte1) & 0x80) !== 0;
        
        // Parse PS, Touchpad click
        const ps = (data.getUint8(btn_byte2) & 0x01) !== 0;
        const touchpadClick = (data.getUint8(btn_byte2) & 0x02) !== 0;

        isTouchpadClicked = touchpadClick;

        const gp = {
          axes: [lx, ly, rx, ry],
          buttons: [
            { pressed: cross, value: cross ? 1.0 : 0.0 }, // 0
            { pressed: circle, value: circle ? 1.0 : 0.0 }, // 1
            { pressed: square, value: square ? 1.0 : 0.0 }, // 2
            { pressed: triangle, value: triangle ? 1.0 : 0.0 }, // 3
            { pressed: l1, value: l1 ? 1.0 : 0.0 }, // 4
            { pressed: r1, value: r1 ? 1.0 : 0.0 }, // 5
            { pressed: l2Val > 0.1 || l2Btn, value: l2Val }, // 6
            { pressed: r2Val > 0.1 || r2Btn, value: r2Val }, // 7
            { pressed: share, value: share ? 1.0 : 0.0 }, // 8
            { pressed: options, value: options ? 1.0 : 0.0 }, // 9
            { pressed: l3, value: l3 ? 1.0 : 0.0 }, // 10
            { pressed: r3, value: r3 ? 1.0 : 0.0 }, // 11
            { pressed: dpadUp, value: dpadUp ? 1.0 : 0.0 }, // 12
            { pressed: dpadDown, value: dpadDown ? 1.0 : 0.0 }, // 13
            { pressed: dpadLeft, value: dpadLeft ? 1.0 : 0.0 }, // 14
            { pressed: dpadRight, value: dpadRight ? 1.0 : 0.0 }, // 15
            { pressed: ps, value: ps ? 1.0 : 0.0 }, // 16
            { pressed: touchpadClick, value: touchpadClick ? 1.0 : 0.0 } // 17
          ]
        };

        updateInputDisplay(gp);

        if (document.getElementById("finetuneModal")?.classList.contains("show")) {
          if (typeof handleFinetuneDpadAndSticks === "function") {
            handleFinetuneDpadAndSticks(gp);
          }
        }

        // Parse motion sensors for DS4 and DualSense
        if (isDS4 && data.byteLength >= 24) {
          try {
            sensorState.gyroX = data.getInt16(12, true) / 1000.0;
            sensorState.gyroY = data.getInt16(14, true) / 1000.0;
            sensorState.gyroZ = data.getInt16(16, true) / 1000.0;
            sensorState.accelX = data.getInt16(18, true) / 8192.0;
            sensorState.accelY = data.getInt16(20, true) / 8192.0;
            sensorState.accelZ = data.getInt16(22, true) / 8192.0;
          } catch(e) {}
        } else if (!isDS4 && data.byteLength >= 28) {
          try {
            sensorState.accelX = data.getInt16(16, true) / 8192.0;
            sensorState.accelY = data.getInt16(18, true) / 8192.0;
            sensorState.accelZ = data.getInt16(20, true) / 8192.0;
            sensorState.gyroX = data.getInt16(22, true) / 1000.0;
            sensorState.gyroY = data.getInt16(24, true) / 1000.0;
            sensorState.gyroZ = data.getInt16(26, true) / 1000.0;
          } catch(e) {}
        }
      }

      // 2. Parse touchpad coordinate points
      // Note: WebHID event.data does NOT include the 1-byte report ID, 
      // so offsets must be -1 compared to standard HID specifications.
      let offset = isDS4 ? 34 : 32; // DS4 USB: 34, DualSense USB: 32
      if (reportId === 0x11) {
        offset = 36; // DS4 Bluetooth
      } else if (reportId === 0x31) {
        offset = 33; // DualSense Bluetooth
      }
      
      if (data.byteLength < offset + 9) return;

      const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

      const clickInd = document.getElementById("touchpadClickIndicator");
      if (isTouchpadClicked) {
        clickInd.classList.remove("d-none");
        document.getElementById("touchpadWrapper").classList.add("clicked");
        document.querySelectorAll(".svg-btn-touchpad").forEach(el => el.classList.add("pressed"));
      } else {
        clickInd.classList.add("d-none");
        document.getElementById("touchpadWrapper").classList.remove("clicked");
        document.querySelectorAll(".svg-btn-touchpad").forEach(el => el.classList.remove("pressed"));
      }

      const f1_active = (bytes[offset + 1] & 0x80) === 0;
      const f1_x = bytes[offset + 2] | ((bytes[offset + 3] & 0x0F) << 8);
      const f1_y = ((bytes[offset + 3] & 0xF0) >> 4) | (bytes[offset + 4] << 4);

      const f2_active = (bytes[offset + 5] & 0x80) === 0;
      const f2_x = bytes[offset + 6] | ((bytes[offset + 7] & 0x0F) << 8);
      const f2_y = ((bytes[offset + 7] & 0xF0) >> 4) | (bytes[offset + 8] << 4);

      updateTouchpadPoints(f1_active, f1_x, f1_y, f2_active, f2_x, f2_y);
    }

    function updateTouchpadPoints(f1_act, f1_x, f1_y, f2_act, f2_x, f2_y) {
      touchpadPoints[0].active = f1_act;
      if (f1_act) {
        touchpadPoints[0].x = f1_x;
        touchpadPoints[0].y = f1_y;
        touchpadPoints[0].trail.push({ x: f1_x, y: f1_y });
        if (touchpadPoints[0].trail.length > 50) touchpadPoints[0].trail.shift();
        document.getElementById("touchpadPos1").innerText = `Finger 1: X=${f1_x}, Y=${f1_y}`;
      } else {
        document.getElementById("touchpadPos1").innerText = `Finger 1: -`;
      }

      touchpadPoints[1].active = f2_act;
      if (f2_act) {
        touchpadPoints[1].x = f2_x;
        touchpadPoints[1].y = f2_y;
        touchpadPoints[1].trail.push({ x: f2_x, y: f2_y });
        if (touchpadPoints[1].trail.length > 50) touchpadPoints[1].trail.shift();
        document.getElementById("touchpadPos2").innerText = `Finger 2: X=${f2_x}, Y=${f2_y}`;
      } else {
        document.getElementById("touchpadPos2").innerText = `Finger 2: -`;
      }

      drawTouchpadCanvas();
    }

    const tpadCanvas = document.getElementById("canvasTouchpad");
    const tpadCtx = tpadCanvas.getContext("2d");

    function drawTouchpadCanvas() {
      tpadCtx.fillStyle = "#f1f5f9";
      tpadCtx.fillRect(0, 0, tpadCanvas.width, tpadCanvas.height);

      tpadCtx.strokeStyle = "#cbd5e1";
      tpadCtx.lineWidth = 2;
      tpadCtx.beginPath();
      for (let i = 1; i < 4; i++) {
        tpadCtx.moveTo((tpadCanvas.width / 4) * i, 0);
        tpadCtx.lineTo((tpadCanvas.width / 4) * i, tpadCanvas.height);
      }
      for (let i = 1; i < 3; i++) {
        tpadCtx.moveTo(0, (tpadCanvas.height / 3) * i);
        tpadCtx.lineTo(tpadCanvas.width, (tpadCanvas.height / 3) * i);
      }
      tpadCtx.stroke();

      const colors = ["#0070d1", "#00b341"];
      for (let f = 0; f < 2; f++) {
        const pt = touchpadPoints[f];
        if (pt.trail.length > 0) {
          tpadCtx.strokeStyle = colors[f];
          tpadCtx.lineWidth = 6;
          tpadCtx.lineCap = "round";
          tpadCtx.lineJoin = "round";
          tpadCtx.beginPath();
          tpadCtx.moveTo(pt.trail[0].x, pt.trail[0].y);
          for (let i = 1; i < pt.trail.length; i++) {
            tpadCtx.lineTo(pt.trail[i].x, pt.trail[i].y);
          }
          tpadCtx.stroke();

          if (pt.active) {
            tpadCtx.fillStyle = colors[f];
            tpadCtx.beginPath();
            tpadCtx.arc(pt.x, pt.y, 18, 0, Math.PI * 2);
            tpadCtx.fill();
            
            tpadCtx.strokeStyle = "#fff";
            tpadCtx.lineWidth = 4;
            tpadCtx.beginPath();
            tpadCtx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
            tpadCtx.stroke();
          }
        }
      }
    }

    document.getElementById("btnClearTouchpad").addEventListener("click", () => {
      touchpadPoints[0].trail = [];
      touchpadPoints[1].trail = [];
      drawTouchpadCanvas();
    });

    drawTouchpadCanvas();

    // Gamepad API Input Loop
    function pollGamepad() {
      inputPollingCount++;
      const now = performance.now();
      if (now - lastHzTime >= 1000) {
        pollingRateHz = inputPollingCount;
        inputPollingCount = 0;
        lastHzTime = now;
        
        document.getElementById("footerPollingRate").innerText = `${pollingRateHz} Hz`;
        document.getElementById("footerStatusDot").className = `status-dot ${isConnected || gamepadIndex >= 0 ? 'connected' : 'disconnected'}`;
        document.getElementById("footerStatusText").innerText = isConnected || gamepadIndex >= 0 ? "Connected" : "Disconnected";
      }

      const gamepads = navigator.getGamepads();
      let gp = null;
      if (gamepadIndex >= 0) {
        gp = gamepads[gamepadIndex];
        if (!gp) gamepadIndex = -1; // Reset if gamepad unplugged
      }
      
      if (gamepadIndex < 0) {
        // Auto-select first active gamepad
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            gp = gamepads[i];
            gamepadIndex = i;
            break;
          }
        }
      }

      // Check if a device (WebHID or Gamepad API) is actively connected
      const isDeviceConnected = isConnected || (gp !== null) || demoModeActive;
      const reqScreen = document.getElementById("connectionRequiredScreen");
      const dashContent = document.getElementById("appDashboardContent");
      
      if (isDeviceConnected) {
        if (reqScreen && !reqScreen.classList.contains("d-none")) {
          reqScreen.classList.add("d-none");
          dashContent.classList.remove("d-none");
        }
      } else {
        if (reqScreen && reqScreen.classList.contains("d-none")) {
          reqScreen.classList.remove("d-none");
          dashContent.classList.add("d-none");
        }
      }

      if (gp) {
        if (!isConnected) {
          updateInputDisplay(gp);
        }
        
        const actuator = gp.vibrationActuator || (gp.hapticActuators && gp.hapticActuators[0]);
        if (isConnected && connectionType === "USB") {
          document.getElementById("vibrationSupportBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-check"></i> Supported (WebHID)</span>`;
        } else if (actuator) {
          document.getElementById("vibrationSupportBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-check"></i> Supported (Gamepad API)</span>`;
        } else {
          document.getElementById("vibrationSupportBadge").innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-circle-xmark"></i> Unsupported</span>`;
        }
      } else if (demoModeActive) {
        simulateDemoInputs();
        document.getElementById("vibrationSupportBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-check"></i> Supported (Simulated)</span>`;
      }

      requestAnimationFrameId = requestAnimationFrame(pollGamepad);
    }

    // Build the buttons grid dynamically
    const testerGrid = document.getElementById("testerButtonsGrid");
    buttonNames.forEach((name, idx) => {
      const col = document.createElement("div");
      col.className = "button-key";
      col.id = `btn-key-${idx}`;
      col.innerHTML = `
        <span class="button-name">${name}</span>
        <span class="button-count" id="btn-count-${idx}">0</span>
      `;
      testerGrid.appendChild(col);
    });

    function updateInputDisplay(gp) {
      // Check button presses
      for (let i = 0; i < 18; i++) {
        let isPressed = false;
        if (i < gp.buttons.length) {
          isPressed = gp.buttons[i].pressed;
        }

        const btnKeyEl = document.getElementById(`btn-key-${i}`);
        const countEl = document.getElementById(`btn-count-${i}`);
        
        if (isPressed) {
          btnKeyEl.classList.add("pressed");
          updateSvgButton(i, true);
          
          if (!lastButtonStates[i]) {
            buttonPressCounts[i]++;
            countEl.innerText = buttonPressCounts[i];
            logInputHistory(`${buttonNames[i]} Button Pressed`);
          }
        } else {
          btnKeyEl.classList.remove("pressed");
          updateSvgButton(i, false);
        }

        // Dynamic analog labels update for L2/R2 keys in the grid
        if (i === 6) {
          const l2ValTemp = (gp.buttons && gp.buttons.length > 6 && gp.buttons[6]) ? (typeof gp.buttons[6].value === 'number' ? gp.buttons[6].value : (gp.buttons[6].pressed ? 1.0 : 0.0)) : 0.0;
          btnKeyEl.querySelector('.button-name').innerText = `L2 (${Math.round(l2ValTemp * 100)}%)`;
        }
        if (i === 7) {
          const r2ValTemp = (gp.buttons && gp.buttons.length > 7 && gp.buttons[7]) ? (typeof gp.buttons[7].value === 'number' ? gp.buttons[7].value : (gp.buttons[7].pressed ? 1.0 : 0.0)) : 0.0;
          btnKeyEl.querySelector('.button-name').innerText = `R2 (${Math.round(r2ValTemp * 100)}%)`;
        }

        lastButtonStates[i] = isPressed;
      }

      // Triggers (L2 / R2) analog value extraction
      const l2Val = (gp.buttons && gp.buttons.length > 6 && gp.buttons[6]) ? (typeof gp.buttons[6].value === 'number' ? gp.buttons[6].value : (gp.buttons[6].pressed ? 1.0 : 0.0)) : 0.0;
      const r2Val = (gp.buttons && gp.buttons.length > 7 && gp.buttons[7]) ? (typeof gp.buttons[7].value === 'number' ? gp.buttons[7].value : (gp.buttons[7].pressed ? 1.0 : 0.0)) : 0.0;

      const l2Percent = Math.round(l2Val * 100);
      const r2Percent = Math.round(r2Val * 100);
      document.getElementById("progressL2").style.width = `${l2Percent}%`;
      document.getElementById("txtL2").innerText = `${l2Percent}% (${Math.round(l2Val * 255)})`;
      document.getElementById("progressR2").style.width = `${r2Percent}%`;
      document.getElementById("txtR2").innerText = `${r2Percent}% (${Math.round(r2Val * 255)})`;

      // Apply buttery-smooth visual damping (lerp) to triggers
      visualL2 += (l2Val - visualL2) * 0.22;
      visualR2 += (r2Val - visualR2) * 0.22;

      // Update SVG Trigger fill via opacity
      document.querySelectorAll("#L2_infill").forEach(el => {
        el.style.opacity = visualL2 > 0.02 ? visualL2 : 0;
        el.classList.toggle("pressed", visualL2 > 0.02);
      });
      document.querySelectorAll("#R2_infill").forEach(el => {
        el.style.opacity = visualR2 > 0.02 ? visualR2 : 0;
        el.classList.toggle("pressed", visualR2 > 0.02);
      });

      // Update SVG text labels dynamically
      document.querySelectorAll("#L2_percentage").forEach(el => {
        el.textContent = l2Val > 0.05 ? `${l2Percent} %` : "0 %";
        el.setAttribute("opacity", l2Val > 0.05 ? "1" : "0");
      });
      document.querySelectorAll("#R2_percentage").forEach(el => {
        el.textContent = r2Val > 0.05 ? `${r2Percent} %` : "0 %";
        el.setAttribute("opacity", r2Val > 0.05 ? "1" : "0");
      });

      // Analog Sticks
      const lx = gp.axes.length > 0 ? gp.axes[0] : 0.0;
      const ly = gp.axes.length > 1 ? gp.axes[1] : 0.0;
      const rx = gp.axes.length > 2 ? gp.axes[2] : 0.0;
      const ry = gp.axes.length > 3 ? gp.axes[3] : 0.0;

      document.getElementById("txtLeftStickVal").innerText = `X: ${lx.toFixed(2)} | Y: ${ly.toFixed(2)}`;
      document.getElementById("txtRightStickVal").innerText = `X: ${rx.toFixed(2)} | Y: ${ry.toFixed(2)}`;

      // Draw original coordinate canvases
      drawCoordinateGrid("canvasLeftStick", lx, ly);
      drawCoordinateGrid("canvasRightStick", rx, ry);

      // Draw the new dualshock-tools style stickCanvas
      const stickCanvas = document.getElementById("stickCanvas");
      if (stickCanvas) {
        const ctx = stickCanvas.getContext("2d");
        const sz = 60;
        const yb = 15 + sz;
        const hb = 20 + sz;
        const w = stickCanvas.width;
        ctx.clearRect(0, 0, w, stickCanvas.height);
        
        draw_stick_dial(ctx, hb, yb, sz, lx, ly, { enable_zoom_center: false });
        draw_stick_dial(ctx, w - hb, yb, sz, rx, ry, { enable_zoom_center: false });

        const lblLx = document.getElementById("lx-lbl");
        const lblLy = document.getElementById("ly-lbl");
        const lblRx = document.getElementById("rx-lbl");
        const lblRy = document.getElementById("ry-lbl");

        if (lblLx) lblLx.innerText = lx.toFixed(3);
        if (lblLy) lblLy.innerText = ly.toFixed(3);
        if (lblRx) lblRx.innerText = rx.toFixed(3);
        if (lblRy) lblRy.innerText = ry.toFixed(3);
      }

      // Draw the finetune modal canvases
      const ftCanvasL = document.getElementById("finetuneStickCanvasL");
      if (ftCanvasL && ftCanvasL.offsetParent !== null) {
        const ctxL = ftCanvasL.getContext("2d");
        ctxL.clearRect(0, 0, ftCanvasL.width, ftCanvasL.height);
        draw_stick_dial(ctxL, ftCanvasL.width/2, ftCanvasL.height/2, ftCanvasL.width/2 - 10, lx, ly);
        document.getElementById("finetuneStickCanvasLx-lbl").innerText = (lx > 0 ? "+" : "") + lx.toFixed(3);
        document.getElementById("finetuneStickCanvasLy-lbl").innerText = (ly > 0 ? "+" : "") + ly.toFixed(3);
      }

      const ftCanvasR = document.getElementById("finetuneStickCanvasR");
      if (ftCanvasR && ftCanvasR.offsetParent !== null) {
        const ctxR = ftCanvasR.getContext("2d");
        ctxR.clearRect(0, 0, ftCanvasR.width, ftCanvasR.height);
        draw_stick_dial(ctxR, ftCanvasR.width/2, ftCanvasR.height/2, ftCanvasR.width/2 - 10, rx, ry);
        document.getElementById("finetuneStickCanvasRx-lbl").innerText = (rx > 0 ? "+" : "") + rx.toFixed(3);
        document.getElementById("finetuneStickCanvasRy-lbl").innerText = (ry > 0 ? "+" : "") + ry.toFixed(3);
      }

      // Apply visual damping (lerp) to analog sticks for buttery-smooth visual movements
      visualLx += (lx - visualLx) * 0.24;
      visualLy += (ly - visualLy) * 0.24;
      visualRx += (rx - visualRx) * 0.24;
      visualRy += (ry - visualRy) * 0.24;

      // Move SVG stick caps with scale effect on L3/R3 click
      const l3Pressed = gp.buttons.length > 10 ? gp.buttons[10].pressed : false;
      const r3Pressed = gp.buttons.length > 11 ? gp.buttons[11].pressed : false;
      const lScale = l3Pressed ? 0.65 : 0.70;
      const rScale = r3Pressed ? 0.65 : 0.70;

      document.querySelectorAll("g#L3").forEach(el => el.setAttribute("transform", `translate(${visualLx * 25}, ${visualLy * 25}) scale(${lScale})`));
      document.querySelectorAll("g#R3").forEach(el => el.setAttribute("transform", `translate(${visualRx * 25}, ${visualRy * 25}) scale(${rScale})`));

      // 3D Tilt rotation based on stick pushes & physical sensors
      let rotX = 0;
      let rotY = 0;
      if (isConnected && sensorState && (Math.abs(sensorState.accelX) > 0.01 || Math.abs(sensorState.accelY) > 0.01)) {
        // WebHID connected: tilt based on physical Accelerometer data
        const rawX = -sensorState.accelY * 18;
        const rawY = sensorState.accelX * 18;
        rotX = Math.max(-15, Math.min(15, rawX));
        rotY = Math.max(-15, Math.min(15, rawY));
      } else {
        // Gamepad API / Demo mode: tilt based on joysticks input
        rotX = -ly * 8 - ry * 8;
        rotY = lx * 8 + rx * 8;
      }

      // Smooth 3D tilt
      visualRotX += (rotX - visualRotX) * 0.15;
      visualRotY += (rotY - visualRotY) * 0.15;

      document.querySelectorAll(".controller-svg").forEach(el => {
        // el.style.transform = `perspective(800px) rotateX(${visualRotX.toFixed(2)}deg) rotateY(${visualRotY.toFixed(2)}deg)`;
      });

      if (isConnected) {
        document.getElementById("infoBattery").innerHTML = `<i class="fa-solid fa-battery-three-quarters text-success"></i> 85%`;
      }

      // Calculate live stick center deviations
      const lxDeviation = Math.sqrt(lx * lx + ly * ly);
      const rxDeviation = Math.sqrt(rx * rx + ry * ry);

      // Track range rotation progress in wizard
      if (typeof trackRangeRotation === "function") {
        trackRangeRotation(lx, ly, rx, ry);
      }

      // Update drift vector on controller SVGs in real-time
      if (typeof updateDriftVector === "function") {
        updateDriftVector(lx, ly, rx, ry, lxDeviation, rxDeviation);
      }

      const calibL = document.getElementById("calibDriftLeft");
      const calibR = document.getElementById("calibDriftRight");
      if (calibL && calibR) {
        calibL.innerText = `X: ${lx.toFixed(2)} | Y: ${ly.toFixed(2)} (Dev: ${lxDeviation.toFixed(3)})`;
        calibR.innerText = `X: ${rx.toFixed(2)} | Y: ${ry.toFixed(2)} (Dev: ${rxDeviation.toFixed(3)})`;
      }

      const assignCalibBadge = (val, badgeId) => {
        const el = document.getElementById(badgeId);
        if (el) {
          if (val <= 0.05) {
            el.innerHTML = `<span class="badge-custom badge-success" style="font-size:0.7rem; padding:2px 8px;">✓ OK</span>`;
          } else if (val <= 0.15) {
            el.innerHTML = `<span class="badge-custom badge-warning" style="font-size:0.7rem; padding:2px 8px;">⚠️ Drift</span>`;
          } else {
            el.innerHTML = `<span class="badge-custom badge-danger" style="font-size:0.7rem; padding:2px 8px;">❌ Severe</span>`;
          }
        }
      };

      assignCalibBadge(lxDeviation, "calibBadgeLeft");
      assignCalibBadge(rxDeviation, "calibBadgeRight");

      // Update stick drift base glow in real time (stored drift check results OR current idle deviation)
      const leftStatus = leftStickDriftStatus !== "ok" ? leftStickDriftStatus : (lxDeviation > 0.05 ? (lxDeviation > 0.15 ? "severe" : "warning") : "ok");
      const rightStatus = rightStickDriftStatus !== "ok" ? rightStickDriftStatus : (rxDeviation > 0.05 ? (rxDeviation > 0.15 ? "severe" : "warning") : "ok");

      document.querySelectorAll(".svg-stick-left-base").forEach(el => {
        el.classList.remove("drift-warning", "drift-severe");
        if (leftStatus === "warning") el.classList.add("drift-warning");
        if (leftStatus === "severe") el.classList.add("drift-severe");
      });

      document.querySelectorAll(".svg-stick-right-base").forEach(el => {
        el.classList.remove("drift-warning", "drift-severe");
        if (rightStatus === "warning") el.classList.add("drift-warning");
        if (rightStatus === "severe") el.classList.add("drift-severe");
      });

      // Update Port & Link Diagnostics
      const usbPortEl = document.getElementById("valUsbCConnection");
      const chargingStatusEl = document.getElementById("valChargingStatus");
      const btSignalEl = document.getElementById("valBtSignal");
      const touchpadPortEl = document.getElementById("valTouchpadPortStatus");
      
      if (usbPortEl && chargingStatusEl && btSignalEl) {
        if (isConnected) {
          const isBt = connectionType === "Bluetooth";
          usbPortEl.innerHTML = !isBt ? `<i class="fa-solid fa-plug text-success"></i> Connected (USB Mode)` : `<i class="fa-solid fa-plug-circle-xmark text-muted"></i> Disconnected`;
          chargingStatusEl.innerHTML = !isBt ? `<i class="fa-solid fa-battery-charging text-success"></i> Charging (85%)` : `<i class="fa-solid fa-battery-three-quarters text-success"></i> Discharging (85%)`;
          btSignalEl.innerHTML = isBt ? `<i class="fa-solid fa-wifi text-success"></i> Connected (BT 5.1 Quality Good)` : `<i class="fa-solid fa-wifi text-muted"></i> Off (USB active)`;
          if (touchpadPortEl) {
            touchpadPortEl.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Active (1920x942 Grid)`;
          }
        } else if (gamepadIndex >= 0 && !demoModeActive) {
          // Connected via standard Gamepad API but not WebHID
          usbPortEl.innerHTML = `<i class="fa-solid fa-plug text-warning"></i> Connected (Standard Gamepad Mode)`;
          chargingStatusEl.innerHTML = `<i class="fa-solid fa-battery-three-quarters text-success"></i> Connected (Battery N/A)`;
          btSignalEl.innerHTML = `<i class="fa-solid fa-wifi text-warning"></i> Bluetooth (Standard Gamepad Mode)`;
          if (touchpadPortEl) {
            touchpadPortEl.innerHTML = `<i class="fa-solid fa-circle-xmark text-danger"></i> Inactive (Requires WebHID)`;
          }
        } else {
          // Demo Mode
          usbPortEl.innerHTML = `<i class="fa-solid fa-plug text-warning"></i> Simulated USB Connection`;
          chargingStatusEl.innerHTML = `<i class="fa-solid fa-battery-full text-success"></i> Fully Charged (100%)`;
          btSignalEl.innerHTML = `<i class="fa-solid fa-wifi text-muted"></i> Off (Simulated)`;
          if (touchpadPortEl) {
            touchpadPortEl.innerHTML = `<i class="fa-solid fa-circle-check text-warning"></i> Simulated (1920x942 Grid)`;
          }
        }
      }

      // Update simulated sensors for DualSense / Demo Mode
      if (isConnected) {
        if (!hidDevice || (hidDevice.productId !== 0x05C4 && hidDevice.productId !== 0x09CC)) {
          // DualSense USB
          const noise = () => (Math.random() - 0.5) * 0.05;
          sensorState.gyroX = lx * 5.0 + noise();
          sensorState.gyroY = ly * 5.0 + noise();
          sensorState.gyroZ = (rx + ry) * 2.0 + noise();
          sensorState.accelX = lx + noise();
          sensorState.accelY = ly + noise();
          sensorState.accelZ = 1.0 - Math.sqrt(lx*lx + ly*ly) + noise();
        }
      } else if (demoModeActive) {
        const noise = () => (Math.random() - 0.5) * 0.05;
        sensorState.gyroX = lx * 5.0 + noise();
        sensorState.gyroY = ly * 5.0 + noise();
        sensorState.gyroZ = (rx + ry) * 2.0 + noise();
        sensorState.accelX = lx + noise();
        sensorState.accelY = ly + noise();
        sensorState.accelZ = 1.0 - Math.sqrt(lx*lx + ly*ly) + noise();
      }
    }

    function updateSvgButton(btnIndex, isPressed) {
      const classes = getSvgPartClasses(btnIndex);
      if (classes) {
        classes.forEach(cls => {
          document.querySelectorAll(cls).forEach(el => {
            if (isPressed) {
              el.classList.add("pressed");
            } else {
              el.classList.remove("pressed");
            }
          });
        });
      }
    }

    function getSvgPartClasses(btnIndex) {
      const mapping = {
        0: ["#Cross_infill"],
        1: ["#Circle_infill"],
        2: ["#Square_infill"],
        3: ["#Triangle_infill"],
        4: ["#L1_infill"],
        5: ["#R1_infill"],
        8: ["#Create_infill"],
        9: ["#Options_infill"],
        10: ["#L3_infill"],
        11: ["#R3_infill"],
        12: ["#Up_infill"],
        13: ["#Down_infill"],
        14: ["#Left_infill"],
        15: ["#Right_infill"],
        16: ["#PS_infill"],
        17: ["#Trackpad_infill"]
      };
      return mapping[btnIndex] || null;
    }

    function drawCoordinateGrid(canvasId, x, y) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext("2d");
      
      const ratio = window.devicePixelRatio || 1;
      const logicalWidth = 150;
      const logicalHeight = 150;
      
      if (canvas.width !== logicalWidth * ratio) {
        canvas.width = logicalWidth * ratio;
        canvas.height = logicalHeight * ratio;
        canvas.style.width = `${logicalWidth}px`;
        canvas.style.height = `${logicalHeight}px`;
      }
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      const radius = logicalWidth / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(radius, logicalHeight);
      ctx.moveTo(0, radius);
      ctx.lineTo(logicalWidth, radius);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 112, 209, 0.2)";
      ctx.beginPath();
      ctx.arc(radius, radius, radius * 0.05, 0, Math.PI * 2);
      ctx.stroke();

      const dotX = radius + x * (radius - 5);
      const dotY = radius + y * (radius - 5);

      ctx.fillStyle = "#0070d1";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    drawCoordinateGrid("canvasLeftStick", 0, 0);
    drawCoordinateGrid("canvasRightStick", 0, 0);

    // VIBRATION SHAKE VISUALS
    function updateVibrationVisuals(leftVal, rightVal) {
      document.querySelectorAll(".controller-svg-container").forEach(container => {
        container.classList.remove("vibrate-heavy", "vibrate-light");
        if (leftVal > 0.5 || rightVal > 0.5) {
          container.classList.add("vibrate-heavy");
        } else if (leftVal > 0 || rightVal > 0) {
          container.classList.add("vibrate-light");
        }
      });
    }

    // VIBRATION LOGIC
    const sliderLeft = document.getElementById("sliderLeftMotor");
    const sliderRight = document.getElementById("sliderRightMotor");
    
    sliderLeft.addEventListener("input", (e) => {
      document.getElementById("txtLeftMotorVal").innerText = `${e.target.value}%`;
      triggerVibration();
    });

    sliderRight.addEventListener("input", (e) => {
      document.getElementById("txtRightMotorVal").innerText = `${e.target.value}%`;
      triggerVibration();
    });

    async function triggerWebHidVibration(strongMagnitude, weakMagnitude) {
      if (!hidDevice || connectionType !== "USB") return false;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          const payload = new Uint8Array(15);
          payload[0] = 0xf3; // Enable rumble and lightbar
          payload[3] = Math.round(weakMagnitude * 255); // Right motor (weak)
          payload[4] = Math.round(strongMagnitude * 255); // Left motor (strong)
          await hidDevice.sendReport(0x05, payload);
        } else {
          // DualSense
          const payload = new Uint8Array(63);
          payload[0] = 0x03; // Enable rumble motors
          payload[2] = Math.round(weakMagnitude * 255); // Right motor (weak)
          payload[3] = Math.round(strongMagnitude * 255); // Left motor (strong)
          await hidDevice.sendReport(0x02, payload);
        }
        return true;
      } catch (err) {
        console.error("Direct WebHID vibration failed:", err);
        return false;
      }
    }

    async function triggerVibration(duration = 500) {
      const leftVal = parseInt(sliderLeft.value) / 100;
      const rightVal = parseInt(sliderRight.value) / 100;

      // Apply shake visual feedback
      updateVibrationVisuals(leftVal, rightVal);

      // Prefer WebHID direct vibration first
      const webHidSuccess = await triggerWebHidVibration(leftVal, rightVal);
      if (webHidSuccess) return;

      if (gamepadIndex < 0) return;
      const gp = navigator.getGamepads()[gamepadIndex];
      if (!gp) return;

      const actuator = gp.vibrationActuator || (gp.hapticActuators && gp.hapticActuators[0]);
      if (actuator) {
        await actuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: duration,
          weakMagnitude: rightVal,
          strongMagnitude: leftVal
        });
      }
    }

    document.getElementById("btnTestBothMotors").addEventListener("click", async () => {
      sliderLeft.value = 50;
      sliderRight.value = 50;
      document.getElementById("txtLeftMotorVal").innerText = "50%";
      document.getElementById("txtRightMotorVal").innerText = "50%";
      
      await triggerVibration(1000);
    });

    document.getElementById("btnStopMotors").addEventListener("click", async () => {
      isVibrating = false;
      sliderLeft.value = 0;
      sliderRight.value = 0;
      document.getElementById("txtLeftMotorVal").innerText = "0%";
      document.getElementById("txtRightMotorVal").innerText = "0%";
      updateVibrationVisuals(0, 0);

      // Stop WebHID vibration
      const webHidSuccess = await triggerWebHidVibration(0, 0);
      if (webHidSuccess) return;

      if (gamepadIndex >= 0) {
        const gp = navigator.getGamepads()[gamepadIndex];
        if (gp) {
          const actuator = gp.vibrationActuator || (gp.hapticActuators && gp.hapticActuators[0]);
          if (actuator) {
            await actuator.playEffect("dual-rumble", { duration: 0, weakMagnitude: 0, strongMagnitude: 0 });
          }
        }
      }
    });

    // Vibration Presets
    document.querySelectorAll(".vibration-preset-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const preset = btn.getAttribute("data-preset");
        let steps = [];

        if (preset === "gentle") {
          steps = [
            { duration: 200, left: 0.3, right: 0.3 },
            { duration: 100, left: 0, right: 0 },
            { duration: 200, left: 0.3, right: 0.3 },
            { duration: 100, left: 0, right: 0 },
            { duration: 200, left: 0.3, right: 0.3 }
          ];
        } else if (preset === "hard") {
          steps = [
            { duration: 600, left: 1.0, right: 1.0 }
          ];
        } else if (preset === "heartbeat") {
          steps = [
            { duration: 100, left: 0.7, right: 0 },
            { duration: 100, left: 0, right: 0 },
            { duration: 100, left: 0.7, right: 0 },
            { duration: 500, left: 0, right: 0 },
            { duration: 100, left: 0.7, right: 0 },
            { duration: 100, left: 0, right: 0 },
            { duration: 100, left: 0.7, right: 0 },
            { duration: 500, left: 0, right: 0 },
            { duration: 100, left: 0.7, right: 0 },
            { duration: 100, left: 0, right: 0 },
            { duration: 100, left: 0.7, right: 0 }
          ];
        } else if (preset === "racing") {
          steps = [];
          for (let i = 0; i < 6; i++) {
            steps.push({ duration: 150, left: 0.6, right: 0 });
            steps.push({ duration: 150, left: 0, right: 0.6 });
          }
        } else if (preset === "explosion") {
          steps = [
            { duration: 80, left: 1.0, right: 1.0 },
            { duration: 100, left: 0.75, right: 0.75 },
            { duration: 100, left: 0.5, right: 0.5 },
            { duration: 100, left: 0.25, right: 0.25 },
            { duration: 100, left: 0.1, right: 0.1 }
          ];
        }

        await playVibrationPattern(steps);
      });
    });

    async function playVibrationPattern(steps) {
      isVibrating = true;
      for (const step of steps) {
        if (!isVibrating) break;
        
        updateVibrationVisuals(step.left, step.right);

        // Prefer WebHID direct vibration first
        const webHidSuccess = await triggerWebHidVibration(step.left, step.right);
        if (!webHidSuccess && gamepadIndex >= 0) {
          const gp = navigator.getGamepads()[gamepadIndex];
          if (gp) {
            const actuator = gp.vibrationActuator || (gp.hapticActuators && gp.hapticActuators[0]);
            if (actuator) {
              await actuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: step.duration,
                weakMagnitude: step.right,
                strongMagnitude: step.left
              });
            }
          }
        }
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
      updateVibrationVisuals(0, 0);
      await triggerWebHidVibration(0, 0);
      isVibrating = false;
    }

    // Pattern Builder Rows
    const patternRowsContainer = document.getElementById("patternBuilderRows");
    
    function addPatternRow(duration = 200, left = 50, right = 50) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="number" class="duration-input" value="${duration}" min="10" max="5000"></td>
        <td><input type="number" class="left-input" value="${left}" min="0" max="100"></td>
        <td><input type="number" class="right-input" value="${right}" min="0" max="100"></td>
        <td class="text-center"><button class="btn btn-sm btn-outline-danger btn-delete-row"><i class="fa-solid fa-xmark"></i></button></td>
      `;
      tr.querySelector(".btn-delete-row").addEventListener("click", () => {
        tr.remove();
      });
      patternRowsContainer.appendChild(tr);
    }

    document.getElementById("btnAddPatternRow").addEventListener("click", () => addPatternRow());
    document.getElementById("btnClearPattern").addEventListener("click", () => {
      patternRowsContainer.innerHTML = "";
    });

    // Default rows
    addPatternRow(300, 80, 0);
    addPatternRow(150, 0, 0);
    addPatternRow(300, 0, 80);

    document.getElementById("btnPlayCustomPattern").addEventListener("click", async () => {
      const steps = [];
      const rows = patternRowsContainer.querySelectorAll("tr");
      rows.forEach(row => {
        const duration = parseInt(row.querySelector(".duration-input").value) || 100;
        const left = (parseInt(row.querySelector(".left-input").value) || 0) / 100;
        const right = (parseInt(row.querySelector(".right-input").value) || 0) / 100;
        steps.push({ duration, left, right });
      });

      if (steps.length > 0) {
        await playVibrationPattern(steps);
      }
    });

    document.getElementById("btnSavePatternLocal").addEventListener("click", () => {
      const steps = [];
      const rows = patternRowsContainer.querySelectorAll("tr");
      rows.forEach(row => {
        const duration = parseInt(row.querySelector(".duration-input").value) || 100;
        const left = parseInt(row.querySelector(".left-input").value) || 0;
        const right = parseInt(row.querySelector(".right-input").value) || 0;
        steps.push({ duration, left, right });
      });

      localStorage.setItem("ps_controller_lab_pattern", JSON.stringify(steps));
      showNotification("Pattern saved successfully!");
    });

    document.getElementById("btnLoadPatternLocal").addEventListener("click", () => {
      const data = localStorage.getItem("ps_controller_lab_pattern");
      if (data) {
        const steps = JSON.parse(data);
        patternRowsContainer.innerHTML = "";
        steps.forEach(step => {
          addPatternRow(step.duration, step.left, step.right);
        });
        showNotification("Pattern loaded successfully!");
      } else {
        showNotification("No saved patterns found in local storage", "danger");
      }
    });

    // DRIFT CHECKER
    document.getElementById("btnRunDriftCheck").addEventListener("click", () => {
      runDriftCheck();
    });

    function runDriftCheck() {
      if (!isConnected && gamepadIndex < 0 && !demoModeActive) {
        showNotification("Connect a controller to check drift", "danger");
        return;
      }

      document.getElementById("btnRunDriftCheck").disabled = true;
      document.getElementById("driftCheckProgressContainer").classList.remove("d-none");

      const startTime = performance.now();
      const samplesLeft = [];
      const samplesRight = [];
      const durationMs = 3000;
      
      const interval = setInterval(() => {
        let lx = 0.0, ly = 0.0, rx = 0.0, ry = 0.0;
        let hasSample = false;

        if (demoModeActive) {
          lx = demoAxes[0];
          ly = demoAxes[1];
          rx = demoAxes[2];
          ry = demoAxes[3];
          hasSample = true;
        } else if (isConnected) {
          lx = lastWebHidAxes[0];
          ly = lastWebHidAxes[1];
          rx = lastWebHidAxes[2];
          ry = lastWebHidAxes[3];
          hasSample = true;
        } else if (gamepadIndex >= 0) {
          const currentGP = navigator.getGamepads()[gamepadIndex];
          if (currentGP) {
            lx = currentGP.axes.length > 0 ? currentGP.axes[0] : 0.0;
            ly = currentGP.axes.length > 1 ? currentGP.axes[1] : 0.0;
            rx = currentGP.axes.length > 2 ? currentGP.axes[2] : 0.0;
            ry = currentGP.axes.length > 3 ? currentGP.axes[3] : 0.0;
            hasSample = true;
          }
        }

        if (hasSample) {
          samplesLeft.push(Math.sqrt(lx * lx + ly * ly));
          samplesRight.push(Math.sqrt(rx * rx + ry * ry));
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min((elapsed / durationMs) * 100, 100);
        document.getElementById("progressDriftCheck").style.width = `${progress}%`;
        document.getElementById("driftCheckProgressLabel").innerText = `Running drift analysis... ${Math.ceil((durationMs - elapsed) / 1000)}s remaining`;

        if (elapsed >= durationMs) {
          clearInterval(interval);
          document.getElementById("btnRunDriftCheck").disabled = false;
          document.getElementById("driftCheckProgressContainer").classList.add("d-none");
          
          const maxLeft = samplesLeft.length > 0 ? Math.max(...samplesLeft) : 0.0;
          const maxRight = samplesRight.length > 0 ? Math.max(...samplesRight) : 0.0;
          
          displayDriftResults(maxLeft, maxRight);
        }
      }, 16);
    }

    let lastDriftResultLeft = null;
    let lastDriftResultRight = null;

    function displayDriftResults(maxLeft, maxRight) {
      lastDriftResultLeft = maxLeft;
      lastDriftResultRight = maxRight;

      document.getElementById("driftValLeft").innerText = maxLeft.toFixed(3);
      document.getElementById("driftValRight").innerText = maxRight.toFixed(3);

      const threshold = parseFloat(document.getElementById("selectDriftThreshold").value);
      const warningLimit = threshold;
      const severeLimit = threshold * 3.0;

      // Update severity description labels
      const okText = document.getElementById("spanThresholdOk");
      const warnText = document.getElementById("spanThresholdWarning");
      const sevText = document.getElementById("spanThresholdSevere");
      
      if (okText) okText.innerHTML = `Max deviation &le; ${warningLimit.toFixed(2)}. The stick centers perfectly.`;
      if (warnText) warnText.innerHTML = `Deviation ${warningLimit.toFixed(2)} to ${severeLimit.toFixed(2)}. Minor drift detected. Calibrate center or adjust deadzone in games.`;
      if (sevText) sevText.innerHTML = `Deviation &gt; ${severeLimit.toFixed(2)}. Heavy drift. Potentiometer physical wear. Consider calibration or replacement.`;

      const assignBadge = (val, badgeId) => {
        const badgeEl = document.getElementById(badgeId);
        if (val <= warningLimit) {
          badgeEl.innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-check"></i> ✓ OK</span>`;
        } else if (val <= severeLimit) {
          badgeEl.innerHTML = `<span class="badge-custom badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> ⚠️ Drift Detected</span>`;
        } else {
          badgeEl.innerHTML = `<span class="badge-custom badge-danger"><i class="fa-solid fa-circle-xmark"></i> ❌ Severe Drift</span>`;
        }
      };

      assignBadge(maxLeft, "driftBadgeLeft");
      assignBadge(maxRight, "driftBadgeRight");

      showNotification("Drift check complete!");
    }

    // Listener for threshold change
    document.getElementById("selectDriftThreshold").addEventListener("change", () => {
      if (lastDriftResultLeft !== null) {
        displayDriftResults(lastDriftResultLeft, lastDriftResultRight);
      } else {
        const threshold = parseFloat(document.getElementById("selectDriftThreshold").value);
        const warningLimit = threshold;
        const severeLimit = threshold * 3.0;

        const okText = document.getElementById("spanThresholdOk");
        const warnText = document.getElementById("spanThresholdWarning");
        const sevText = document.getElementById("spanThresholdSevere");
        
        if (okText) okText.innerHTML = `Max deviation &le; ${warningLimit.toFixed(2)}. The stick centers perfectly.`;
        if (warnText) warnText.innerHTML = `Deviation ${warningLimit.toFixed(2)} to ${severeLimit.toFixed(2)}. Minor drift detected. Calibrate center or adjust deadzone in games.`;
        if (sevText) sevText.innerHTML = `Deviation &gt; ${severeLimit.toFixed(2)}. Heavy drift. Potentiometer physical wear. Consider calibration or replacement.`;
      }
    });

    // CALIBRATION WIZARD SYSTEM
    const modalEl = document.getElementById('calibrationWizardModal');
    let wizardModalObj = null;
    try {
      if (typeof bootstrap !== 'undefined') {
        wizardModalObj = new bootstrap.Modal(modalEl);
      }
    } catch (e) {
      console.warn("Could not init bootstrap Modal", e);
    }

    function showWizardModal() {
      if (wizardModalObj) {
        wizardModalObj.show();
      } else {
        modalEl.style.display = 'block';
        modalEl.classList.add('show');
        document.body.classList.add('modal-open');
        
        let backdrop = document.getElementById('modal-backdrop-fallback');
        if (!backdrop) {
          backdrop = document.createElement('div');
          backdrop.id = 'modal-backdrop-fallback';
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }
    }

    function hideWizardModal() {
      if (wizardModalObj) {
        wizardModalObj.hide();
      } else {
        modalEl.style.display = 'none';
        modalEl.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.getElementById('modal-backdrop-fallback');
        if (backdrop) backdrop.remove();
      }
    }

    let wizardStep = 1;
    let wizardType = "center";

    let rangeLeftFullCycles = 0;
    let rangeRightFullCycles = 0;
    let wizardRangeLData = new Array(120).fill(0);
    let wizardRangeRData = new Array(120).fill(0);

    // Track range rotation cycles during range calibration wizard step 2
    function trackRangeRotation(lx, ly, rx, ry) {
      if (wizardType !== "range" || wizardStep !== 2) return;

      const JOYSTICK_EXTREME_THRESHOLD = 0.80;
      const CIRCLE_FILL_THRESHOLD = 0.95;
      const MAX_N = 120;

      // Track Left Stick
      const distL = Math.sqrt(lx * lx + ly * ly);
      if (distL > JOYSTICK_EXTREME_THRESHOLD) {
        const angleL = (Math.atan2(ly, lx) + Math.PI) / (2 * Math.PI); // 0 to 1
        const indexL = Math.floor(angleL * MAX_N) % MAX_N;
        wizardRangeLData[indexL] = Math.max(wizardRangeLData[indexL], distL);
      }

      // Track Right Stick
      const distR = Math.sqrt(rx * rx + ry * ry);
      if (distR > JOYSTICK_EXTREME_THRESHOLD) {
        const angleR = (Math.atan2(ry, rx) + Math.PI) / (2 * Math.PI); // 0 to 1
        const indexR = Math.floor(angleR * MAX_N) % MAX_N;
        wizardRangeRData[indexR] = Math.max(wizardRangeRData[indexR], distR);
      }

      // Check completed cycles
      const leftCount = wizardRangeLData.filter(v => v > JOYSTICK_EXTREME_THRESHOLD).length;
      if (rangeLeftFullCycles < 4 && (leftCount / MAX_N >= CIRCLE_FILL_THRESHOLD)) {
        rangeLeftFullCycles++;
        wizardRangeLData.fill(0);
        showNotification(`Left stick rotation cycle completed! (${rangeLeftFullCycles}/4)`, "success");
      }

      const rightCount = wizardRangeRData.filter(v => v > JOYSTICK_EXTREME_THRESHOLD).length;
      if (rangeRightFullCycles < 4 && (rightCount / MAX_N >= CIRCLE_FILL_THRESHOLD)) {
        rangeRightFullCycles++;
        wizardRangeRData.fill(0);
        showNotification(`Right stick rotation cycle completed! (${rangeRightFullCycles}/4)`, "success");
      }

      // Update progress bar and text in the wizard modal
      const progressL = Math.min(rangeLeftFullCycles, 4) * 12.5;
      const progressR = Math.min(rangeRightFullCycles, 4) * 12.5;
      const partialL = (leftCount / MAX_N) * 12.5;
      const partialR = (rightCount / MAX_N) * 12.5;

      const totalProgress = Math.round(
        Math.min(50, progressL + partialL) +
        Math.min(50, progressR + partialR)
      );

      document.getElementById("rangeWizardProgressBar").style.width = `${totalProgress}%`;
      document.getElementById("rangeWizardProgressText").innerText = `Left: ${rangeLeftFullCycles}/4 | Right: ${rangeRightFullCycles}/4`;

      // Enable the Next button if both sticks have completed 4 cycles (or if in demo mode)
      const allDone = (rangeLeftFullCycles >= 4 && rangeRightFullCycles >= 4) || demoModeActive;
      document.getElementById("btnWizardNext").disabled = !allDone;
    }

    // Draw magnified live drift vector line and dot on all controller SVGs
    function updateDriftVector(lx, ly, rx, ry, lxDev, rxDev) {
      const driftThreshold = 0.02;

      // Left Stick (Center cx=230, cy=270, radius=38)
      document.querySelectorAll(".svg-drift-line-left").forEach(el => {
        if (lxDev > driftThreshold) {
          el.setAttribute("x2", 230 + lx * 38);
          el.setAttribute("y2", 270 + ly * 38);
          el.setAttribute("opacity", "1");
        } else {
          el.setAttribute("opacity", "0");
        }
      });
      document.querySelectorAll(".svg-drift-dot-left").forEach(el => {
        if (lxDev > driftThreshold) {
          el.setAttribute("cx", 230 + lx * 38);
          el.setAttribute("cy", 270 + ly * 38);
          el.setAttribute("opacity", "1");
        } else {
          el.setAttribute("opacity", "0");
        }
      });

      // Right Stick (Center cx=370, cy=270, radius=38)
      document.querySelectorAll(".svg-drift-line-right").forEach(el => {
        if (rxDev > driftThreshold) {
          el.setAttribute("x2", 370 + rx * 38);
          el.setAttribute("y2", 270 + ry * 38);
          el.setAttribute("opacity", "1");
        } else {
          el.setAttribute("opacity", "0");
        }
      });
      document.querySelectorAll(".svg-drift-dot-right").forEach(el => {
        if (rxDev > driftThreshold) {
          el.setAttribute("cx", 370 + rx * 38);
          el.setAttribute("cy", 270 + ry * 38);
          el.setAttribute("opacity", "1");
        } else {
          el.setAttribute("opacity", "0");
        }
      });
    }

    const btnNext = document.getElementById("btnWizardNext");
    const btnRetry = document.getElementById("btnWizardRetry");
    const btnCancel = document.getElementById("btnWizardCancel");

    // Unified low-level calibration commands based on official reverse-engineered bytes
    async function calibrateSticksBegin() {
      if (demoModeActive) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      if (isDS4) {
        await sendFeatureReport(hidDevice, 0x90, new Uint8Array([1, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d1 = await receiveFeatureReport(hidDevice, 0x91);
        const d2 = await receiveFeatureReport(hidDevice, 0x92);
        const v1 = (d1 && d1.byteLength >= 4) ? d1.getUint32(0, false) : 0;
        const v2 = (d2 && d2.byteLength >= 4) ? d2.getUint32(0, false) : 0;
        if (v1 !== 0x91010101 || v2 !== 0x920101ff) {
          throw new Error(`DS4 stick begin verify failed: 0x${v1.toString(16)}, 0x${v2.toString(16)}`);
        }
      } else {
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([1, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d = await receiveFeatureReport(hidDevice, 0x83);
        const v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010101) {
          throw new Error(`DualSense stick begin verify failed: 0x${v.toString(16)}`);
        }
      }
    }

    async function calibrateSticksSample() {
      if (demoModeActive) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      if (isDS4) {
        await sendFeatureReport(hidDevice, 0x90, new Uint8Array([3, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d1 = await receiveFeatureReport(hidDevice, 0x91);
        const d2 = await receiveFeatureReport(hidDevice, 0x92);
        const v1 = (d1 && d1.byteLength >= 4) ? d1.getUint32(0, false) : 0;
        const v2 = (d2 && d2.byteLength >= 4) ? d2.getUint32(0, false) : 0;
        if (v1 !== 0x91010101 || v2 !== 0x920101ff) {
          throw new Error(`DS4 stick sample verify failed: 0x${v1.toString(16)}, 0x${v2.toString(16)}`);
        }
      } else {
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([3, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d = await receiveFeatureReport(hidDevice, 0x83);
        const v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010101) {
          throw new Error(`DualSense stick sample verify failed: 0x${v.toString(16)}`);
        }
      }
    }

    async function calibrateSticksEnd() {
      if (demoModeActive) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      if (isDS4) {
        await sendFeatureReport(hidDevice, 0x90, new Uint8Array([2, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d1 = await receiveFeatureReport(hidDevice, 0x91);
        const d2 = await receiveFeatureReport(hidDevice, 0x92);
        const v1 = (d1 && d1.byteLength >= 4) ? d1.getUint32(0, false) : 0;
        const v2 = (d2 && d2.byteLength >= 4) ? d2.getUint32(0, false) : 0;
        if (v1 !== 0x91010102 || v2 !== 0x92010101) {
          throw new Error(`DS4 stick end verify failed: 0x${v1.toString(16)}, 0x${v2.toString(16)}`);
        }
      } else if (isEdge) {
        // DualSense Edge two-stage write verification
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        let d = await receiveFeatureReport(hidDevice, 0x83);
        let v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010101) {
          throw new Error(`DualSense Edge stick end stage 1 verify failed: 0x${v.toString(16)}`);
        }
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        d = await receiveFeatureReport(hidDevice, 0x83);
        v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010103 && v !== 0x83010312) {
          throw new Error(`DualSense Edge stick end stage 2 verify failed: 0x${v.toString(16)}`);
        }
      } else {
        // Standard DualSense
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 1]));
        await new Promise(r => setTimeout(r, 200));
        const d = await receiveFeatureReport(hidDevice, 0x83);
        const v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010102) {
          throw new Error(`DualSense stick end verify failed: 0x${v.toString(16)}`);
        }
      }
    }

    async function calibrateRangeBegin() {
      if (demoModeActive) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      if (isDS4) {
        await sendFeatureReport(hidDevice, 0x90, new Uint8Array([1, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        const d1 = await receiveFeatureReport(hidDevice, 0x91);
        const d2 = await receiveFeatureReport(hidDevice, 0x92);
        const v1 = (d1 && d1.byteLength >= 4) ? d1.getUint32(0, false) : 0;
        const v2 = (d2 && d2.byteLength >= 4) ? d2.getUint32(0, false) : 0;
        if (v1 !== 0x91010201 || v2 !== 0x920102ff) {
          throw new Error(`DS4 range begin verify failed: 0x${v1.toString(16)}, 0x${v2.toString(16)}`);
        }
      } else {
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([1, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        const d = await receiveFeatureReport(hidDevice, 0x83);
        const v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010201) {
          throw new Error(`DualSense range begin verify failed: 0x${v.toString(16)}`);
        }
      }
    }

    async function calibrateRangeEnd() {
      if (demoModeActive) return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      if (isDS4) {
        await sendFeatureReport(hidDevice, 0x90, new Uint8Array([2, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        const d1 = await receiveFeatureReport(hidDevice, 0x91);
        const d2 = await receiveFeatureReport(hidDevice, 0x92);
        const v1 = (d1 && d1.byteLength >= 4) ? d1.getUint32(0, false) : 0;
        const v2 = (d2 && d2.byteLength >= 4) ? d2.getUint32(0, false) : 0;
        if (v1 !== 0x91010202 || v2 !== 0x92010201) {
          console.warn(`DS4 Range End verify warning: v1=0x${v1.toString(16)}, v2=0x${v2.toString(16)}`);
        }
      } else if (isEdge) {
        // DualSense Edge two-stage write verification
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        let d = await receiveFeatureReport(hidDevice, 0x83);
        let v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010201) {
          throw new Error(`DualSense Edge range end stage 1 verify failed: 0x${v.toString(16)}`);
        }
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        d = await receiveFeatureReport(hidDevice, 0x83);
        v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010203) {
          throw new Error(`DualSense Edge range end stage 2 verify failed: 0x${v.toString(16)}`);
        }
      } else {
        // Standard DualSense
        await sendFeatureReport(hidDevice, 0x82, new Uint8Array([2, 1, 2]));
        await new Promise(r => setTimeout(r, 200));
        const d = await receiveFeatureReport(hidDevice, 0x83);
        const v = (d && d.byteLength >= 4) ? d.getUint32(0, false) : 0;
        if (v !== 0x83010202) {
          console.warn(`DualSense Range End verify warning: v=0x${v.toString(16)}`);
        }
      }
    }

    // simulated NVS sector memory-block visualizer
    async function runNvsBlocksAnimation(isDS4) {
      const container = document.getElementById("nvsWriteVisualizer");
      const grid = document.getElementById("nvsBlocksGrid");
      const statusLabel = document.getElementById("nvsWriteStatusLabel");
      
      container.classList.remove("d-none");
      grid.innerHTML = "";
      statusLabel.innerText = isDS4 ? "Unlocking DS4 NVS Sector 0x0A..." : "Unlocking DualSense NVS Sector 0x03...";
      
      const totalBlocks = 16;
      for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement("div");
        block.className = "nvs-block";
        grid.appendChild(block);
      }
      
      await new Promise(r => setTimeout(r, 400));
      statusLabel.innerText = "Writing calibration sectors...";
      
      for (let i = 0; i < totalBlocks; i++) {
        const block = grid.children[i];
        block.classList.add("writing");
        await new Promise(r => setTimeout(r, 40));
        block.classList.remove("writing");
        block.classList.add("written");
      }
      
      statusLabel.innerText = "Verifying write mirror & locking memory...";
      await new Promise(r => setTimeout(r, 300));
      statusLabel.innerText = "✓ Memory written and locked!";
    }

    document.getElementById("btnCalibrateCenter").addEventListener("click", () => {
      startWizard("center");
    });

    document.getElementById("btnCalibrateRange").addEventListener("click", () => {
      startWizard("range");
    });

    function startWizard(type) {
      if (isClone || connectionType === "Bluetooth") return;
      
      wizardType = type;
      wizardStep = 1;

      // Clean rotation tracking states
      rangeLeftFullCycles = 0;
      rangeRightFullCycles = 0;
      wizardRangeLData.fill(0);
      wizardRangeRData.fill(0);

      // Reset DOM structures
      document.getElementById("wizardRangeProgressContainer").classList.add("d-none");
      document.getElementById("nvsWriteVisualizer").classList.add("d-none");
      document.getElementById("wizardErrorAlert").classList.add("d-none");
      document.getElementById("wizardStickHighlightText").innerText = "Sticks in neutral center";

      // Reset Range Calibration progress values in Wizard UI
      if (type === "range") {
        document.getElementById("rangeWizardProgressBar").style.width = "0%";
        document.getElementById("rangeWizardProgressText").innerText = "Left: 0/4 | Right: 0/4";
      }

      // Show/Hide step dots depending on 6 vs 4 steps
      if (type === "center") {
        document.querySelectorAll(".calibration-steps-indicator .calibration-step-dot").forEach((dot) => {
          dot.classList.remove("d-none");
        });
      } else {
        document.querySelectorAll(".calibration-steps-indicator .calibration-step-dot").forEach((dot) => {
          const step = parseInt(dot.getAttribute("data-step"));
          if (step > 4) dot.classList.add("d-none");
        });
      }
      
      document.getElementById("wizardModalTitle").innerText = type === "center" ? "Analog Center Calibration Wizard" : "Analog Range Calibration Wizard";
      btnRetry.classList.add("d-none");
      btnNext.disabled = false;
      btnCancel.disabled = false;
      
      // Reset highlights in the modal's SVG controller
      document.querySelectorAll("#wizardControllerContainer .svg-stick-left-base").forEach(el => el.classList.add("pulse-calib"));
      document.querySelectorAll("#wizardControllerContainer .svg-stick-right-base").forEach(el => el.classList.add("pulse-calib"));

      updateWizardUI();
      showWizardModal();
    }

    function updateWizardUI() {
      const maxSteps = wizardType === "center" ? 6 : 4;
      const fillPercentage = ((wizardStep - 1) / (maxSteps - 1)) * 100;
      document.getElementById("wizardStepsLineFill").style.width = `${fillPercentage}%`;

      document.querySelectorAll(".calibration-step-dot").forEach((dot, idx) => {
        const stepNum = idx + 1;
        dot.className = "calibration-step-dot";
        
        // Ensure steps hidden for Range aren't selected
        if (wizardType === "range" && stepNum > 4) {
          dot.classList.add("d-none");
          return;
        }

        if (stepNum < wizardStep) {
          dot.classList.add("completed");
        } else if (stepNum === wizardStep) {
          dot.classList.add("active");
        }
      });

      const header = document.getElementById("wizardStepHeader");
      const text = document.getElementById("wizardStepText");
      const ill = document.getElementById("wizardIllustration");

      if (wizardType === "center") {
        if (wizardStep === 1) {
          header.innerText = "Step 1: Welcome & Setup";
          text.innerText = "Let go of both sticks completely. Keep them in neutral center position. Click Next to initialize.";
          ill.innerHTML = `<i class="fa-solid fa-arrows-to-dot"></i>`;
        } else if (wizardStep === 2) {
          header.innerText = "Step 2: Initialize Calibration";
          text.innerText = "Preparing controller calibration memory. Keep sticks centered. Click Next to sample.";
          ill.innerHTML = `<i class="fa-solid fa-compress animate-pulse"></i>`;
        } else if (wizardStep === 3) {
          header.innerText = "Step 3: Sample Center (1/3)";
          text.innerText = "Sampling first stick rest position. Keep sticks centered. Click Next to continue.";
          ill.innerHTML = `<i class="fa-solid fa-sliders"></i>`;
        } else if (wizardStep === 4) {
          header.innerText = "Step 4: Sample Center (2/3)";
          text.innerText = "Sampling second stick rest position. Keep sticks centered. Click Next to continue.";
          ill.innerHTML = `<i class="fa-solid fa-sliders"></i>`;
        } else if (wizardStep === 5) {
          header.innerText = "Step 5: Sample Center (3/3)";
          text.innerText = "Sampling third stick rest position. Keep sticks centered. Click Next to continue.";
          ill.innerHTML = `<i class="fa-solid fa-sliders"></i>`;
        } else if (wizardStep === 6) {
          header.innerText = "Step 6: Write & Verify Calibration";
          text.innerText = "All center samples gathered. Click Complete to permanently write calibration settings to controller memory.";
          ill.innerHTML = `<i class="fa-solid fa-floppy-disk text-success"></i>`;
          btnNext.innerText = "Complete";
        }
      } else {
        if (wizardStep === 1) {
          header.innerText = "Step 1: Initialize Range";
          text.innerText = "Ready to calibrate stick outer boundaries. Let go of sticks and click Next.";
          ill.innerHTML = `<i class="fa-solid fa-arrows-spin"></i>`;
        } else if (wizardStep === 2) {
          header.innerText = "Step 2: Rotate Sticks to Maximum Bounds";
          text.innerText = "Slowly rotate both sticks along their outermost edges. A progress bar will track your cycles.";
          ill.innerHTML = `<i class="fa-solid fa-rotate-left"></i>`;
          document.getElementById("wizardRangeProgressContainer").classList.remove("d-none");
          btnNext.disabled = true; // Disabled until cycles finished
        } else if (wizardStep === 3) {
          header.innerText = "Step 3: Save Range Calibration";
          text.innerText = "Stick boundaries captured successfully! Click Next to write and lock calibration settings.";
          ill.innerHTML = `<i class="fa-solid fa-floppy-disk text-success"></i>`;
          document.getElementById("wizardRangeProgressContainer").classList.add("d-none");
        } else if (wizardStep === 4) {
          header.innerText = "Step 4: Complete";
          text.innerText = "Stick range bounds have been successfully adjusted and verified. Click Complete to close.";
          ill.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i>`;
          btnNext.innerText = "Complete";
        }
      }

      if (wizardStep < maxSteps) {
        btnNext.innerText = "Next";
      }
    }

    btnNext.addEventListener("click", async () => {
      const maxSteps = wizardType === "center" ? 6 : 4;
      if (wizardStep === maxSteps) {
        hideWizardModal();
        return;
      }

      btnNext.disabled = true;
      btnCancel.disabled = true;
      document.getElementById("wizardSpinner").classList.remove("d-none");
      document.getElementById("wizardErrorAlert").classList.add("d-none");

      try {
        const isDS4 = hidDevice ? (hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC) : true;
        
        if (wizardType === "center") {
          if (wizardStep === 1) {
            await calibrateSticksBegin();
          } else if (wizardStep === 2) {
            await calibrateSticksSample();
          } else if (wizardStep === 3) {
            await calibrateSticksSample();
          } else if (wizardStep === 4) {
            await calibrateSticksSample();
          } else if (wizardStep === 5) {
            // Step 5 triggers the final sampling and permanent write sector routines
            await calibrateSticksSample();
            
            // Write sequence: End Calibration write -> NVS animation -> Save permanently
            await calibrateSticksEnd();
            await runNvsBlocksAnimation(isDS4);
            await saveCalibrationPermanently();
            
            showNotification("Center calibration written and saved permanently!", "success");
          }
        } else {
          // Range Calibration
          if (wizardStep === 1) {
            await calibrateRangeBegin();
          } else if (wizardStep === 2) {
            // Next clicked on Step 2 (Wait was completed)
            // No action needed, progress to Step 3
          } else if (wizardStep === 3) {
            // Step 3 triggers writing range boundaries permanently
            await calibrateRangeEnd();
            await runNvsBlocksAnimation(isDS4);
            await saveCalibrationPermanently();
            
            showNotification("Range calibration written and saved permanently!", "success");
          }
        }

        wizardStep++;
        updateWizardUI();
      } catch (err) {
        console.error("Wizard step failed", err);
        logRawHID(`Calibration Wizard Error: ${err.message}`);
        
        document.getElementById("wizardErrorTitle").innerText = `Step ${wizardStep} Action Failed:`;
        document.getElementById("wizardErrorText").innerText = err.message || "Failed to communicate with controller.";
        document.getElementById("wizardErrorAlert").classList.remove("d-none");
        
        btnRetry.classList.remove("d-none");
      } finally {
        document.getElementById("wizardSpinner").classList.add("d-none");
        if (wizardStep === 2 && wizardType === "range") {
          // Keep button disabled until range completed
          btnNext.disabled = (rangeLeftFullCycles < 4 || rangeRightFullCycles < 4) && !demoModeActive;
        } else {
          btnNext.disabled = false;
        }
        btnCancel.disabled = false;
      }
    });

    btnRetry.addEventListener("click", () => {
      btnNext.click();
    });

    btnCancel.addEventListener("click", () => {
      hideWizardModal();
    });

    // DualSense Fine-Tune Commands
    const finetuneInputs = ["LL", "LT", "RL", "RT", "LR", "LB", "RR", "RB", "LX", "LY", "RX", "RY"];

    let activeFinetuneStick = "left"; // "left" or "right"
    let dpadInitialTimer = null;
    let dpadRepeatTimer = null;
    let lastDpadState = { up: false, down: false, left: false, right: false };

    function stopContinuousDpad() {
      if (dpadInitialTimer) { clearTimeout(dpadInitialTimer); dpadInitialTimer = null; }
      if (dpadRepeatTimer) { clearInterval(dpadRepeatTimer); dpadRepeatTimer = null; }
    }

    function applyDpadAdjustment(left, right, up, down) {
      let xId = activeFinetuneStick === "left" ? "finetuneLX" : "finetuneRX";
      let yId = activeFinetuneStick === "left" ? "finetuneLY" : "finetuneRY";

      const xInput = document.getElementById(xId);
      const yInput = document.getElementById(yId);

      if (!xInput || !yInput) return;

      let xVal = parseInt(xInput.value) || 0;
      let yVal = parseInt(yInput.value) || 0;

      const step = 5;

      if (left) xVal += step;
      if (right) xVal -= step;
      if (up) yVal += step;
      if (down) yVal -= step;

      xInput.value = Math.max(0, Math.min(65535, xVal));
      yInput.value = Math.max(0, Math.min(65535, yVal));

      // Trigger live write to hardware so the stick canvas updates instantly
      writeFinetuneDataToController().catch(e => console.error("Finetune write error", e));
    }

    function handleFinetuneDpadAndSticks(gp) {
      // Auto-switch active stick based on stick movement
      const [lx, ly, rx, ry] = gp.axes;
      if (Math.abs(lx) > 0.2 || Math.abs(ly) > 0.2) {
        setFinetuneActiveStick("left");
      } else if (Math.abs(rx) > 0.2 || Math.abs(ry) > 0.2) {
        setFinetuneActiveStick("right");
      }

      // Check if we are in center mode or circularity mode
      const isCircularity = document.getElementById("finetuneModal").classList.contains("circularity-mode");
      if (isCircularity) return;

      const dpadUp = gp.buttons[12].pressed;
      const dpadDown = gp.buttons[13].pressed;
      const dpadLeft = gp.buttons[14].pressed;
      const dpadRight = gp.buttons[15].pressed;

      // If nothing is pressed, clear timers and save state
      if (!dpadUp && !dpadDown && !dpadLeft && !dpadRight) {
        stopContinuousDpad();
        lastDpadState = { up: false, down: false, left: false, right: false };
        return;
      }

      // Check if this is a newly pressed button
      const newlyPressed = (!lastDpadState.up && dpadUp) || 
                           (!lastDpadState.down && dpadDown) || 
                           (!lastDpadState.left && dpadLeft) || 
                           (!lastDpadState.right && dpadRight);

      // Save current state
      lastDpadState = { up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight };

      if (newlyPressed) {
        stopContinuousDpad();
        applyDpadAdjustment(dpadLeft, dpadRight, dpadUp, dpadDown);

        // Start initial delay
        dpadInitialTimer = setTimeout(() => {
          // After 400ms, start repeat timer
          dpadRepeatTimer = setInterval(() => {
            applyDpadAdjustment(lastDpadState.left, lastDpadState.right, lastDpadState.up, lastDpadState.down);
          }, 150);
        }, 400);
      }
    }

    function setFinetuneActiveStick(stick) {
      activeFinetuneStick = stick;
      const leftCard = document.getElementById("left-stick-card");
      const leftHeader = document.getElementById("left-stick-header");
      const rightCard = document.getElementById("right-stick-card");
      const rightHeader = document.getElementById("right-stick-header");
      if (!leftCard || !rightCard) return;

      if (stick === "left") {
        leftCard.style.borderColor = "#0d6efd";
        leftCard.style.borderWidth = "2px";
        leftHeader.style.background = "#0d6efd";
        leftHeader.style.color = "#fff";
        rightCard.style.borderColor = "";
        rightCard.style.borderWidth = "";
        rightHeader.style.background = "#f8f9fa";
        rightHeader.style.color = "#212529";
      } else {
        rightCard.style.borderColor = "#0d6efd";
        rightCard.style.borderWidth = "2px";
        rightHeader.style.background = "#0d6efd";
        rightHeader.style.color = "#fff";
        leftCard.style.borderColor = "";
        leftCard.style.borderWidth = "";
        leftHeader.style.background = "#f8f9fa";
        leftHeader.style.color = "#212529";
      }
    }

    document.getElementById("left-stick-card").addEventListener("click", () => setFinetuneActiveStick("left"));
    document.getElementById("right-stick-card").addEventListener("click", () => setFinetuneActiveStick("right"));

    document.getElementById("finetuneModeCenter").addEventListener("change", (e) => {
      if (e.target.checked) document.getElementById("finetuneModal").classList.remove("circularity-mode");
    });
    
    document.getElementById("finetuneModeCircularity").addEventListener("change", (e) => {
      if (e.target.checked) document.getElementById("finetuneModal").classList.add("circularity-mode");
    });
    
    document.getElementById("showRawNumbersCheckbox").addEventListener("change", (e) => {
      document.getElementById("finetuneModal").classList.toggle("hide-raw-numbers", !e.target.checked);
    });

    document.getElementById("finetuneModal").addEventListener("show.bs.modal", async () => {
      setFinetuneActiveStick("left");
      if (!hidDevice || isClone) return;
      try {
        await sendFeatureReport(hidDevice, 0x80, new Uint8Array([12, 2]));
        await new Promise(r => setTimeout(r, 100)); // sleep 100ms
        const res = await receiveFeatureReport(hidDevice, 0x81);
        
        const cmd = res.getUint8(0, true);
        const p1 = res.getUint8(1, true);
        
        if (cmd === 129 && p1 === 12) {
          const values = [];
          for (let i = 0; i < 12; i++) {
            values.push(res.getUint16(4 + i * 2, true));
          }
          
          finetuneInputs.forEach((suffix, i) => {
            const el = document.getElementById("finetune" + suffix);
            if (el) el.value = values[i];
          });
          
          showNotification("Successfully read raw finetune offsets from controller.");
        } else {
          showNotification("Failed to parse finetune data from controller.", "danger");
        }
      } catch (e) {
        showNotification("Failed to read raw offsets: " + e.message, "danger");
      }
    });

    async function writeFinetuneDataToController() {
      if (!hidDevice || isClone) return;
      const payload = new Uint8Array(2 + 24);
      payload[0] = 12;
      payload[1] = 1;
      
      const dv = new DataView(payload.buffer);
      finetuneInputs.forEach((suffix, i) => {
        const el = document.getElementById("finetune" + suffix);
        const val = el ? parseInt(el.value) || 0 : 0;
        dv.setUint16(2 + i * 2, val, true);
      });

      await sendFeatureReport(hidDevice, 0x80, payload);
    }

    document.getElementById("btnApplyFineTuneSave").addEventListener("click", async () => {
      try {
        await writeFinetuneDataToController();
        showNotification("Fine-tune values written successfully!");
        
        // Close modal
        const modalEl = document.getElementById('finetuneModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      } catch (e) {
        showNotification("Failed to write offsets: " + e.message, "danger");
      }
    });

    // Clone bypass click handler
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "btnBypassClone") {
        e.preventDefault();
        isClone = false;
        document.getElementById("cloneWarningBanner").classList.add("d-none");
        document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-check-double"></i> Forced Genuine</span>`;
        document.getElementById("btnCalibrateCenter").disabled = false;
        document.getElementById("btnCalibrateRange").disabled = false;
        document.getElementById("btnSavePermanently").disabled = false;
        document.getElementById("btnCalibrateCenter").removeAttribute("title");
        document.getElementById("btnCalibrateRange").removeAttribute("title");
        showNotification("Clone protection bypassed. Calibration features enabled.", "warning");
      }
    });

    // DEMO MODE / FALLBACK UI
    let demoModeActive = false;
    let demoAxes = [0, 0, 0, 0];
    let demoButtons = Array(18).fill(false);

    function startDemoMode() {
      demoModeActive = true;
      document.getElementById("demoModeIndicator").classList.remove("d-none");
      document.getElementById("overviewDevName").innerText = "PlayStation Controller (Demo Mode)";
      document.getElementById("footerModelName").innerText = "Demo Controller (Gamepad API Simulated)";
      document.getElementById("overviewDevStatus").innerText = "Running in browser Demo Mode.";
      
      document.getElementById("overviewInfoCard").classList.remove("opacity-50");
      document.getElementById("calibrationOptionsCard").classList.remove("opacity-50");
      document.getElementById("driftResultsRow").classList.remove("opacity-50");

      document.getElementById("infoGenuineBadge").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-circle-play"></i> Demo Mode</span>`;
      document.getElementById("infoConnectionType").innerText = "Keyboard Sim";
      document.getElementById("infoBattery").innerHTML = `<i class="fa-solid fa-battery-full text-success"></i> 100%`;
      document.getElementById("infoMac").innerText = "00:11:22:33:44:55";
      document.getElementById("infoBuildDate").innerText = "Jun 05 2026";

      document.getElementById("btnCalibrateCenter").disabled = false;
      document.getElementById("btnCalibrateRange").disabled = false;
      document.getElementById("btnSavePermanently").disabled = false;
      document.getElementById("nvsStatusText").innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked</span>`;
      
      document.getElementById("footerStatusDot").className = "status-dot connected";
      document.getElementById("footerStatusText").innerText = "Demo Mode";
    }

    // Register keyboard listeners for input simulation
    window.addEventListener("keydown", handleDemoKeyDown);
    window.addEventListener("keyup", handleDemoKeyUp);

    function handleDemoKeyDown(e) {
      if (!demoModeActive) return;
      // WASD for Left Stick
      if (e.key === 'w' || e.key === 'W') demoAxes[1] = -1.0;
      if (e.key === 's' || e.key === 'S') demoAxes[1] = 1.0;
      if (e.key === 'a' || e.key === 'A') demoAxes[0] = -1.0;
      if (e.key === 'd' || e.key === 'D') demoAxes[0] = 1.0;

      // Arrows for Right Stick
      if (e.key === 'ArrowUp') demoAxes[3] = -1.0;
      if (e.key === 'ArrowDown') demoAxes[3] = 1.0;
      if (e.key === 'ArrowLeft') demoAxes[2] = -1.0;
      if (e.key === 'ArrowRight') demoAxes[2] = 1.0;

      // Buttons
      if (e.key === ' ') demoButtons[0] = true; // Cross
      if (e.key === 'Enter') demoButtons[1] = true; // Circle
      if (e.key === 'q' || e.key === 'Q') demoButtons[2] = true; // Square
      if (e.key === 'e' || e.key === 'E') demoButtons[3] = true; // Triangle
      if (e.key === '1') demoButtons[4] = true; // L1
      if (e.key === '2') demoButtons[5] = true; // R1
    }

    function handleDemoKeyUp(e) {
      if (!demoModeActive) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') demoAxes[1] = 0.0;
      if (e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') demoAxes[0] = 0.0;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') demoAxes[3] = 0.0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') demoAxes[2] = 0.0;

      if (e.key === ' ') demoButtons[0] = false;
      if (e.key === 'Enter') demoButtons[1] = false;
      if (e.key === 'q' || e.key === 'Q') demoButtons[2] = false;
      if (e.key === 'e' || e.key === 'E') demoButtons[3] = false;
      if (e.key === '1') demoButtons[4] = false;
      if (e.key === '2') demoButtons[5] = false;
    }

    function simulateDemoInputs() {
      const gp = {
        axes: demoAxes,
        buttons: demoButtons.map((pressed, idx) => ({
          pressed: pressed,
          value: pressed ? 1.0 : 0.0
        }))
      };

      if (demoButtons[4]) gp.buttons[6].value = 0.8; // L1 holds L2 trigger
      if (demoButtons[5]) gp.buttons[7].value = 0.8; // R1 holds R2 trigger

      updateInputDisplay(gp);
    }

    // ==========================================
    // SENSOR LAB DIAGNOSTIC LOGIC
    // ==========================================

    // 3D Projection Cube for IMU Visualization
    const imuCanvas = document.getElementById("imuCanvas3D");
    const imuCtx = imuCanvas ? imuCanvas.getContext("2d") : null;
    let angle3dX = 0;
    let angle3dY = 0;
    let cubeSpeedX = 0.01;
    let cubeSpeedY = 0.015;

    // Cube Vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ];

    // Cube Edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ];

    function draw3DCube() {
      if (!imuCanvas || !imuCtx) return;
      
      const ratio = window.devicePixelRatio || 1;
      const logicalWidth = 220;
      const logicalHeight = 220;
      
      if (imuCanvas.width !== logicalWidth * ratio) {
        imuCanvas.width = logicalWidth * ratio;
        imuCanvas.height = logicalHeight * ratio;
        imuCanvas.style.width = `${logicalWidth}px`;
        imuCanvas.style.height = `${logicalHeight}px`;
      }
      
      imuCtx.setTransform(1, 0, 0, 1, 0, 0);
      imuCtx.scale(ratio, ratio);
      imuCtx.clearRect(0, 0, logicalWidth, logicalHeight);
      
      const cx = logicalWidth / 2;
      const cy = logicalHeight / 2;
      const scale = 50;

      // Rotate based on gyro sensors & auto-rotate setting
      const autoRotateEl = document.getElementById("chkImuAutoRotate");
      const autoRotate = autoRotateEl ? autoRotateEl.checked : true;
      const speedX = autoRotate ? cubeSpeedX : 0.0;
      const speedY = autoRotate ? cubeSpeedY : 0.0;

      angle3dX += speedX + (sensorState.gyroX * 0.02);
      angle3dY += speedY + (sensorState.gyroY * 0.02);

      const projected = [];
      const radX = angle3dX;
      const radY = angle3dY;

      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);

      vertices.forEach(v => {
        let x1 = v[0] * cosY - v[2] * sinY;
        let z1 = v[0] * sinY + v[2] * cosY;
        let y2 = v[1] * cosX - z1 * sinX;
        let z2 = v[1] * sinX + z1 * cosX;

        const distance = 3;
        const projectedX = cx + (x1 * scale) / (z2 + distance);
        const projectedY = cy + (y2 * scale) / (z2 + distance);
        projected.push([projectedX, projectedY]);
      });

      // Draw Edges
      imuCtx.strokeStyle = "#0070d1"; // var(--accent) fallback
      imuCtx.lineWidth = 2.5;
      imuCtx.beginPath();
      edges.forEach(e => {
        imuCtx.moveTo(projected[e[0]][0], projected[e[0]][1]);
        imuCtx.lineTo(projected[e[1]][0], projected[e[1]][1]);
      });
      imuCtx.stroke();

      // Draw Vertices
      imuCtx.fillStyle = "#0f172a"; // var(--text) fallback
      projected.forEach(p => {
        imuCtx.beginPath();
        imuCtx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        imuCtx.fill();
      });

      // Update numeric output fields
      const gx = document.getElementById("valGyroX");
      const gy = document.getElementById("valGyroY");
      const gz = document.getElementById("valGyroZ");
      const ax = document.getElementById("valAccelX");
      const ay = document.getElementById("valAccelY");
      const az = document.getElementById("valAccelZ");

      if (gx) gx.innerText = sensorState.gyroX.toFixed(2);
      if (gy) gy.innerText = sensorState.gyroY.toFixed(2);
      if (gz) gz.innerText = sensorState.gyroZ.toFixed(2);
      if (ax) ax.innerText = sensorState.accelX.toFixed(2);
      if (ay) ay.innerText = sensorState.accelY.toFixed(2);
      if (az) az.innerText = sensorState.accelZ.toFixed(2);

      // Update real-time meters
      updateImuMeter("meterGyroX", sensorState.gyroX, -5.0, 5.0);
      updateImuMeter("meterGyroY", sensorState.gyroY, -5.0, 5.0);
      updateImuMeter("meterGyroZ", sensorState.gyroZ, -5.0, 5.0);
      updateImuMeter("meterAccelX", sensorState.accelX, -1.5, 1.5);
      updateImuMeter("meterAccelY", sensorState.accelY, -1.5, 1.5);
      updateImuMeter("meterAccelZ", sensorState.accelZ, -1.5, 1.5);

      requestAnimationFrame(draw3DCube);
    }

    if (imuCanvas) {
      imuCanvas.addEventListener("mousemove", (e) => {
        const rect = imuCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left - imuCanvas.width / 2;
        const y = e.clientY - rect.top - imuCanvas.height / 2;
        
        sensorState.gyroX = -y / 20;
        sensorState.gyroY = x / 20;
        sensorState.accelX = x / 50;
        sensorState.accelY = -y / 50;
        sensorState.accelZ = 1.0 - Math.sqrt(Math.max(0, 1 - (sensorState.accelX**2 + sensorState.accelY**2)));
      });

      imuCanvas.addEventListener("mouseleave", () => {
        sensorState.gyroX = 0;
        sensorState.gyroY = 0;
        sensorState.accelX = 0;
        sensorState.accelY = 0;
        sensorState.accelZ = 1.0;
      });
    }

    // Bi-directional IMU meter bar updater
    function updateImuMeter(elementId, value, minVal, maxVal) {
      const bar = document.getElementById(elementId);
      if (!bar) return;
      const clamped = Math.max(minVal, Math.min(maxVal, value));
      const range = maxVal - minVal;
      const zeroPercent = (-minVal / range) * 100;
      const valPercent = ((clamped - minVal) / range) * 100;
      
      if (clamped >= 0) {
        bar.style.left = `${zeroPercent}%`;
        bar.style.width = `${valPercent - zeroPercent}%`;
      } else {
        bar.style.left = `${valPercent}%`;
        bar.style.width = `${zeroPercent - valPercent}%`;
      }
    }

    // Static IMU Diagnostic Test
    let isImuDiagRunning = false;
    const btnImuDiag = document.getElementById("btnImuDiag");
    if (btnImuDiag) {
      btnImuDiag.addEventListener("click", () => {
        if (isImuDiagRunning) return;
        isImuDiagRunning = true;
        btnImuDiag.disabled = true;
        
        const panel = document.getElementById("imuDiagPanel");
        const progressDiv = document.getElementById("imuDiagProgress");
        const resultDiv = document.getElementById("imuDiagResult");
        const progressBar = document.getElementById("imuDiagProgressBar");
        
        panel.classList.remove("d-none");
        progressDiv.classList.remove("d-none");
        resultDiv.classList.add("d-none");
        progressBar.style.width = "0%";
        
        const gyroX = [], gyroY = [], gyroZ = [];
        const accelX = [], accelY = [], accelZ = [];
        
        const startTime = Date.now();
        const duration = 2000; // 2 seconds
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const percent = Math.min(100, (elapsed / duration) * 100);
          progressBar.style.width = `${percent}%`;
          
          gyroX.push(sensorState.gyroX);
          gyroY.push(sensorState.gyroY);
          gyroZ.push(sensorState.gyroZ);
          accelX.push(sensorState.accelX);
          accelY.push(sensorState.accelY);
          accelZ.push(sensorState.accelZ);
          
          if (elapsed >= duration) {
            clearInterval(interval);
            
            // Calculate Standard Deviation
            const calcSD = (arr) => {
              if (arr.length === 0) return 0;
              const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
              const sqDiff = arr.reduce((a, b) => a + (b - avg) ** 2, 0);
              return Math.sqrt(sqDiff / arr.length);
            };
            
            const sdGx = calcSD(gyroX);
            const sdGy = calcSD(gyroY);
            const sdGz = calcSD(gyroZ);
            const sdAx = calcSD(accelX);
            const sdAy = calcSD(accelY);
            const sdAz = calcSD(accelZ);
            
            const avgAx = accelX.reduce((a, b) => a + b, 0) / accelX.length;
            const avgAy = accelY.reduce((a, b) => a + b, 0) / accelY.length;
            const avgAz = accelZ.reduce((a, b) => a + b, 0) / accelZ.length;
            const gravityMag = Math.sqrt(avgAx**2 + avgAy**2 + avgAz**2);
            
            document.getElementById("txtImuDiagGyroNoise").innerText = `${sdGx.toFixed(4)} / ${sdGy.toFixed(4)} / ${sdGz.toFixed(4)}`;
            document.getElementById("txtImuDiagAccelNoise").innerText = `${sdAx.toFixed(4)} / ${sdAy.toFixed(4)} / ${sdAz.toFixed(4)}`;
            document.getElementById("txtImuDiagGravity").innerText = `${gravityMag.toFixed(2)} G`;
            
            let status = "healthy";
            let badgeText = "✓ Healthy";
            let badgeClass = "badge-success";
            
            const totalSd = sdGx + sdGy + sdGz + sdAx + sdAy + sdAz;
            if (isConnected && totalSd === 0) {
              status = "frozen";
              badgeText = "❌ No Data (Frozen)";
              badgeClass = "badge-danger";
            } else if (sdGx > 0.08 || sdGy > 0.08 || sdGz > 0.08 || sdAx > 0.04 || sdAy > 0.04 || sdAz > 0.04) {
              status = "noisy";
              badgeText = "⚠️ High Noise (Drifting)";
              badgeClass = "badge-warning";
            }
            
            const badge = document.getElementById("imuDiagReportBadge");
            badge.innerText = badgeText;
            badge.className = `badge-custom ${badgeClass}`;
            
            progressDiv.classList.add("d-none");
            resultDiv.classList.remove("d-none");
            
            isImuDiagRunning = false;
            btnImuDiag.disabled = false;
            showNotification(`Sensor diagnostic complete: Sensor is ${status.toUpperCase()}`, status === "healthy" ? "success" : (status === "noisy" ? "warning" : "danger"));
          }
        }, 16);
      });
    }

    // Direct WebHID LED Color Sender
    async function setControllerLed(r, g, b) {
      if (!hidDevice || connectionType !== "USB") return false;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          // DS4 output report 0x05 — 31 bytes payload
          // Byte 0: valid_flag0 (0x07 = rumble + lightbar + flash)
          const payload = new Uint8Array(31);
          payload[0] = 0x07; 
          payload[5] = r;   // Red
          payload[6] = g;   // Green
          payload[7] = b;   // Blue
          await hidDevice.sendReport(0x05, payload);
        } else {
          // DualSense output report 0x02 — 63 bytes payload (USB)
          // Byte 1: valid_flag1 (0x04 = enable lightbar LED)
          const payload = new Uint8Array(63);
          payload[0] = 0x02; // valid_flag0
          payload[1] = 0x04; // valid_flag1: Enable Lightbar
          payload[44] = r;   // Red
          payload[45] = g;   // Green
          payload[46] = b;   // Blue
          await hidDevice.sendReport(0x02, payload);
        }
        return true;
      } catch (err) {
        console.error("Direct WebHID LED set failed:", err);
        return false;
      }
    }

    // LED Preset Buttons
    document.querySelectorAll(".btn-led-color").forEach(btn => {
      btn.addEventListener("click", () => {
        const hex = btn.getAttribute("data-color");
        const picker = document.getElementById("ledColorPicker");
        if (picker) picker.value = hex;
        applyLedHexColor(hex);
      });
    });

    const picker = document.getElementById("ledColorPicker");
    if (picker) {
      picker.addEventListener("input", (e) => {
        applyLedHexColor(e.target.value);
      });
    }

    function applyLedHexColor(hex) {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);

      // Update live preview swatch
      const swatch = document.getElementById("ledColorSwatch");
      if (swatch) {
        swatch.style.background = hex;
        swatch.style.boxShadow = `0 0 12px 4px ${hex}88`;
        swatch.title = `RGB(${r}, ${g}, ${b})`;
      }
      const swatchLabel = document.getElementById("ledColorSwatchLabel");
      if (swatchLabel) swatchLabel.innerText = `RGB(${r}, ${g}, ${b})`;

      if (!hidDevice || connectionType !== "USB") {
        showNotification(`Preview: RGB(${r}, ${g}, ${b}) — Connect via USB to apply to controller`, "warning");
        return;
      }
      setControllerLed(r, g, b);
      showNotification(`Set LED Lightbar color to RGB(${r}, ${g}, ${b})`, "success");
    }

    // DualSense Adaptive Triggers
    const triggerStartEl = document.getElementById("sliderTriggerStart");
    const triggerForceEl = document.getElementById("sliderTriggerForce");

    if (triggerStartEl) {
      triggerStartEl.addEventListener("input", (e) => {
        const lbl = document.getElementById("txtTriggerStart");
        if (lbl) lbl.innerText = e.target.value;
      });
    }
    if (triggerForceEl) {
      triggerForceEl.addEventListener("input", (e) => {
        const lbl = document.getElementById("txtTriggerForce");
        if (lbl) lbl.innerText = e.target.value;
      });
    }

    const btnApplyTrig = document.getElementById("btnApplyTriggerEffect");
    if (btnApplyTrig) {
      btnApplyTrig.addEventListener("click", async () => {
        if (!hidDevice) {
          showNotification("Please connect a real controller to apply trigger effects", "danger");
          return;
        }
        const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
        if (isDS4) {
          showNotification("Adaptive triggers are only supported on DualSense / Edge controllers", "danger");
          return;
        }

        const target = document.getElementById("selectTriggerTarget").value;
        const mode = parseInt(document.getElementById("selectTriggerMode").value);
        const start = parseInt(document.getElementById("sliderTriggerStart").value);
        const force = parseInt(document.getElementById("sliderTriggerForce").value);

        try {
          const payload = new Uint8Array(63);
          let flag = 0;
          if (target === "left" || target === "both") flag |= 0x08;
          if (target === "right" || target === "both") flag |= 0x04;
          payload[0] = flag;

          if (target === "left" || target === "both") {
            payload[10] = mode;
            if (mode === 2) {
              payload[11] = start;
              payload[12] = Math.min(9, start + 2);
              payload[13] = force;
            } else {
              payload[11] = start;
              payload[12] = force;
              payload[13] = 0;
            }
          }
          if (target === "right" || target === "both") {
            payload[20] = mode;
            if (mode === 2) {
              payload[21] = start;
              payload[22] = Math.min(9, start + 2);
              payload[23] = force;
            } else {
              payload[21] = start;
              payload[22] = force;
              payload[23] = 0;
            }
          }

          await hidDevice.sendReport(0x02, payload);
          showNotification(`Applied Adaptive Trigger effect (Mode: ${mode}, Start: ${start}, Force: ${force})`, "success");
        } catch (err) {
          console.error("Adaptive trigger write error", err);
          showNotification("Failed to write adaptive triggers: " + err.message, "danger");
        }
      });
    }

    // Speaker Diagnostics Tone (440Hz Sine Wave)
    let oscillator = null;
    let audioCtxSpeaker = null;

    const btnPlaySpeaker = document.getElementById("btnPlaySpeakerTone");
    if (btnPlaySpeaker) {
      btnPlaySpeaker.addEventListener("click", async () => {
        try {
          audioCtxSpeaker = new (window.AudioContext || window.webkitAudioContext)();
          
          // Try to automatically find and route to controller speaker audio device
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const controllerAudioDevice = devices.find(d => 
              d.kind === "audiooutput" && 
              (d.label.toLowerCase().includes("wireless controller") || 
               d.label.toLowerCase().includes("dualsense") ||
               d.label.toLowerCase().includes("playstation") ||
               d.label.toLowerCase().includes("sony"))
            );
            if (controllerAudioDevice && typeof audioCtxSpeaker.setSinkId === "function") {
              await audioCtxSpeaker.setSinkId(controllerAudioDevice.deviceId);
              console.log("Automatically routed speaker tone to controller device:", controllerAudioDevice.label);
            }
          } catch (sinkErr) {
            console.warn("Could not auto-route audio to controller sink:", sinkErr);
          }

          oscillator = audioCtxSpeaker.createOscillator();
          const gainNode = audioCtxSpeaker.createGain();
          
          oscillator.type = "sine";
          oscillator.frequency.value = 440; // 440Hz diagnostic sine tone
          gainNode.gain.setValueAtTime(0.1, audioCtxSpeaker.currentTime); // Soft but audible volume
          
          // Create 4-channel merger to play on all channels (headphones + built-in controller speaker)
          let audioOutputNode = gainNode;
          try {
            audioCtxSpeaker.destination.channelCount = 4;
            const merger = audioCtxSpeaker.createChannelMerger(4);
            gainNode.connect(merger, 0, 0); // ch 1 (headphones left)
            gainNode.connect(merger, 0, 1); // ch 2 (headphones right)
            gainNode.connect(merger, 0, 2); // ch 3 (built-in speaker)
            gainNode.connect(merger, 0, 3); // ch 4 (vibration/haptics channel)
            audioOutputNode = merger;
          } catch (channelErr) {
            console.warn("Could not setup 4-channel audio routing, falling back to standard stereo:", channelErr);
          }
          
          oscillator.connect(gainNode);
          audioOutputNode.connect(audioCtxSpeaker.destination);
          oscillator.start();
          
          btnPlaySpeaker.classList.add("d-none");
          const btnStopSpk = document.getElementById("btnStopSpeakerTone");
          if (btnStopSpk) btnStopSpk.classList.remove("d-none");
          showNotification("Playing 440Hz diagnostic sine tone. Automatically routed to all audio channels.", "success");
        } catch (err) {
          console.error("Speaker test tone failed", err);
          showNotification("Speaker test tone failed: " + err.message, "danger");
        }
      });
    }

    const btnStopSpeaker = document.getElementById("btnStopSpeakerTone");
    if (btnStopSpeaker) {
      btnStopSpeaker.addEventListener("click", () => {
        stopSpeakerTone();
      });
    }

    function stopSpeakerTone() {
      if (oscillator) {
        try { oscillator.stop(); } catch(e) {}
      }
      if (audioCtxSpeaker) {
        audioCtxSpeaker.close();
      }
      oscillator = null;
      audioCtxSpeaker = null;
      
      const btnPlay = document.getElementById("btnPlaySpeakerTone");
      if (btnPlay) btnPlay.classList.remove("d-none");
      const btnStop = document.getElementById("btnStopSpeakerTone");
      if (btnStop) btnStop.classList.add("d-none");
      showNotification("Speaker diagnostic tone stopped.", "warning");
    }

    // Microphone Oscilloscope Visualizer
    let audioContext = null;
    let analyser = null;
    let micStream = null;
    let micAnimationId = null;
    const micCanvas = document.getElementById("micOscilloscope");
    const micCtx = micCanvas ? micCanvas.getContext("2d") : null;

    const btnToggleMic = document.getElementById("btnToggleMicTest");
    if (btnToggleMic) {
      btnToggleMic.addEventListener("click", async () => {
        if (micStream) {
          stopMicTest();
          btnToggleMic.innerHTML = `<i class="fa-solid fa-microphone"></i> Test Microphone Input`;
          btnToggleMic.className = "btn-custom-primary btn-sm";
        } else {
          try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(micStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            btnToggleMic.innerHTML = `<i class="fa-solid fa-stop"></i> Stop Mic Test`;
            btnToggleMic.className = "btn-custom-danger btn-sm";
            
            drawMicOscilloscope();
            showNotification("Microphone diagnostics active. Speak to test!", "success");
          } catch (err) {
            console.error("Microphone access failed", err);
            showNotification("Microphone access denied: " + err.message, "danger");
          }
        }
      });
    }

    function apply_center_zoom(x, y) {
      const distance = Math.sqrt(x * x + y * y);
      if (distance === 0) return { x, y};
      const angle = Math.atan2(y, x);
      const new_distance = distance <= 0.05
        ? (distance / 0.05) * 0.5 
        : 0.5 + ((distance - 0.05) / 0.95) * 0.5;
      return {
        x: Math.cos(angle) * new_distance,
        y: Math.sin(angle) * new_distance
      };
    }

    function calculateCircularityError(data) {
      const sumSquaredDeviations = data.reduce((acc, val) =>
        val > 0.2 ? acc + Math.pow(val - 1, 2) : acc, 0);
      const validDataCount = data.filter(val => val > 0.2).length;
      return validDataCount > 0 ? Math.sqrt(sumSquaredDeviations / validDataCount) * 100 : 0;
    }

    function draw_stick_dial(ctx, center_x, center_y, sz, stick_x, stick_y, opts = {}) {
      const { circularity_data = null, enable_zoom_center = false, highlight } = opts;

      ctx.lineWidth = 1;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.beginPath();
      ctx.arc(center_x, center_y, sz, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      function cc_to_color(cc) {
        const dd = Math.sqrt(Math.pow((1.0 - cc), 2));
        let hh;
        if(cc <= 1.0)
          hh = 220 - 220 * Math.min(1.0, Math.max(0, (dd - 0.05)) / 0.1);
        else
          hh = (245 + (360-245) * Math.min(1.0, Math.max(0, (dd - 0.05)) / 0.15)) % 360;
        return hh;
      }

      if (circularity_data?.length > 0) {
        const MAX_N = 48; // CIRCULARITY_DATA_SIZE
        for(let i = 0; i < MAX_N; i++) {
          const kd = circularity_data[i];
          const kd1 = circularity_data[(i+1) % 48];
          if (kd === undefined || kd1 === undefined) continue;
          const ka = i * Math.PI * 2 / MAX_N;
          const ka1 = ((i+1)%MAX_N) * 2 * Math.PI / MAX_N;

          const kx = Math.cos(ka) * kd;
          const ky = Math.sin(ka) * kd;
          const kx1 = Math.cos(ka1) * kd1;
          const ky1 = Math.sin(ka1) * kd1;

          ctx.beginPath();
          ctx.moveTo(center_x, center_y);
          ctx.lineTo(center_x+kx*sz, center_y+ky*sz);
          ctx.lineTo(center_x+kx1*sz, center_y+ky1*sz);
          ctx.lineTo(center_x, center_y);
          ctx.closePath();

          const cc = (kd + kd1) / 2;
          const hh = cc_to_color(cc);
          ctx.fillStyle = 'hsla(' + parseInt(hh) + ', 100%, 50%, 0.5)';
          ctx.fill();
        }
      }

      if (circularity_data?.filter(n => n > 0.3).length > 10) {
        const circularityError = calculateCircularityError(circularity_data);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '24px Arial';
        const text_y = center_y + sz * 0.5;
        const text = `${circularityError.toFixed(1)} %`;
        ctx.strokeText(text, center_x, text_y);
        ctx.fillText(text, center_x, text_y);
      }

      ctx.strokeStyle = '#aaaaaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(center_x-sz, center_y);
      ctx.lineTo(center_x+sz, center_y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(center_x, center_y-sz);
      ctx.lineTo(center_x, center_y+sz);
      ctx.closePath();
      ctx.stroke();

      let display_x = stick_x;
      let display_y = stick_y;
      if (enable_zoom_center) {
        const transformed = apply_center_zoom(stick_x, stick_y);
        display_x = transformed.x;
        display_y = transformed.y;
        ctx.strokeStyle = '#d3d3d3';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center_x, center_y, sz * 0.5, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';

      const stick_distance = Math.sqrt(display_x*display_x + display_y*display_y);
      const boundary_radius = 0.5;

      const use_two_segments = enable_zoom_center && stick_distance > boundary_radius;
      if (use_two_segments) {
        const boundary_x = (display_x / stick_distance) * boundary_radius;
        const boundary_y = (display_y / stick_distance) * boundary_radius;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(center_x, center_y);
        ctx.lineTo(center_x + boundary_x*sz, center_y + boundary_y*sz);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center_x + boundary_x*sz, center_y + boundary_y*sz);
        ctx.lineTo(center_x + display_x*sz, center_y + display_y*sz);
        ctx.stroke();
      } else {
        ctx.lineWidth = enable_zoom_center ? 3 : 1;
        ctx.beginPath();
        ctx.moveTo(center_x, center_y);
        ctx.lineTo(center_x + display_x*sz, center_y + display_y*sz);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(center_x+display_x*sz, center_y+display_y*sz, highlight ? 4 : 3, 0, 2*Math.PI);
      ctx.fillStyle = highlight ? '#2989f7ff' : '#030b84ff';
      ctx.fill();
    }

    function drawFlatMicLine() {
      if (!micCanvas || !micCtx) return;
      const ratio = window.devicePixelRatio || 1;
      const logicalWidth = micCanvas.clientWidth || 300;
      const logicalHeight = micCanvas.clientHeight || 100;
      
      if (micCanvas.width !== logicalWidth * ratio || micCanvas.height !== logicalHeight * ratio) {
        micCanvas.width = logicalWidth * ratio;
        micCanvas.height = logicalHeight * ratio;
      }
      
      micCtx.setTransform(1, 0, 0, 1, 0, 0);
      micCtx.scale(ratio, ratio);

      const bgCardColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || "#ffffff";
      micCtx.fillStyle = bgCardColor;
      micCtx.fillRect(0, 0, logicalWidth, logicalHeight);

      micCtx.lineWidth = 2.5;
      micCtx.strokeStyle = "#00a83c"; // var(--success)
      micCtx.beginPath();
      micCtx.moveTo(0, logicalHeight / 2);
      micCtx.lineTo(logicalWidth, logicalHeight / 2);
      micCtx.stroke();
    }

    function stopMicTest() {
      if (micAnimationId) cancelAnimationFrame(micAnimationId);
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
      micStream = null;
      audioContext = null;
      analyser = null;
      micAnimationId = null;
      
      if (micCanvas && micCtx) {
        drawFlatMicLine();
      }
    }

    function drawMicOscilloscope() {
      if (!micStream || !analyser || !micCanvas || !micCtx) return;
      micAnimationId = requestAnimationFrame(drawMicOscilloscope);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      const ratio = window.devicePixelRatio || 1;
      const logicalWidth = micCanvas.clientWidth || 300;
      const logicalHeight = micCanvas.clientHeight || 100;
      
      if (micCanvas.width !== logicalWidth * ratio || micCanvas.height !== logicalHeight * ratio) {
        micCanvas.width = logicalWidth * ratio;
        micCanvas.height = logicalHeight * ratio;
      }
      
      micCtx.setTransform(1, 0, 0, 1, 0, 0);
      micCtx.scale(ratio, ratio);

      const bgCardColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || "#ffffff";
      micCtx.fillStyle = bgCardColor;
      micCtx.fillRect(0, 0, logicalWidth, logicalHeight);

      micCtx.lineWidth = 2.5;
      micCtx.strokeStyle = "#00a83c"; // var(--success)
      micCtx.beginPath();

      const sliceWidth = logicalWidth / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (logicalHeight / 2);

        if (i === 0) {
          micCtx.moveTo(x, y);
        } else {
          micCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      micCtx.lineTo(logicalWidth, logicalHeight / 2);
      micCtx.stroke();
    }


  // Auto-detect browser WebHID support on load
    window.addEventListener("load", async () => {
      // Inject SVGs into containers
      const overviewContainer = document.getElementById("overviewControllerContainer");
      const testerContainer = document.getElementById("testerControllerContainer");
      const calibrationContainer = document.getElementById("calibrationControllerContainer");
      const wizardContainer = document.getElementById("wizardControllerContainer");
      if (overviewContainer) overviewContainer.innerHTML = CONTROLLER_SVG_MARKUP;
      if (testerContainer) testerContainer.innerHTML = CONTROLLER_SVG_MARKUP;
      if (calibrationContainer) calibrationContainer.innerHTML = CONTROLLER_SVG_MARKUP;
      if (wizardContainer) wizardContainer.innerHTML = CONTROLLER_SVG_MARKUP;

      draw3DCube();
      drawFlatMicLine();

      if (!navigator.hid) {
        document.getElementById("browserWarningBanner").style.display = "block";
      } else {
        try {
          const pairedDevices = await navigator.hid.getDevices();
          if (pairedDevices.length > 0) {
            logRawHID(`Found ${pairedDevices.length} already paired controller(s).`);
            try {
              await pairedDevices[0].open();
              handleConnect(pairedDevices[0]);
            } catch (openErr) {
              console.warn("Failed to open paired controller", openErr);
              showNotification("Paired controller found but could not be opened. Ensure Steam, DS4Windows, or other gaming utilities are completely closed.", "warning");
            }
          }
        } catch (e) {
          console.warn("Failed to check pre-paired devices", e);
        }
      }
    });

    // Reset controller triggers & LEDs on page exit
    window.addEventListener("beforeunload", () => {
      if (!hidDevice || connectionType !== "USB") return;
      const isDS4 = hidDevice.productId === 0x05C4 || hidDevice.productId === 0x09CC;
      try {
        if (isDS4) {
          const payload = new Uint8Array(15);
          payload[0] = 0xf3;
          payload[5] = 0;
          payload[6] = 0;
          payload[7] = 80; // Reset to default blue
          hidDevice.sendReport(0x05, payload);
        } else {
          const payload = new Uint8Array(63);
          payload[0] = 0x0C; // Reset both triggers
          payload[1] = 0x04; // Reset LED
          payload[10] = 0;   // Trigger Mode Off
          payload[20] = 0;   // Trigger Mode Off
          payload[43] = 128; // Default white LED
          payload[44] = 128;
          payload[45] = 128;
          hidDevice.sendReport(0x02, payload);
        }
      } catch (e) {
        console.warn("Failed to reset controller on unload", e);
      }
    });

