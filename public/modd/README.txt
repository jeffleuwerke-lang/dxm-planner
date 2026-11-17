DXM Planner shared sensor library
=================================
Every user of the site gets the sensors listed in manifest.json.

Add a device for everyone:
  1. Put the device's *_MODD.xml file in public/modd/devices/
  2. Add an entry to public/modd/manifest.json:
       { "name": "MODEL-NAME", "family": "Dropdown group", "file": "devices/MODEL-NAME_MODD.xml" }
  3. Commit to main. The site redeploys in a minute or two (hard-refresh with Ctrl+F5).

Notes
  - Built-in sensors in App.jsx always take priority over a MODD file with the same model.
    The connection suffix (-M / -MQ / -MQP) is ignored when matching.
  - Only read-only registers 40001-40099 are imported, as one contiguous block.
  - Users can also import a MODD file for themselves from the Setup tab; that stays in their own browser.
