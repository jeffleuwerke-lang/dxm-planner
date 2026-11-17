import { useState, useCallback, useMemo } from "react";

// ── Sensor Database ───────────────────────────────────────────────────────
const SENSOR_DB = {
  "M25VTU-MQP": [
    {reg:40001,desc:"RMS Velocity in/s 10-1kHz",scale_exp:-4,divide_by:10000,raw_max:65535,units:"in/s"},
    {reg:40002,desc:"HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40003,desc:"Temp (°F)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°F"},
    {reg:40004,desc:"HF Peak Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40005,desc:"HF Crest Factor 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40006,desc:"HF Kurtosis 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40007,desc:"HFE Impact Index",scale_exp:0,divide_by:1,raw_max:65535,units:""},
    {reg:40008,desc:"FB RMS Accel G 10-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40009,desc:"FB Pk-Pk Accel G 10-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40010,desc:"FB Crest Factor 10-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40011,desc:"FB Kurtosis 10-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40012,desc:"Peak Velocity Freq (Hz) 10-1kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40013,desc:"FB Peak Accel Freq Hz 10-5.3kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40014,desc:"Run Flag",scale_exp:0,divide_by:1,raw_max:1,units:"0=Stop 1=Run"},
    {reg:40015,desc:"US RMS 20-40kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40016,desc:"US Peak 20-40kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40017,desc:"US Crest Factor",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40018,desc:"US Impact Index",scale_exp:0,divide_by:1,raw_max:65535,units:""},
    {reg:40019,desc:"RMS Velocity mm/s 10-1kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"mm/s"},
    {reg:40020,desc:"HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40021,desc:"Temp (°C)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°C"},
  ],
  "QM30VT3-MQP": [
    {reg:40001,desc:"X RMS Velocity in/s 6-1kHz",scale_exp:-4,divide_by:10000,raw_max:65535,units:"in/s"},
    {reg:40002,desc:"X HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40003,desc:"Y RMS Velocity in/s 6-1kHz",scale_exp:-4,divide_by:10000,raw_max:65535,units:"in/s"},
    {reg:40004,desc:"Y HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40005,desc:"Z RMS Velocity in/s 6-1kHz",scale_exp:-4,divide_by:10000,raw_max:65535,units:"in/s"},
    {reg:40006,desc:"Z HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40007,desc:"Temp (°F)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°F"},
    {reg:40008,desc:"X FB Pk-Pk Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40009,desc:"Y FB Pk-Pk Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40010,desc:"Z FB Pk-Pk Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40011,desc:"X HF Peak Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40012,desc:"Y HF Peak Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40013,desc:"Z HF Peak Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40014,desc:"X HF Crest Factor 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40015,desc:"Y HF Crest Factor 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40016,desc:"Z HF Crest Factor 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40017,desc:"X HF Kurtosis 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40018,desc:"Y HF Kurtosis 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40019,desc:"Z HF Kurtosis 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40020,desc:"X FB Crest Factor 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40021,desc:"Y FB Crest Factor 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40022,desc:"Z FB Crest Factor 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40023,desc:"X FB Kurtosis 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40024,desc:"Y FB Kurtosis 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40025,desc:"Z FB Kurtosis 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:""},
    {reg:40026,desc:"X Peak Velocity Freq (Hz) 6-1kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40027,desc:"Y Peak Velocity Freq (Hz) 6-1kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40028,desc:"Z Peak Velocity Freq (Hz) 6-1kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40029,desc:"Motor Run Flag",scale_exp:0,divide_by:1,raw_max:1,units:"0=Stop 1=Run"},
    {reg:40030,desc:"X FB Peak Accel Freq Hz 6-5.3kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40031,desc:"Y FB Peak Accel Freq Hz 6-5.3kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40032,desc:"Z FB Peak Accel Freq Hz 6-5.3kHz",scale_exp:-1,divide_by:10,raw_max:65535,units:"Hz"},
    {reg:40033,desc:"XYZ HF RMS Accel G 1k-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40034,desc:"X FB RMS Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40035,desc:"Y FB RMS Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40036,desc:"Z FB RMS Accel G 6-5.3kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40037,desc:"X RMS Velocity mm/s 6-1kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"mm/s"},
    {reg:40038,desc:"X HF RMS Accel G",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40039,desc:"Y RMS Velocity mm/s 6-1kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"mm/s"},
    {reg:40040,desc:"Y HF RMS Accel G",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40041,desc:"Z RMS Velocity mm/s 6-1kHz",scale_exp:-3,divide_by:1000,raw_max:65535,units:"mm/s"},
    {reg:40042,desc:"Z HF RMS Accel G",scale_exp:-3,divide_by:1000,raw_max:65535,units:"G"},
    {reg:40043,desc:"Temp (°C)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°C"},
  ],
  "S15S-TH-MQ": [
    {reg:40001,desc:"Humidity (%RH)",scale_exp:-2,divide_by:100,raw_max:10000,units:"%RH"},
    {reg:40002,desc:"Temp (°C)",scale_exp:0,divide_by:20,raw_max:32767,units:"°C"},
    {reg:40003,desc:"Temp (°F)",scale_exp:0,divide_by:20,raw_max:32767,units:"°F"},
    {reg:40004,desc:"Dew Pt (°C)",scale_exp:0,divide_by:20,raw_max:32767,units:"°C"},
    {reg:40005,desc:"Dew Pt (°F)",scale_exp:0,divide_by:20,raw_max:32767,units:"°F"},
  ],
  "S15S-T-MQ": [
    {reg:40002,desc:"Temp (°C)",scale_exp:0,divide_by:5,raw_max:1600,units:"°C"},
    {reg:40003,desc:"Temp (°F)",scale_exp:0,divide_by:5,raw_max:3220,units:"°F"},
    {reg:40004,desc:"Core/Ambient Temp (°C)",scale_exp:0,divide_by:5,raw_max:1600,units:"°C"},
    {reg:40005,desc:"Reserved",scale_exp:0,divide_by:1,raw_max:65535,units:"—"},
    {reg:40006,desc:"Reserved",scale_exp:0,divide_by:1,raw_max:65535,units:"—"},
    {reg:40007,desc:"Core/Ambient Temp (°F)",scale_exp:0,divide_by:5,raw_max:3220,units:"°F"},
  ],
  "S15C-TMS-MQ": [
    {reg:40001,desc:"Temp (°C)",scale_exp:-2,divide_by:100,raw_max:10500,units:"°C"},
    {reg:40002,desc:"Temp (°F)",scale_exp:-2,divide_by:100,raw_max:22100,units:"°F"},
    {reg:40003,desc:"Therm Res",scale_exp:0,divide_by:1,raw_max:23980,units:"ohms x10"},
    {reg:40004,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:7,units:"0=OK"},
  ],
  "S15C-DTMS-MQ": [
    {reg:40001,desc:"Temp 1 (°C)",scale_exp:-2,divide_by:100,raw_max:10500,units:"°C"},
    {reg:40002,desc:"Temp 1 (°F)",scale_exp:-2,divide_by:100,raw_max:22100,units:"°F"},
    {reg:40003,desc:"Therm 1 Res",scale_exp:0,divide_by:1,raw_max:23980,units:"ohms x10"},
    {reg:40004,desc:"IO Error 1 Status",scale_exp:0,divide_by:1,raw_max:7,units:"0=OK"},
    {reg:40005,desc:"Temp 2 (°C)",scale_exp:-2,divide_by:100,raw_max:10500,units:"°C"},
    {reg:40006,desc:"Temp 2 (°F)",scale_exp:-2,divide_by:100,raw_max:22100,units:"°F"},
    {reg:40007,desc:"Therm 2 Res",scale_exp:0,divide_by:1,raw_max:23980,units:"ohms x10"},
    {reg:40008,desc:"IO Error 2 Status",scale_exp:0,divide_by:1,raw_max:7,units:"0=OK"},
  ],
  "S24AS-D-MQP": [
    {reg:40001,desc:"Humidity (%RH)",scale_exp:-2,divide_by:100,raw_max:10000,units:"%RH"},
    {reg:40002,desc:"Temp (°C)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°C"},
    {reg:40003,desc:"Temp (°F)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°F"},
    {reg:40004,desc:"Dew Pt (°C)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°C"},
    {reg:40005,desc:"Dew Pt (°F)",scale_exp:-2,divide_by:100,raw_max:32767,units:"°F"},
  ],
  "S15C-CT150A-MQ": [{reg:40001,desc:"AC RMS Current (A)",scale_exp:-2,divide_by:100,raw_max:15000,units:"A"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-CT20A-MQ":  [{reg:40001,desc:"AC RMS Current (A)",scale_exp:-2,divide_by:100,raw_max:2000,units:"A"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-CT600A-MQ": [{reg:40001,desc:"AC RMS Current (A)",scale_exp:-2,divide_by:100,raw_max:60000,units:"A"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS150C-MQ":   [{reg:40001,desc:"Pressure (PSI)",scale_exp:-2,divide_by:100,raw_max:15000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS15SS-MQ":   [{reg:40001,desc:"Pressure (PSI)",scale_exp:-2,divide_by:100,raw_max:1500,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS50SS-MQ":   [{reg:40001,desc:"Pressure (PSI)",scale_exp:-2,divide_by:100,raw_max:5000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS100SS-MQ":  [{reg:40001,desc:"Pressure (PSI)",scale_exp:-2,divide_by:100,raw_max:10000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS150SS-MQ":  [{reg:40001,desc:"Pressure (PSI)",scale_exp:-2,divide_by:100,raw_max:15000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS3000SS-MQ": [{reg:40001,desc:"Pressure (PSI)",scale_exp:0,divide_by:1,raw_max:3000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-PS5000SS-MQ": [{reg:40001,desc:"Pressure (PSI)",scale_exp:0,divide_by:1,raw_max:5000,units:"PSI"},{reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},{reg:40003,desc:"IO Error Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK"}],
  "S15C-B22-MQ": [
    {reg:40001,desc:"Pin 4 Active State",scale_exp:0,divide_by:1,raw_max:1,units:"0=Inactive 1=Active"},
    {reg:40002,desc:"Pin 2 Active State",scale_exp:0,divide_by:1,raw_max:1,units:"0=Inactive 1=Active"},
    {reg:40003,desc:"Pin 4 Count H",scale_exp:0,divide_by:1,raw_max:65535,units:"counts (upper 16)"},
    {reg:40004,desc:"Pin 4 Count L",scale_exp:0,divide_by:1,raw_max:65535,units:"counts (lower 16)"},
    {reg:40005,desc:"Pin 4 Duration H",scale_exp:0,divide_by:1,raw_max:65535,units:"us (upper 16)"},
    {reg:40006,desc:"Pin 4 Duration L",scale_exp:0,divide_by:1,raw_max:65535,units:"us (lower 16)"},
    {reg:40007,desc:"Pin 4 Events Per Minute H",scale_exp:0,divide_by:1,raw_max:65535,units:"EPM (upper 16)"},
    {reg:40008,desc:"Pin 4 Events Per Minute L",scale_exp:0,divide_by:1,raw_max:65535,units:"EPM (lower 16)"},
    {reg:40009,desc:"Pin 4 Totalizer Count H",scale_exp:0,divide_by:1,raw_max:65535,units:"(upper 16)"},
    {reg:40010,desc:"Pin 4 Totalizer Count L",scale_exp:0,divide_by:1,raw_max:65535,units:"(lower 16)"},
    {reg:40011,desc:"Pin 2 Count H",scale_exp:0,divide_by:1,raw_max:65535,units:"counts (upper 16)"},
    {reg:40012,desc:"Pin 2 Count L",scale_exp:0,divide_by:1,raw_max:65535,units:"counts (lower 16)"},
    {reg:40013,desc:"Pin 2 Duration H",scale_exp:0,divide_by:1,raw_max:65535,units:"us (upper 16)"},
    {reg:40014,desc:"Pin 2 Duration L",scale_exp:0,divide_by:1,raw_max:65535,units:"us (lower 16)"},
    {reg:40015,desc:"Pin 2 Events Per Minute H",scale_exp:0,divide_by:1,raw_max:65535,units:"EPM (upper 16)"},
    {reg:40016,desc:"Pin 2 Events Per Minute L",scale_exp:0,divide_by:1,raw_max:65535,units:"EPM (lower 16)"},
    {reg:40017,desc:"Pin 2 Totalizer Count H",scale_exp:0,divide_by:1,raw_max:65535,units:"(upper 16)"},
    {reg:40018,desc:"Pin 2 Totalizer Count L",scale_exp:0,divide_by:1,raw_max:65535,units:"(lower 16)"},
    {reg:40019,desc:"Pin 4 Counts Per Minute H",scale_exp:0,divide_by:1,raw_max:65535,units:"CPM (upper 16)"},
    {reg:40020,desc:"Pin 4 Counts Per Minute L",scale_exp:0,divide_by:1,raw_max:65535,units:"CPM (lower 16)"},
    {reg:40021,desc:"Pin 2 Counts Per Minute H",scale_exp:0,divide_by:1,raw_max:65535,units:"CPM (upper 16)"},
    {reg:40022,desc:"Pin 2 Counts Per Minute L",scale_exp:0,divide_by:1,raw_max:65535,units:"CPM (lower 16)"},
  ],
  "S15C-I-MQ": [
    {reg:40001,desc:"Analog Current (mA x1000)",scale_exp:-3,divide_by:1000,raw_max:20000,units:"mA"},
    {reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},
    {reg:40003,desc:"IO Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK 1=Below 2=Above"},
  ],
  "S15C-U-MQ": [
    {reg:40001,desc:"Analog Voltage (V x1000)",scale_exp:-3,divide_by:1000,raw_max:10000,units:"V"},
    {reg:40002,desc:"IO Alarm State",scale_exp:0,divide_by:1,raw_max:1,units:"0=OK 1=Alarm"},
    {reg:40003,desc:"IO Status",scale_exp:0,divide_by:1,raw_max:2,units:"0=OK 1=Below 2=Above"},
  ],
};

const MODEL_LIST    = ["", ...Object.keys(SENSOR_DB).sort()];
const STAG_BASE     = 5001;
const STAG_MAX_REGS = 2000;
const MAX_SENSORS   = 40;
const PORTS = [
  { label: "Port 1", sublabel: "RS-485", value: "Port 1", defaultConn: "RS-485" },
  { label: "Port 2", sublabel: "RS-485", value: "Port 2", defaultConn: "RS-485" },
  { label: "Port 3", sublabel: "RS-485", value: "Port 3", defaultConn: "RS-485" },
  { label: "Port 4", sublabel: "RS-485", value: "Port 4", defaultConn: "RS-485" },
  { label: "Port 5", sublabel: "Radio",  value: "Port 5", defaultConn: "Wireless" },
];

// ── DXM platform differences ────────────────────────────────────────────
// DXM1200-X2 supports Port 5 (radio), local LCD, and local SD-card data
// logging. DXMR90-X1 / DXMR90-X1E have no Port 5, no LCD, and no local
// data logging — Cloud Push and EtherNet/IP mapping are still supported.
const DXM_TYPES = {
  "DXM1200-X2": {
    label: "DXM1200-X2",
    device: "DXM1200X2",
    hasPort5: true,
    hasLcd: true,
    hasLocalLog: true,
    rtuServerTimeout: "5",
    hasRtuDevLine: true,
    hasModbusTcp: false,
    hasCx: false,
    defaultDefaddr: "0.0.0.0",
    defaultDhcp: "1",
  },
  "DXMR90-X1": {
    label: "DXMR90-X1",
    device: "DXMR90x",
    hasPort5: false,
    hasLcd: false,
    hasLocalLog: false,
    rtuServerTimeout: "0",
    hasRtuDevLine: false,
    hasModbusTcp: true,
    hasCx: true,
    defaultDefaddr: "192.168.0.1",
    defaultDhcp: "0",
  },
  "DXMR90-X1E": {
    label: "DXMR90-X1E",
    device: "DXMR90X1E",
    hasPort5: false,
    hasLcd: false,
    hasLocalLog: false,
    rtuServerTimeout: "0",
    hasRtuDevLine: false,
    hasModbusTcp: true,
    hasCx: true,
    defaultDefaddr: "192.168.0.1",
    defaultDhcp: "0",
  },
};
const DXM_TYPE_LIST = Object.keys(DXM_TYPES);
const DEVICE_TO_DXM_TYPE = Object.fromEntries(
  Object.entries(DXM_TYPES).map(([k, v]) => [v.device, k])
);
function getPorts(dxmType) {
  const info = DXM_TYPES[dxmType] || DXM_TYPES["DXM1200-X2"];
  return info.hasPort5 ? PORTS : PORTS.filter(p => p.value !== "Port 5");
}
const LOG_OPTS   = ["—", "Log 1", "Log 2", "Log 3"];
const CLOUD_OPTS = ["—", "Read", "Write", "Read-Write"];
const LCD_OPTS   = ["—", "Read", "Read-Write"];
const EIP_OPTS   = ["—", "DXM→PLC", "PLC→DXM"];

// Batch Modify only: dedicated clear action, separate from "—" (leave unchanged)
const CLEAR = "✕ Clear";
const withClear = (opts) => [opts[0], CLEAR, ...opts.slice(1)];

// EtherNet/IP hardware cap: 228 registers per direction
const EIP_LIMIT     = 228;
const EIP_WARN_AT   = Math.ceil(EIP_LIMIT * 0.9); // 206 — "approaching" threshold

const ZERO_GUID = "00000000-0000-0000-0000-000000000000";
const GUID_RE   = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isRealGuid = (g) => !!g && GUID_RE.test(g.trim()) && g.trim() !== ZERO_GUID;

const initSensor = (i) => ({
  id: i, model: "", location: "", modbusId: 11,
  port: "Port 1", connection: "RS-485",
  stagStart: STAG_BASE, pollFreq: 1.0, logConfig: {},
});

// Returns the next available staging register given the current configured sensors
function nextStagStart(sensors) {
  const configured = sensors.filter(s => s.model);
  if (!configured.length) return STAG_BASE;
  const highestEnd = configured.reduce((max, s) => {
    const end = s.stagStart + (SENSOR_DB[s.model]?.length || 0);
    return Math.max(max, end);
  }, STAG_BASE);
  return highestEnd;
}

const xmlEscape = (s) => String(s)
  .replace(/&/g,"&amp;").replace(/"/g,"&quot;")
  .replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/°/g,"deg").replace(/%/g,"pct");

function secsToHMS(secs) {
  const s = parseFloat(secs) || 1;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(3).padStart(6, "0");
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${sec}`;
}

function buildRtuRead(sensors, dxmType = "DXM1200-X2") {
  const info = DXM_TYPES[dxmType] || DXM_TYPES["DXM1200-X2"];
  const MAX_RULE_REGS = 40;
  const rules = [];
  sensors.filter(s => s.model && s.modbusId && (info.hasPort5 || s.port !== "Port 5")).forEach(s => {
    const regs = SENSOR_DB[s.model] || [];
    if (!regs.length) return;
    const pNum    = s.port.replace("Port ","");
    const name    = xmlEscape(s.location || s.model);
    const total   = regs.length;
    const firstReg = regs[0].reg - 40000; // e.g. 40002 → 2
    if (total <= MAX_RULE_REGS) {
      rules.push(`  <rule count="${total}" default="0" localreg="${s.stagStart}" mask="0" maxfail="0" name="${name}" offset="0" poll="${s.pollFreq ?? 1}" port="${pNum}" remfmt="int" remreg="${firstReg}" remtype="hold_reg" scale="0" swapped="0" unit="${s.modbusId}" /><!-- model="${s.model}" -->`);
    } else {
      let remReg = firstReg, localReg = s.stagStart, remaining = total, part = 1;
      while (remaining > 0) {
        const count = Math.min(remaining, MAX_RULE_REGS);
        const partName = `${name} pt${part}`;
        rules.push(`  <rule count="${count}" default="0" localreg="${localReg}" mask="0" maxfail="0" name="${partName}" offset="0" poll="${s.pollFreq ?? 1}" port="${pNum}" remfmt="int" remreg="${remReg}" remtype="hold_reg" scale="0" swapped="0" unit="${s.modbusId}" /><!-- model="${s.model}" pt${part} -->`);
        remReg += count; localReg += count; remaining -= count; part++;
      }
    }
  });
  return `<rtu_read>\n${rules.join("\n")}\n</rtu_read>`;
}

function buildLocalRegs(sensors, dxmType = "DXM1200-X2") {
  const info = DXM_TYPES[dxmType] || DXM_TYPES["DXM1200-X2"];
  const LOG_MAP   = {"Log 1":1,"Log 2":2,"Log 3":4};
  const CLOUD_MAP = {"Read":[1,1],"Write":[1,2],"Read-Write":[1,3]};
  const LCD_MAP   = {"Read":1,"Read-Write":3};
  const EIP_MAP   = {"DXM\u2192PLC":2,"PLC\u2192DXM":1};
  const lines = [];
  sensors.forEach(s => {
    if (!s.model) return;
    if (!info.hasPort5 && s.port === "Port 5") return; // no Port 5 hardware on this platform
    const regs = SENSOR_DB[s.model] || [];
    regs.forEach((r, idx) => {
      const localReg = s.stagStart + idx;
      const cfg = s.logConfig[r.reg] || {};
      // Log/LCD are not available on platforms without local logging / LCD hardware
      const logV = info.hasLocalLog ? (cfg.log || "—") : "—";
      const cloudV = cfg.cloud || "—";
      const lcdV = info.hasLcd ? (cfg.lcd || "—") : "—";
      const eipV = cfg.eip || "—";
      const name = xmlEscape(cfg.name?.trim() || r.desc);
      const attrs = [];
      let logfiles = LOG_MAP[logV] || 0;
      if (cloudV !== "—") logfiles += 8;
      if (logfiles) attrs.push(`logfiles="${logfiles}"`);
      if (cloudV !== "—") { const [cio,perms]=CLOUD_MAP[cloudV]; attrs.push(`cloudio="${cio}" perms="${perms}"`); }
      if (lcdV !== "—") attrs.push(`lcd="${LCD_MAP[lcdV]}"`);
      if (eipV !== "—" && EIP_MAP[eipV]) attrs.push(`mapEIP="${EIP_MAP[eipV]}"`);
      attrs.push(`name="${name.slice(0,32)}"`, `num="${localReg}"`);
      // Tag: use location if set, otherwise build "Model - PX IDY", abbreviate if over 32 chars
      let tag = "";
      if (s.location) {
        tag = s.location.replace(/[^A-Za-z0-9 ]/g,"").slice(0,32);
      } else {
        const pNum = s.port.replace("Port ","");
        const longTag = `${s.model} - P${pNum} ID${s.modbusId}`;
        tag = longTag.length <= 32 ? longTag : longTag.slice(0,32);
      }
      if (tag) attrs.push(`tag="${xmlEscape(tag)}"`);
      lines.push(`  <reg ${attrs.join(" ")} />`);
    });
  });
  return lines.length ? `<local_regs>\n${lines.join("\n")}\n</local_regs>` : "<local_regs />";
}

function buildFullXml(sensors, logFiles, filename, notes="", guid="", dxmIp="", dxmType="DXM1200-X2") {
  const info = DXM_TYPES[dxmType] || DXM_TYPES["DXM1200-X2"];
  const now = new Date();
  const ts = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString('en-US')}`;
  const cleanFn = (filename||"dxm_config").replace(/[^A-Za-z0-9_-]/g,"_");
  const staticIp = dxmIp.trim();
  const useStatic = staticIp.length > 0;
  const defaddr  = useStatic ? staticIp : info.defaultDefaddr;
  const dhcp     = useStatic ? "0" : info.defaultDhcp;

  const usedLogs = new Set();
  sensors.forEach(s => Object.values(s.logConfig).forEach(cfg => {
    if (["Log 1","Log 2","Log 3"].includes(cfg.log)) usedLogs.add(parseInt(cfg.log.split(" ")[1]));
  }));

  const logFilesXml = [
    `    <fileinfo>\n      <message />\n      <log dir="1" email="" enab="0" end="00:00:00" full="0" name="EventLog.txt" new="0" rate="00:00:00" reg="0" size="102400" subject="" tod="1" />\n    </fileinfo>`,
    ...[1,2,3].map(n => {
      const lf = logFiles[n];
      const fn = (lf.name||`Log${n}`).replace(/[^A-Za-z0-9_-]/g,"_");
      const rate = `${String(lf.rateH||0).padStart(2,"0")}:${String(lf.rateM||0).padStart(2,"0")}:${String(lf.rateS||0).padStart(2,"0")}`;
      return `    <fileinfo>\n      <message />\n      <log dir="1" email="" enab="${usedLogs.has(n)?1:0}" end="00:00:00" full="0" name="${fn}.txt" new="0" rate="${rate}" reg="0" size="102400" subject="" tod="5" />\n    </fileinfo>`;
    }),
    `    <fileinfo>\n      <message />\n      <log dir="1" email="" enab="1" end="00:00:00" full="1" name="HttpLog.txt" new="0" rate="00:00:00" reg="0" size="0" subject="" tod="1" />\n    </fileinfo>`,
  ].join("\n");

  const indent = (s, n=2) => s.split("\n").map(l => " ".repeat(n)+l).join("\n");
  const rtu   = indent(buildRtuRead(sensors, dxmType));
  const local = indent(buildLocalRegs(sensors, dxmType));
  const cleanNotes = notes.replace(/[^a-zA-Z0-9 !@#$^()\-_=+~?/\[\]{} \n]/g, "").slice(0, 4095);

  const rtuDeviceLines = [
    ...(info.hasRtuDevLine
      ? [`    <dev baud="19200" commtype="485" data="8" parity="0" rate="50" stop="1" thisUnit="0" timeout="5" />`]
      : []),
    ...[0,1,2,3,4].map(p => `    <bus baud="19200" commtype="485" data="8" parity="0" port="${p}" rate="50" stop="1" thisUnit="255" timeout="5" />`),
    ...(info.hasPort5
      ? [`    <bus baud="19200" commtype="485" data="8" parity="0" port="5" rate="50" stop="1" thisUnit="255" timeout="5" />`]
      : []),
  ].join("\n");

  const modbusTcpBlock = info.hasModbusTcp
    ? `  <modbus_tcp>\n    <server enabled="1" inact="600000" />\n  </modbus_tcp>\n`
    : "";

  const cxLine = info.hasCx ? `    <cx en="1" />\n` : "";

  return `<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <file_info>
    <info device="${info.device}" filename="${cleanFn}.xml" guid="${guid}" os="Win32NT" osversion="Microsoft Windows NT 6.2.9200.0" software="DXMConfigurationSoftware v4" solution="None" timestamp="${ts}" version="4.19.8.0" />
    <notes>${cleanNotes}</notes>
  </file_info>
${local}
  <cascade />
  <constant />
  <calculate />
  <thresholds />
  <trend />
${rtu}
  <rtu_write />
${modbusTcpBlock}  <sched_holidays />
  <sched_commands />
  <sched_events />
  <astro_clock>
    <set dst="0" lat="0" lon="0" zone="0" />
  </astro_clock>
  <gps>
    <unit addr="0" enabled="0" flags="0" lograte="00:00:00" poll="00:00:00" />
  </gps>
  <master_mode>
    <mode opt="1" state="0" />
  </master_mode>
  <rtu_device>
${rtuDeviceLines}
  </rtu_device>
  <rtu_server>
    <dev baud="19200" commtype="485" data="8" parity="0" stop="1" timeout="${info.rtuServerTimeout}" />
  </rtu_server>
  <scripts>
    <script baud="19200" data="8" delay="20000" enabled="0" parity="0" path="" stop="1" />
  </scripts>
  <timekeepers>
    <timekeeper address="0.0.0.0" enabled="1" interval="0" name="external" priority="3" />
    <timekeeper address="0.0.0.0" enabled="0" interval="0" name="internal" priority="2" />
    <timekeeper address="0.0.0.0" enabled="0" interval="0" name="network" priority="1" />
  </timekeepers>
  <system_types />
  <log_files>
${logFilesXml}
  </log_files>
  <device_sync>
    <device sync_rollover="100000000" />
  </device_sync>
  <email_server>
    <server auth="" domain="" pass="" pop3="" pop3domain="" pop3user="" port="25" pwd="" smtp="" sysrep="0" useauth="0" user="" />
  </email_server>
  <server_params>
    <server apn="IP" apnpass="vzwinternet" cellenab="8" cellfw="0.0.0.0" cellfwmask="255.255.255.0" defaddr="${defaddr}" defgtwy="0.0.0.0" defmask="255.255.255.0" dhcp="${dhcp}" sms="0" />
    <cell_info cell_modelname="SXI-CATM1VZW-001" />
    <maint cexch="0" ckeep="0" csflags="0" csqbak="0" csqret="5" csrvre="0" csrvwd="0" linkdel="60000" linkmax="120000" linkret="2" />
    <eth flags="0" />
    <apn idx="1" name="" type="IPV4V6" />
    <apn idx="2" name="vzwadmin" type="IPV4V6" />
    <apn idx="3" name="vzwinternet" type="IPV4V6" />
    <apn idx="4" name="vzwapp" type="IPV4V6" />
    <apn idx="5" name="vzw800" type="IPV4V6" />
    <apn idx="6" name="vzwclass6" type="IPV4V6" />
${cxLine}    <netif flags="0" gw4="0.0.0.0" ip4="0.0.0.0" mode="1" sn4="0.0.0.0" />
  </server_params>
  <http_push>
    <dns address="0.0.0.0" />
    <dns address="0.0.0.0" />
    <push debug="0" enabled="1" flags="4104" host="push.bannercds.com" id="${guid || ZERO_GUID}" interval="00:00:00" page="/push.aspx" port="80" vendor="0" />
  </http_push>
  <fwall />
  <profinet>
    <io en="0" flags="0" />
  </profinet>
  <iot>
    <mqtt debug="0" en="0" flags="5" host="" id=" " ping="50000" port="8883" throttle="0" vendor="7" />
  </iot>
</configuration>`;
}

function copyToClipboard(text, setCopied, key) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  }).catch(() => {
    const el = document.getElementById("xml-output-area");
    if (el) { el.select(); document.execCommand("copy"); }
  });
}

// ── Sub-components ────────────────────────────────────────────────────────
function SensorCard({ sensor, sensorNum, portSensorNum, isDuplicate, isStagConflict, onChange, ports = PORTS }) {
  const [open, setOpen] = useState(false);
  const regs = SENSOR_DB[sensor.model] || [];
  const stagEnd = sensor.stagStart + regs.length - 1;
  const update = (field, val) => onChange({ ...sensor, [field]: val });

  return (
    <div style={{
      border: `0.5px solid ${isDuplicate || isStagConflict ? "#dc2626" : open ? "#FFD600" : "#D3D1C7"}`,
      borderRadius: 6, marginBottom: 8, overflow: "hidden", transition: "border-color 0.15s",
    }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        cursor: "pointer", background: open ? "#fafafa" : "#ffffff", userSelect: "none",
      }}>
        {sensor.model ? (
          <>
            <span style={{ color: "#2C2C2A", fontSize: 13, fontWeight: 600 }}>{sensor.model}</span>
            <span style={{
              background: isDuplicate ? "#FEE2E2" : "#EAF3DE",
              color: isDuplicate ? "#991B1B" : "#27500A",
              border: `0.5px solid ${isDuplicate ? "#FCA5A5" : "#97C459"}`,
              borderRadius: 3, fontSize: 11, padding: "1px 6px", fontFamily: "monospace",
            }}>ID {sensor.modbusId}{isDuplicate ? " ⚠" : ""}</span>
            {sensor.location && <span style={{ color: "#888780", fontSize: 12 }}>{sensor.location}</span>}
            <span style={{ color: isStagConflict ? "#dc2626" : "#B4B2A9", fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>
              regs {sensor.stagStart}–{stagEnd}{isStagConflict ? " ⚠ overlap" : ""}
            </span>
          </>
        ) : (
          <span style={{ color: "#B4B2A9", fontSize: 13, fontStyle: "italic" }}>Empty slot — click to configure</span>
        )}
        <span style={{ color: "#B4B2A9", marginLeft: sensor.model ? 0 : "auto", flexShrink: 0 }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div style={{ padding: "14px 16px", background: "#ffffff", borderTop: "0.5px solid #D3D1C7" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2.5fr 1fr 1.5fr", gap: 12, marginBottom: 12 }}>
            <Field label="Sensor Model">
              <select value={sensor.model} onChange={e => update("model", e.target.value)} style={selectStyle}>
                {MODEL_LIST.map(m => <option key={m} value={m}>{m || "— Select model —"}</option>)}
              </select>
            </Field>
            <Field label={`Location / Description (${sensor.location.length}/32)`}>
              <input value={sensor.location}
                onChange={e => update("location", e.target.value.replace(/[^A-Za-z0-9 !@#$^()\-_=+~?/\[\]{} ]/g,"").slice(0,32))}
                placeholder={`e.g. ${sensor.port} Sensor ${portSensorNum}`} style={inputStyle} maxLength={32} />
            </Field>
            <Field label="Modbus ID">
              <input type="number" min={1} max={247} value={sensor.modbusId}
                onChange={e => update("modbusId", parseInt(e.target.value)||1)}
                style={{ ...inputStyle, textAlign: "center" }} />
            </Field>
            <Field label="Staging Start Reg">
              <input type="number" min={5001} max={7000} value={sensor.stagStart}
                onChange={e => update("stagStart", parseInt(e.target.value)||5001)}
                style={{ ...inputStyle, textAlign: "center" }} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr", gap: 12, marginBottom: 12 }}>
            <Field label="Port">
              <select value={sensor.port}
                onChange={e => {
                  const newPort = e.target.value;
                  if (newPort === "Port 5") onChange({ ...sensor, port: newPort, connection: "Wireless" });
                  else update("port", newPort);
                }} style={selectStyle}>
                {ports.map(p => <option key={p.value} value={p.value}>{p.label} · {p.sublabel}</option>)}
              </select>
            </Field>
            <Field label="Connection">
              <select value={sensor.connection} onChange={e => update("connection", e.target.value)} style={selectStyle}>
                <option value="RS-485">RS-485</option>
                <option value="Wireless">Wireless</option>
              </select>
            </Field>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:12, marginTop:12 }}>
            <Field label="Poll Frequency (seconds)">
              <input type="number" min={0.01} max={10000} step={0.1}
                value={sensor.pollFreq ?? 1.0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0.01 && v <= 10000) update("pollFreq", v); }}
                style={{ ...inputStyle, textAlign:"center" }} />
            </Field>
            <Field label="Read Interval (hh:mm:ss.fff)">
              <div style={{ ...inputStyle, color:"#633806", fontFamily:"monospace", background:"#FAEEDA", cursor:"default", paddingTop:7 }}>
                {secsToHMS(sensor.pollFreq ?? 1.0)}
              </div>
            </Field>
          </div>

          {regs.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#633806", fontFamily: "monospace", marginBottom: 6 }}>
                {regs.length} registers · staging {sensor.stagStart}–{stagEnd}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
                  <thead>
                    <tr style={{ background: "#000000" }}>
                      {["Sensor Reg","Local Reg","Description","Units","÷ By"].map(h => (
                        <th key={h} style={{ padding: "4px 8px", textAlign: "left", color: "#ffffff", fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map((r, idx) => (
                      <tr key={r.reg} style={{ background: idx%2===0 ? "#ffffff" : "#F1EFE8" }}>
                        <td style={{ padding:"3px 8px", color:"#633806", fontWeight:600 }}>{r.reg}</td>
                        <td style={{ padding:"3px 8px", color:"#27500A" }}>{sensor.stagStart+idx}</td>
                        <td style={{ padding:"3px 8px", color:"#2C2C2A" }}>{r.desc}</td>
                        <td style={{ padding:"3px 8px", color:"#27500A" }}>{r.units}</td>
                        <td style={{ padding:"3px 8px", color:"#5F5E5A" }}>{r.divide_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LocalRegsPanel({ sensors, onChange, hasLcd = true, hasLocalLog = true }) {
  const [batchStart, setBatchStart] = useState("");
  const [batchCount, setBatchCount] = useState("");
  const [batchLog,   setBatchLog]   = useState("—");
  const [batchCloud, setBatchCloud] = useState("—");
  const [batchLcd,   setBatchLcd]   = useState("—");
  const [batchEip,   setBatchEip]   = useState("—");
  const [batchMsg,   setBatchMsg]   = useState("");

  const configured = sensors.filter(s => s.model);

  const applyBatch = () => {
    const start = parseInt(batchStart);
    const count = parseInt(batchCount);
    if (isNaN(start) || isNaN(count) || count < 1) {
      setBatchMsg("Enter a valid start register and count."); return;
    }
    const end = start + count - 1;
    let hits = 0;
    const updatedSensors = sensors.map(s => {
      if (!s.model) return s;
      const regs = SENSOR_DB[s.model] || [];
      let changed = false;
      const newConfig = { ...s.logConfig };
      regs.forEach((r, idx) => {
        const localReg = s.stagStart + idx;
        if (localReg >= start && localReg <= end) {
          const existing = newConfig[r.reg] || {};
          const updated = { ...existing };
          // "—" = leave unchanged; CLEAR = reset that field to "—" (none)
          if (batchLog   !== "—") updated.log   = batchLog   === CLEAR ? "—" : batchLog;
          if (batchCloud !== "—") updated.cloud = batchCloud === CLEAR ? "—" : batchCloud;
          if (batchLcd   !== "—") updated.lcd   = batchLcd   === CLEAR ? "—" : batchLcd;
          if (batchEip   !== "—") updated.eip   = batchEip   === CLEAR ? "—" : batchEip;
          newConfig[r.reg] = updated;
          changed = true; hits++;
        }
      });
      return changed ? { ...s, logConfig: newConfig } : s;
    });
    updatedSensors.forEach(s => {
      const orig = sensors.find(x => x.id === s.id);
      if (orig && s.logConfig !== orig.logConfig) onChange(s.id, "logConfig", s.logConfig);
    });
    const clearedFields = [["Log File",batchLog],["Cloud Push",batchCloud],["LCD",batchLcd],["EtherNet/IP",batchEip]]
      .filter(([,v]) => v === CLEAR).map(([n]) => n);
    setBatchMsg(`Applied to ${hits} register${hits !== 1 ? "s" : ""}.` +
      (clearedFields.length ? ` Cleared: ${clearedFields.join(", ")}.` : ""));
    // Clearing is intentional and one-shot: reset any Clear selection so it can't be re-applied by accident
    if (batchLog   === CLEAR) setBatchLog("—");
    if (batchCloud === CLEAR) setBatchCloud("—");
    if (batchLcd   === CLEAR) setBatchLcd("—");
    if (batchEip   === CLEAR) setBatchEip("—");
    setTimeout(() => setBatchMsg(""), 3000);
  };

  const batchFieldStyle = { background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:3,
    color:"#2C2C2A", padding:"4px 6px", fontSize:11, width:"100%" };
  const batchSel = (v) => v === CLEAR
    ? { ...batchFieldStyle, color:"#dc2626", fontWeight:700, borderColor:"#FCA5A5" }
    : batchFieldStyle;
  const clearOpt = (o) => o === CLEAR
    ? <option key={o} style={{ color:"#dc2626", fontWeight:700 }}>{o}</option>
    : <option key={o}>{o}</option>;

  if (!configured.length) return (
    <div style={{ color:"#888780", fontStyle:"italic", padding:"2rem 0", textAlign:"center" }}>
      Configure sensors in the Setup tab first.
    </div>
  );

  return (
    <div>
      {/* ── Batch Modify Panel ── */}
      <div style={{ background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:5,
        padding:"12px 14px", marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#2C2C2A", marginBottom:10,
          textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:"2px solid #FFD600", paddingBottom:4 }}>
          Batch Modify Registers
        </div>
        <div style={{ fontSize:11, color:"#888780", marginBottom:10 }}>
          Specify a local register range and apply settings to all matching registers across all sensors.
        </div>
        <div style={{ display:"grid",
          gridTemplateColumns:`140px 140px ${hasLocalLog?"1fr ":""}1fr ${hasLcd?"1fr ":""}1fr auto`,
          gap:8, alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Start Register</div>
            <input type="number" value={batchStart} onChange={e=>setBatchStart(e.target.value)}
              placeholder="e.g. 5001" style={batchFieldStyle} />
          </div>
          <div>
            <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Count</div>
            <input type="number" value={batchCount} onChange={e=>setBatchCount(e.target.value)}
              placeholder="e.g. 21" style={batchFieldStyle} />
          </div>
          {hasLocalLog && (
            <div>
              <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Log File</div>
              <select value={batchLog} onChange={e=>setBatchLog(e.target.value)} style={batchSel(batchLog)}>
                {withClear(LOG_OPTS).map(clearOpt)}
              </select>
            </div>
          )}
          <div>
            <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Cloud Push</div>
            <select value={batchCloud} onChange={e=>setBatchCloud(e.target.value)} style={batchSel(batchCloud)}>
              {withClear(CLOUD_OPTS).map(clearOpt)}
            </select>
          </div>
          {hasLcd && (
            <div>
              <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>LCD</div>
              <select value={batchLcd} onChange={e=>setBatchLcd(e.target.value)} style={batchSel(batchLcd)}>
                {withClear(LCD_OPTS).map(clearOpt)}
              </select>
            </div>
          )}
          <div>
            <div style={{ fontSize:9, color:"#888780", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>EtherNet/IP</div>
            <select value={batchEip} onChange={e=>setBatchEip(e.target.value)} style={batchSel(batchEip)}>
              {withClear(EIP_OPTS).map(clearOpt)}
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <div style={{ fontSize:9, color:"transparent", marginBottom:3 }}>.</div>
            <button onClick={applyBatch}
              style={{ background:"#FFD600", color:"#000000", border:"1px solid #BA7517",
                borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:700,
                padding:"5px 14px", whiteSpace:"nowrap" }}>
              Apply
            </button>
          </div>
        </div>
        {batchMsg && (
          <div style={{ marginTop:8, fontSize:11, color:"#27500A", fontWeight:600 }}>{batchMsg}</div>
        )}
        <div style={{ marginTop:6, fontSize:10, color:"#B4B2A9" }}>
          Fields left on — are not changed. Choose a value to apply it, or <span style={{ color:"#dc2626", fontWeight:700 }}>✕ Clear</span> to remove that setting from every register in the range.
        </div>
      </div>

      {/* ── Per-register table ── */}
      {configured.map(s => {
        const regs = SENSOR_DB[s.model] || [];
        return (
          <div key={s.id} style={{ marginBottom: 24 }}>
            <div style={{ padding:"8px 12px", background:"#F1EFE8", borderLeft:"3px solid #FFD600",
              borderRadius:"0 4px 4px 0", marginBottom:8, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:"#2C2C2A", fontWeight:700 }}>Sensor {s.id+1}</span>
              <span style={{ background:"#FAEEDA", color:"#633806", borderRadius:3, fontSize:11, padding:"1px 6px", fontFamily:"monospace" }}>{s.model}</span>
              <span style={{ color:"#888780", fontSize:12 }}>{s.location || "No location"}</span>
            </div>
            <div style={{ display:"grid",
              gridTemplateColumns:`80px 80px 1fr ${hasLocalLog?"100px ":""}120px ${hasLcd?"80px ":""}110px 160px`,
              gap:4, padding:"4px 6px", marginBottom:2 }}>
              {[["Sensor Reg","#633806"],["Local Reg","#27500A"],["Description","#5F5E5A"],
                ...(hasLocalLog ? [["Log File","#888780"]] : []),
                ["Cloud Push","#888780"],
                ...(hasLcd ? [["LCD","#888780"]] : []),
                ["EtherNet/IP","#888780"],["Name Override","#888780"]
              ].map(([h,c]) => (
                <div key={h} style={{ fontSize:9, color:c, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{h}</div>
              ))}
            </div>
            {regs.map((r, idx) => {
              const localReg = s.stagStart + idx;
              const cfg = s.logConfig[r.reg] || {};
              const updateCfg = (field, val) => {
                onChange(s.id, "logConfig", { ...s.logConfig, [r.reg]: { ...cfg, [field]: val } });
              };
              return (
                <div key={r.reg} style={{ display:"grid",
                  gridTemplateColumns:`80px 80px 1fr ${hasLocalLog?"100px ":""}120px ${hasLcd?"80px ":""}110px 160px`,
                  gap:4, padding:"3px 6px", background:idx%2===0?"#ffffff":"#F1EFE8",
                  alignItems:"center", borderBottom:"0.5px solid #D3D1C7" }}>
                  <div style={{ fontFamily:"monospace", fontSize:11, color:"#633806", fontWeight:600 }}>{r.reg}</div>
                  <div style={{ fontFamily:"monospace", fontSize:11, color:"#27500A" }}>{localReg}</div>
                  <div style={{ fontSize:11, color:"#2C2C2A" }}>
                    {r.desc} {r.units && <span style={{ color:"#27500A", marginLeft:4 }}>{r.units}</span>}
                  </div>
                  {hasLocalLog && (
                    <select value={cfg.log||"—"} onChange={e=>updateCfg("log",e.target.value)} style={miniSelectStyle}>
                      {LOG_OPTS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  )}
                  <select value={cfg.cloud||"—"} onChange={e=>updateCfg("cloud",e.target.value)} style={miniSelectStyle}>
                    {CLOUD_OPTS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  {hasLcd && (
                    <select value={cfg.lcd||"—"} onChange={e=>updateCfg("lcd",e.target.value)} style={miniSelectStyle}>
                      {LCD_OPTS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  )}
                  <select value={cfg.eip||"—"} onChange={e=>updateCfg("eip",e.target.value)} style={miniSelectStyle}>
                    {EIP_OPTS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <input value={cfg.name||""} onChange={e=>updateCfg("name",e.target.value)}
                    placeholder={r.desc.slice(0,20)+"…"} style={miniInputStyle} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function LogFileSettings({ logFiles, setLogFiles }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
      {[1,2,3].map(n => {
        const lf = logFiles[n];
        const update = (f,v) => setLogFiles(prev => ({ ...prev, [n]: { ...prev[n], [f]:v } }));
        return (
          <div key={n} style={{ background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:5, padding:14 }}>
            <div style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:"#2C2C2A",
              textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
              Log File {n}
            </div>
            <Field label="File Name (no spaces)">
              <input value={lf.name} onChange={e => update("name", e.target.value.replace(/[^A-Za-z0-9_-]/g,""))}
                placeholder={`Log${n}`} style={inputStyle} />
              <div style={{ fontSize:10, color:"#888780", marginTop:3 }}>→ {(lf.name||`Log${n}`)}.txt</div>
            </Field>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:8 }}>
              {[["HH","rateH",23],["MM","rateM",59],["SS","rateS",59]].map(([lbl,key,mx]) => (
                <Field key={key} label={lbl}>
                  <input type="number" min={0} max={mx} value={lf[key]||0}
                    onChange={e => update(key, Math.min(mx,Math.max(0,parseInt(e.target.value)||0)))}
                    style={{ ...inputStyle, textAlign:"center" }} />
                </Field>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <div style={{ fontSize:10, color:"#888780", fontWeight:700, textTransform:"uppercase",
      letterSpacing:"0.08em", marginBottom:4 }}>{label}</div>
    {children}
  </div>
);

const inputStyle = {
  width:"100%", background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:4,
  color:"#2C2C2A", padding:"6px 9px", fontSize:12, fontFamily:"inherit",
  outline:"none", boxSizing:"border-box",
};
const selectStyle = { ...inputStyle, cursor:"pointer", appearance:"auto" };
const miniSelectStyle = {
  background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:3,
  color:"#2C2C2A", padding:"2px 4px", fontSize:11, width:"100%",
};
const miniInputStyle = {
  background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:3,
  color:"#2C2C2A", padding:"2px 5px", fontSize:11, width:"100%",
};
const sectionHeader = {
  fontFamily:"monospace", fontSize:10, fontWeight:700, color:"#5F5E5A", textTransform:"uppercase", letterSpacing:"0.12em",
  borderBottom:"0.5px solid #D3D1C7", paddingBottom:6, marginBottom:12,
};
const btnStyle = {
  background:"#FFD600", color:"#000000", border:"1px solid #BA7517",
  borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600,
};
const smallBtnStyle = { ...btnStyle, padding:"3px 10px", fontSize:11 };

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("setup");
  const [portTab, setPortTab] = useState(0);
  const [dxmType, setDxmType] = useState("DXM1200-X2");
  const dxmInfo = DXM_TYPES[dxmType] || DXM_TYPES["DXM1200-X2"];
  const ports = useMemo(() => getPorts(dxmType), [dxmType]);
  const [sensors, setSensors] = useState(() => Array.from({length:MAX_SENSORS}, (_,i) => initSensor(i)));
  const [logFiles, setLogFiles] = useState({
    1:{name:"Log1",rateH:0,rateM:0,rateS:0},
    2:{name:"Log2",rateH:0,rateM:0,rateS:0},
    3:{name:"Log3",rateH:0,rateM:0,rateS:0},
  });
  const [xmlFilename, setXmlFilename] = useState("dxm_config");
  const [projectMeta, setProjectMeta] = useState({
    application:"", configuredBy:"", reviewedBy:"", dxmIp:"", dateDeployed:"",
  });
  const meta = (f, v) => setProjectMeta(prev => ({ ...prev, [f]: v }));
  const [notes, setNotes]   = useState("");
  const [copied, setCopied] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [configGuid, setConfigGuid] = useState(() =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
    })
  );

  const updateSensor = useCallback((id, field, val) => {
    setSensors(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  }, []);

  const updateSensorObj = useCallback((updated) => {
    setSensors(prev => prev.map(s => s.id === updated.id ? updated : s));
  }, []);

  const dupIds = useMemo(() => {
    const counts = {};
    sensors.filter(s=>s.model).forEach(s => {
      const key = `${s.port}:${s.modbusId}`;
      counts[key] = (counts[key]||0) + 1;
    });
    return new Set(Object.entries(counts).filter(([,c])=>c>1).map(([k])=>k));
  }, [sensors]);

  const isDup = (s) => dupIds.has(`${s.port}:${s.modbusId}`);

  const stagConflicts = useMemo(() => {
    const blocks = {};
    sensors.filter(s => s.model).forEach(s => {
      const regCount = SENSOR_DB[s.model]?.length || 0;
      const end = s.stagStart + regCount - 1;
      for (let r = s.stagStart; r <= end; r++) {
        if (!blocks[r]) blocks[r] = [];
        blocks[r].push(s.id);
      }
    });
    const conflictingIds = new Set();
    Object.values(blocks).forEach(ids => {
      if (ids.length > 1) ids.forEach(id => conflictingIds.add(id));
    });
    return conflictingIds;
  }, [sensors]);

  const isStagConflict = (s) => stagConflicts.has(s.id);

  const activeSensors  = sensors.filter(s=>s.model);
  const actualRegs     = activeSensors.reduce((n,s)=>n+(SENSOR_DB[s.model]?.length||0),0);
  const allocatedRegs  = actualRegs;

  // EtherNet/IP registers mapped per direction (counts only registers that
  // exist in the sensor's current model and are emitted in the XML).
  const eipCounts = useMemo(() => {
    let toPlc = 0, fromPlc = 0;
    sensors.forEach(s => {
      if (!s.model) return;
      if (!dxmInfo.hasPort5 && s.port === "Port 5") return; // excluded from XML
      (SENSOR_DB[s.model] || []).forEach(r => {
        const v = s.logConfig[r.reg]?.eip;
        if (v === "DXM→PLC") toPlc++;
        else if (v === "PLC→DXM") fromPlc++;
      });
    });
    return { toPlc, fromPlc };
  }, [sensors, dxmInfo.hasPort5]);
  const eipMax    = Math.max(eipCounts.toPlc, eipCounts.fromPlc);
  const eipLevel  = eipMax > EIP_LIMIT ? "exceeded" : eipMax >= EIP_WARN_AT ? "approaching" : "ok";
  const eipMsg    = eipLevel === "exceeded"
    ? `EtherNet/IP limit exceeded — DXM→PLC ${eipCounts.toPlc} / PLC→DXM ${eipCounts.fromPlc} (max ${EIP_LIMIT} per direction). Registers beyond ${EIP_LIMIT} will not be usable on the DXM; remove some mappings before deploying.`
    : eipLevel === "approaching"
    ? `Approaching EtherNet/IP limit — DXM→PLC ${eipCounts.toPlc} / PLC→DXM ${eipCounts.fromPlc} (max ${EIP_LIMIT} per direction).`
    : "";

  const byPort = useMemo(() => {
    const m = {};
    ports.forEach(p => { m[p.value] = []; });
    activeSensors.forEach(s => { if (m[s.port]) m[s.port].push(s); });
    return m;
  }, [activeSensors, ports]);

  // Full (unfiltered) port grouping — used only to compute the same "S1, S2…"
  // per-port position label the sidebar uses, even for sensors on a port
  // (e.g. Port 5) that's hidden from the sidebar under the current DXM type.
  const byPortAll = useMemo(() => {
    const m = {};
    PORTS.forEach(p => { m[p.value] = []; });
    activeSensors.forEach(s => { if (m[s.port]) m[s.port].push(s); });
    return m;
  }, [activeSensors]);

  const sensorLabel = (s) => {
    const ps = byPortAll[s.port] || [];
    const idx = ps.indexOf(s);
    return `${s.port} · S${idx>=0 ? idx+1 : "?"}`;
  };

  const conflicts = activeSensors.filter(s=>isDup(s));
  const stagConflictSensors = activeSensors.filter(s=>isStagConflict(s));

  // ── Cross-platform conflicts (config not auto-cleared on DXM type switch) ──
  const port5ConflictSensors = useMemo(() => {
    if (dxmInfo.hasPort5) return [];
    return activeSensors.filter(s => s.port === "Port 5");
  }, [activeSensors, dxmInfo.hasPort5]);

  const logLcdConflictSensors = useMemo(() => {
    if (dxmInfo.hasLocalLog && dxmInfo.hasLcd) return [];
    return activeSensors.filter(s => Object.values(s.logConfig).some(cfg =>
      (!dxmInfo.hasLocalLog && cfg.log && cfg.log !== "—") ||
      (!dxmInfo.hasLcd && cfg.lcd && cfg.lcd !== "—")
    ));
  }, [activeSensors, dxmInfo.hasLocalLog, dxmInfo.hasLcd]);

  const autoNotes = useMemo(() => {
    const bp = {};
    ports.forEach(p => { bp[p.value] = []; });
    sensors.filter(s=>s.model).forEach(s => { if (bp[s.port]) bp[s.port].push(s); });

    const fmtRate = (h,m,s) => {
      const parts = [];
      if (h>0) parts.push(h+" hour"+(h!==1?"s":""));
      if (m>0) parts.push(m+" minute"+(m!==1?"s":""));
      if (s>0) parts.push(s+" second"+(s!==1?"s":""));
      return parts.length ? parts.join(" ") : "0 seconds";
    };

    const lines = [];

    // Project info block
    if (projectMeta.application)  lines.push("Application - "+projectMeta.application);
    if (projectMeta.configuredBy) lines.push("Configured By - "+projectMeta.configuredBy);
    if (projectMeta.reviewedBy)   lines.push("Reviewed By - "+projectMeta.reviewedBy);
    if (projectMeta.dateDeployed) lines.push("Date Deployed - "+projectMeta.dateDeployed);
    if (projectMeta.dxmIp)        lines.push("DXM IP - "+projectMeta.dxmIp);
    if (lines.length) lines.push("");

    lines.push("--- Sensor Layout ---");
    let hasSensors = false;
    ports.forEach(p => {
      const ps = bp[p.value];
      if (!ps.length) return;
      hasSensors = true;
      lines.push(p.value+" - "+p.sublabel);
      ps.forEach(s => lines.push("  ID "+s.modbusId+" - "+s.model+(s.location?" - "+s.location:"")));
      lines.push("");
    });
    if (!hasSensors) lines.push("No sensors configured");

    if (dxmInfo.hasLocalLog) {
      lines.push("", "--- Data Logging ---");
      const usedLogs = new Set();
      sensors.forEach(s => Object.values(s.logConfig).forEach(cfg => {
        if (["Log 1","Log 2","Log 3"].includes(cfg.log)) usedLogs.add(parseInt(cfg.log.split(" ")[1]));
      }));
      [1,2,3].forEach(n => {
        const lf = logFiles[n];
        lines.push((lf.name||"Log"+n)+" - "+(usedLogs.has(n)?"Enabled":"Disabled")+" - "+fmtRate(lf.rateH||0,lf.rateM||0,lf.rateS||0)+" log rate");
      });
    }
    return lines.join("\n").trim();
  }, [sensors, logFiles, projectMeta, ports, dxmInfo.hasLocalLog]);

  const effectiveNotes = notes.trim() || autoNotes;
  const fullXml = useMemo(() =>
    buildFullXml(sensors, logFiles, xmlFilename, effectiveNotes, configGuid, projectMeta.dxmIp||"", dxmType),
    [sensors, logFiles, xmlFilename, effectiveNotes, configGuid, projectMeta.dxmIp, dxmType]
  );

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(()=>setCopied(null),2000); });
  };

  // ── Load XML ─────────────────────────────────────────────────────────────
  const loadXmlFile = (file) => {
    setLoadError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, "application/xml");
        if (doc.querySelector("parsererror")) throw new Error("Invalid XML file");

        const notesEl = doc.querySelector("file_info notes");
        if (notesEl) setNotes(notesEl.textContent || "");

        const infoEl = doc.querySelector("file_info info");
        if (infoEl) setXmlFilename((infoEl.getAttribute("filename")||"dxm_config").replace(/\.xml$/i,""));
        // Preserve device identity: prefer file_info guid, fall back to http_push id.
        // Both are written from the same value on save, so they normally match.
        const fileGuid = infoEl?.getAttribute("guid") || "";
        const pushGuid = doc.querySelector("http_push push")?.getAttribute("id") || "";
        const loadedGuid = isRealGuid(fileGuid) ? fileGuid.trim()
                         : isRealGuid(pushGuid) ? pushGuid.trim() : "";
        if (loadedGuid) setConfigGuid(loadedGuid);
        const loadedDevice = infoEl?.getAttribute("device") || "";
        const detectedType = DEVICE_TO_DXM_TYPE[loadedDevice];
        if (detectedType) setDxmType(detectedType);

        const regEls = [...doc.querySelectorAll("local_regs reg")];
        const newSensors = Array.from({length:MAX_SENSORS}, (_,i) => initSensor(i));
        const rules = [...doc.querySelectorAll("rtu_read rule")];
        const primaryRules = rules.filter(r =>
          !r.getAttribute("name")?.endsWith(" pt2") && !r.getAttribute("name")?.endsWith(" (cont)")
        );

        primaryRules.forEach((rule, idx) => {
          if (idx >= MAX_SENSORS) return;
          const localreg = parseInt(rule.getAttribute("localreg")||"5001");
          const unit     = parseInt(rule.getAttribute("unit")||"11");
          const port     = rule.getAttribute("port")||"1";
          const name     = rule.getAttribute("name")||"";
          const poll     = parseFloat(rule.getAttribute("poll")||"1");
          const count    = parseInt(rule.getAttribute("count")||"0");
          const modelComment = rule.outerHTML.match(/<!--\s*model="([^"]+)"/);
          const model    = (modelComment && SENSOR_DB[modelComment[1]])
            ? modelComment[1]
            : Object.keys(SENSOR_DB).find(m =>
                SENSOR_DB[m].length === count || (count === 40 && SENSOR_DB[m].length > 40)
              ) || "";

          const logConfig = {};
          if (model && SENSOR_DB[model]) {
            SENSOR_DB[model].forEach((r, ri) => {
              const localRegNum = localreg + ri;
              const regEl = regEls.find(el => parseInt(el.getAttribute("num")) === localRegNum);
              if (!regEl) return;
              const logfiles = parseInt(regEl.getAttribute("logfiles")||"0");
              const cloudio  = parseInt(regEl.getAttribute("cloudio")||"0");
              const perms    = parseInt(regEl.getAttribute("perms")||"0");
              const lcd      = parseInt(regEl.getAttribute("lcd")||"0");
              const regName  = regEl.getAttribute("name")||"";
              const cfg = {};
              const logPart = cloudio ? logfiles-8 : logfiles;
              if (logPart===1) cfg.log="Log 1";
              else if (logPart===2) cfg.log="Log 2";
              else if (logPart===4) cfg.log="Log 3";
              if (cloudio) cfg.cloud = perms===1?"Read":perms===2?"Write":"Read-Write";
              if (lcd===1) cfg.lcd="Read";
              else if (lcd===3) cfg.lcd="Read-Write";
              const mapEIP = parseInt(regEl.getAttribute("mapEIP")||"0");
              if (mapEIP===2) cfg.eip="DXM→PLC";
              else if (mapEIP===1) cfg.eip="PLC→DXM";
              if (regName && regName!==r.desc && regName!==r.desc.slice(0,32)) cfg.name=regName;
              if (Object.keys(cfg).length) logConfig[r.reg]=cfg;
            });
          }

          newSensors[idx] = {
            ...newSensors[idx], model, location:name, modbusId:unit,
            port:`Port ${port}`, connection:port==="5"?"Wireless":"RS-485",
            stagStart:localreg, pollFreq:poll, logConfig,
          };
        });

        const fileinfos = [...doc.querySelectorAll("log_files fileinfo")];
        const newLogFiles = {
          1:{name:"Log1",rateH:0,rateM:0,rateS:0},
          2:{name:"Log2",rateH:0,rateM:0,rateS:0},
          3:{name:"Log3",rateH:0,rateM:0,rateS:0},
        };
        [1,2,3].forEach(n => {
          const fi = fileinfos[n]; if (!fi) return;
          const log = fi.querySelector("log"); if (!log) return;
          const fname = (log.getAttribute("name")||`Log${n}.txt`).replace(/\.txt$/i,"");
          const rate  = log.getAttribute("rate")||"00:00:00";
          const [hh,mm,ss] = rate.split(":").map(Number);
          newLogFiles[n] = { name:fname, rateH:hh||0, rateM:mm||0, rateS:ss||0 };
        });

        // Restore DXM IP from server_params if present
        const serverEl = doc.querySelector("server_params server");
        if (serverEl) {
          const loadedIp  = serverEl.getAttribute("defaddr")||"";
          const loadedDhcp = serverEl.getAttribute("dhcp")||"1";
          const typeForDefaults = (detectedType && DXM_TYPES[detectedType]) || dxmInfo;
          if (loadedDhcp === "0" && loadedIp && loadedIp !== typeForDefaults.defaultDefaddr) {
            setProjectMeta(prev => ({ ...prev, dxmIp: loadedIp }));
          }
        }

        setSensors(newSensors);
        setLogFiles(newLogFiles);
        setLoadError(loadedGuid
          ? "✓ Configuration loaded successfully. GUID preserved."
          : "✓ Configuration loaded. No valid GUID in file — kept the current GUID.");
      } catch(err) {
        setLoadError("Error loading XML: "+err.message);
      }
    };
    reader.readAsText(file);
  };

  // ── Generate worksheet HTML and open in new tab ───────────────────────
  const generateWorksheet = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const timeStr = now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});

    const bp = {};
    ports.forEach(p => { bp[p.value] = []; });
    sensors.filter(s=>s.model).forEach(s => { if(bp[s.port]) bp[s.port].push(s); });

    const usedLogs = new Set();
    sensors.forEach(s => Object.values(s.logConfig).forEach(cfg => {
      if(["Log 1","Log 2","Log 3"].includes(cfg.log)) usedLogs.add(parseInt(cfg.log.split(" ")[1]));
    }));

    const portRows = ports.map(p => {
      const ps = bp[p.value]||[];
      if (!ps.length) return "";
      const rows = ps.map(s => {
        const regs = SENSOR_DB[s.model]||[];
        const end  = s.stagStart+regs.length-1;
        const regStr = regs.length>40
          ? `${s.stagStart}–${s.stagStart+39}<br><small>(cont) ${s.stagStart+40}–${end}</small>`
          : `${s.stagStart}–${end}`;
        return `<tr><td>${s.modbusId}</td><td>${s.model}</td><td>${s.location||"<em>Not set</em>"}</td><td>${s.connection}</td><td>${regStr}</td><td>${s.pollFreq??1}s</td></tr>`;
      }).join("");
      return `<h3>${p.label} · ${p.sublabel}</h3><table><thead><tr><th>ID</th><th>Model</th><th>Location</th><th>Conn</th><th>Registers</th><th>Poll</th></tr></thead><tbody>${rows}</tbody></table>`;
    }).join("");

    const logRows = dxmInfo.hasLocalLog ? [1,2,3].map(n => {
      const lf = logFiles[n];
      const enabled = usedLogs.has(n);
      const rate = `${String(lf.rateH).padStart(2,"0")}:${String(lf.rateM).padStart(2,"0")}:${String(lf.rateS).padStart(2,"0")}`;
      return `<tr><td>Log ${n} — ${lf.name}.txt</td><td class="${enabled?"ok":"na"}">${enabled?"Enabled":"Disabled"}</td><td>${rate}</td><td>100 KB</td></tr>`;
    }).join("") : `<tr><td colspan="4">Local data logging not available on ${dxmInfo.label}</td></tr>`;

    const infoRows = [
      ["Device Model",dxmInfo.label],
      ["Config File",(xmlFilename||"dxm_config")+".xml"],
      ["Software Version","DXMConfigurationSoftware v4 (v4.19.8.0)"],
      ["Generated",`${dateStr} — ${timeStr}`],
      ["Application",projectMeta.application||"—"],
      ["DXM IP Address",projectMeta.dxmIp||"—"],
      ["Config GUID",configGuid],
    ].map(([k,v])=>`<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${dxmInfo.label} Configuration Worksheet</title>
<style>
  body{font-family:Arial,sans-serif;font-size:11pt;color:#222;margin:0;padding:24px 32px}
  h1{font-size:18pt;color:#1F4E79;margin:0 0 2px}
  .subtitle{font-size:10pt;color:#555;margin:0 0 6px}
  .meta-bar{font-size:9pt;color:#888;border-bottom:2px solid #1F4E79;padding-bottom:6px;margin-bottom:18px}
  h2{font-size:13pt;color:#1F4E79;border-bottom:1px solid #2E75B6;padding-bottom:3px;margin:20px 0 8px}
  h3{font-size:11pt;color:#2E75B6;margin:12px 0 4px}
  table{width:100%;border-collapse:collapse;margin-bottom:10px;font-size:10pt}
  th{background:#1F4E79;color:white;padding:5px 8px;text-align:left}
  td{padding:4px 8px;border-bottom:1px solid #ddd}
  tr:nth-child(even) td{background:#f0f5fa}
  .ok{color:#1A4731;font-weight:bold}
  .na{color:#888}
  .signoff td{border-bottom:1px solid #ccc;padding:10px 8px}
  .signoff td:first-child{color:#555;font-size:9pt;width:180px}
  .footer{font-size:8pt;color:#aaa;border-top:1px solid #ddd;margin-top:24px;padding-top:6px}
  @media print{body{padding:12px 20px}}
</style></head><body>
<h1>${dxmInfo.label} Configuration Worksheet</h1>
<div class="subtitle">${projectMeta.application||"Generic Condition Monitoring"}</div>
<div class="meta-bar">Configuration Date: ${dateStr}&nbsp;&nbsp;|&nbsp;&nbsp;Software: DXM Configuration Software v4.19.8.0</div>
<h2>1. Device Information</h2><table><tbody>${infoRows}</tbody></table>
<h2>2. Sensor Layout</h2>${portRows||"<p>No sensors configured.</p>"}
<h2>3. RS-485 / Modbus RTU Configuration</h2>
<table><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>
<tr><td>Baud Rate</td><td>19,200</td></tr>
<tr><td>Data Bits</td><td>8</td></tr>
<tr><td>Parity</td><td>None</td></tr>
<tr><td>Stop Bits</td><td>1</td></tr>
<tr><td>Timeout</td><td>${dxmInfo.rtuServerTimeout} ms</td></tr>
<tr><td>Protocol</td><td>Modbus RTU</td></tr>
</tbody></table>
<h2>4. Data Logging</h2>
<table><thead><tr><th>Log File</th><th>Status</th><th>Rate (hh:mm:ss)</th><th>Max Size</th></tr></thead>
<tbody>${logRows}
<tr><td>Event Log</td><td class="na">Disabled</td><td>—</td><td>100 KB</td></tr>
<tr><td>HTTP Log</td><td class="ok">Enabled</td><td>Continuous</td><td>Unlimited</td></tr>
</tbody></table>
<h2>5. Connectivity</h2>
<table><thead><tr><th>Interface</th><th>Status</th><th>Notes</th></tr></thead><tbody>
<tr><td>Modbus TCP Server</td><td class="${dxmInfo.hasModbusTcp?"ok":"na"}">${dxmInfo.hasModbusTcp?"Enabled":"N/A"}</td><td>${dxmInfo.hasModbusTcp?"Inactivity timeout: 600 sec":"Not available on this platform"}</td></tr>
<tr><td>Cellular Module</td><td>SXI-CATM1VZW-001</td><td>Verizon CAT-M1</td></tr>
<tr><td>APN</td><td>vzwinternet</td><td>${(projectMeta.dxmIp||"").trim()?"Static IP configured":"DHCP enabled"}</td></tr>
<tr><td>Cloud Push Host</td><td>push.bannercds.com</td><td>Port 80, HTTP</td></tr>
<tr><td>MQTT</td><td class="na">Disabled</td><td>Configured but inactive</td></tr>
</tbody></table>
<h2>6. Sign-Off</h2>
<table class="signoff"><tbody>
<tr><td>Configured by</td><td>${projectMeta.configuredBy||"&nbsp;"}</td></tr>
<tr><td>Reviewed by</td><td>${projectMeta.reviewedBy||"&nbsp;"}</td></tr>
<tr><td>Date Deployed</td><td>${projectMeta.dateDeployed||"&nbsp;"}</td></tr>
<tr><td>DXM IP Address</td><td>${projectMeta.dxmIp||"&nbsp;"}</td></tr>
<tr><td>Config GUID</td><td style="font-family:monospace;font-size:9pt">${configGuid}</td></tr>
</tbody></table>
<div class="footer">Confidential — Internal Use Only&nbsp;&nbsp;|&nbsp;&nbsp;Config File: ${xmlFilename||"dxm_config"}.xml&nbsp;&nbsp;|&nbsp;&nbsp;Generated: ${dateStr}</div>
</body></html>`;
  };

  const NAV_TABS = [
    { id:"setup",      label:"⚙  Setup" },
    { id:"localregs",  label:"📋  Local Regs" },
    { id:"xmlbuilder", label:"📄  XML Builder" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", background:"#F1EFE8", color:"#2C2C2A",
      fontFamily:"'Segoe UI', system-ui, sans-serif", fontSize:13, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:220, background:"#ffffff", borderRight:"0.5px solid #D3D1C7",
        display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
        <div style={{ padding:"16px 14px 12px", borderBottom:"1px solid #D3D1C7", background:"#000000" }}>
          <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:"#ffffff", letterSpacing:"0.05em" }}>
            ⚙ DXM Planner
          </div>
          <div style={{ fontSize:10, color:"#D3D1C7", marginTop:2 }}>{dxmInfo.label}</div>
        </div>

        <div style={{ padding:"8px 8px 0" }}>
          {NAV_TABS.map(t => (
            <div key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"7px 10px", cursor:"pointer", fontSize:12,
              color: tab===t.id ? "#000000" : "#888780",
              background: tab===t.id ? "#FAEEDA" : "transparent", borderLeft: tab===t.id ? "2px solid #FFD600" : "2px solid transparent", borderRadius: tab===t.id ? 0 : 4,
              marginBottom:2, transition:"all 0.1s",
            }}>{t.label}</div>
          ))}
        </div>

        <div style={{ borderTop:"0.5px solid #D3D1C7", margin:"10px 0", padding:"8px 14px 4px" }}>
          <div style={{ fontSize:10, color:"#888780", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
            Sensors
          </div>
          {conflicts.length > 0 && (
            <div style={{ fontSize:10, color:"#991B1B", background:"#FEE2E2",
              border:"0.5px solid #FCA5A5", borderRadius:3, padding:"4px 7px", marginBottom:6 }}>
              ⚠ ID conflict on {[...new Set(conflicts.map(s=>s.port))].join(", ")}
            </div>
          )}
          {stagConflictSensors.length > 0 && (
            <div style={{ fontSize:10, color:"#991B1B", background:"#FEE2E2",
              border:"0.5px solid #FCA5A5", borderRadius:3, padding:"4px 7px", marginBottom:6 }}>
              ⚠ Register overlap ({stagConflictSensors.length} sensors)
            </div>
          )}
          {port5ConflictSensors.length > 0 && (
            <div style={{ fontSize:10, color:"#991B1B", background:"#FEE2E2",
              border:"0.5px solid #FCA5A5", borderRadius:3, padding:"4px 7px", marginBottom:6 }}>
              ⚠ {port5ConflictSensors.length} sensor{port5ConflictSensors.length!==1?"s":""} on Port 5 — unsupported on {dxmInfo.label}
            </div>
          )}
          {logLcdConflictSensors.length > 0 && (
            <div style={{ fontSize:10, color:"#991B1B", background:"#FEE2E2",
              border:"0.5px solid #FCA5A5", borderRadius:3, padding:"4px 7px", marginBottom:6 }}>
              ⚠ Log/LCD settings on {logLcdConflictSensors.length} sensor{logLcdConflictSensors.length!==1?"s":""} — unsupported on {dxmInfo.label}
            </div>
          )}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"0 8px 8px" }}>
          {ports.map(p => {
            const ps = byPort[p.value]||[];
            if (!ps.length) return null;
            return (
              <div key={p.value} style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#888780", fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.08em", padding:"4px 6px 3px", marginBottom:2, borderBottom:"0.5px solid #D3D1C7" }}>
                  {p.label} · {p.sublabel}
                </div>
                {ps.map((s, idx) => (
                  <div key={s.id} style={{ padding:"5px 6px 5px 10px", borderBottom:"0.5px solid #D3D1C7",
                    borderLeft:`2px solid ${isDup(s)?"#dc2626":"#FFD600"}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                      <span style={{ fontFamily:"monospace", fontSize:10, color:"#B4B2A9",
                        background:"#F1EFE8", padding:"0 4px", borderRadius:2, flexShrink:0 }}>S{idx+1}</span>
                      <span style={{ color:"#2C2C2A", fontSize:11, fontWeight:600,
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.model}</span>
                    </div>
                    <div style={{ color:"#888780", fontSize:10, marginBottom:3, paddingLeft:2,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {s.location || <span style={{fontStyle:"italic",color:"#B4B2A9"}}>No location</span>}
                    </div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"monospace", fontSize:10,
                        background:"#FAEEDA", color:"#633806", borderRadius:2, padding:"0 5px" }}>
                        {SENSOR_DB[s.model]?.length||0} regs
                      </span>
                      <span style={{ fontFamily:"monospace", fontSize:10, borderRadius:2, padding:"0 5px",
                        background:isDup(s)?"#FEE2E2":"#EAF3DE", color:isDup(s)?"#991B1B":"#27500A",
                        border:`0.5px solid ${isDup(s)?"#FCA5A5":"#97C459"}` }}>
                        ID {s.modbusId}{isDup(s)?" ⚠":""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          {!activeSensors.length && (
            <div style={{ color:"#B4B2A9", fontSize:11, fontStyle:"italic", padding:"6px" }}>
              No sensors configured
            </div>
          )}

          {activeSensors.length > 0 && (() => {
            const loggedCnt = activeSensors.reduce((n,s)=>n+Object.values(s.logConfig).filter(c=>c.log&&c.log!=="—").length,0);
            const cloudCnt  = activeSensors.reduce((n,s)=>n+Object.values(s.logConfig).filter(c=>c.cloud&&c.cloud!=="—").length,0);
            const lcdCnt    = activeSensors.reduce((n,s)=>n+Object.values(s.logConfig).filter(c=>c.lcd&&c.lcd!=="—").length,0);
            return (
              <div style={{ marginTop:10, borderTop:"0.5px solid #D3D1C7", paddingTop:8 }}>
                <div style={{ fontSize:10, color:"#888780", fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:6, padding:"0 4px" }}>Summary</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, padding:"0 2px" }}>
                  {[["Sensors",activeSensors.length],["Regs",actualRegs],["Logged",loggedCnt],["Cloud",cloudCnt],["LCD",lcdCnt]].map(([label,val]) => (
                    <div key={label} style={{ background:"#F1EFE8", border:"0.5px solid #D3D1C7",
                      borderRadius:4, padding:"5px 6px", textAlign:"center" }}>
                      <div style={{ fontSize:16, fontWeight:700, color:"#5F5E5A", fontFamily:"monospace" }}>{val}</div>
                      <div style={{ fontSize:9, color:"#888780", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{ borderTop:"0.5px solid #D3D1C7", padding:"10px 14px" }}>
          <div style={{ fontSize:10, color:"#888780", marginBottom:8 }}>
            {[["EIP DXM→PLC", eipCounts.toPlc],["EIP PLC→DXM", eipCounts.fromPlc]].map(([lbl,n]) => {
              const col = n > EIP_LIMIT ? "#dc2626" : n >= EIP_WARN_AT ? "#d97706" : "#27500A";
              return (
                <div key={lbl} style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span>{lbl}</span>
                  <span style={{ fontFamily:"monospace", fontWeight:700, color:col }}>
                    {n} / {EIP_LIMIT}{n > EIP_LIMIT ? " ⚠" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize:10, color:"#888780", marginBottom:4 }}>
            Staging:<span style={{ fontWeight:700,
              color:actualRegs/STAG_MAX_REGS>0.85?"#f85149":actualRegs/STAG_MAX_REGS>0.65?"#ffa657":"#3fb950"
            }}>{actualRegs}</span> / {STAG_MAX_REGS} registers
          </div>
          <div style={{ height:4, background:"#D3D1C7", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:2, transition:"width 0.3s",
              width:`${Math.min(actualRegs/STAG_MAX_REGS*100,100)}%`,
              background:actualRegs/STAG_MAX_REGS>0.85?"#dc2626":actualRegs/STAG_MAX_REGS>0.65?"#d97706":"#FFD600"
            }}/>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"12px 20px",
          background:"#000000", borderBottom:"3px solid #FFD600",
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"monospace", fontSize:14, fontWeight:700, color:"#ffffff" }}>
              DXM Configuration Planner
            </div>
            <div style={{ fontSize:11, color:"#D3D1C7" }}>
              {dxmInfo.label} · Generic Condition Monitoring · R70SR MultiHop
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:10, color:"#D3D1C7", textTransform:"uppercase", letterSpacing:"0.08em" }}>DXM Type</span>
            <select value={dxmType} onChange={e => setDxmType(e.target.value)}
              style={{ background:"#FFD600", color:"#000000", border:"1px solid #BA7517",
                borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700,
                padding:"5px 10px" }}>
              {DXM_TYPE_LIST.map(t => <option key={t} value={t}>{DXM_TYPES[t].label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:20, background:"#F1EFE8" }}>

          {/* ══ SETUP TAB ══ */}
          {tab === "setup" && (
            <div>
              <div style={sectionHeader}>Sensor Configuration</div>
              <div style={{ fontSize:11, color:"#888780", marginBottom:12 }}>
                Sensors organized by port. Max 40 sensors. Local registers 5001–7000 used for data collection. Wireless Modbus IDs: 11–60.
              </div>

              {conflicts.length > 0 && (
                <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:5,
                  padding:"8px 14px", marginBottom:14, fontSize:12, color:"#991B1B" }}>
                  ⚠ Modbus ID conflict — same ID on same port: {conflicts.map(s=>`${sensorLabel(s)} (ID ${s.modbusId})`).join(", ")}
                </div>
              )}

              {stagConflictSensors.length > 0 && (
                <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:5,
                  padding:"8px 14px", marginBottom:14, fontSize:12, color:"#991B1B" }}>
                  ⚠ Staging register overlap — multiple sensors share the same register block: {stagConflictSensors.map(s=>{const end=s.stagStart+(SENSOR_DB[s.model]?.length||1)-1;return `${sensorLabel(s)} (${s.stagStart}–${end})`;}).join(", ")}
                </div>
              )}

              {port5ConflictSensors.length > 0 && (
                <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:5,
                  padding:"8px 14px", marginBottom:14, fontSize:12, color:"#991B1B" }}>
                  ⚠ {dxmInfo.label} has no Port 5 (radio) — these sensors will be excluded from the generated XML until reassigned or the DXM type is switched back: {port5ConflictSensors.map(s=>`${sensorLabel(s)} (${s.model})`).join(", ")}
                </div>
              )}

              {logLcdConflictSensors.length > 0 && (
                <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:5,
                  padding:"8px 14px", marginBottom:14, fontSize:12, color:"#991B1B" }}>
                  ⚠ {dxmInfo.label} has no LCD / local data logging — Log File and LCD settings on these sensors will be omitted from the generated XML: {logLcdConflictSensors.map(s=>`${sensorLabel(s)} (${s.model})`).join(", ")}
                </div>
              )}

              <div style={{ display:"flex", borderBottom:"1px solid #D3D1C7", marginBottom:16, gap:2 }}>
                {(() => { const safeTab = portTab < ports.length ? portTab : 0; return ports.map((p,i) => {
                  const cnt = byPort[p.value]?.length||0;
                  return (
                    <div key={p.value} onClick={()=>setPortTab(i)} style={{
                      padding:"7px 14px", cursor:"pointer", fontSize:12, borderBottom:"2px solid transparent",
                      color:safeTab===i?"#000000":"#888780",
                      borderBottomColor:safeTab===i?"#000000":"transparent",
                      display:"flex", alignItems:"center", gap:6, transition:"color 0.1s", fontWeight:safeTab===i?700:400,
                    }}>
                      {p.label}
                      <span style={{ fontSize:10, color:safeTab===i?"#5F5E5A":"#B4B2A9" }}>· {p.sublabel}</span>
                      {cnt>0 && (
                        <span style={{ background:"#FAEEDA", color:"#633806", borderRadius:8,
                          fontSize:10, padding:"0 5px", fontFamily:"monospace" }}>{cnt}</span>
                      )}
                    </div>
                  );
                }); })()}
              </div>

              {(() => {
                const safeTab   = portTab < ports.length ? portTab : 0;
                const portVal   = ports[safeTab].value;
                const portConn  = ports[safeTab].defaultConn;
                const portSensors = sensors.filter(s => s.port===portVal && s.model);
                const nextEmptyRaw = sensors.find(s => !s.model);
                const usedIdsOnPort = new Set(sensors.filter(s=>s.model&&s.port===portVal).map(s=>s.modbusId));
                let nextId = 11;
                while (usedIdsOnPort.has(nextId)) nextId++;
                const nextEmpty = nextEmptyRaw
                  ? { ...nextEmptyRaw, port:portVal, connection:portConn, modbusId:nextId, stagStart:nextStagStart(sensors) }
                  : null;
                const toShow = [...portSensors, ...(nextEmpty ? [nextEmpty] : [])];
                return toShow.map(s => {
                  const portPos = portSensors.indexOf(s);
                  const portSensorNum = portPos>=0 ? portPos+1 : portSensors.length+1;
                  return (
                    <SensorCard key={s.id} sensor={s} sensorNum={s.id+1}
                      portSensorNum={portSensorNum} isDuplicate={isDup(s)} isStagConflict={isStagConflict(s)}
                      ports={ports}
                      onChange={updated => {
                        // When a model is first assigned to an empty sensor, lock in the stagStart
                        if (!s.model && updated.model && updated.stagStart === s.stagStart) {
                          updated = { ...updated, stagStart: nextStagStart(sensors) };
                        }
                        if (updated.port !== s.port && s.model) {
                          const newPortIdx = ports.findIndex(p=>p.value===updated.port);
                          if (newPortIdx>=0) setPortTab(newPortIdx);
                        }
                        updateSensorObj(updated);
                      }} />
                  );
                });
              })()}
            </div>
          )}

          {/* ══ LOCAL REGS TAB ══ */}
          {tab === "localregs" && (
            <div>
              <div style={sectionHeader}>Local Register Configuration</div>
              <div style={{ fontSize:11, color:"#888780", marginBottom:16 }}>
                All staging registers appear in the XML. Configure Log / Cloud / LCD as needed.
                {!dxmInfo.hasLocalLog && !dxmInfo.hasLcd && (
                  <span style={{ color:"#BA7517" }}> {dxmInfo.label} has no LCD or local data logging — only Cloud Push and EtherNet/IP are available.</span>
                )}
              </div>
              {eipLevel !== "ok" && (
                <div style={{ background:eipLevel==="exceeded"?"#FEE2E2":"#FEF3C7",
                  border:`1px solid ${eipLevel==="exceeded"?"#FCA5A5":"#F2C14E"}`, borderRadius:5,
                  padding:"8px 14px", marginBottom:14, fontSize:12,
                  color:eipLevel==="exceeded"?"#991B1B":"#854F0B" }}>
                  ⚠ {eipMsg}
                </div>
              )}
              <LocalRegsPanel sensors={sensors}
                hasLcd={dxmInfo.hasLcd} hasLocalLog={dxmInfo.hasLocalLog}
                onChange={(id, field, val) => updateSensor(id, field, val)} />
            </div>
          )}

          {/* ══ XML BUILDER TAB ══ */}
          {tab === "xmlbuilder" && (
            <div>

              {/* ── XML Output top bar ── */}
              <div style={sectionHeader}>XML Output</div>
              <div style={{ background:"#ffffff", border:"0.5px solid #D3D1C7", borderRadius:5,
                padding:"12px 14px", marginBottom:20 }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-end", marginBottom:10 }}>
                  <div style={{ flex:1 }}>
                    <Field label="XML Filename">
                      <input value={xmlFilename}
                        onChange={e => setXmlFilename(e.target.value.replace(/[^A-Za-z0-9_-]/g,"_"))}
                        placeholder="dxm_config" style={inputStyle} />
                    </Field>
                    <div style={{ fontSize:10, color:"#888780", marginTop:3 }}>→ {xmlFilename||"dxm_config"}.xml</div>
                  </div>
                  <button onClick={() => copyToClipboard(fullXml, setCopied, "full")}
                    style={{ ...btnStyle, padding:"8px 20px", whiteSpace:"nowrap",
                      background:copied==="full"?"#EAF3DE":"#FFD600",
                      color:copied==="full"?"#27500A":"#000000",
                      borderColor:copied==="full"?"#97C459":"#BA7517" }}>
                    {copied==="full" ? "✓ Copied!" : "⎘ Copy complete XML"}
                  </button>
                  <label style={{ background:"#ffffff", color:"#2C2C2A", border:"0.5px solid #D3D1C7",
                    borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600,
                    padding:"8px 16px", display:"inline-block", whiteSpace:"nowrap" }}>
                    📂 Load XML File
                    <input type="file" accept=".xml" style={{ display:"none" }}
                      onChange={e => { if(e.target.files[0]) loadXmlFile(e.target.files[0]); e.target.value=""; }} />
                  </label>
                  {loadError && (
                    <span style={{ fontSize:11, color:loadError.startsWith("✓")?"#27500A":"#991B1B",
                      fontWeight:600, whiteSpace:"nowrap" }}>
                      {loadError}
                    </span>
                  )}
                </div>
                {eipLevel !== "ok" && (
                  <div style={{ background:eipLevel==="exceeded"?"#FEE2E2":"#FEF3C7",
                    border:`1px solid ${eipLevel==="exceeded"?"#FCA5A5":"#F2C14E"}`, borderRadius:4,
                    padding:"6px 12px", marginBottom:8, fontSize:11,
                    color:eipLevel==="exceeded"?"#991B1B":"#854F0B" }}>
                    ⚠ {eipMsg}
                  </div>
                )}
                <div style={{ background:"#EAF3DE", border:"1px solid #97C459", borderRadius:4,
                  padding:"8px 12px", fontSize:11, color:"#27500A", fontFamily:"monospace", lineHeight:1.5 }}>
                  <span style={{ fontWeight:700, marginRight:8 }}>HOW TO SAVE</span>
                  <span style={{ color:"#5F5E5A" }}>
                    1. Click "Copy complete XML" &nbsp;·&nbsp;
                    2. Open Notepad &nbsp;·&nbsp;
                    3. Paste (Ctrl+V) &nbsp;·&nbsp;
                    4. File → Save As → <span style={{color:"#2C2C2A",fontWeight:600}}>{xmlFilename||"dxm_config"}.xml</span> &nbsp;·&nbsp;
                    5. Save as type: All Files (*.*) &nbsp;·&nbsp;
                    6. Save
                  </span>
                </div>
              </div>

              {/* ── Project Information ── */}
              <div style={sectionHeader}>Project Information</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <Field label="Application / Project Name">
                    <input value={projectMeta.application} onChange={e=>meta("application",e.target.value)}
                      placeholder="e.g. Overhead Crane — Drive Wheel Monitoring" style={inputStyle} />
                  </Field>
                  <Field label="Config GUID (preserved from loaded XML, else auto-generated)">
                    <div style={{ ...inputStyle, fontFamily:"monospace", fontSize:11,
                      color:"#633806", background:"#FAEEDA", cursor:"default", paddingTop:7 }}>
                      {configGuid}
                    </div>
                  </Field>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                  <Field label="Configured By">
                    <input value={projectMeta.configuredBy} onChange={e=>meta("configuredBy",e.target.value)}
                      placeholder="Name" style={inputStyle} />
                  </Field>
                  <Field label="Reviewed By">
                    <input value={projectMeta.reviewedBy} onChange={e=>meta("reviewedBy",e.target.value)}
                      placeholder="Name" style={inputStyle} />
                  </Field>
                  <Field label="Date Deployed">
                    <input value={projectMeta.dateDeployed} onChange={e=>meta("dateDeployed",e.target.value)}
                      placeholder="e.g. June 1, 2026" style={inputStyle} />
                  </Field>
                  <Field label="DXM IP Address">
                    <input value={projectMeta.dxmIp} onChange={e=>meta("dxmIp",e.target.value)}
                      placeholder="e.g. 192.168.1.100" style={inputStyle} />
                  </Field>
                </div>
              </div>

              {/* ── System Notes ── */}
              <div style={sectionHeader}>System Notes</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:"#888780", marginBottom:8 }}>
                  Stored in the XML file_info section. Auto-populated from your sensor config — edit freely.
                  Max 4095 characters. Only letters, numbers, spaces, and dashes allowed.
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ fontSize:10, color:"#B4B2A9" }}>
                    {effectiveNotes.length} / 4095 characters
                    {!notes.trim() && activeSensors.length>0 &&
                      <span style={{ color:"#BA7517", marginLeft:8 }}>← auto-generated from setup</span>}
                  </div>
                  {notes.trim() && (
                    <button onClick={()=>setNotes("")}
                      style={{ ...smallBtnStyle, background:"#FEF3C7", borderColor:"#BA7517", color:"#854F0B" }}>
                      Reset to auto
                    </button>
                  )}
                </div>
                <textarea
                  value={notes.trim() ? notes : autoNotes}
                  onChange={e => setNotes(e.target.value.replace(/[^a-zA-Z0-9 !@#$^()\-_=+~?/\[\]{} \n]/g,"").slice(0,4095))}
                  style={{ width:"100%", height:160, background:"#ffffff",
                    border:"0.5px solid #D3D1C7", borderRadius:5, padding:"10px 12px",
                    fontSize:12, fontFamily:"Courier New", color:"#2C2C2A",
                    resize:"vertical", boxSizing:"border-box", lineHeight:1.6, outline:"none" }} />
              </div>

              {/* ── Data Log File Settings ── */}
              <div style={sectionHeader}>Data Log File Settings</div>
              <LogFileSettings logFiles={logFiles} setLogFiles={setLogFiles} />

              {/* ── Configuration Worksheet ── */}
              <div style={sectionHeader}>Configuration Worksheet</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:"#888780", marginBottom:8 }}>
                  Opens in a new browser tab — use Print to save as PDF.
                </div>
                <button
                  onClick={() => {
                    const html = generateWorksheet();
                    const win = window.open("", "_blank");
                    if (win) { win.document.write(html); win.document.close(); }
                    else copyToClipboard(html, setCopied, "worksheet");
                  }}
                  style={{ ...btnStyle, padding:"8px 20px" }}>
                  📋 Generate Worksheet
                </button>
                {copied==="worksheet" && (
                  <span style={{ fontSize:11, color:"#27500A", marginLeft:12 }}>✓ Copied (pop-up blocked)</span>
                )}
              </div>

              {/* ── Complete XML ── */}
              <div style={sectionHeader}>Complete XML — Scroll to Review</div>
              <div style={{ marginBottom:16 }}>
                <textarea id="xml-output-area" readOnly value={fullXml}
                  onClick={e => e.target.select()}
                  style={{ width:"100%", height:480, background:"#2b2b2b",
                    border:"1px solid #444444", borderRadius:3, padding:"10px 14px",
                    fontSize:11, fontFamily:"Courier New", color:"#e8e8e8",
                    resize:"vertical", boxSizing:"border-box", lineHeight:1.6,
                    outline:"none", caretColor:"#ffffff", letterSpacing:"0.01em" }} />
                <div style={{ fontSize:10, color:"#888780", marginTop:3 }}>
                  Click anywhere in the box to select all text
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
